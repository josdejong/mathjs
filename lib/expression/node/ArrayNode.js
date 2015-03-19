'use strict';

var Node = require('./Node'),
    string = require('../../util/string'),

    isArray = Array.isArray,
    isNode = Node.isNode;

/**
 * @constructor ArrayNode
 * @extends {Node}
 * Holds an 1-dimensional array with nodes
 * @param {Node[]} [nodes]   1 dimensional array with nodes
 */
function ArrayNode(nodes) {
  if (!(this instanceof ArrayNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  this.nodes = nodes || [];

  // validate input
  if (!isArray(this.nodes) || !this.nodes.every(isNode)) {
    throw new TypeError('Array containing Nodes expected');
  }
}

ArrayNode.prototype = new Node();

ArrayNode.prototype.type = 'ArrayNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @private
 */
ArrayNode.prototype._compile = function (defs) {
  var asMatrix = (defs.math.config().matrix !== 'array');

  var nodes = this.nodes.map(function (node) {
    return node._compile(defs);
  });

  return (asMatrix ? 'math.matrix([' : '[') +
      nodes.join(',') +
      (asMatrix ? '])' : ']');
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
ArrayNode.prototype.forEach = function (callback) {
  for (var i = 0; i < this.nodes.length; i++) {
    var node = this.nodes[i];
    callback(node, 'nodes[' + i + ']', this);
  }
};

/**
 * Create a new ArrayNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {ArrayNode} Returns a transformed copy of the node
 */
ArrayNode.prototype.map = function (callback) {
  var nodes = [];
  for (var i = 0; i < this.nodes.length; i++) {
    nodes[i] = this._ifNode(callback(this.nodes[i], 'nodes[' + i + ']', this));
  }
  return new ArrayNode(nodes);
};

/**
 * Create a clone of this node, a shallow copy
 * @return {ArrayNode}
 */
ArrayNode.prototype.clone = function() {
  return new ArrayNode(this.nodes.slice(0));
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
ArrayNode.prototype.toString = function() {
  return string.format(this.nodes);
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @param {String} type
 * @return {String} str
 */
ArrayNode.prototype._toTex = function(callbacks) {
  this.latexType = this.latexType || 'bmatrix';
  var s = '\\begin{' + this.latexType + '}';

  this.nodes.forEach(function(node) {
    if (node.nodes) {
      s += node.nodes.map(function(childNode) {
        return childNode.toTex(callbacks);
      }).join('&');
    }
    else {
      s += node.toTex(callbacks);
    }

    // new line
    s += '\\\\';
  });
  s += '\\end{' + this.latexType + '}';
  return s;
};

module.exports = ArrayNode;
