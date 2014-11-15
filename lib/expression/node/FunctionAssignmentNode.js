'use strict';

var Node = require('./Node');
var keywords = require('../keywords');
var latex = require('../../util/latex');
var isString = require('../../util/string').isString;
var isArray = Array.isArray;

/**
 * @constructor FunctionAssignmentNode
 * @extends {Node}
 * Function assignment
 *
 * @param {String} name           Function name
 * @param {String[]} params         Function parameter names
 * @param {Node} expr             The function expression
 */
function FunctionAssignmentNode(name, params, expr) {
  if (!(this instanceof FunctionAssignmentNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!isString(name)) throw new TypeError('String expected for parameter "name"');
  if (!isArray(params) || !params.every(isString))  throw new TypeError('Array containing strings expected for parameter "params"');
  if (!(expr instanceof Node)) throw new TypeError('Node expected for parameter "expr"');
  if (name in keywords) throw new Error('Illegal function name, "'  + name +  '" is a reserved keyword');

  this.name = name;
  this.params = params;
  this.expr = expr;
}

FunctionAssignmentNode.prototype = new Node();

FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
FunctionAssignmentNode.prototype._compile = function (defs) {
  return 'scope["' + this.name + '"] = ' +
      '  (function (scope) {' +
      '    scope = Object.create(scope); ' +
      '    var fn = function ' + this.name + '(' + this.params.join(',') + ') {' +
      '      if (arguments.length != ' + this.params.length + ') {' +
      // TODO: use util.error.ArgumentsError here
      // TODO: test arguments error
      '        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.params.length + ' expected)");' +
      '      }' +
      this.params.map(function (variable, index) {
        return 'scope["' + variable + '"] = arguments[' + index + '];';
      }).join('') +
      '      return ' + this.expr._compile(defs) + '' +
      '    };' +
      '    fn.syntax = "' + this.name + '(' + this.params.join(', ') + ')";' +
      '    return fn;' +
      '  })(scope);';
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
FunctionAssignmentNode.prototype.forEach = function (callback) {
  callback(this.expr, 'expr', this);
};

/**
 * Create a new FunctionAssignmentNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
 */
FunctionAssignmentNode.prototype.map = function (callback) {
  var expr = this._ifNode(callback(this.expr, 'expr', this));

  return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
};

/**
 * Create a clone of this node, a shallow copy
 * @return {FunctionAssignmentNode}
 */
FunctionAssignmentNode.prototype.clone = function() {
  return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
};

/**
 * get string representation
 * @return {String} str
 */
FunctionAssignmentNode.prototype.toString = function() {
  return 'function ' + this.name +
      '(' + this.params.join(', ') + ') = ' +
      this.expr.toString();
};

/**
 * get LaTeX representation
 * @return {String} str
 */
FunctionAssignmentNode.prototype.toTex = function() {
  return this.name +
      latex.addBraces(this.params.map(latex.toSymbol).join(', '), true) + '=' +
      latex.addBraces(this.expr.toTex());
};

module.exports = FunctionAssignmentNode;
