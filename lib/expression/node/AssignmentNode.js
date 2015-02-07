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
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
AssignmentNode.prototype.forEach = function (callback) {
  callback(this.expr, 'expr', this);
};

/**
 * Create a new AssignmentNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {AssignmentNode} Returns a transformed copy of the node
 */
AssignmentNode.prototype.map = function (callback) {
  return new AssignmentNode(this.name, this._ifNode(callback(this.expr, 'expr', this)));
};

/**
 * Create a clone of this node, a shallow copy
 * @return {AssignmentNode}
 */
AssignmentNode.prototype.clone = function() {
  return new AssignmentNode(this.name, this.expr);
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