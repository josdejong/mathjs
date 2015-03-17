'use strict';

var Node = require('./Node');
var latex = require('../../util/latex');
var BigNumber = require('../../type/BigNumber');
var Complex = require('../../type/Complex');
var Unit = require('../../type/Unit');
var util = require('../../util');
var operators = require('../operators');
var isString = util.string.isString;
var isNumber = util.number.isNumber;
var isBoolean = util['boolean'].isBoolean;

/**
 * A lazy evaluating conditional operator: 'condition ? trueExpr : falseExpr'
 *
 * @param {Node} condition   Condition, must result in a boolean
 * @param {Node} trueExpr    Expression evaluated when condition is true
 * @param {Node} falseExpr   Expression evaluated when condition is true
 *
 * @constructor ConditionalNode
 * @extends {Node}
 */
function ConditionalNode (condition, trueExpr, falseExpr) {
  if (!(this instanceof ConditionalNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }
  if (!(condition instanceof Node)) throw new TypeError('Parameter condition must be a Node');
  if (!(trueExpr instanceof Node))  throw new TypeError('Parameter trueExpr must be a Node');
  if (!(falseExpr instanceof Node)) throw new TypeError('Parameter falseExpr must be a Node');

  this.condition = condition;
  this.trueExpr = trueExpr;
  this.falseExpr = falseExpr;
}

ConditionalNode.prototype = new Node();

ConditionalNode.prototype.type = 'ConditionalNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ConditionalNode.prototype._compile = function(defs) {
  /**
   * Test whether a condition is met
   * @param {*} condition
   * @returns {boolean} true if condition is true or non-zero, else false
   */
  defs.testCondition = function (condition) {
    if (isNumber(condition) || isBoolean(condition) || isString(condition)) {
      return condition ? true : false;
    }

    if (condition instanceof BigNumber) {
      return condition.isZero() ? false : true;
    }

    if (condition instanceof Complex) {
      return (condition.re || condition.im) ? true : false;
    }

    if (condition instanceof Unit) {
      return condition.value ? true : false;
    }

    if (condition === null || condition === undefined) {
      return false;
    }

    throw new TypeError('Unsupported type of condition "' + defs.math['typeof'](condition) + '"');
  };

  return (
      'testCondition(' + this.condition._compile(defs) + ') ? ' +
      '( ' + this.trueExpr._compile(defs) + ') : ' +
      '( ' + this.falseExpr._compile(defs) + ')'
      );
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
ConditionalNode.prototype.forEach = function (callback) {
  callback(this.condition, 'condition', this);
  callback(this.trueExpr, 'trueExpr', this);
  callback(this.falseExpr, 'falseExpr', this);
};

/**
 * Create a new ConditionalNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {ConditionalNode} Returns a transformed copy of the node
 */
ConditionalNode.prototype.map = function (callback) {
  return new ConditionalNode(
      this._ifNode(callback(this.condition, 'condition', this)),
      this._ifNode(callback(this.trueExpr, 'trueExpr', this)),
      this._ifNode(callback(this.falseExpr, 'falseExpr', this))
  );
};

/**
 * Create a clone of this node, a shallow copy
 * @return {ConditionalNode}
 */
ConditionalNode.prototype.clone = function() {
  return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr);
};

/**
 * Get string representation
 * @return {String} str
 */
ConditionalNode.prototype.toString = function() {
  var precedence = operators.getPrecedence(this);

  //Enclose Arguments in parentheses if they are an OperatorNode
  //or have lower or equal precedence
  //NOTE: enclosing all OperatorNodes in parentheses is a decision
  //purely based on aesthetics and readability
  var condition = this.condition.toString();
  var conditionPrecedence = operators.getPrecedence(this.condition);
  if ((this.condition.type === 'OperatorNode')
      || ((conditionPrecedence !== null) && (conditionPrecedence <= precedence))) {
    condition = '(' + condition + ')';
  }

  var trueExpr = this.trueExpr.toString();
  var truePrecedence = operators.getPrecedence(this.trueExpr);
  if ((this.trueExpr.type === 'OperatorNode')
      || ((truePrecedence !== null) && (truePrecedence <= precedence))) {
    trueExpr = '(' + trueExpr + ')';
  }

  var falseExpr = this.falseExpr.toString();
  var falsePrecedence = operators.getPrecedence(this.falseExpr);
  if ((this.falseExpr.type === 'OperatorNode')
      || ((falsePrecedence !== null) && (falsePrecedence <= precedence))) {
    falseExpr = '(' + falseExpr + ')';
  }
  return condition + ' ? ' + trueExpr + ' : ' + falseExpr;
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @return {String} str
 */
ConditionalNode.prototype._toTex = function(callbacks) {
  var s = (
      latex.addBraces(this.trueExpr.toTex(callbacks)) +
      ', &\\quad' +
      latex.addBraces('\\text{if}\\;' + this.condition.toTex(callbacks))
      ) + '\\\\' + (
      latex.addBraces(this.falseExpr.toTex(callbacks)) +
      ', &\\quad' +
      latex.addBraces('\\text{otherwise}')
      );

  return latex.addBraces(s, [
    '\\left\\{\\begin{array}{l l}',
    '\\end{array}\\right.'
  ]);
};

module.exports = ConditionalNode;
