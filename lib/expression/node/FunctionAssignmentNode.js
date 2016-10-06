'use strict';

var keywords = require('../keywords');
var latex = require('../../utils/latex');
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
   * @param {string} name           Function name
   * @param {string[] | Array.<{name: string, type: string}>} params
   *                                Array with function parameter names, or an
   *                                array with objects containing the name
   *                                and type of the parameter
   * @param {Node} expr             The function expression
   */
  function FunctionAssignmentNode(name, params, expr) {
    if (!(this instanceof FunctionAssignmentNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('String expected for parameter "name"');
    if (!Array.isArray(params))  throw new TypeError('Array containing strings or objects expected for parameter "params"');
    if (!(expr && expr.isNode)) throw new TypeError('Node expected for parameter "expr"');
    if (name in keywords) throw new Error('Illegal function name, "' + name + '" is a reserved keyword');

    this.name = name;
    this.params = params.map(function (param) {
      return param && param.name || param;
    });
    this.types = params.map(function (param) {
      return param && param.type || 'any'
    });
    this.expr = expr;
  }

  FunctionAssignmentNode.prototype = new Node();

  FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

  FunctionAssignmentNode.prototype.isFunctionAssignmentNode = true;

  /**
   * Will create a typed function which allows for currying and partial application
   * Similar to haskell or ramda's curry function
   *
   * Example:
   * addNums(x, y) = x + y  // function(arg0, arg1)
   * addNums(1, 2) // 3
   * add5 = addNums(5)  // function(arg0)
   * add5(3) // 8
   *
   * @param {Object} compiledExpr     A Compiled expression `this.expr._compile(defs, childArgs);`
   * @private
   */
  FunctionAssignmentNode.prototype._typedCurry = function (compiledExpr, types, params) {
    types = types || this.types;
    params = params || this.params;

    return params.reduceRight(function(typedFns, _, index) {
      var nextIndex = index + 1;
      var key = types.slice(0, nextIndex).join(',');
      var signature = params.slice(0, nextIndex).join(',');
      var partialName = `${this.name}_${params.slice(0, nextIndex).join('_')}`;

      if (nextIndex === params.length) {
        return `"${key}": function (${signature}) { return ${compiledExpr} }`;
      }

      return `
        "${key}": function (${signature}){
          return typed("${partialName}", {
            ${this._typedCurry(compiledExpr, types.slice(nextIndex), params.slice(nextIndex))}
          });
        },
        ${typedFns}
      `;
    }.bind(this), '')
  };


  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  FunctionAssignmentNode.prototype._compile = function (defs, args) {
    defs.typed = typed;

    // we extend the original args and add the args to the child object
    var childArgs = Object.create(args);
    this.params.forEach(function (variable) {
      childArgs[variable] = true;
    });

    // compile the function expression with the child args
    var jsExpr = this.expr._compile(defs, childArgs);

    // Curry the function by default
    return (
      `scope["${this.name}"] = (function () {
        return typed("${this.name}", {
          ${this._typedCurry(jsExpr)}
        })
      })()`
    );
  }


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
   * @param {Node} node
   * @param {Object} parenthesis
   * @private
   */
  function needParenthesis(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var exprPrecedence = operators.getPrecedence(node.expr, parenthesis);

    return (parenthesis === 'all')
      || ((exprPrecedence !== null) && (exprPrecedence <= precedence));
  }

  /**
   * get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toString(options);
    if (needParenthesis(this, parenthesis)) {
      expr = '(' + expr + ')';
    }
    return 'function ' + this.name +
        '(' + this.params.join(', ') + ') = ' + expr;
  };

  /**
   * get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionAssignmentNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var expr = this.expr.toTex(options);
    if (needParenthesis(this, parenthesis)) {
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
