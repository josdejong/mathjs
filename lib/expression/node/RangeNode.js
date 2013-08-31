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

  this.start = null;  // included lower-bound
  this.end = null;    // included upper-bound
  this.step = null;   // optional step

  if (params.length == 2) {
    this.start = params[0];
    this.end = params[1];
  }
  else if (params.length == 3) {
    this.start = params[0];
    this.step = params[1];
    this.end = params[2];
  }
  else {
    // TODO: better error message
    throw new SyntaxError('Wrong number of arguments');
  }
}

RangeNode.prototype = new Node();

/**
 * Evaluate the range
 * @return {*} result
 */
RangeNode.prototype.eval = function() {
  // evaluate the parameters
  var start = this.start.eval();
  var step = this.step ? this.step.eval() : 1;
  var end = this.end.eval();

  // generate the range (upper-bound included!)
  var array = [],
      x = start;
  if (step > 0) {
    while (x <= end) {
      array.push(x);
      x += step;
    }
  }
  else if (step < 0) {
    while (x >= end) {
      array.push(x);
      x += step;
    }
  }

  return array;
};

/**
 * Create a Range from a RangeNode
 * @return {Range} range
 */
RangeNode.prototype.toRange = function() {
  // evaluate the parameters
  var start = this.start.eval();
  var step = this.step ? this.step.eval() : 1;
  var end = this.end.eval();

  // upper-bound be included, so compensate for that
  // NOTE: this only works for integer values!
  end = this.math.add(end, (step > 0) ? 1 : -1);

  // create the range
  return new Range(start, end, step);
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

  // search in parameters
  if (this.start) {
    nodes = nodes.concat(this.start.find(filter));
  }
  if (this.step) {
    nodes = nodes.concat(this.step.find(filter));
  }
  if (this.end) {
    nodes = nodes.concat(this.end.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
RangeNode.prototype.toString = function() {
  // format the range like "start:step:end"
  var str = this.start.toString();
  if (this.step) {
    str += ':' + this.step.toString();
  }
  str += ':' + this.end.toString();

  return str;
};

module.exports = RangeNode;
