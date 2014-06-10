var Node = require('./Node'),
    keywords = require('../keywords'),
    latex = require('../../util/latex'),
    isString = require('../../util/string').isString;
    isArray = Array.isArray;

/**
 * @constructor FunctionNode
 * @extends {Node}
 * Function assignment
 *
 * @param {String} name           Function name
 * @param {String[]} args         Function argument names
 * @param {Node} expr             The function expression
 */
function FunctionNode(name, args, expr) {
  if (!(this instanceof FunctionNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!isString(name)) throw new TypeError('String expected for parameter "name"');
  if (!isArray(args) || !args.every(isString))  throw new TypeError('Array containing strings expected for parameter "args"');
  if (!(expr instanceof Node)) throw new TypeError('Node expected for parameter "expr"');
  if (name in keywords) throw new Error('Illegal function name, "'  + name +  '" is a reserved keyword');

  this.name = name;
  this.args = args;
  this.expr = expr;
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
  return 'scope["' + this.name + '"] = ' +
      '  (function (scope) {' +
      '    scope = Object.create(scope); ' +
      '    var fn = function ' + this.name + '(' + this.args.join(',') + ') {' +
      '      if (arguments.length != ' + this.args.length + ') {' +
      // TODO: use util.error.ArgumentsError here
      // TODO: test arguments error
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
  nodes = nodes.concat(this.expr.find(filter));

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

/**
 * get LaTeX representation
 * @return {String} str
 */
FunctionNode.prototype.toTex = function() {
  return this.name +
      latex.addBraces(this.args.map(latex.toSymbol).join(', '), true) + '=' +
      latex.addBraces(this.expr.toTex());
};

module.exports = FunctionNode;
