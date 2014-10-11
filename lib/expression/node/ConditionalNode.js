'use strict';

var Node = require('./Node');
var latex = require('../../util/latex');
var BigNumber = require('decimal.js');
var Complex = require('../../type/Complex');
var Unit = require('../../type/Unit');
var util = require('../../util');
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
 * Recursively execute a callback for each of the child nodes of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
ConditionalNode.prototype._traverse = function (callback) {
  callback(this.condition, 'condition', this);
  this.condition._traverse(callback);

  callback(this.trueExpr, 'trueExpr', this);
  this.trueExpr._traverse(callback);

  callback(this.falseExpr, 'falseExpr', this);
  this.falseExpr._traverse(callback);
};

/**
 * Create a clone of this node
 * @return {ConditionalNode}
 */
ConditionalNode.prototype.clone = function() {
  return new ConditionalNode(this.condition.clone(), this.trueExpr.clone(), this.falseExpr.clone());
};

/**
 * Get string representation
 * @return {String} str
 */
ConditionalNode.prototype.toString = function() {
  // TODO: not nice adding parenthesis al the time
  return '(' + this.condition.toString() + ') ? (' +
      this.trueExpr.toString() + ') : (' +
      this.falseExpr.toString() + ')';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
ConditionalNode.prototype.toTex = function() {
  var s = (
      latex.addBraces(this.trueExpr.toTex()) +
      ', &\\quad' +
      latex.addBraces('\\text{if}\\;' + this.condition.toTex())
      ) + '\\\\' + (
      latex.addBraces(this.falseExpr.toTex()) +
      ', &\\quad' +
      latex.addBraces('\\text{otherwise}')
      );

  return latex.addBraces(s, [
    '\\left\\{\\begin{array}{l l}',
    '\\end{array}\\right.'
  ]);
};

module.exports = ConditionalNode;
