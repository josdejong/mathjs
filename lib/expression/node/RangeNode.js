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
 * @param {Object} settings         Settings of the math
 * @param {Node[]} params
 */
function RangeNode (math, settings, params) {
  this.math = math;
  this.settings = settings;

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
      start = range.start,
      step = range.step,
      end = range.end;

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

  return (this.settings.matrix === 'array') ? array : new Matrix(array);
};

/**
 * Create a Range from a RangeNode
 * @return {Range} range
 */
RangeNode.prototype.toRange = function() {
  // evaluate the parameters
  var range = this._evalParams(),
      start = range.start,
      step = range.step,
      end = range.end;

  // upper-bound be included, so compensate for that
  // NOTE: this only works for integer values!
  end = this.math.add(end, (step > 0) ? 1 : -1);

  // create the range
  return new Range(start, end, step);
};

/**
 * Evaluate the range parameters start, step, end
 * @returns {{start: Number, end: Number, step: Number}} range
 * @private
 */
RangeNode.prototype._evalParams = function _evalParams() {
  var start = this.start.eval();
  var end = this.end.eval();
  var step = this.step ? this.step.eval() : 1;

  // TODO: implement support for big numbers

  // convert big numbers to numbers
  if (start instanceof BigNumber) start = toNumber(start);
  if (end instanceof BigNumber)   end   = toNumber(end);
  if (step instanceof BigNumber)  step  = toNumber(step);

  // validate parameters
  if (!number.isNumber(start)) throw new TypeError('Parameter start must be a number');
  if (!number.isNumber(end))   throw new TypeError('Parameter end must be a number');
  if (!number.isNumber(step))  throw new TypeError('Parameter step must be a number');

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
