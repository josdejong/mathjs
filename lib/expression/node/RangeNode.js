'use strict';

var Node = require('./Node');

var isNode = Node.isNode;

/**
 * @constructor RangeNode
 * @extends {Node}
 * create a range
 * @param {Node[]} params           Array [start, end] or [start, end, step]
 */
function RangeNode (params) {
  if (!(this instanceof RangeNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate inputs
  if (!Array.isArray(params) ||
      (params.length != 2 && params.length != 3) ||
      !params.every(isNode)) {
    throw new TypeError('Expected an Array containing 2 or 3 Nodes as parameter "params"');
  }

  this.start = params[0];  // included lower-bound
  this.end   = params[1];  // included upper-bound
  this.step  = params[2];  // optional step
}

RangeNode.prototype = new Node();

RangeNode.prototype.type = 'RangeNode';

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
      this.end._compile(defs) +
      (this.step ? (', ' + this.step._compile(defs)) : '') +
      ')';
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
  nodes = nodes.concat(this.start.find(filter));
  if (this.step) {
    nodes = nodes.concat(this.step.find(filter));
  }
  nodes = nodes.concat(this.end.find(filter));

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

/**
 * Get LaTeX representation
 * @return {String} str
 */
RangeNode.prototype.toTex = function() {
  var str = this.start.toTex();
  if (this.step) {
    str += ':' + this.step.toTex();
  }
  str += ':' + this.end.toTex();

  return str;
};

module.exports = RangeNode;
