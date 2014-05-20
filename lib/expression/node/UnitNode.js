var Node = require('./Node'),

    Unit = require('../../type/Unit'),

    latex = require('../../util/latex'),
    isString = require('../../util/string').isString;

/**
 * @constructor UnitNode
 * @extends {Node}
 * Construct a unit, like '3 cm'
 * @param {Node} value
 * @param {String} unit     Unit name, for example  'meter' 'kg'
 */
function UnitNode (value, unit) {
  if (!(this instanceof UnitNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!(value instanceof Node)) throw new TypeError('Node expected for parameter "value"');
  if (!isString(unit))          throw new TypeError('String expected for parameter "unit"');

  this.value = value;
  this.unit = unit;
}

UnitNode.prototype = new Node();

UnitNode.prototype.type = 'UnitNode';

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
 * @param {Object} filter  See Node.find for a description of the filter options
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

/**
 * Get LaTeX representation
 * @return {String} str
 */
UnitNode.prototype.toTex = function() {
  return this.value + latex.toUnit(this.unit);
};

module.exports = UnitNode;
