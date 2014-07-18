'use strict';

var Node = require('./Node'),
    object = require('../../util/object'),
    string = require('../../util/string'),
    collection = require('../../type/collection'),
    util = require('../../util/index'),

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
    throw new TypeError('Array containing Nodes expected')
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
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ArrayNode.prototype.find = function (filter) {
  var results = [];

  // check itself
  if (this.match(filter)) {
    results.push(this);
  }

  // search in all nodes
  var nodes = this.nodes;
  for (var r = 0, rows = nodes.length; r < rows; r++) {
    results = results.concat(nodes[r].find(filter));
  }

  return results;
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
 * @return {String} str
 */
ArrayNode.prototype.toTex = function(type) {
  type = type || 'bmatrix';
  var s = '\\begin{' + type + '}';

  this.nodes.forEach(function(node) {
    if (node.nodes) {
      s += node.nodes.map(function(childNode) {
        return childNode.toTex();
      }).join('&');
    }
    else {
      s += node.toTex();
    }

    // new line
    s += '\\\\';
  });
  s += '\\end{' + type + '}';
  return s;
};

module.exports = ArrayNode;
