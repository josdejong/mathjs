'use strict';

var latex = require('../../utils/latex');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var ArrayNode = load(require('./ArrayNode'));

  var keywords = require('../keywords');
  var operators = require('../operators');

  /**
   * @constructor AssignmentNode
   * @extends {Node}
   * Define a symbol, like "a = 3.2"
   *
   * @param {string} name       Symbol name
   * @param {Node} expr         The expression defining the symbol
   */
  function AssignmentNode(name, expr) {
    if (!(this instanceof AssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!(expr && expr.isNode))  throw new TypeError('Node expected for parameter "expr"');
    if (name in keywords)         throw new Error('Illegal symbol name, "'  + name +  '" is a reserved keyword');

    this.name = name;
    this.expr = expr;
  }

  AssignmentNode.prototype = new Node();

  AssignmentNode.prototype.type = 'AssignmentNode';

  AssignmentNode.prototype.isAssignmentNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @private
   */
  AssignmentNode.prototype._compile = function (defs, args) {
    return 'scope["' + this.name + '"] = ' + this.expr._compile(defs, args) + '';
  };


  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  AssignmentNode.prototype.forEach = function (callback) {
    callback(this.expr, 'expr', this);
  };

  /**
   * Create a new AssignmentNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {AssignmentNode} Returns a transformed copy of the node
   */
  AssignmentNode.prototype.map = function (callback) {
    return new AssignmentNode(this.name, this._ifNode(callback(this.expr, 'expr', this)));
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {AssignmentNode}
   */
  AssignmentNode.prototype.clone = function() {
    return new AssignmentNode(this.name, this.expr);
  };

  /*
   * Is parenthesis needed?
   * @param {node} node
   * @param {string} parenthesis
   * @private
   */
  function needParenthesis(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.expr, parenthesis);
    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toString = function(options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toString(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')';
    }
    return this.name + ' = ' + expr;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  AssignmentNode.prototype._toTex = function(options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toTex(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '\\left(' + expr + '\\right)';
    }

    return latex.toSymbol(this.name) + ':=' + expr;
  };

  return AssignmentNode;
}

exports.name = 'AssignmentNode';
exports.path = 'expression.node';
exports.factory = factory;
