var Node = require('./Node'),

    latex = require('../../util/latex'),
    isNode = Node.isNode;

/**
 * @constructor ParamsNode
 * @extends {Node}
 * invoke a list with parameters on a node
 * @param {Node} object
 * @param {Node[]} params
 */
function ParamsNode (object, params) {
  if (!(this instanceof ParamsNode)) {
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

ParamsNode.prototype = new Node();

ParamsNode.prototype.type = 'ParamsNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ParamsNode.prototype._compile = function (defs) {
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
ParamsNode.prototype.find = function (filter) {
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
ParamsNode.prototype.toString = function() {
  // format the parameters like "add(2, 4.2)"
  return this.object.toString() + '(' + this.params.join(', ') + ')';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
ParamsNode.prototype.toTex = function() {
  return latex.toParams(this);
};

module.exports = ParamsNode;
