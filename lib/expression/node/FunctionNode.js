var Node = require('./Node');

/**
 * @constructor FunctionNode
 * @extends {Node}
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
      throw new SyntaxError('Wrong number of arguments in function ' + name +
          ' (' + arguments.length + ' provided, ' + num + ' expected)');
    }

    // fill in the provided arguments in the functionScope variables
    for (var i = 0; i < num; i++) {
      functionScope.set(variables[i], arguments[i]);
    }

    // evaluate the expression
    return expr.eval();
  };

  // add a field describing the function syntax
  this.fn.syntax = name + '(' + variables.join(', ') + ')';
}

FunctionNode.prototype = new Node();

/**
 * Evaluate the function assignment
 * @return {function} fn
 */
// TODO: cleanup
FunctionNode.prototype._eval = function() {
  // put the definition in the scope
  this.scope.set(this.name, this.fn);

  return this.fn;
};

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
FunctionNode.prototype._compile = function (defs) {

  // TODO: validate whether name and all variables are strings

  return 'scope["' + this.name + '"] = ' +
      '  (function (scope) {' +
      '    scope = Object.create(scope); ' +
      '    var fn = function ' + this.name + '(' + this.variables.join(',') + ') {' +
      '      if (arguments.length != ' + this.variables.length + ') {' +
      '        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.variables.length + ' expected)");' +
      '      }' +
      this.variables.map(function (variable, index) {
        return 'scope["' + variable + '"] = arguments[' + index + '];';
      }).join('') +
      '      return ' + this.expr._compile(defs) + '' +
      '    };' +
      '    fn.syntax = "' + this.name + '(' + this.variables.join(', ') + ')";' +
      '    return fn;' +
      '  })(scope);';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
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
  return 'function ' + this.name +
      '(' + this.variables.join(', ') + ') = ' +
      this.expr.toString();
};

module.exports = FunctionNode;
