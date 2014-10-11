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
 * Recursively execute a callback for each of the child nodes of this node
 * @param {function(Node, string, Node)} callback
 * @private
 */
RangeNode.prototype._traverse = function (callback) {
  callback(this.start, 'start', this);
  this.start._traverse(callback);

  if (this.step) {
    callback(this.step, 'step', this);
    this.step._traverse(callback);
  }

  callback(this.end, 'end', this);
  this.end._traverse(callback);
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
