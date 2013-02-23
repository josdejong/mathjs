/**
 * @constructor math.parser.node.Function
 * @param {String} [name]
 * @param {function} fn
 * @param {Node[]} params
 * @extends {Node}
 */
function Function(name, fn, params) {
    this.name = name;
    this.fn = fn;
    this.params = params;
}

Function.prototype = new Node();

math.parser.node.Function = Function;

/**
 * Check whether the Function has one or multiple parameters set.
 * @return {Boolean}
 */
Function.prototype.hasParams = function () {
    return (this.params != undefined && this.params.length > 0);
};

/**
 * Evaluate the symbol
 * @return {*} result
 * @override
 */
Function.prototype.eval = function() {
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
Function.prototype.toString = function() {
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
