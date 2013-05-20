
/**
 * Scope
 * A scope stores values of symbols: variables and functions.
 *
 * Usage:
 *     var scope = new math.expr.Scope();
 *     var scope = new math.expr.Scope(parentScope);
 *     var scope = new math.expr.Scope(symbols);
 *     var scope = new math.expr.Scope(parentScope, symbols);
 *
 * Where:
 *     {math.expr.Scope} parentScope    Scope will be linked to a parent scope,
 *                                      which is consulted when resolving
 *                                      symbols.
 *     {Object} symbols                 A custom object that will be used to
 *                                      resolve and store variables.
 *
 * @constructor math.expr.Scope
 * @param {...} [args]
 */
math.expr.Scope = function Scope(args) {
    /** @type {math.expr.Scope} */
    this.parentScope = null;

    /** @type {math.expr.Scope[]} */
    this.subScopes = null;

    /** @type {Object.<String, *>} */
    this.symbols = {}; // variables and functions

    // read first argument
    if (arguments.length > 0) {
        var arg0 = arguments[0];
        if (arg0 instanceof math.expr.Scope) {
            this.parentScope = arg0;
        }
        else if (arg0 instanceof Object) {
            this.symbols = arg0;
        }
    }

    // read second argument
    if (arguments.length > 1) {
        var arg1 = arguments[1];
        if (arg1 instanceof Object) {
            this.symbols = arg1;
        }
    }
};

math.expr.Scope.prototype = {
    /**
     * Create a sub scope
     * The variables in a sub scope are not accessible from the parent scope
     * @return {math.expr.Scope} subScope
     */
    createSubScope: function () {
        var subScope = new math.expr.Scope(this);
        if (!this.subScopes) {
            this.subScopes = [];
        }
        this.subScopes.push(subScope);
        return subScope;
    },

    /**
     * Get a symbol value by name.
     * Returns undefined if the symbol is not found in this scope or any of
     * its parent scopes.
     * @param {String} name
     * @returns {* | undefined} value
     */
    get: function (name) {
        var value;

        // check itself
        value = this.symbols[name];
        if (value !== undefined) {
            return value;
        }

        // TODO: implement a caching mechanism to store the scope.symbols where it last found the symbol

        // check parent scope
        if (this.parentScope) {
            return this.parentScope.get(name);
        }

        // check root scope
        return math.expr.Scope.rootScope.get(name);
    },

    /**
     * Test whether this scope contains a symbol (will not check parent scopes)
     * @param {String} name
     * @return {Boolean} hasSymbol
     */
    has: function (name) {
        return (this.symbols[name] !== undefined);
    },

    /**
     * Set a symbol value
     * @param {String} name
     * @param {*} value
     * @return {*} value
     */
    set: function (name, value) {
        return this.symbols[name] = value;
    },

    /**
     * Remove a symbol by name
     * @param {String} name
     */
    remove: function(name) {
        delete this.symbols[name];
    },

    /**
     * Clear all symbols in this scope and its sub scopes
     * (parent scope will not be cleared)
     */
    clear: function () {
        var symbols = this.symbols;
        for (var name in symbols) {
            if (symbols.hasOwnProperty(name)) {
                delete symbols[name];
            }
        }

        if (this.subScopes) {
            var subScopes = this.subScopes;
            for (var i = 0, iMax = subScopes.length; i < iMax; i++) {
                subScopes[i].clear();
            }
        }
    },

    /**
     * Locate a symbol, find the last scope where this symbol is defined.
     * The function will first search the chain of parent scopes until it
     * finds the symbol. If found, it returns the scope where the symbol is
     * defined, else it returns undefined.
     * @param {String} name
     * @return {math.expr.Scope | undefined} scope, or undefined when not found
     */
    find: function (name) {
        // check this scope
        if (this.symbols[name] !== undefined) {
            return this;
        }

        // check parent scope
        if (this.parentScope) {
            return this.parentScope.find(name);
        }

        // check root scope
        return math.expr.Scope.rootScope.find(name);
    }
};

/**
 * @constructor math.expr.RootScope
 * The root scope is read-only, and returns/holds all built-in functions and
 * variables
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

    // TODO: do not cache anything in the root scope?
    //       will give issues when changing functions in the math namespace

    // check if cached
    value = this.symbols[name];
    if (value !== undefined) {
        return value;
    }

    // check function (and load the function), for example "sin" or "sqrt"
    // search in the mathnotepad.math namespace for this symbol
    value = math[name];
    if (value) {
        // Note: we do NOT cache methods
        return value;
    }

    // Check if token is a unit
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
