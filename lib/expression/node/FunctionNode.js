'use strict';

var Node = require('./Node'),

    latex = require('../../util/latex'),
    isNode = Node.isNode,
    isArray = Array.isArray;

/**
 * @constructor FunctionNode
 * @extends {Node}
 * invoke a list with parameters on a node
 * @param {Node} object
 * @param {Node[]} params
 */
function FunctionNode (object, params) {
  if (!(this instanceof FunctionNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!(object instanceof Node)) throw new TypeError('Node expected for parameter "object"');
  if (!isArray(params) || !params.every(isNode)) {
    throw new TypeError('Array containing Nodes expected for parameter "params"');
  }

  this.object = object;
  this.params = params;
}

FunctionNode.prototype = new Node();

FunctionNode.prototype.type = 'FunctionNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
FunctionNode.prototype._compile = function (defs) {
  // TODO: implement support for matrix indexes and ranges
  var params = this.params.map(function (param) {
    return param._compile(defs);
  });

  return this.object._compile(defs) + '(' + params.join(', ') + ')';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
FunctionNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search object
  nodes = nodes.concat(this.object.find(filter));

  // search in parameters
  var params = this.params;
  for (var i = 0, len = params.length; i < len; i++) {
    nodes = nodes.concat(params[i].find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
  // format the parameters like "add(2, 4.2)"
  return this.object.toString() + '(' + this.params.join(', ') + ')';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
FunctionNode.prototype.toTex = function() {
  return latex.toParams(this);
};

module.exports = FunctionNode;
