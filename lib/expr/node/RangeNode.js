var Node = require('./Node.js'),
    Range = require('../../type/Range.js');

/**
 * @constructor RangeNode
 * create a range
 * @param {Object} math             The math namespace containing all functions
 * @param {Node[]} params
 */
function RangeNode (math, params) {
  this.math = math;

  this.params = params;

  if (params.length >= 3) {
    // swap step and end
    var step = params[2];
    params[2] = params[1]; // end
    params[1] = step;
  }
}

RangeNode.prototype = new Node();

/**
 * Evaluate the range
 * @return {*} result
 */
RangeNode.prototype.eval = function() {
  // evaluate the parameters
  var params = this.params,
      results = [];
  for (var i = 0, len = this.params.length; i < len; i++) {
    results[i] = params[i].eval();
  }

  // create the range
  return this.math.range.apply(this.math.range, results);
};

/**
 * Create a Range from a RangeNode
 * @return {Range} range
 */
RangeNode.prototype.toRange = function() {
  // evaluate the parameters
  var params = this.params,
      results = [];
  for (var i = 0, len = this.params.length; i < len; i++) {
    results[i] = params[i].eval();
  }

  // create the range
  return _createRange(results);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
RangeNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search object
  if (this.object) {
    nodes = nodes.concat(this.object.find(filter));
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
RangeNode.prototype.toString = function() {
  // format the parameters like "(2, 4.2)"
  var str = this.object ? this.object.toString() : '';
  if (this.params) {
    str += '(' + this.params.join(', ') + ')';
  }
  return str;
};

/**
 * Create a Range from from parameters
 * @param {Array.<Number>} params   An array with numbers start, end, and
 *                                  optionally step.
 * @return {Range} range
 * @private
 */
function _createRange(params) {
  var range = new Range();
  Range.apply(range, params);
  return range;
}

module.exports = RangeNode;
