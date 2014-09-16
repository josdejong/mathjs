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
 * Throws an error 'Undefined symbol {name}'
 * @param {String} name
 */
function undef (name) {
  throw new Error('Undefined symbol ' + name);
}

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
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toTex = function() {
  return latex.toSymbol(this.name);
};

module.exports = SymbolNode;
