'use strict';

var Node = require('./Node'),
    ArrayNode = require('./ArrayNode'),

    keywords = require('../keywords'),

    latex = require('../../util/latex'),
    isString = require('../../util/string').isString;

/**
 * @constructor AssignmentNode
 * @extends {Node}
 * Define a symbol, like "a = 3.2"
 *
 * @param {String} name       Symbol name
 * @param {Node} expr         The expression defining the symbol
 */
function AssignmentNode(name, expr) {
  if (!(this instanceof AssignmentNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!isString(name))          throw new TypeError('String expected for parameter "name"');
  if (!(expr instanceof Node))  throw new TypeError('Node expected for parameter "expr"');
  if (name in keywords)         throw new Error('Illegal symbol name, "'  + name +  '" is a reserved keyword');

  this.name = name;
  this.expr = expr;
}

AssignmentNode.prototype = new Node();

AssignmentNode.prototype.type = 'AssignmentNode';

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
  nodes = nodes.concat(this.expr.find(filter));

  return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
AssignmentNode.prototype.toString = function() {
  return this.name + ' = ' + this.expr.toString();
};

/**
 * Get LaTeX representation
 * @return {String}
 */
AssignmentNode.prototype.toTex = function() {
  var brace;
  if (this.expr instanceof ArrayNode) {
    brace = ['\\mathbf{', '}'];
  }
  return latex.addBraces(latex.toSymbol(this.name), brace) + '=' +
      latex.addBraces(this.expr.toTex());
};

module.exports = AssignmentNode;