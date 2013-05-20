
/**
 * @constructor math.expr.RootScope
 * The root scope is read-only, and returns/holds all built-in functions and
 * variables
 *
 * @extends math.expr.Scope
 */
math.expr.RootScope = function RootScope() {};

math.expr.RootScope.prototype = new math.expr.Scope();

/**
 * Create a sub scope
 * The variables in a sub scope are not accessible from the parent scope
 * @return {math.expr.Scope} subScope
 */
math.expr.RootScope.prototype.createSubScope = function () {
    throw new Error('Cannot create a sub scope in the root scope');
};

/**
 * Get a symbol value by name. Returns undefined if the symbol is not
 * found in this scope.
 * @param {String} name
 * @returns {* | undefined} value
 */
math.expr.RootScope.prototype.get = function (name) {
    var value;

    // check function (and load the function), for example "sin" or "sqrt"
    // search in the mathnotepad.math namespace for this symbol
    value = math[name];
    if (value) {
        // Note: we do NOT cache methods from the math namespace
        return value;
    }

    // check if cached
    value = this.symbols[name];
    if (value !== undefined) {
        return value;
    }

    // check if token is a unit
    if (Unit.isPlainUnit(name)) {
        value = new Unit(null, name);
        this.symbols[name] = value;
        return value;
    }

    // noop. not found
    return undefined;
};

/**
 * Test whether this scope contains a symbol (will not check parent scopes)
 * @param {String} name
 * @return {Boolean} hasSymbol
 */
math.expr.RootScope.prototype.has = function (name) {
    return (this.get(name) !== undefined);
};

/**
 * Set a symbol value
 * @param {String} name
 * @param {*} value
 */
math.expr.RootScope.prototype.set = function (name, value) {
    throw new Error('Cannot set a symbol in the root scope');
};

/**
 * Locate a symbol, find the last scope where this symbol is defined.
 * The function will first search the chain of parent scopes until it
 * finds the symbol. If found, it returns the scope where the symbol is
 * defined, else it returns undefined.
 * @param {String} name
 * @return {Scope | undefined} scope, or undefined when not found
 */
math.expr.RootScope.prototype.find = function (name) {
    if (this.get(name) !== undefined) {
        return this;
    }
    else {
        return undefined;
    }
};

/**
 * Singleton root scope for use by all scopes
 * @type {math.expr.Scope}
 */
math.expr.Scope.rootScope = new math.expr.RootScope();
