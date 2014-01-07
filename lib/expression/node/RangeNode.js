var number = require('../../util/number'),
    Node = require('./Node'),

    BigNumber = require('bignumber.js'),
    Range = require('../../type/Range'),
    Matrix = require('../../type/Matrix'),

    toNumber = number.toNumber;

/**
 * @constructor RangeNode
 * @extends {Node}
 * create a range
 * @param {Node[]} params           Array [start, end] or [start, end, step]
 */
function RangeNode (params) {
  if (params.length != 2 && params.length != 3) {
    throw new SyntaxError('Wrong number of arguments. ' +
        'Expected [start, end] or [start, end, step]');
  }

  this.start = params[0];  // included lower-bound
  this.end   = params[1];  // included upper-bound
  this.step  = params[2];  // optional step
}

RangeNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
RangeNode.prototype._compile = function (defs) {
  return 'math.range(' +
      this.start._compile(defs) + ', ' +
      this.end._compile(defs) + ', ' +
      (this.step ? (this.step._compile(defs) + ', ') : '') +
      'true)'; // parameter includeEnd = true
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
