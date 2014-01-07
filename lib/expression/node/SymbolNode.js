var Node = require('./Node'),
    Unit = require('../../type/Unit');

/**
 * @constructor SymbolNode
 * @extends {Node}
 * A symbol node can hold and resolve a symbol
 * @param {String} name
 * @extends {Node}
 */
function SymbolNode(name) {
  this.name = name;
}

SymbolNode.prototype = new Node();

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

  return '(' +
      'scope["' + this.name + '"] !== undefined ? scope["' + this.name + '"] : ' +
      'math["' + this.name + '"] !== undefined ? math["' + this.name + '"] : ' +
      (Unit.isPlainUnit(this.name) ?
        'new Unit(null, "' + this.name + '")' :
        'undef("' + this.name + '")') +
      ')';
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

module.exports = SymbolNode;
