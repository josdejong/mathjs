var Node = require('./Node');

/**
 * @constructor SymbolNode
 * A symbol node can hold and resolve a symbol
 * @param {String} name
 * @param {Scope} scope
 * @extends {Node}
 */
function SymbolNode(name, scope) {
  this.name = name;
  this.scope = scope;
}

SymbolNode.prototype = new Node();

/**
 * Evaluate the symbol. Throws an error when the symbol is undefined.
 * @return {*} result
 * @override
 */
SymbolNode.prototype.eval = function() {
  // return the value of the symbol
  var value = this.scope.get(this.name);

  if (value === undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  return value;
};

/**
 * Compile the node to javascript code
 * @param {Object} math     math.js instance
 * @return {String} js
 * @private
 */
SymbolNode.prototype._compile = function (math) {
  // Note: symbol node requires a function undef(name) to be defined,
  // this function is defined once in Node.prototype.compile
  return '(' +
      'scope["' + this.name + '"] !== undefined ? scope["' + this.name + '"] : ' +
      'math["' + this.name + '"] !== undefined ? math["' + this.name + '"] : ' +
      'undef("' + this.name + '")' +
      ')';
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toString = function() {
  return this.name;
};

module.exports = SymbolNode;
