'use strict';

var latex = require('../../utils/latex');
var escape = require('../../utils/string').escape;
var isSafeMethod = require('../../utils/customs').isSafeMethod;
var getSafeProperty = require('../../utils/customs').getSafeProperty;
var operators = require('../operators');

function factory (type, config, load) {
  var Node = load(require('./Node'));

  /**
   * @constructor UnaryOperatorNode
   * @extends {Node}
   * An operator with two arguments, like 2+3
   *
   * @param {string} op           Operator name, for example '+'
   * @param {string} fn           Function name, for example 'add'
   * @param {Node} value          Operator argument
   */
  function UnaryOperatorNode(op, fn, value) {
    if (!(this instanceof UnaryOperatorNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    //validate input
    if (typeof op !== 'string') {
      throw new TypeError('string expected for parameter "op"');
    }
    if (typeof fn !== 'string') {
      throw new TypeError('string expected for parameter "fn"');
    }
    if (!type.isNode(value)) {
      throw new TypeError('Node expected for parameter "value"');
    }

    this.op = op;
    this.fn = fn;
    this.value = value;
  }

  UnaryOperatorNode.prototype = new Node();

  UnaryOperatorNode.prototype.type = 'UnaryOperatorNode';

  UnaryOperatorNode.prototype.isUnaryOperatorNode = true;

  /**
   * Compile a node into a JavaScript function.
   * This basically pre-calculates as much as possible and only leaves open
   * calculations which depend on a dynamic scope with variables.
   * @param {Object} math     Math.js namespace with functions and constants. 
   * @param {Object} argNames An object with argument names as key and `true`
   *                          as value. Used in the SymbolNode to optimize
   *                          for arguments from user assigned functions
   *                          (see FunctionAssignmentNode) or special symbols
   *                          like `end` (see IndexNode).
   * @return {function} Returns a function which can be called like:
   *                        evalNode(scope: Object, args: Object, context: *)
   */
  UnaryOperatorNode.prototype._compile = function (math, argNames) {
    // validate fn
    if (typeof this.fn !== 'string' || !isSafeMethod(math, this.fn)) {
      if (!math[this.fn]) {
        throw new Error('Function ' + this.fn + ' missing in provided namespace "math"');
      }
      else {
        throw new Error('No access to function "' + this.fn + '"');
      }
    }

    var fn = getSafeProperty(math, this.fn);
    var evalArg = this.value._compile(math, argNames);

    return function evalUnaryOperatorNode(scope, args, context) {
      return fn(evalArg(scope, args, context));
    };
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  UnaryOperatorNode.prototype.forEach = function (callback) {
    callback(this.value, 'value', this);
  };

  /**
   * Create a new UnaryOperatorNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {UnaryOperatorNode} Returns a transformed copy of the node
   */
  UnaryOperatorNode.prototype.map = function (callback) {
    return new UnaryOperatorNode(this.op, this.fn, this._ifNode(callback(this.value, 'value', this)));
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {UnaryOperatorNode}
   */
  UnaryOperatorNode.prototype.clone = function () {
    return new UnaryOperatorNode(this.op, this.fn, this.value);
  };

  /**
   * Calculate which parentheses are necessary. Gets an UnaryOperatorNode
   * (which is the root of the tree) and an Array of Nodes
   * (this.value) and returns an array where 'true' means that an argument
   * has to be enclosed in parentheses whereas 'false' means the opposite.
   *
   * @param {UnaryOperatorNode} root
   * @param {string} parenthesis
   * @param {Node} value
   * @param {boolean} latex
   * @return {boolean}
   * @private
   */
  function areParenthesisNeeded(root, parenthesis, value, latex) {
    //precedence of the root UnaryOperatorNode
    var precedence = operators.getPrecedence(root, parenthesis);

    if (parenthesis === 'all') {
      switch (value.getContent().type) { //Nodes that don't need extra parentheses
        case 'ArrayNode':
        case 'ConstantNode':
        case 'SymbolNode':
        case 'ParenthesisNode':
          return false;
        default:
          return true;
      }
    }

    //precedence of the operand
    var operandPrecedence = operators.getPrecedence(value, parenthesis);

    //handle special cases for LaTeX, where some of the parentheses aren't needed
    if (latex && (operandPrecedence !== null)) {
      var operandIdentifier;
      var rootIdentifier;
      if (parenthesis === 'keep') {
        operandIdentifier = value.getIdentifier();
        rootIdentifier = root.getIdentifier();
      }
      else {
        //Ignore Parenthesis Nodes when not in 'keep' mode
        operandIdentifier = value.getContent().getIdentifier();
        rootIdentifier = root.getContent().getIdentifier();
      }
      if (operators.properties[precedence][rootIdentifier].latexLeftParens === false) {
        return false;
      }

      if (operators.properties[operandPrecedence][operandIdentifier].latexParens === false) {
        return false;
      }
    }

    if (operandPrecedence === null) {
      //if the operand has no defined precedence, no parens are needed
      return false;
    }

    if (operandPrecedence <= precedence) {
      //if the operands precedence is lower, parens are needed
      return true;
    }

    //otherwise, no parens needed
    return false;
  }

  /**
   * Get string representation.
   * @param {Object} options
   * @return {string} str
   */
  UnaryOperatorNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var paren = areParenthesisNeeded(this, parenthesis, this.value, false);

    var assoc = operators.getAssociativity(this, parenthesis);

    var operand = this.value.toString(options);
    console.log("name: ", this.getIdentifier());
    console.log("assos: ", paren);
    if (paren) {
      operand = '(' + operand + ')';
    }

    if (assoc === 'right') { //prefix operator
      return this.op + operand;
    }
    else if (assoc === 'left') { //postfix
      return operand + this.op;
    }

    //fall back to postfix
    return operand + this.op;
  };

  /**
   * Get HTML representation.
   * @param {Object} options
   * @return {string} str
   */
  UnaryOperatorNode.prototype.toHTML = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var paren = areParenthesisNeeded(this, parenthesis, this.value, false);

    var assoc = operators.getAssociativity(this, parenthesis);

    var operand = this.value.toHTML(options);
    if (paren) {
      operand = '<span class="math-parenthesis math-round-parenthesis">(</span>' + operand + '<span class="math-parenthesis math-round-parenthesis">)</span>';
    }

    if (assoc === 'right') { //prefix operator
      return '<span class="math-operator math-unary-operator math-lefthand-unary-operator">' + escape(this.op) + '</span>' + operand;
    }
    else if (assoc === 'left') { //postfix
      return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand;
    }

    //fall back to postfix
    return '<span class="math-operator math-unary-operator math-righthand-unary-operator">' + escape(this.op) + '</span>' + operand;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  UnaryOperatorNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var paren = areParenthesisNeeded(this, parenthesis, this.value, true);
    var op = latex.operators[this.fn];
    op = typeof op === 'undefined' ? this.op : op; // fall back to using this.op

    var assoc = operators.getAssociativity(this, parenthesis);

    var operand = this.value.toTex(options);
    if (paren) {
      operand = '\\left(' + operand + '\\right)';
    }

    if (assoc === 'right') { // prefix operator
      return op + operand;
    }
    else if (assoc === 'left') { // postfix operator
      return operand + op;
    }

    // fall back to postfix
    return operand + op;
  };

  /**
   * Get identifier.
   * @return {string}
   */
  UnaryOperatorNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.fn;
  };

  return UnaryOperatorNode;
}

exports.name = 'UnaryOperatorNode';
exports.path = 'expression.node';
exports.factory = factory;
