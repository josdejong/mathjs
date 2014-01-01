var number = require('../../util/number'),
    Node = require('./Node'),

    BigNumber = require('bignumber.js'),
    Range = require('../../type/Range'),
    Matrix = require('../../type/Matrix'),

    toNumber = number.toNumber;

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
  var range = this._evalParams(),
      includeEnd = true;

  // create the range
  return this.math.range(range.start, range.end, range.step, includeEnd);
};

/**
 * Compile the node to javascript code
 * @param {Object} math     math.js instance
 * @return {String} js
 * @private
 */
RangeNode.prototype._compile = function (math) {
  return 'math.range(' +
      this.start._compile(math) + ', ' +
      this.end._compile(math) + ', ' +
      (this.step ? (this.step._compile(math) + ', ') : '') +
      'true)'; // parameter includeEnd = true
};

/**
 * Create a Range from a RangeNode
 * @return {Range} range
 */
RangeNode.prototype.toRange = function() {
  // evaluate the parameters
  var range = this._evalParams();

  // convert big numbers to numbers
  if (range.start instanceof BigNumber) range.start = toNumber(range.start);
  if (range.end instanceof BigNumber)   range.end   = toNumber(range.end);
  if (range.step instanceof BigNumber)  range.step  = toNumber(range.step);

  // upper-bound must be included, so compensate for that
  // NOTE: this only works for integer numbers!
  range.end = this.math.add(range.end, (range.step > 0) ? 1 : -1);

  // create the range
  return new Range(range.start, range.end, range.step);
};

/**
 * Evaluate the range parameters start, step, end
 * @returns {{start: Number, end: Number, step: Number}} range
 * @private
 */
RangeNode.prototype._evalParams = function _evalParams() {
  var start = this.start.eval();
  var end = this.end.eval();
  var step = this.step ? this.step.eval() :
      ((start instanceof BigNumber) ? new BigNumber(1) : 1);

  return {
    start: start,
    end: end,
    step: step
  };
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
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
