var Node = require('./Node');

/**
 * @constructor FunctionNode
 * @extends {Node}
 * Function assignment
 *
 * @param {String} name           Function name
 * @param {String[]} args         Function arguments
 * @param {Node} expr             The function expression
 */
function FunctionNode(name, args, expr) {
  this.name = name;
  this.args = args;
  this.expr = expr;
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

  // TODO: validate whether name and all arguments are strings

  return 'scope["' + this.name + '"] = ' +
      '  (function (scope) {' +
      '    scope = Object.create(scope); ' +
      '    var fn = function ' + this.name + '(' + this.args.join(',') + ') {' +
      '      if (arguments.length != ' + this.args.length + ') {' +
      '        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.args.length + ' expected)");' +
      '      }' +
      this.args.map(function (variable, index) {
        return 'scope["' + variable + '"] = arguments[' + index + '];';
      }).join('') +
      '      return ' + this.expr._compile(defs) + '' +
      '    };' +
      '    fn.syntax = "' + this.name + '(' + this.args.join(', ') + ')";' +
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
      '(' + this.args.join(', ') + ') = ' +
      this.expr.toString();
};

module.exports = FunctionNode;
