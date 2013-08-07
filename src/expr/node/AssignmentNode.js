var Node = require('./Node.js');

/**
 * @constructor AssignmentNode
 * Define a symbol, like "a = 3.2"
 *
 * @param {String} name       Symbol name
 * @param {Node} expr         The expression defining the symbol
 * @param {Scope} scope       Scope to store the result
 */
function AssignmentNode(name, expr, scope) {
  this.name = name;
  this.expr = expr;
  this.scope = scope;
}

AssignmentNode.prototype = new Node();

/**
 * Evaluate the assignment
 * @return {*} result
 */
AssignmentNode.prototype.eval = function() {
  if (this.expr === undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  var result = this.expr.eval();
  this.scope.set(this.name, result);

  return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
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