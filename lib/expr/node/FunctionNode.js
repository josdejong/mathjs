var Node = require('./Node.js'),
    error = require('../../util/error.js');

/**
 * @constructor FunctionNode
 * Function assignment
 *
 * @param {String} name           Function name
 * @param {String[]} variables    Variable names
 * @param {Node} expr             The function expression
 * @param {Scope} functionScope   Scope in which to write variable values
 * @param {Scope} scope           Scope to store the resulting function assignment
 */
function FunctionNode(name, variables, expr, functionScope, scope) {
  this.name = name;
  this.variables = variables;
  this.expr = expr;
  this.scope = scope;

  // create function
  this.fn = function () {
    var num = variables ? variables.length : 0;

    // validate correct number of arguments
    if (arguments.length != num) {
      throw new error.ArgumentsError(name, arguments.length, num);
    }

    // fill in the provided arguments in the functionScope variables
    for (var i = 0; i < num; i++) {
      functionScope.set(variables[i], arguments[i]);
    }

    // evaluate the expression
    return expr.eval();
  };

  this.fn.toString = function() {
    // TODO: what to return as toString?
    return name + '(' + variables.join(', ') + ')';
    //return name + '(' + variableNames.join(', ') + ') = ' + expr.toString();
  };
}

FunctionNode.prototype = new Node();

/**
 * Evaluate the function assignment
 * @return {function} fn
 */
FunctionNode.prototype.eval = function() {
  // put the definition in the scope
  this.scope.set(this.name, this.fn);

  return this.fn;
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

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
  return this.fn.toString();
};

module.exports = FunctionNode;
