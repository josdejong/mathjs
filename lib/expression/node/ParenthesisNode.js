'use strict';

var Node = require('./Node');
var isNode = Node.isNode;

/**
 * @constructor ParenthesisNode
 * @extends {Node}
 * A parenthesis node describes manual parenthesis from the user input
 * @param {Node} content
 * @extends {Node}
 */
function ParenthesisNode(content) {
  if (!(this instanceof ParenthesisNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!isNode(content)) {
    throw new TypeError('Node expected for parameter "content"');
  }

  this.content = content;
}

ParenthesisNode.prototype = new Node();

ParenthesisNode.prototype.type = 'ParenthesisNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ParenthesisNode.prototype._compile = function (defs) {
  return this.content._compile(defs);
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
ParenthesisNode.prototype.forEach = function (callback) {
  callback(this.content, 'content', this);
};

/**
 * Create a new ParenthesisNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node) : Node} callback
 * @returns {ParenthesisNode} Returns a clone of the node
 */
ParenthesisNode.prototype.map = function (callback) {
  var content = callback(this.content, 'content', this);
  return new ParenthesisNode(content);
};

/**
 * Create a clone of this node, a shallow copy
 * @return {ParenthesisNode}
 */
ParenthesisNode.prototype.clone = function() {
  return new ParenthesisNode(this.content);
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
ParenthesisNode.prototype.toString = function() {
  return '(' + this.content.toString() + ')';
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @return {String} str
 * @override
 */
ParenthesisNode.prototype._toTex = function(callbacks) {
  return '\\left(' + this.content.toTex(callbacks) + '\\right)';
};

module.exports = ParenthesisNode;
