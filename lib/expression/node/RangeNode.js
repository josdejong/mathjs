'use strict';

var Node = require('./Node');
var operators = require('../operators');

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
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
RangeNode.prototype.forEach = function (callback) {
  callback(this.start, 'start', this);
  callback(this.end, 'end', this);
  if (this.step) {
    callback(this.step, 'step', this);
  }
};

/**
 * Create a new RangeNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {RangeNode} Returns a transformed copy of the node
 */
RangeNode.prototype.map = function (callback) {
  return new RangeNode(
      this._ifNode(callback(this.start, 'start', this)),
      this._ifNode(callback(this.end, 'end', this)),
      this.step && this._ifNode(callback(this.step, 'step', this))
  );
};

/**
 * Create a clone of this node, a shallow copy
 * @return {RangeNode}
 */
RangeNode.prototype.clone = function() {
  return new RangeNode(this.start, this.end, this.step && this.step);
};

/**
 * Get string representation
 * @return {String} str
 */
RangeNode.prototype.toString = function() {
  var precedence = operators.getPrecedence(this);

  //format string as start:step:stop
  var str;

  var start = this.start.toString();
  var startPrecedence = operators.getPrecedence(this.start);
  if ((startPrecedence !== null) && (startPrecedence <= precedence)) {
    start = '(' + start + ')';
  }
  str = start;

  if (this.step) {
    var step = this.step.toString();
    var stepPrecedence = operators.getPrecedence(this.step);
    if ((stepPrecedence !== null) && (stepPrecedence <= precedence)) {
      step = '(' + step + ')';
    }
    str += ':' + step;
  }

  var end = this.end.toString();
  var endPrecedence = operators.getPrecedence(this.end);
  if ((endPrecedence !== null) && (endPrecedence <= precedence)) {
    end = '(' + end + ')';
  }
  str += ':' + end;

  return str;
};

/**
 * Get LaTeX representation
 * @params {Object|function} callback(s)
 * @return {String} str
 */
RangeNode.prototype.toTex = function(customFunctions) {
  var str = this.start.toTex(customFunctions);
  if (this.step) {
    str += ':' + this.step.toTex(customFunctions);
  }
  str += ':' + this.end.toTex(customFunctions);

  return str;
};

module.exports = RangeNode;
