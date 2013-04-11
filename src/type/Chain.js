/**
 * Create a chained value. All methods available in the math.js library
 * can be called upon the value, and then will be evaluated with the
 * value itself as first argument.
 * The chain can be closed by executing chain.done(), which will return the
 * final value.
 * @param {*} [value]
 * @constructor
 */
math.type.Chain = function Chain (value) {
    if (!(this instanceof Chain)) {
        throw new SyntaxError(
            'Chain constructor must be called with the new operator');
    }

    this.value = value || undefined;
};

math.type.Chain.prototype = {
    /**
     * Close the chain. Returns the final value.
     * Does the same as method valueOf()
     * @returns {*} value
     */
    done: function () {
        return this.value;
    },

    /**
     * Get a submatrix or subselection from current value.
     * Only applicable when the current value has a method get.
     */
    get: function () {
        var value = this.value;
        if (!value) {
            throw Error('Value in chain is undefined');
        }

        if (value.get) {
            return new math.type.Chain(value.get.apply(value, arguments));
        }

        if (value instanceof Array) {
            // convert to matrix, evaluate, and then back to Array
            value = new Matrix(value);
            return new math.type.Chain(
                value.get.apply(value, arguments).valueOf()
            );
        }

        throw Error('Value in chain has no method get');
    },

    /**
     * Set a submatrix or subselection on current value.
     * Only applicable when the current value has a method set.
     */
    set: function () {
        var value = this.value;
        if (!value) {
            throw Error('Value in chain is undefined');
        }

        if (value.set) {
            return new math.type.Chain(value.set.apply(value, arguments));
        }

        if (value instanceof Array) {
            // convert to matrix, evaluate, and then back to Array
            value = new Matrix(value);
            return new math.type.Chain(
                value.set.apply(value, arguments).valueOf()
            );
        }

        throw Error('Value in chain has no method set');
    },

    /**
     * Close the chain. Returns the final value.
     * Does the same as method done()
     * @returns {*} value
     */
    valueOf: function () {
        return this.value;
    },

    /**
     * Get the string representation of the value in the chain
     * @returns {String}
     */
    toString: function () {
        return math.format(this.value);
    }
};

/**
 * Create a proxy method for the
 * @param {String} name
 * @param {*} value       The value or function to be proxied
 */
function createChainProxy(name, value) {
    var Chain = math.type.Chain;
    var slice = Array.prototype.slice;
    if (typeof value === 'function') {
        // a function
        Chain.prototype[name] = function () {
            var args = [this.value].concat(slice.call(arguments, 0));
            return new Chain(value.apply(this, args));
        }
    }
    else {
        // a constant
        Chain.prototype[name] = new Chain(value);
    }
}
