/**
 * @constructor Symbol
 * A symbol can hold and evaluate a variable or function with parameters.
 * @param {String} [name]
 * @param {function} fn
 * @param {Node[]} params
 * @extends {Node}
 */
function Symbol(name, fn, params) {
    this.name = name;
    this.fn = fn;
    this.params = params;
}

Symbol.prototype = new Node();

math.expr.node.Symbol = Symbol;

/**
 * Check whether the Symbol has one or multiple parameters set.
 * @return {Boolean}
 */
Symbol.prototype.hasParams = function () {
    return (this.params != undefined && this.params.length > 0);
};

/**
 * Evaluate the symbol
 * @return {*} result
 * @override
 */
Symbol.prototype.eval = function() {
    var fn = this.fn;
    if (fn === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    // evaluate the parameters
    var results = this.params.map(function (param) {
        return param.eval();
    });

    // evaluate the function
    return fn.apply(this, results);
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
Symbol.prototype.toString = function() {
    // variable. format the symbol like "myvar"
    if (this.name && !this.params) {
        return this.name;
    }

    /* TODO: determine if the function is an operator
    // operator. format the operation like "(2 + 3)"
    if (this.fn && (this.fn instanceof mathnotepad.fn.Operator)) {
        if (this.params && this.params.length == 2) {
            return '(' +
                this.params[0].toString() + ' ' +
                this.name + ' ' +
                this.params[1].toString() + ')';
        }
    }
    */

    // function. format the operation like "f(2, 4.2)"
    var str = this.name;
    if (this.params && this.params.length) {
        str += '(' + this.params.join(', ') + ')';
    }
    return str;
};
