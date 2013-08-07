var Node = require('./Node.js'),
    string = require('../../util/string.js');

/**
 * @constructor ConstantNode
 * @param {*} value
 * @extends {Node}
 */
function ConstantNode(value) {
  this.value = value;
}

ConstantNode.prototype = new Node();

/**
 * Evaluate the constant (just return it)
 * @return {*} value
 */
ConstantNode.prototype.eval = function () {
  return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
  return string.format(this.value);
};

module.exports = ConstantNode;
