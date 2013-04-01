(function () {
    /**
     * Scope
     * A scope stores functions.
     *
     * @constructor mathnotepad.Scope
     * @param {Scope} [parentScope]
     */
    function Scope(parentScope) {
        this.parentScope = parentScope;
        this.nestedScopes = undefined;

        this.symbols = {}; // the actual symbols

        // the following objects are just used to test existence.
        this.defs = {};    // definitions by name (for example "a = [1, 2; 3, 4]")
        this.updates = {}; // updates by name     (for example "a(2, 1) = 5.2")
        this.links = {};   // links by name       (for example "2 * a")
    }

    math.expr.Scope = Scope;

    // TODO: rethink the whole scoping solution again. Try to simplify

    /**
     * Create a nested scope
     * The variables in a nested scope are not accessible from the parent scope
     * @return {Scope} nestedScope
     */
    Scope.prototype.createNestedScope = function () {
        var nestedScope = new Scope(this);
        if (!this.nestedScopes) {
            this.nestedScopes = [];
        }
        this.nestedScopes.push(nestedScope);
        return nestedScope;
    };

    /**
     * Clear all symbols in this scope and its nested scopes
     * (parent scope will not be cleared)
     */
    Scope.prototype.clear = function () {
        this.symbols = {};
        this.defs = {};
        this.links = {};
        this.updates = {};

        if (this.nestedScopes) {
            var nestedScopes = this.nestedScopes;
            for (var i = 0, iMax = nestedScopes.length; i < iMax; i++) {
                nestedScopes[i].clear();
            }
        }
    };

    /**
     * create a symbol
     * @param {String} name
     * @return {function} symbol
     * @private
     */
    Scope.prototype.createSymbol = function (name) {
        var symbol = this.symbols[name];
        if (!symbol) {
            // get a link to the last definition
            var lastDef = this.findDef(name);

            // create a new symbol
            symbol = this.newSymbol(name, lastDef);
            this.symbols[name] = symbol;

        }
        return symbol;
    };

    /**
     * Create a new symbol
     * @param {String} name
     * @param {*} [value]
     * @return {function} symbol
     * @private
     */
    Scope.prototype.newSymbol = function (name, value) {
        // create a new symbol
        var scope = this;
        var symbol = function () {
            var args, i;
            if (!symbol.value) {
                // try to resolve again
                symbol.value = scope.findDef(name);

                if (!symbol.value) {
                    throw new Error('Undefined symbol ' + name);
                }
            }
            if (typeof symbol.value === 'function') {
                return symbol.value.apply(null, arguments);
            }
            else if (symbol.value instanceof Matrix || symbol.value instanceof Range || symbol.value instanceof Array) {
                if (arguments.length) {
                    var matrix = (symbol.value instanceof Array) ? new Matrix(symbol.value) : symbol.value;
                    args = [];
                    for (i = 0; i < arguments.length; i++) {
                        args[i] = arguments[i];
                    }
                    return matrix.get(args);
                }
                else {
                    return symbol.value;
                }
            }
            // TODO: implement get subset for all types
            else {
                return symbol.value;
            }
        };

        symbol.value = value;

        symbol.toString = function () {
            return symbol.value ? symbol.value.toString() : '';
        };

        return symbol;
    };

    /**
     * create a link to a value.
     * @param {String} name
     * @return {function} symbol
     */
    Scope.prototype.createLink = function (name) {
        var symbol = this.links[name];
        if (!symbol) {
            symbol = this.createSymbol(name);
            this.links[name] = symbol;
        }
        return symbol;
    };

    /**
     * Create a variable definition
     * Returns the created symbol
     * @param {String} name
     * @param {*} [value]
     * @return {function} symbol
     */
    Scope.prototype.createDef = function (name, value) {
        var symbol = this.defs[name];
        if (!symbol) {
            symbol = this.createSymbol(name);
            this.defs[name] = symbol;
        }
        if (symbol && value != undefined) {
            symbol.value = value;
        }
        return symbol;
    };

    /**
     * Create a variable update definition
     * Returns the created symbol
     * @param {String} name
     * @return {function} symbol
     */
    Scope.prototype.createUpdate = function (name) {
        var symbol = this.updates[name];
        if (!symbol) {
            symbol = this.createLink(name);
            this.updates[name] = symbol;
        }
        return symbol;
    };

    /**
     * get the link to a symbol definition or update.
     * If the symbol is not found in this scope, it will be looked up in its parent
     * scope.
     * @param {String} name
     * @return {function | undefined} symbol, or undefined when not found
     */
    Scope.prototype.findDef = function (name) {
        var symbol;

        // check scope
        symbol = this.defs[name];
        if (symbol) {
            return symbol;
        }
        symbol = this.updates[name];
        if (symbol) {
            return symbol;
        }

        // check parent scope
        if (this.parentScope) {
            return this.parentScope.findDef(name);
        }
        else {
            // this is the root scope (has no parent)

            var newSymbol = this.newSymbol,
                symbols = this.symbols,
                defs = this.defs;

            /**
             * Store a symbol in the root scope
             * @param {String} name
             * @param {*} value
             * @return {function} symbol
             */
            function put(name, value) {
                var symbol = newSymbol(name, value);
                symbols[name] = symbol;
                defs[name] = symbol;
                return symbol;
            }

            // check constant (and load the constant)
            if (name == 'pi') {
                return put(name, math.PI);
            }
            if (name == 'e') {
                return put(name, math.E);
            }
            if (name == 'i') {
                return put(name, new Complex(0, 1));
            }

            // check function (and load the function), for example "sin" or "sqrt"
            // search in the mathnotepad.math namespace for this symbol
            var fn = math[name];
            if (fn) {
                return put(name, fn);
            }

            // Check if token is a unit
            // Note: we do not check the upper case name, units are case sensitive!
            if (Unit.isUnit(name)) {
                var unit = new Unit(null, name);
                return put(name, unit);
            }
        }

        return undefined;
    };

    /**
     * Remove a link to a symbol
     * @param {String} name
     */
    Scope.prototype.removeLink = function (name) {
        delete this.links[name];
    };

    /**
     * Remove a definition of a symbol
     * @param {String} name
     */
    Scope.prototype.removeDef = function (name) {
        delete this.defs[name];
    };

    /**
     * Remove an update definition of a symbol
     * @param {String} name
     */
    Scope.prototype.removeUpdate = function (name) {
        delete this.updates[name];
    };

    /**
     * initialize the scope and its nested scopes
     *
     * All functions are linked to their previous definition
     * If there is no parentScope, or no definition of the func in the parent scope,
     * the link will be set undefined
     */
    Scope.prototype.init = function () {
        var symbols = this.symbols;
        var parentScope = this.parentScope;

        for (var name in symbols) {
            if (symbols.hasOwnProperty(name)) {
                var symbol = symbols[name];
                symbol.value = (parentScope ? parentScope.findDef(name) : undefined);
            }
        }

        if (this.nestedScopes) {
            this.nestedScopes.forEach(function (nestedScope) {
                nestedScope.init();
            });
        }
    };

    /**
     * Check whether this scope or any of its nested scopes contain a link to a
     * symbol with given name
     * @param {String} name
     * @return {boolean} hasLink   True if a link with given name is found
     */
    Scope.prototype.hasLink = function (name) {
        if (this.links[name]) {
            return true;
        }

        if (this.nestedScopes) {
            var nestedScopes = this.nestedScopes;
            for (var i = 0, iMax = nestedScopes.length; i < iMax; i++) {
                if (nestedScopes[i].hasLink(name)) {
                    return true;
                }
            }
        }

        return false;
    };

    /**
     * Check whether this scope contains a definition of a symbol with given name
     * @param {String} name
     * @return {boolean} hasDef   True if a definition with given name is found
     */
    Scope.prototype.hasDef = function (name) {
        return (this.defs[name] != undefined);
    };

    /**
     * Check whether this scope contains an update definition of a symbol with
     * given name
     * @param {String} name
     * @return {boolean} hasUpdate   True if an update definition with given name is found
     */
    Scope.prototype.hasUpdate = function (name) {
        return (this.updates[name] != undefined);
    };

    /**
     * Retrieve all undefined symbols
     * @return {function[]} undefinedSymbols   All symbols which are undefined
     */
    Scope.prototype.getUndefinedSymbols = function () {
        var symbols = this.symbols;
        var undefinedSymbols = [];
        for (var i in symbols) {
            if (symbols.hasOwnProperty(i)) {
                var symbol = symbols[i];
                if (symbol.value == undefined) {
                    undefinedSymbols.push(symbol);
                }
            }
        }

        if (this.nestedScopes) {
            this.nestedScopes.forEach(function (nestedScope) {
                undefinedSymbols =
                    undefinedSymbols.concat(nestedScope.getUndefinedSymbols());
            });
        }

        return undefinedSymbols;
    };

})();
