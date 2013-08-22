var Unit = require('../type/Unit.js');

/**
 * Scope
 * A scope stores values of symbols: variables and functions.
 *
 * Syntax:
 *     var scope = new Scope(math);
 *     var scope = new Scope(math, parentScope);
 *     var scope = new Scope(math, symbols);
 *     var scope = new Scope(math, parentScope, symbols);
 *
 * Where:
 *     {Object} math                Link to the (static) math.js namespace
 *     {Scope | Object} parentScope Scope will be linked to a parent scope,
 *                                  which is traversed when resolving
 *                                  symbols.
 *     {Object} symbols             A custom object that will be used to
 *                                  resolve and store variables.
 *
 * @constructor Scope
 * @param {...} [math]
 * @param {*} [arg1]
 * @param {*} [arg2]
 */
function Scope(math, arg1, arg2) {
  this.math = math;

  /** @type {Scope} */
  this.parentScope = null;
  // TODO: rename parentScope to previousScope, add a nextScope, change Scope to a linked list node

  /** @type {Scope[]} */
  this.subScopes = null;
  // TODO: rename subScopes to childScopes (or childNodes?)

  /** @type {Object.<String, *>} */
  this.symbols = {};  // variables and functions

  /** @type {Object.<String, Object>} */
  this.cache = {};    // cache, referring to the scope.symbols object where
  // a variable was last found

  // read second argument (can be parentScope or symbols map)
  if (arg1) {
    if (arg1 instanceof Scope) {
      this.parentScope = arg1;
    }
    else if (arg1 instanceof Object) {
      this.symbols = arg1;
    }
  }

  // read second argument (can be symbols map)
  if (arg2) {
    if (arg2 instanceof Object) {
      this.symbols = arg2;
    }
  }
}

Scope.prototype = {
  /**
   * Create a sub scope
   * The variables in a sub scope are not accessible from the parent scope
   * @return {Scope} subScope
   */
  createSubScope: function () {
    var subScope = new Scope(this.math, this);
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

    // read from cache
    var symbols = this.cache[name];
    if (symbols) {
      return symbols[name];
    }

    // check parent scope
    var parent = this.parentScope;
    while (parent) {
      value = parent.symbols[name];
      if (value !== undefined) {
        this.cache[name] = parent.symbols;
        return value;
      }
      parent = parent.parentScope;
    }

    // check static context
    value = this.math[name];
    if (value !== undefined) {
      this.cache[name] = this.math;
      return value;
    }

    // check if name is a unit
    if (Unit.isPlainUnit(name)) {
      value = new Unit(null, name);
      this.cache[name] = {};
      this.cache[name][name] = value;
      return value;
    }

    return undefined;
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
   * Clear all symbols in this scope, its sub scopes, and clear the cache.
   * Parent scopes will not be cleared.
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

    this.clearCache();
  },

  /**
   * Clear cached links to symbols in other scopes
   */
  clearCache: function () {
    this.cache = {};
  }
};

Scope.context = []; // static context, for example the math namespace

module.exports = Scope;
