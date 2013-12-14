var Node = require('./Node'),

    BigNumber = require('bignumber.js'),
    Complex = require('../../type/Complex'),
    Unit = require('../../type/Unit'),

    number = require('../../util/number'),
    toNumber = number.toNumber;

/**
 * @constructor UnitNode
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
 * Evaluate the parameters
 * @return {*} result
 */
UnitNode.prototype.eval = function() {
  // evaluate the value
  var value = this.value.eval();

  // convert bignumber to number as Unit doesn't support BigNumber
  value = (value instanceof BigNumber) ? toNumber(value) : value;

  // create the unit
  if (Unit.isPlainUnit(this.unit)) {
    return new Unit(value, this.unit);
  }
  else {
    throw new TypeError('Unknown unit "' + this.unit + '"');
  }
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
