/**
 * @constructor SymbolNode
 * A symbol node can hold and resolve a symbol
 * @param {String} [name]
 * @param {math.expr.Symbol} symbol
 * @extends {Node}
 */
function SymbolNode(name, symbol) {
    this.name = name;
    this.symbol = symbol;
}

SymbolNode.prototype = new Node();

math.expr.node.SymbolNode = SymbolNode;

/**
 * Evaluate the symbol. Throws an error when the symbol is undefined.
 * @return {*} result
 * @override
 */
SymbolNode.prototype.eval = function() {
    // return the value of the symbol
    var value = this.symbol.get();

    if (value === undefined) {
        // TODO: throw an error or not?
        throw new Error('Undefined symbol ' + this.name);
    }

    return value;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toString = function() {
    return this.name;
};
