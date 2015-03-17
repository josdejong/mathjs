'use strict';

var Node = require('./Node'),
    Unit = require('../../type/Unit'),

    latex = require('../../util/latex'),
    isString = require('../../util/string').isString;

/**
 * @constructor SymbolNode
 * @extends {Node}
 * A symbol node can hold and resolve a symbol
 * @param {String} name
 * @extends {Node}
 */
function SymbolNode(name) {
  if (!(this instanceof SymbolNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!isString(name))  throw new TypeError('String expected for parameter "name"');

  this.name = name;
}

SymbolNode.prototype = new Node();

SymbolNode.prototype.type = 'SymbolNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
SymbolNode.prototype._compile = function (defs) {
  // add a function to the definitions
  defs['undef'] = undef;
  defs['Unit'] = Unit;

  if (this.name in defs.math) {
    return '("' + this.name + '" in scope ? scope["' + this.name + '"] : math["' + this.name + '"])';
  }
  else {
    return '(' +
        '"' + this.name + '" in scope ? scope["' + this.name + '"] : ' +
        (Unit.isValuelessUnit(this.name) ?
            'new Unit(null, "' + this.name + '")' :
            'undef("' + this.name + '")') +
        ')';
  }
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
SymbolNode.prototype.forEach = function (callback) {
  // nothing to do, we don't have childs
};

/**
 * Create a new SymbolNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node) : Node} callback
 * @returns {SymbolNode} Returns a clone of the node
 */
SymbolNode.prototype.map = function (callback) {
  return this.clone();
};

/**
 * Throws an error 'Undefined symbol {name}'
 * @param {String} name
 */
function undef (name) {
  throw new Error('Undefined symbol ' + name);
}

/**
 * Create a clone of this node, a shallow copy
 * @return {SymbolNode}
 */
SymbolNode.prototype.clone = function() {
  return new SymbolNode(this.name);
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toString = function() {
  return this.name;
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @return {String} str
 * @override
 */
SymbolNode.prototype._toTex = function(callbacks) {
  return latex.toSymbol(this.name, callbacks);
};

module.exports = SymbolNode;
