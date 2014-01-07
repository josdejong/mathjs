var Node = require('./Node'),

    BigNumber = require('bignumber.js'),
    Complex = require('../../type/Complex'),
    Unit = require('../../type/Unit'),

    number = require('../../util/number'),
    toNumber = number.toNumber;

/**
 * @constructor UnitNode
 * @extends {Node}
 * Construct a unit, like '3 cm'
 * @param {Node} value
 * @param {String} unit     Unit name, for example  'meter' 'kg'
 */
function UnitNode (value, unit) {
  this.value = value;
  this.unit = unit;
}

UnitNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
UnitNode.prototype._compile = function (defs) {
  return 'math.unit(' + this.value._compile(defs) + ', "' + this.unit + '")';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
 * @returns {Node[]} nodes
 */
UnitNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // check value
  nodes = nodes.concat(this.value.find(filter));

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
UnitNode.prototype.toString = function() {
  return this.value + ' ' + this.unit;
};

module.exports = UnitNode;
