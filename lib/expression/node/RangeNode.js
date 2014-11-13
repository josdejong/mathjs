'use strict';

var Node = require('./Node');

var isNode = Node.isNode;

/**
 * @constructor RangeNode
 * @extends {Node}
 * create a range
 * @param {Node} start  included lower-bound
 * @param {Node} end    included lower-bound
 * @param {Node} [step] optional step
 */
function RangeNode (start, end, step) {
  if (!(this instanceof RangeNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate inputs
  if (!isNode(start)) throw new TypeError('Node expected');
  if (!isNode(end)) throw new TypeError('Node expected');
  if (step && !isNode(step)) throw new TypeError('Node expected');
  if (arguments.length > 3) throw new Error('Too many arguments');

  this.start = start;         // included lower-bound
  this.end   = end;           // included upper-bound
  this.step  = step || null;  // optional step
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
 * Create a clone of this node
 * @return {RangeNode}
 */
RangeNode.prototype.clone = function() {
  return new RangeNode(
      this.start.clone(),
      this.end.clone(),
      this.step && this.step.clone()
  );
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
