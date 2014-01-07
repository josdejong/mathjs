var Node = require('./Node');

/**
 * @constructor AssignmentNode
 * @extends {Node}
 * Define a symbol, like "a = 3.2"
 *
 * @param {String} name       Symbol name
 * @param {Node} expr         The expression defining the symbol
 */
function AssignmentNode(name, expr) {
  this.name = name;
  this.expr = expr;
}

AssignmentNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @private
 */
AssignmentNode.prototype._compile = function (defs) {
  return 'scope["' + this.name + '"] = ' + this.expr._compile(defs) + '';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
 * @returns {Node[]} nodes
 */
AssignmentNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
AssignmentNode.prototype.toString = function() {
  return this.name + ' = ' + this.expr.toString();
};

module.exports = AssignmentNode;