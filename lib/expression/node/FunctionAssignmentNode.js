'use strict';

var keywords = require('../keywords');
var latex = require('../../util/latex');
var operators = require('../operators');

function isString (x) {
  return typeof x === 'string';
}

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor FunctionAssignmentNode
   * @extends {Node}
   * Function assignment
   *
   * @param {String} name           Function name
   * @param {String[]} params         Function parameter names
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode(name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!Array.isArray(params) || !params.every(isString))  throw new TypeError('Array containing strings expected for parameter "params"');
    if (!(expr && expr.isNode)) throw new TypeError('Node expected for parameter "expr"');
    if (name in keywords) throw new Error('Illegal function name, "' + name + '" is a reserved keyword');

    this.name = name;
    this.params = params;
    this.expr = expr;
  }

  FunctionAssignmentNode.prototype = new Node();

  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @return {String} js
   * @private
   */
  FunctionAssignmentNode.prototype._compile = function (defs) {
    // add the function arguments to defs (used by SymbolNode and UpdateNode)
    this.params.forEach(function (variable) {
      defs.args[variable] = true;
    });

    return 'scope["' + this.name + '"] = ' +
        '  (function () {' +
        '    var fn = function ' + this.name + '(' + this.params.join(',') + ') {' +
        '      if (arguments.length != ' + this.params.length + ') {' +
          // TODO: use util.error.ArgumentsError here?
          // TODO: test arguments error
        '        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.params.length + ' expected)");' +
        '      }' +
        '      return ' + this.expr._compile(defs) + '' +
        '    };' +
        '    fn.syntax = "' + this.name + '(' + this.params.join(', ') + ')";' +
        '    return fn;' +
        '  })();';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionAssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this);
  };

  /**
   * Create a new FunctionAssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
   */
  FunctionAssignmentNode.prototype.map = function (callback) {
    var expr = this._ifNode(callback(this.expr, 'expr', this));

    return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionAssignmentNode}
   */
  FunctionAssignmentNode.prototype.clone = function () {
    return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
  };

  /**
   * Is parenthesis needed?
   * @private
   */
  function needParenthesis(node) {
    var precedence = operators.getPrecedence(node, config);
    var exprPrecedence = operators.getPrecedence(node.expr, config);

    return (config.parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * get string representation
   * @return {String} str
   */
  FunctionAssignmentNode.prototype._toString = function () {
    var expr = this.expr.toString();
    if (needParenthesis(this)) {
      expr = '(' + expr + ')';
    }
    return 'function ' + this.name +
        '(' + this.params.join(', ') + ') = ' + expr;
  };

  /**
   * get LaTeX representation
   * @param {Object|function} callback(s)
   * @return {String} str
   */
  FunctionAssignmentNode.prototype._toTex = function (callbacks) {
    var expr = this.expr.toTex(callbacks);
    if (needParenthesis(this)) {
      expr = '\\left(' + expr + '\\right)';
    }

    return '\\mathrm{' + this.name
        + '}\\left(' + this.params.map(latex.toSymbol).join(',') + '\\right):=' + expr;
  };

  return FunctionAssignmentNode;
}
exports.name = 'FunctionAssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;
