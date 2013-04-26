/**
 * @constructor Symbol
 * A symbol can hold and evaluate a link to a value or function defined in a
 * scope.
 * @param {String} [name]
 * @param {Link} link
 * @extends {Node}
 */
function Symbol(name, link) {
    this.name = name;
    this.link = link;
}

Symbol.prototype = new Node();

math.expr.node.Symbol = Symbol;

/**
 * Evaluate the symbol
 * @return {*} result
 * @override
 */
Symbol.prototype.eval = function() {
    // return the value of the link
    return this.link.get();
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
Symbol.prototype.toString = function() {
    return this.name;
};
