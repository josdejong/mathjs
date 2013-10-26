/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * @version 0.15.0
 * @date    2013-10-26
 *
 * @license
 * Copyright (C) 2013 Jos de Jong <wjosdejong@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
(function(e){if("function"==typeof bootstrap)bootstrap("mathjs",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeMathjs=e}else"undefined"!=typeof window?window.mathjs=e():global.mathjs=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var object = require('./lib/util/object');

/**
 * math.js factory function.
 *
 * Usage:
 *
 *     var math = mathjs();
 *     var math = mathjs(options);
 *
 * @param {Object} [options]  Available options:
 *                            {Number} format.precision
 *                              A number in the range 0-16. Default value is 5.
 *                            {String} matrix.defaultType
 *                              A string 'array' or 'matrix' (default).
 */
function mathjs (options) {
  // create new namespace
  var math = {};

  // options
  // TODO: change options to properties with getters to validate the input value
  math.options = {
    matrix: {
      'defaultType': 'matrix' // type of default matrix output. Choose 'array' or 'matrix' (default)
    }
  };

  // merge options
  object.deepExtend(math.options, options);

  // TODO: remove deprecated options some day (deprecated since version 0.15.0)
  if (Object.defineProperty) {
    var fnPrecision = function () {
      throw new Error('Option math.options.precision is deprecated. ' +
          'Use math.format(value, precision) instead.')
    };

    Object.defineProperty(math.options, 'precision', {
      get: fnPrecision,
      set: fnPrecision,
      enumerable: false,
      configurable: false
    });

    var fnDefault = function () {
      throw new Error('Option math.options.matrix.default is deprecated. ' +
          'Use math.options.matrix.defaultType instead.')
    };

    Object.defineProperty(math.options.matrix, 'default', {
      get: fnDefault,
      set: fnDefault,
      enumerable: false,
      configurable: false
    });
  }


  // expression (Parser, Scope, nodes, docs)
  math.expression = {};
  math.expression.node = require('./lib/expression/node/index.js');
  math.expression.Scope = require('./lib/expression/Scope.js');
  math.expression.Parser = require('./lib/expression/Parser.js');
  math.expression.docs = require('./lib/expression/docs/index.js');

  // TODO: deprecated since version 0.13.0. cleanup deprecated stuff some day
  math.expr = {};
  math.expr.Scope = function () {
    throw new Error('Moved to math.expression.Scope');
  };
  math.expr.Parser = function () {
    throw new Error('Moved to math.expression.Parser');
  };


  // types (Matrix, Complex, Unit, ...)
  math.type = {};
  math.type.Complex = require('./lib/type/Complex.js');
  math.type.Range = require('./lib/type/Range.js');
  math.type.Index = require('./lib/type/Index.js');
  math.type.Matrix = require('./lib/type/Matrix.js');
  math.type.Unit = require('./lib/type/Unit.js');
  math.type.Help = require('./lib/type/Help.js');

  math.collection = require('./lib/type/collection.js');

  // expression parser
  require('./lib/function/expression/eval.js')(math);
  require('./lib/function/expression/help.js')(math);
  require('./lib/function/expression/parse.js')(math);

  // functions - arithmetic
  require('./lib/function/arithmetic/abs.js')(math);
  require('./lib/function/arithmetic/add.js')(math);
  require('./lib/function/arithmetic/add.js')(math);
  require('./lib/function/arithmetic/ceil.js')(math);
  require('./lib/function/arithmetic/cube.js')(math);
  require('./lib/function/arithmetic/divide.js')(math);
  require('./lib/function/arithmetic/edivide.js')(math);
  require('./lib/function/arithmetic/emultiply.js')(math);
  require('./lib/function/arithmetic/epow.js')(math);
  require('./lib/function/arithmetic/equal.js')(math);
  require('./lib/function/arithmetic/exp.js')(math);
  require('./lib/function/arithmetic/fix.js')(math);
  require('./lib/function/arithmetic/floor.js')(math);
  require('./lib/function/arithmetic/gcd.js')(math);
  require('./lib/function/arithmetic/larger.js')(math);
  require('./lib/function/arithmetic/largereq.js')(math);
  require('./lib/function/arithmetic/lcm.js')(math);
  require('./lib/function/arithmetic/log.js')(math);
  require('./lib/function/arithmetic/log10.js')(math);
  require('./lib/function/arithmetic/mod.js')(math);
  require('./lib/function/arithmetic/multiply.js')(math);
  require('./lib/function/arithmetic/pow.js')(math);
  require('./lib/function/arithmetic/round.js')(math);
  require('./lib/function/arithmetic/sign.js')(math);
  require('./lib/function/arithmetic/smaller.js')(math);
  require('./lib/function/arithmetic/smallereq.js')(math);
  require('./lib/function/arithmetic/sqrt.js')(math);
  require('./lib/function/arithmetic/square.js')(math);
  require('./lib/function/arithmetic/subtract.js')(math);
  require('./lib/function/arithmetic/unary.js')(math);
  require('./lib/function/arithmetic/unequal.js')(math);
  require('./lib/function/arithmetic/xgcd.js')(math);

  // functions - complex
  require('./lib/function/complex/arg.js')(math);
  require('./lib/function/complex/conj.js')(math);
  require('./lib/function/complex/re.js')(math);
  require('./lib/function/complex/im.js')(math);

  // functions - construction
  require('./lib/function/construction/boolean.js')(math);
  require('./lib/function/construction/complex.js')(math);
  require('./lib/function/construction/index.js')(math);
  require('./lib/function/construction/matrix.js')(math);
  require('./lib/function/construction/number.js')(math);
  require('./lib/function/construction/parser.js')(math);
  require('./lib/function/construction/string.js')(math);
  require('./lib/function/construction/unit.js')(math);

  // functions - matrix
  require('./lib/function/matrix/concat.js')(math);
  require('./lib/function/matrix/det.js')(math);
  require('./lib/function/matrix/diag.js')(math);
  require('./lib/function/matrix/eye.js')(math);
  require('./lib/function/matrix/inv.js')(math);
  require('./lib/function/matrix/ones.js')(math);
  require('./lib/function/matrix/range.js')(math);
  require('./lib/function/matrix/size.js')(math);
  require('./lib/function/matrix/squeeze.js')(math);
  require('./lib/function/matrix/subset.js')(math);
  require('./lib/function/matrix/transpose.js')(math);
  require('./lib/function/matrix/zeros.js')(math);

  // functions - probability
  require('./lib/function/probability/factorial.js')(math);
  require('./lib/function/probability/random.js')(math);

  // functions - statistics
  require('./lib/function/statistics/min.js')(math);
  require('./lib/function/statistics/max.js')(math);
  require('./lib/function/statistics/mean.js')(math);

  // functions - trigonometry
  require('./lib/function/trigonometry/acos.js')(math);
  require('./lib/function/trigonometry/asin.js')(math);
  require('./lib/function/trigonometry/atan.js')(math);
  require('./lib/function/trigonometry/atan2.js')(math);
  require('./lib/function/trigonometry/cos.js')(math);
  require('./lib/function/trigonometry/cot.js')(math);
  require('./lib/function/trigonometry/csc.js')(math);
  require('./lib/function/trigonometry/sec.js')(math);
  require('./lib/function/trigonometry/sin.js')(math);
  require('./lib/function/trigonometry/tan.js')(math);

  // functions - units
  require('./lib/function/units/in.js')(math);

  // functions - utils
  require('./lib/function/utils/clone.js')(math);
  require('./lib/function/utils/format.js')(math);
  require('./lib/function/utils/import.js')(math);
  require('./lib/function/utils/map.js')(math);
  require('./lib/function/utils/print.js')(math);
  require('./lib/function/utils/select.js')(math);
  require('./lib/function/utils/typeof.js')(math);
  require('./lib/function/utils/forEach.js')(math);

  // constants
  require('./lib/constants.js')(math);

  // selector (we initialize after all functions are loaded)
  math.chaining = {};
  math.chaining.Selector = require('./lib/chaining/Selector.js')(math);

  // TODO: deprecated since version 0.13.0. Cleanup some day
  math.expr.Selector = function () {
    throw new Error('Moved to math.expression.Selector');
  };

  // return the new instance
  return math;
}


// return the mathjs factory
module.exports = mathjs;

// error messages for deprecated static library (deprecated since v0.15.0) TODO: remove some day
var placeholder = function () {
  throw new Error('Static function calls are deprecated. Create an instance of math.js:\n\t"var math = require(\'mathjs\')();" on node.js, \n\t"var math = mathjs();" in the browser.');
};
var instance = mathjs();
for (var prop in instance) {
  if (instance.hasOwnProperty(prop)) {
    var fn = instance[prop];
    if (typeof fn === 'function') {
      mathjs[prop] = placeholder;
    }
    else {
      if (Object.defineProperty) {
        Object.defineProperty(mathjs, prop, {
          get: placeholder,
          set: placeholder,
          enumerable: true,
          configurable: false
        });
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.math = mathjs;
}
},{"./lib/chaining/Selector.js":2,"./lib/constants.js":3,"./lib/expression/Parser.js":4,"./lib/expression/Scope.js":5,"./lib/expression/docs/index.js":101,"./lib/expression/node/index.js":114,"./lib/function/arithmetic/abs.js":115,"./lib/function/arithmetic/add.js":116,"./lib/function/arithmetic/ceil.js":117,"./lib/function/arithmetic/cube.js":118,"./lib/function/arithmetic/divide.js":119,"./lib/function/arithmetic/edivide.js":120,"./lib/function/arithmetic/emultiply.js":121,"./lib/function/arithmetic/epow.js":122,"./lib/function/arithmetic/equal.js":123,"./lib/function/arithmetic/exp.js":124,"./lib/function/arithmetic/fix.js":125,"./lib/function/arithmetic/floor.js":126,"./lib/function/arithmetic/gcd.js":127,"./lib/function/arithmetic/larger.js":128,"./lib/function/arithmetic/largereq.js":129,"./lib/function/arithmetic/lcm.js":130,"./lib/function/arithmetic/log.js":131,"./lib/function/arithmetic/log10.js":132,"./lib/function/arithmetic/mod.js":133,"./lib/function/arithmetic/multiply.js":134,"./lib/function/arithmetic/pow.js":135,"./lib/function/arithmetic/round.js":136,"./lib/function/arithmetic/sign.js":137,"./lib/function/arithmetic/smaller.js":138,"./lib/function/arithmetic/smallereq.js":139,"./lib/function/arithmetic/sqrt.js":140,"./lib/function/arithmetic/square.js":141,"./lib/function/arithmetic/subtract.js":142,"./lib/function/arithmetic/unary.js":143,"./lib/function/arithmetic/unequal.js":144,"./lib/function/arithmetic/xgcd.js":145,"./lib/function/complex/arg.js":146,"./lib/function/complex/conj.js":147,"./lib/function/complex/im.js":148,"./lib/function/complex/re.js":149,"./lib/function/construction/boolean.js":150,"./lib/function/construction/complex.js":151,"./lib/function/construction/index.js":152,"./lib/function/construction/matrix.js":153,"./lib/function/construction/number.js":154,"./lib/function/construction/parser.js":155,"./lib/function/construction/string.js":156,"./lib/function/construction/unit.js":157,"./lib/function/expression/eval.js":158,"./lib/function/expression/help.js":159,"./lib/function/expression/parse.js":160,"./lib/function/matrix/concat.js":161,"./lib/function/matrix/det.js":162,"./lib/function/matrix/diag.js":163,"./lib/function/matrix/eye.js":164,"./lib/function/matrix/inv.js":165,"./lib/function/matrix/ones.js":166,"./lib/function/matrix/range.js":167,"./lib/function/matrix/size.js":168,"./lib/function/matrix/squeeze.js":169,"./lib/function/matrix/subset.js":170,"./lib/function/matrix/transpose.js":171,"./lib/function/matrix/zeros.js":172,"./lib/function/probability/factorial.js":173,"./lib/function/probability/random.js":174,"./lib/function/statistics/max.js":175,"./lib/function/statistics/mean.js":176,"./lib/function/statistics/min.js":177,"./lib/function/trigonometry/acos.js":178,"./lib/function/trigonometry/asin.js":179,"./lib/function/trigonometry/atan.js":180,"./lib/function/trigonometry/atan2.js":181,"./lib/function/trigonometry/cos.js":182,"./lib/function/trigonometry/cot.js":183,"./lib/function/trigonometry/csc.js":184,"./lib/function/trigonometry/sec.js":185,"./lib/function/trigonometry/sin.js":186,"./lib/function/trigonometry/tan.js":187,"./lib/function/units/in.js":188,"./lib/function/utils/clone.js":189,"./lib/function/utils/forEach.js":190,"./lib/function/utils/format.js":191,"./lib/function/utils/import.js":192,"./lib/function/utils/map.js":193,"./lib/function/utils/print.js":194,"./lib/function/utils/select.js":195,"./lib/function/utils/typeof.js":196,"./lib/type/Complex.js":197,"./lib/type/Help.js":198,"./lib/type/Index.js":199,"./lib/type/Matrix.js":200,"./lib/type/Range.js":201,"./lib/type/Unit.js":202,"./lib/type/collection.js":203,"./lib/util/object":209}],2:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../util/index'),
      string = util.string;

  /**
   * @constructor Selector
   * Wrap any value in a Selector, allowing to perform chained operations on
   * the value.
   *
   * All methods available in the math.js library can be called upon the selector,
   * and then will be evaluated with the value itself as first argument.
   * The selector can be closed by executing selector.done(), which will return
   * the final value.
   *
   * The Selector has a number of special functions:
   * - done()             Finalize the chained operation and return the
   *                      selectors value.
   * - valueOf()          The same as done()
   * - toString()         Returns a string representation of the selectors value.
   *
   * @param {*} [value]
   */
  function Selector (value) {
    if (!(this instanceof Selector)) {
      throw new SyntaxError(
          'Selector constructor must be called with the new operator');
    }

    if (value instanceof Selector) {
      this.value = value.value;
    }
    else {
      this.value = value;
    }
  }

  Selector.prototype = {
    /**
     * Close the selector. Returns the final value.
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
    // TODO: Selector.get is deprecated since version 0.13.0, remove it some day
    get: function (index) {
      throw new Error('Selector.get is removed. Use Selector.subset(index) instead.')
    },

    /**
     * Set a submatrix or subselection on current value.
     * Only applicable when the current value has a method set.
     */
    // TODO: Selector.get is deprecated since version 0.13.0, remove it some day
    set: function (index, replacement) {
      throw new Error('Selector.set is removed. Use Selector.subset(index, replacement) instead.')
    },

    /**
     * Close the selector. Returns the final value.
     * Does the same as method done()
     * @returns {*} value
     */
    valueOf: function () {
      return this.value;
    },

    /**
     * Get a string representation of the value in the selector
     * @returns {String}
     */
    toString: function () {
      return string.format(this.value);
    }
  };

  /**
   * Create a proxy method for the selector
   * @param {String} name
   * @param {*} value       The value or function to be proxied
   */
  function createProxy(name, value) {
    var slice = Array.prototype.slice;
    if (typeof value === 'function') {
      // a function
      Selector.prototype[name] = function () {
        var args = [this.value].concat(slice.call(arguments, 0));
        return new Selector(value.apply(this, args));
      }
    }
    else {
      // a constant
      Selector.prototype[name] = new Selector(value);
    }
  }

  Selector.createProxy = createProxy;

  /**
   * initialise the Chain prototype with all functions and constants in math
   */
  for (var prop in math) {
    if (math.hasOwnProperty(prop) && prop) {
      createProxy(prop, math[prop]);
    }
  }

  util.types.addType('selector', Selector);

  return Selector;
};

},{"../util/index":207}],3:[function(require,module,exports){
module.exports = function (math) {
  var Complex = require('./type/Complex');

  math.pi          = Math.PI;
  math.e           = Math.E;
  math.tau         = Math.PI * 2;
  math.i           = new Complex(0, 1);

  math['Infinity'] = Infinity;
  math['NaN']      = NaN;
  math['true']     = true;
  math['false']    = false;

  // uppercase constants (for compatibility with built-in Math)
  math.E           = Math.E;
  math.LN2         = Math.LN2;
  math.LN10        = Math.LN10;
  math.LOG2E       = Math.LOG2E;
  math.LOG10E      = Math.LOG10E;
  math.PI          = Math.PI;
  math.SQRT1_2     = Math.SQRT1_2;
  math.SQRT2       = Math.SQRT2;
};

},{"./type/Complex":197}],4:[function(require,module,exports){
var Scope = require('./Scope');

/**
 * @constructor Parser
 * Parser contains methods to evaluate or parse expressions, and has a number
 * of convenience methods to get, set, and remove variables from memory. Parser
 * keeps a scope containing variables in memory, which is used for all
 * evaluations.
 *
 * Methods:
 *    var result = parser.eval(expr);    // evaluate an expression
 *    var value = parser.get(name);      // retrieve a variable from the parser
 *    parser.set(name, value);           // set a variable in the parser
 *    parser.remove(name);               // clear a variable from the
 *                                       // parsers scope
 *    parser.clear();                    // clear the parsers scope
 *
 *    // it is possible to parse an expression into a node tree:
 *    var node = parser.parse(expr);     // parse an expression into a node tree
 *    var result = node.eval();          // evaluate a parsed node
 *
 * Example usage:
 *    var parser = new Parser(math);
 *    // Note: there is a convenience method which can be used instead:
 *    // var parser = new math.parser();
 *
 *    // evaluate expressions
 *    parser.eval('sqrt(3^2 + 4^2)');         // 5
 *    parser.eval('sqrt(-4)');                // 2i
 *    parser.eval('2 inch in cm');            // 5.08 cm
 *    parser.eval('cos(45 deg)');             // 0.7071067811865476
 *
 *    // define variables and functions
 *    parser.eval('x = 7 / 2');               // 3.5
 *    parser.eval('x + 3');                   // 6.5
 *    parser.eval('function f(x, y) = x^y');  // f(x, y)
 *    parser.eval('f(2, 3)');                 // 8
 *
 *    // get and set variables and functions
 *    var x = parser.get('x');                // 7
 *    var f = parser.get('f');                // function
 *    var g = f(3, 2);                        // 9
 *    parser.set('h', 500);
 *    var i = parser.eval('h / 2');           // 250
 *    parser.set('hello', function (name) {
 *        return 'hello, ' + name + '!';
 *    });
 *    parser.eval('hello("user")');           // "hello, user!"
 *
 *    // clear defined functions and variables
 *    parser.clear();
 *
 *
 * @param {Object} math     Link to the math.js namespace
 */
function Parser(math) {
  if (!(this instanceof Parser)) {
    throw new SyntaxError(
        'Parser constructor must be called with the new operator');
  }

  this.math = math;
  this.scope = new Scope(math);
}

/**
 * Parse an expression end return the parsed function node.
 * The node can be evaluated via node.eval()
 * @param {String} expr
 * @return {Node} node
 * @throws {Error}
 */
Parser.prototype.parse = function (expr) {
  // TODO: validate arguments
  return this.math.parse(expr, this.scope);
};

/**
 * Parse and evaluate the given expression
 * @param {String} expr   A string containing an expression, for example "2+3"
 * @return {*} result     The result, or undefined when the expression was empty
 * @throws {Error}
 */
Parser.prototype.eval = function (expr) {
  // TODO: validate arguments
  var node = this.math.parse(expr, this.scope);
  return node.eval();
};

/**
 * Get a variable (a function or variable) by name from the parsers scope.
 * Returns undefined when not found
 * @param {String} name
 * @return {* | undefined} value
 */
Parser.prototype.get = function (name) {
  // TODO: validate arguments
  return this.scope.get(name);
};

/**
 * Set a symbol (a function or variable) by name from the parsers scope.
 * @param {String} name
 * @param {* | undefined} value
 */
Parser.prototype.set = function (name, value) {
  // TODO: validate arguments
  return this.scope.set(name, value);
};

/**
 * Remove a variable from the parsers scope
 * @param {String} name
 */
Parser.prototype.remove = function (name) {
  // TODO: validate arguments
  this.scope.remove(name);
};

/**
 * Clear the scope with variables and functions
 */
Parser.prototype.clear = function () {
  this.scope.clear();
};

module.exports = Parser;

},{"./Scope":5}],5:[function(require,module,exports){
var Unit = require('../type/Unit');

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

},{"../type/Unit":202}],6:[function(require,module,exports){
module.exports = {
  'name': 'Infinity',
  'category': 'Constants',
  'syntax': [
    'Infinity'
  ],
  'description': 'Infinity, a number which is larger than the maximum number that can be handled by a floating point number.',
  'examples': [
    'Infinity',
    '1 / 0'
  ],
  'seealso': []
};

},{}],7:[function(require,module,exports){
module.exports = {
  'name': 'LN10',
  'category': 'Constants',
  'syntax': [
    'LN10'
  ],
  'description': 'Returns the natural logarithm of 10, approximately equal to 2.302',
  'examples': [
    'LN10',
    'log(10)'
  ],
  'seealso': []
};

},{}],8:[function(require,module,exports){
module.exports = {
  'name': 'LN2',
  'category': 'Constants',
  'syntax': [
    'LN2'
  ],
  'description': 'Returns the natural logarithm of 2, approximately equal to 0.693',
  'examples': [
    'LN2',
    'log(2)'
  ],
  'seealso': []
};

},{}],9:[function(require,module,exports){
module.exports = {
  'name': 'LOG10E',
  'category': 'Constants',
  'syntax': [
    'LOG10E'
  ],
  'description': 'Returns the base-10 logarithm of E, approximately equal to 0.434',
  'examples': [
    'LOG10E',
    'log(e, 10)'
  ],
  'seealso': []
};

},{}],10:[function(require,module,exports){
module.exports = {
  'name': 'LOG2E',
  'category': 'Constants',
  'syntax': [
    'LOG2E'
  ],
  'description': 'Returns the base-2 logarithm of E, approximately equal to 1.442',
  'examples': [
    'LOG2E',
    'log(e, 2)'
  ],
  'seealso': []
};

},{}],11:[function(require,module,exports){
module.exports = {
  'name': 'NaN',
  'category': 'Constants',
  'syntax': [
    'NaN'
  ],
  'description': 'Not a number',
  'examples': [
    'NaN',
    '0 / 0'
  ],
  'seealso': []
};

},{}],12:[function(require,module,exports){
module.exports = {
  'name': 'SQRT1_2',
  'category': 'Constants',
  'syntax': [
    'SQRT1_2'
  ],
  'description': 'Returns the square root of 1/2, approximately equal to 0.707',
  'examples': [
    'SQRT1_2',
    'sqrt(1/2)'
  ],
  'seealso': []
};

},{}],13:[function(require,module,exports){
module.exports = {
  'name': 'SQRT2',
  'category': 'Constants',
  'syntax': [
    'SQRT2'
  ],
  'description': 'Returns the square root of 2, approximately equal to 1.414',
  'examples': [
    'SQRT2',
    'sqrt(2)'
  ],
  'seealso': []
};

},{}],14:[function(require,module,exports){
module.exports = {
  'name': 'e',
  'category': 'Constants',
  'syntax': [
    'e'
  ],
  'description': 'Euler\'s number, the base of the natural logarithm. Approximately equal to 2.71828',
  'examples': [
    'e',
    'e ^ 2',
    'exp(2)',
    'log(e)'
  ],
  'seealso': ['exp']
};

},{}],15:[function(require,module,exports){
module.exports = {
  'name': 'false',
  'category': 'Constants',
  'syntax': [
    'false'
  ],
  'description': 'Boolean value false',
  'examples': [
    'false'
  ],
  'seealso': ['true']
};

},{}],16:[function(require,module,exports){
module.exports = {
  'name': 'i',
  'category': 'Constants',
  'syntax': [
    'i'
  ],
  'description': 'Imaginary unit, defined as i*i=-1. A complex number is described as a + b*i, where a is the real part, and b is the imaginary part.',
  'examples': [
    'i',
    'i * i',
    'sqrt(-1)'
  ],
  'seealso': []
};

},{}],17:[function(require,module,exports){
module.exports = {
  'name': 'pi',
  'category': 'Constants',
  'syntax': [
    'pi'
  ],
  'description': 'The number pi is a mathematical constant that is the ratio of a circle\'s circumference to its diameter, and is approximately equal to 3.14159',
  'examples': [
    'pi',
    'sin(pi/2)'
  ],
  'seealso': ['tau']
};

},{}],18:[function(require,module,exports){
module.exports = {
  'name': 'tau',
  'category': 'Constants',
  'syntax': [
    'pi'
  ],
  'description': 'Tau is the ratio constant of a circle\'s circumference to radius, equal to 2 * pi, approximately 6.2832.',
  'examples': [
    'tau',
    '2 * pi'
  ],
  'seealso': ['pi']
};

},{}],19:[function(require,module,exports){
module.exports = {
  'name': 'true',
  'category': 'Constants',
  'syntax': [
    'true'
  ],
  'description': 'Boolean value true',
  'examples': [
    'true'
  ],
  'seealso': ['false']
};

},{}],20:[function(require,module,exports){
module.exports = {
  'name': 'abs',
  'category': 'Arithmetic',
  'syntax': [
    'abs(x)'
  ],
  'description': 'Compute the absolute value.',
  'examples': [
    'abs(3.5)',
    'abs(-4.2)'
  ],
  'seealso': ['sign']
};

},{}],21:[function(require,module,exports){
module.exports = {
  'name': 'add',
  'category': 'Operators',
  'syntax': [
    'x + y',
    'add(x, y)'
  ],
  'description': 'Add two values.',
  'examples': [
    '2.1 + 3.6',
    'ans - 3.6',
    '3 + 2i',
    '"hello" + " world"',
    '3 cm + 2 inch'
  ],
  'seealso': [
    'subtract'
  ]
};

},{}],22:[function(require,module,exports){
module.exports = {
  'name': 'ceil',
  'category': 'Arithmetic',
  'syntax': [
    'ceil(x)'
  ],
  'description':
      'Round a value towards plus infinity.If x is complex, both real and imaginary part are rounded towards plus infinity.',
  'examples': [
    'ceil(3.2)',
    'ceil(3.8)',
    'ceil(-4.2)'
  ],
  'seealso': ['floor', 'fix', 'round']
};

},{}],23:[function(require,module,exports){
module.exports = {
  'name': 'cube',
  'category': 'Arithmetic',
  'syntax': [
    'cube(x)'
  ],
  'description': 'Compute the cube of a value. The cube of x is x * x * x.',
  'examples': [
    'cube(2)',
    '2^3',
    '2 * 2 * 2'
  ],
  'seealso': [
    'multiply',
    'square',
    'pow'
  ]
};

},{}],24:[function(require,module,exports){
module.exports = {
  'name': 'divide',
  'category': 'Operators',
  'syntax': [
    'x / y',
    'divide(x, y)'
  ],
  'description': 'Divide two values.',
  'examples': [
    '2 / 3',
    'ans * 3',
    '4.5 / 2',
    '3 + 4 / 2',
    '(3 + 4) / 2',
    '18 km / 4.5'
  ],
  'seealso': [
    'multiply'
  ]
};

},{}],25:[function(require,module,exports){
module.exports = {
  'name': 'edivide',
  'category': 'Operators',
  'syntax': [
    'x ./ y',
    'edivide(x, y)'
  ],
  'description': 'divide two values element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'b = [2, 1, 1; 3, 2, 5]',
    'a ./ b'
  ],
  'seealso': [
    'multiply',
    'emultiply',
    'divide'
  ]
};

},{}],26:[function(require,module,exports){
module.exports = {
  'name': 'emultiply',
  'category': 'Operators',
  'syntax': [
    'x .* y',
    'emultiply(x, y)'
  ],
  'description': 'multiply two values element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'b = [2, 1, 1; 3, 2, 5]',
    'a .* b'
  ],
  'seealso': [
    'multiply',
    'divide',
    'edivide'
  ]
};

},{}],27:[function(require,module,exports){
module.exports = {
  'name': 'epow',
  'category': 'Operators',
  'syntax': [
    'x .^ y',
    'epow(x, y)'
  ],
  'description':
      'Calculates the power of x to y element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'a .^ 2'
  ],
  'seealso': [
    'pow'
  ]
};

},{}],28:[function(require,module,exports){
module.exports = {
  'name': 'equal',
  'category': 'Operators',
  'syntax': [
    'x == y',
    'equal(x, y)'
  ],
  'description':
      'Check equality of two values. Returns 1 if the values are equal, and 0 if not.',
  'examples': [
    '2+2 == 3',
    '2+2 == 4',
    'a = 3.2',
    'b = 6-2.8',
    'a == b',
    '50cm == 0.5m'
  ],
  'seealso': [
    'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
  ]
};

},{}],29:[function(require,module,exports){
module.exports = {
  'name': 'exp',
  'category': 'Arithmetic',
  'syntax': [
    'exp(x)'
  ],
  'description': 'Calculate the exponent of a value.',
  'examples': [
    'exp(1.3)',
    'e ^ 1.3',
    'log(exp(1.3))',
    'x = 2.4',
    '(exp(i*x) == cos(x) + i*sin(x))   # Euler\'s formula'
  ],
  'seealso': [
    'square',
    'multiply',
    'log'
  ]
};

},{}],30:[function(require,module,exports){
module.exports = {
  'name': 'fix',
  'category': 'Arithmetic',
  'syntax': [
    'fix(x)'
  ],
  'description':
      'Round a value towards zero.If x is complex, both real and imaginary part are rounded towards zero.',
  'examples': [
    'fix(3.2)',
    'fix(3.8)',
    'fix(-4.2)',
    'fix(-4.8)'
  ],
  'seealso': ['ceil', 'floor', 'round']
};

},{}],31:[function(require,module,exports){
module.exports = {
  'name': 'floor',
  'category': 'Arithmetic',
  'syntax': [
    'floor(x)'
  ],
  'description':
      'Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.',
  'examples': [
    'floor(3.2)',
    'floor(3.8)',
    'floor(-4.2)'
  ],
  'seealso': ['ceil', 'fix', 'round']
};

},{}],32:[function(require,module,exports){
module.exports = {
  'name': 'gcd',
  'category': 'Arithmetic',
  'syntax': [
    'gcd(a, b)',
    'gcd(a, b, c, ...)'
  ],
  'description': 'Compute the greatest common divisor.',
  'examples': [
    'gcd(8, 12)',
    'gcd(-4, 6)',
    'gcd(25, 15, -10)'
  ],
  'seealso': [ 'lcm', 'xgcd' ]
};

},{}],33:[function(require,module,exports){
module.exports = {
  'name': 'larger',
  'category': 'Operators',
  'syntax': [
    'x > y',
    'larger(x, y)'
  ],
  'description':
      'Check if value x is larger than y. Returns 1 if x is larger than y, and 0 if not.',
  'examples': [
    '2 > 3',
    '5 > 2*2',
    'a = 3.3',
    'b = 6-2.8',
    '(a > b)',
    '(b < a)',
    '5 cm > 2 inch'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'smallereq', 'largereq'
  ]
};

},{}],34:[function(require,module,exports){
module.exports = {
  'name': 'largereq',
  'category': 'Operators',
  'syntax': [
    'x >= y',
    'largereq(x, y)'
  ],
  'description':
      'Check if value x is larger or equal to y. Returns 1 if x is larger or equal to y, and 0 if not.',
  'examples': [
    '2 > 1+1',
    '2 >= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a > b)'
  ],
  'seealso': [
    'equal', 'unequal', 'smallereq', 'smaller', 'largereq'
  ]
};

},{}],35:[function(require,module,exports){
module.exports = {
  'name': 'lcm',
  'category': 'Arithmetic',
  'syntax': [
    'lcm(x, y)'
  ],
  'description': 'Compute the least common multiple.',
  'examples': [
    'lcm(4, 6)',
    'lcm(6, 21)',
    'lcm(6, 21, 5)'
  ],
  'seealso': [ 'gcd' ]
};

},{}],36:[function(require,module,exports){
module.exports = {
  'name': 'log',
  'category': 'Arithmetic',
  'syntax': [
    'log(x)',
    'log(x, base)'
  ],
  'description': 'Compute the logarithm of a value. If no base is provided, the natural logarithm of x is calculated. If base if provided, the logarithm is calculated for the specified base. log(x, base) is defined as log(x) / log(base).',
  'examples': [
    'log(3.5)',
    'a = log(2.4)',
    'exp(a)',
    '10 ^ 3',
    'log(1000, 10)',
    'log(1000) / log(10)',
    'b = logb(1024, 2)',
    '2 ^ b'
  ],
  'seealso': [
    'exp',
    'log10'
  ]
};
},{}],37:[function(require,module,exports){
module.exports = {
  'name': 'log10',
  'category': 'Arithmetic',
  'syntax': [
    'log10(x)'
  ],
  'description': 'Compute the 10-base logarithm of a value.',
  'examples': [
    'log10(1000)',
    '10 ^ 3',
    'log10(0.01)',
    'log(1000) / log(10)',
    'log(1000, 10)'
  ],
  'seealso': [
    'exp',
    'log'
  ]
};

},{}],38:[function(require,module,exports){
module.exports = {
  'name': 'mod',
  'category': 'Operators',
  'syntax': [
    'x % y',
    'x mod y',
    'mod(x, y)'
  ],
  'description':
      'Calculates the modulus, the remainder of an integer division.',
  'examples': [
    '7 % 3',
    '11 % 2',
    '10 mod 4',
    'function isOdd(x) = x % 2',
    'isOdd(2)',
    'isOdd(3)'
  ],
  'seealso': []
};

},{}],39:[function(require,module,exports){
module.exports = {
  'name': 'multiply',
  'category': 'Operators',
  'syntax': [
    'x * y',
    'multiply(x, y)'
  ],
  'description': 'multiply two values.',
  'examples': [
    '2.1 * 3.6',
    'ans / 3.6',
    '2 * 3 + 4',
    '2 * (3 + 4)',
    '3 * 2.1 km'
  ],
  'seealso': [
    'divide'
  ]
};

},{}],40:[function(require,module,exports){
module.exports = {
  'name': 'pow',
  'category': 'Operators',
  'syntax': [
    'x ^ y',
    'pow(x, y)'
  ],
  'description':
      'Calculates the power of x to y, x^y.',
  'examples': [
    '2^3 = 8',
    '2*2*2',
    '1 + e ^ (pi * i)'
  ],
  'seealso': [
    'unequal', 'smaller', 'larger', 'smallereq', 'largereq'
  ]
};

},{}],41:[function(require,module,exports){
module.exports = {
  'name': 'round',
  'category': 'Arithmetic',
  'syntax': [
    'round(x)',
    'round(x, n)'
  ],
  'description':
      'round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.',
  'examples': [
    'round(3.2)',
    'round(3.8)',
    'round(-4.2)',
    'round(-4.8)',
    'round(pi, 3)',
    'round(123.45678, 2)'
  ],
  'seealso': ['ceil', 'floor', 'fix']
};

},{}],42:[function(require,module,exports){
module.exports = {
  'name': 'sign',
  'category': 'Arithmetic',
  'syntax': [
    'sign(x)'
  ],
  'description':
      'Compute the sign of a value. The sign of a value x is 1 when x>1, -1 when x<0, and 0 when x=0.',
  'examples': [
    'sign(3.5)',
    'sign(-4.2)',
    'sign(0)'
  ],
  'seealso': [
    'abs'
  ]
};

},{}],43:[function(require,module,exports){
module.exports = {
  'name': 'smaller',
  'category': 'Operators',
  'syntax': [
    'x < y',
    'smaller(x, y)'
  ],
  'description':
      'Check if value x is smaller than value y. Returns 1 if x is smaller than y, and 0 if not.',
  'examples': [
    '2 < 3',
    '5 < 2*2',
    'a = 3.3',
    'b = 6-2.8',
    '(a < b)',
    '5 cm < 2 inch'
  ],
  'seealso': [
    'equal', 'unequal', 'larger', 'smallereq', 'largereq'
  ]
};

},{}],44:[function(require,module,exports){
module.exports = {
  'name': 'smallereq',
  'category': 'Operators',
  'syntax': [
    'x <= y',
    'smallereq(x, y)'
  ],
  'description':
      'Check if value x is smaller or equal to value y. Returns 1 if x is smaller than y, and 0 if not.',
  'examples': [
    '2 < 1+1',
    '2 <= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a < b)'
  ],
  'seealso': [
    'equal', 'unequal', 'larger', 'smaller', 'largereq'
  ]
};

},{}],45:[function(require,module,exports){
module.exports = {
  'name': 'sqrt',
  'category': 'Arithmetic',
  'syntax': [
    'sqrt(x)'
  ],
  'description':
      'Compute the square root value. If x = y * y, then y is the square root of x.',
  'examples': [
    'sqrt(25)',
    '5 * 5',
    'sqrt(-1)'
  ],
  'seealso': [
    'square',
    'multiply'
  ]
};

},{}],46:[function(require,module,exports){
module.exports = {
  'name': 'square',
  'category': 'Arithmetic',
  'syntax': [
    'square(x)'
  ],
  'description':
      'Compute the square of a value. The square of x is x * x.',
  'examples': [
    'square(3)',
    'sqrt(9)',
    '3^2',
    '3 * 3'
  ],
  'seealso': [
    'multiply',
    'pow',
    'sqrt',
    'cube'
  ]
};

},{}],47:[function(require,module,exports){
module.exports = {
  'name': 'subtract',
  'category': 'Operators',
  'syntax': [
    'x - y',
    'subtract(x, y)'
  ],
  'description': 'subtract two values.',
  'examples': [
    '5.3 - 2',
    'ans + 2',
    '2/3 - 1/6',
    '2 * 3 - 3',
    '2.1 km - 500m'
  ],
  'seealso': [
    'add'
  ]
};

},{}],48:[function(require,module,exports){
module.exports = {
  'name': 'unary',
  'category': 'Operators',
  'syntax': [
    '-x',
    'unary(x)'
  ],
  'description':
      'Inverse the sign of a value.',
  'examples': [
    '-4.5',
    '-(-5.6)'
  ],
  'seealso': [
    'add', 'subtract'
  ]
};

},{}],49:[function(require,module,exports){
module.exports = {
  'name': 'unequal',
  'category': 'Operators',
  'syntax': [
    'x != y',
    'unequal(x, y)'
  ],
  'description':
      'Check unequality of two values. Returns 1 if the values are unequal, and 0 if they are equal.',
  'examples': [
    '2+2 != 3',
    '2+2 != 4',
    'a = 3.2',
    'b = 6-2.8',
    'a != b',
    '50cm != 0.5m',
    '5 cm != 2 inch'
  ],
  'seealso': [
    'equal', 'smaller', 'larger', 'smallereq', 'largereq'
  ]
};

},{}],50:[function(require,module,exports){
module.exports = {
  'name': 'xgcd',
  'category': 'Arithmetic',
  'syntax': [
    'xgcd(a, b)'
  ],
  'description': 'Calculate the extended greatest common divisor for two values',
  'examples': [
    'xgcd(8, 12)',
    'gcd(8, 12)',
    'xgcd(36163, 21199)'
  ],
  'seealso': [ 'gcd', 'lcm' ]
};

},{}],51:[function(require,module,exports){
module.exports = {
  'name': 'arg',
  'category': 'Complex',
  'syntax': [
    'arg(x)'
  ],
  'description':
      'Compute the argument of a complex value. If x = a+bi, the argument is computed as atan2(b, a).',
  'examples': [
    'arg(2 + 2i)',
    'atan2(3, 2)',
    'arg(2 - 3i)'
  ],
  'seealso': [
    're',
    'im',
    'conj',
    'abs'
  ]
};

},{}],52:[function(require,module,exports){
module.exports = {
  'name': 'conj',
  'category': 'Complex',
  'syntax': [
    'conj(x)'
  ],
  'description':
      'Compute the complex conjugate of a complex value. If x = a+bi, the complex conjugate is a-bi.',
  'examples': [
    'conj(2 + 3i)',
    'conj(2 - 3i)',
    'conj(-5.2i)'
  ],
  'seealso': [
    're',
    'im',
    'abs',
    'arg'
  ]
};

},{}],53:[function(require,module,exports){
module.exports = {
  'name': 'im',
  'category': 'Complex',
  'syntax': [
    'im(x)'
  ],
  'description': 'Get the imaginary part of a complex number.',
  'examples': [
    'im(2 + 3i)',
    're(2 + 3i)',
    'im(-5.2i)',
    'im(2.4)'
  ],
  'seealso': [
    're',
    'conj',
    'abs',
    'arg'
  ]
};

},{}],54:[function(require,module,exports){
module.exports = {
  'name': 're',
  'category': 'Complex',
  'syntax': [
    're(x)'
  ],
  'description': 'Get the real part of a complex number.',
  'examples': [
    're(2 + 3i)',
    'im(2 + 3i)',
    're(-5.2i)',
    're(2.4)'
  ],
  'seealso': [
    'im',
    'conj',
    'abs',
    'arg'
  ]
};

},{}],55:[function(require,module,exports){
module.exports = {
  'name': 'boolean',
  'category': 'Type',
  'syntax': [
    'x',
    'boolean(x)'
  ],
  'description':
      'Convert a string or number into a boolean.',
  'examples': [
    'boolean(0)',
    'boolean(1)',
    'boolean(3)',
    'boolean("true")',
    'boolean("false")',
    'boolean([1, 0, 1, 1])'
  ],
  'seealso': [
    'complex', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};

},{}],56:[function(require,module,exports){
module.exports = {
  'name': 'complex',
  'category': 'Type',
  'syntax': [
    'complex()',
    'complex(re, im)',
    'complex(string)'
  ],
  'description':
      'Create a complex number.',
  'examples': [
    'complex()',
    'complex(2, 3)',
    'complex("7 - 2i")'
  ],
  'seealso': [
    'boolean', 'index', 'matrix', 'number', 'string', 'unit'
  ]
};

},{}],57:[function(require,module,exports){
module.exports = {
  'name': 'index',
  'category': 'Type',
  'syntax': [
    '[start]',
    '[start:end]',
    '[start:step:end]',
    '[start1, start 2, ...]',
    '[start1:end1, start2:end2, ...]',
    '[start1:step1:end1, start2:step2:end2, ...]'
  ],
  'description':
      'Create an index to get or replace a subset of a matrix',
  'examples': [
    '[]',
    '[1, 2, 3]',
    'A = [1, 2, 3; 4, 5, 6]',
    'A[1, :]',
    'A[1, 2] = 50',
    'A[0:2, 0:2] = ones(2, 2)'
  ],
  'seealso': [
    'boolean', 'complex', 'matrix,', 'number', 'range', 'string', 'unit'
  ]
};

},{}],58:[function(require,module,exports){
module.exports = {
  'name': 'matrix',
  'category': 'Type',
  'syntax': [
    '[]',
    '[a1, b1, ...; a2, b2, ...]',
    'matrix()',
    'matrix([...])'
  ],
  'description':
      'Create a matrix.',
  'examples': [
    '[]',
    '[1, 2, 3]',
    '[1, 2, 3; 4, 5, 6]',
    'matrix()',
    'matrix([3, 4])'
  ],
  'seealso': [
    'boolean', 'complex', 'index', 'number', 'string', 'unit'
  ]
};

},{}],59:[function(require,module,exports){
module.exports = {
  'name': 'number',
  'category': 'Type',
  'syntax': [
    'x',
    'number(x)'
  ],
  'description':
      'Create a number or convert a string or boolean into a number.',
  'examples': [
    '2',
    '2e3',
    '4.05',
    'number(2)',
    'number("7.2")',
    'number(true)',
    'number([true, false, true, true])'
  ],
  'seealso': [
    'boolean', 'complex', 'index', 'matrix', 'string', 'unit'
  ]
};

},{}],60:[function(require,module,exports){
module.exports = {
  'name': 'string',
  'category': 'Type',
  'syntax': [
    '"text"',
    'string(x)'
  ],
  'description':
      'Create a string or convert a value to a string',
  'examples': [
    '"Hello World!"',
    'string(4.2)',
    'string(3 + 2i)'
  ],
  'seealso': [
    'boolean', 'complex', 'index', 'matrix', 'number', 'unit'
  ]
};

},{}],61:[function(require,module,exports){
module.exports = {
  'name': 'unit',
  'category': 'Type',
  'syntax': [
    'value unit',
    'unit(value, unit)',
    'unit(string)'
  ],
  'description':
      'Create a unit.',
  'examples': [
    '5.5 mm',
    '3 inch',
    'unit(7.1, "kilogram")',
    'unit("23 deg")'
  ],
  'seealso': [
    'boolean', 'complex', 'index', 'matrix', 'number', 'string'
  ]
};

},{}],62:[function(require,module,exports){
module.exports = {
  'name': 'eval',
  'category': 'Expression',
  'syntax': [
    'eval(expression)',
    'eval([expr1, expr2, expr3, ...])'
  ],
  'description': 'Evaluate an expression or an array with expressions.',
  'examples': [
    'eval("2 + 3")',
    'eval("sqrt(" + 4 + ")")'
  ],
  'seealso': []
};

},{}],63:[function(require,module,exports){
module.exports = {
  'name': 'help',
  'category': 'Expression',
  'syntax': [
    'help(object)',
    'help(string)'
  ],
  'description': 'Display documentation on a function or data type.',
  'examples': [
    'help(sqrt)',
    'help("complex")'
  ],
  'seealso': []
};

},{}],64:[function(require,module,exports){
module.exports = {
  'name': 'concat',
  'category': 'Matrix',
  'syntax': [
    'concat(a, b, c, ...)',
    'concat(a, b, c, ..., dim)'
  ],
  'description': 'Concatenate matrices. By default, the matrices are concatenated by the first dimension. The dimension on which to concatenate can be provided as last argument.',
  'examples': [
    'a = [1, 2; 5, 6]',
    'b = [3, 4; 7, 8]',
    'concat(a, b)',
    '[a, b]',
    'concat(a, b, 2)',
    '[a; b]'
  ],
  'seealso': [
    'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],65:[function(require,module,exports){
module.exports = {
  'name': 'det',
  'category': 'Matrix',
  'syntax': [
    'det(x)'
  ],
  'description': 'Calculate the determinant of a matrix',
  'examples': [
    'det([1, 2; 3, 4])',
    'det([-2, 2, 3; -1, 1, 3; 2, 0, -1])'
  ],
  'seealso': [
    'concat', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],66:[function(require,module,exports){
module.exports = {
  'name': 'diag',
  'category': 'Matrix',
  'syntax': [
    'diag(x)',
    'diag(x, k)'
  ],
  'description': 'Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned.When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.',
  'examples': [
    'diag(1:3)',
    'diag(1:3, 1)',
    'a = [1, 2, 3; 4, 5, 6; 7, 8, 9]',
    'diag(a)'
  ],
  'seealso': [
    'concat', 'det', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],67:[function(require,module,exports){
module.exports = {
  'name': 'eye',
  'category': 'Matrix',
  'syntax': [
    'eye(n)',
    'eye(m, n)',
    'eye([m, n])',
    'eye'
  ],
  'description': 'Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.',
  'examples': [
    'eye(3)',
    'eye(3, 5)',
    'a = [1, 2, 3; 4, 5, 6]',
    'eye(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],68:[function(require,module,exports){
module.exports = {
  'name': 'inv',
  'category': 'Matrix',
  'syntax': [
    'inv(x)'
  ],
  'description': 'Calculate the inverse of a matrix',
  'examples': [
    'inv([1, 2; 3, 4])',
    'inv(4)',
    '1 / 4'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],69:[function(require,module,exports){
module.exports = {
  'name': 'ones',
  'category': 'Matrix',
  'syntax': [
    'ones(n)',
    'ones(m, n)',
    'ones(m, n, p, ...)',
    'ones([m, n])',
    'ones([m, n, p, ...])',
    'ones'
  ],
  'description': 'Create a matrix containing ones.',
  'examples': [
    'ones(3)',
    'ones(3, 5)',
    'ones([2,3]) * 4.5',
    'a = [1, 2, 3; 4, 5, 6]',
    'ones(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],70:[function(require,module,exports){
module.exports = {
  'name': 'range',
  'category': 'Type',
  'syntax': [
    'start:end',
    'start:step:end',
    'range(start, end)',
    'range(start, end, step)',
    'range(string)'
  ],
  'description':
      'Create a range. Lower bound of the range is included, upper bound is excluded.',
  'examples': [
    '1:5',
    '3:-1:-3',
    'range(3, 7)',
    'range(0, 12, 2)',
    'range("4:10")',
    'a = [1, 2, 3, 4; 5, 6, 7, 8]',
    'a(1:2, 1:2)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],71:[function(require,module,exports){
module.exports = {
  'name': 'size',
  'category': 'Matrix',
  'syntax': [
    'size(x)'
  ],
  'description': 'Calculate the size of a matrix.',
  'examples': [
    'size(2.3)',
    'size("hello world")',
    'a = [1, 2; 3, 4; 5, 6]',
    'size(a)',
    'size(1:6)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};

},{}],72:[function(require,module,exports){
module.exports = {
  'name': 'squeeze',
  'category': 'Matrix',
  'syntax': [
    'squeeze(x)'
  ],
  'description': 'Remove singleton dimensions from a matrix.',
  'examples': [
    'a = zeros(1,3,2)',
    'size(squeeze(a))',
    'b = zeros(3,1,1)',
    'size(squeeze(b))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'subset', 'transpose', 'zeros'
  ]
};

},{}],73:[function(require,module,exports){
module.exports = {
  'name': 'subset',
  'category': 'Matrix',
  'syntax': [
    'value(index)',
    'value(index) = replacement',
    'subset(value, [index])',
    'subset(value, [index], replacement)'
  ],
  'description': 'Get or set a subset of a matrix or string. ' +
      'Indexes are one-based. ' +
      'Both the ranges lower-bound and upper-bound are included.',
  'examples': [
    'd = [1, 2; 3, 4]',
    'e = []',
    'e(1, 1:2) = [5, 6]',
    'e(2, :) = [7, 8]',
    'f = d * e',
    'f(2, 1)',
    'f(:, 1)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
  ]
};

},{}],74:[function(require,module,exports){
module.exports = {
  'name': 'transpose',
  'category': 'Matrix',
  'syntax': [
    'x\'',
    'transpose(x)'
  ],
  'description': 'Transpose a matrix',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'a\'',
    'transpose(a)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'zeros'
  ]
};

},{}],75:[function(require,module,exports){
module.exports = {
  'name': 'zeros',
  'category': 'Matrix',
  'syntax': [
    'zeros(n)',
    'zeros(m, n)',
    'zeros(m, n, p, ...)',
    'zeros([m, n])',
    'zeros([m, n, p, ...])',
    'zeros'
  ],
  'description': 'Create a matrix containing zeros.',
  'examples': [
    'zeros(3)',
    'zeros(3, 5)',
    'a = [1, 2, 3; 4, 5, 6]',
    'zeros(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose'
  ]
};

},{}],76:[function(require,module,exports){
module.exports = {
  'name': 'distribution',
  'category': 'Probability',
  'syntax': [
    'distribution(name)',
    'distribution(name, arg1, arg2, ...)'
  ],
  'description':
      'Create a distribution object of a specific type. ' +
          'A distribution object contains functions `random([size,] [min,] [max])`, ' +
          '`randomInt([size,] [min,] [max])`, and `pickRandom(array)`. ' +
          'Available types of distributions: "uniform", "normal". ' +
          'Note that the function distribution is currently not available via the expression parser.',
  'examples': [
  ],
  'seealso': ['random', 'randomInt']
};

},{}],77:[function(require,module,exports){
module.exports = {
  'name': 'factorial',
  'category': 'Probability',
  'syntax': [
    'x!',
    'factorial(x)'
  ],
  'description': 'Compute the factorial of a value',
  'examples': [
    '5!',
    '5*4*3*2*1',
    '3!'
  ],
  'seealso': []
};

},{}],78:[function(require,module,exports){
module.exports = {
  'name': 'pickRandom',
  'category': 'Probability',
  'syntax': [
    'pickRandom(array)'
  ],
  'description':
      'Pick a random entry from a given array.',
  'examples': [
    'pickRandom(0:10)',
    'pickRandom([1, 3, 1, 6])'
  ],
  'seealso': ['distribution', 'random', 'randomInt']
};

},{}],79:[function(require,module,exports){
module.exports = {
  'name': 'random',
  'category': 'Probability',
  'syntax': [
    'random()',
    'random(max)',
    'random(min, max)',
    'random(size)',
    'random(size, max)',
    'random(size, min, max)'
  ],
  'description':
      'Return a random number.',
  'examples': [
    'random()',
    'random(10, 20)',
    'random([2, 3])'
  ],
  'seealso': ['distribution', 'pickRandom', 'randomInt']
};

},{}],80:[function(require,module,exports){
module.exports = {
  'name': 'randInt',
  'category': 'Probability',
  'syntax': [
    'randInt()',
    'randInt(max)',
    'randInt(min, max)',
    'randInt(size)',
    'randInt(size, max)',
    'randInt(size, min, max)'
  ],
  'description':
      'Return a random integer number',
  'examples': [
    'randInt()',
    'randInt(10, 20)',
    'randInt([2, 3], 10)'
  ],
  'seealso': ['distribution', 'pickRandom', 'random']
};
},{}],81:[function(require,module,exports){
module.exports = {
  'name': 'max',
  'category': 'Statistics',
  'syntax': [
    'max(a, b, c, ...)',
    'max(A)',
    'max(A, dim)'
  ],
  'description': 'Compute the maximum value of a list of values.',
  'examples': [
    'max(2, 3, 4, 1)',
    'max([2, 3, 4, 1])',
    'max([2, 5; 4, 3], 0)',
    'max([2, 5; 4, 3], 1)',
    'max(2.7, 7.1, -4.5, 2.0, 4.1)',
    'min(2.7, 7.1, -4.5, 2.0, 4.1)'
  ],
  'seealso': [
    //'sum',
    //'prod',
    //'avg',
    //'var',
    //'std',
    'mean',
    //'median',
    'min'
  ]
};

},{}],82:[function(require,module,exports){
module.exports = {
  'name': 'mean',
  'category': 'Statistics',
  'syntax': [
    'mean(a, b, c, ...)',
    'mean(A)',
    'mean(A, dim)'
  ],
  'description': 'Compute the arithmetic mean of a list of values.',
  'examples': [
    'mean(2, 3, 4, 1)',
    'mean([2, 3, 4, 1])',
    'mean([2, 5; 4, 3], 0)',
    'mean([2, 5; 4, 3], 1)',
    'mean([1.0, 2.7, 3.2, 4.0])'
  ],
  'seealso': [
    //'sum',
    //'prod',
    //'avg',
    //'var',
    //'std',
	  'max',
    'min'
    //'median'
  ]
};

},{}],83:[function(require,module,exports){
module.exports = {
  'name': 'min',
  'category': 'Statistics',
  'syntax': [
    'min(a, b, c, ...)',
    'min(A)',
    'min(A, dim)'
  ],
  'description': 'Compute the minimum value of a list of values.',
  'examples': [
    'min(2, 3, 4, 1)',
    'min([2, 3, 4, 1])',
    'min([2, 5; 4, 3], 0)',
    'min([2, 5; 4, 3], 1)',
    'min(2.7, 7.1, -4.5, 2.0, 4.1)',
    'max(2.7, 7.1, -4.5, 2.0, 4.1)'
  ],
  'seealso': [
    //'sum',
    //'prod',
    //'avg',
    //'var',
    //'std',
    'max',
    'mean',
    //'median',
    'min'
  ]
};

},{}],84:[function(require,module,exports){
module.exports = {
  'name': 'acos',
  'category': 'Trigonometry',
  'syntax': [
    'acos(x)'
  ],
  'description': 'Compute the inverse cosine of a value in radians.',
  'examples': [
    'acos(0.5)',
    'acos(cos(2.3))'
  ],
  'seealso': [
    'cos',
    'acos',
    'asin'
  ]
};

},{}],85:[function(require,module,exports){
module.exports = {
  'name': 'asin',
  'category': 'Trigonometry',
  'syntax': [
    'asin(x)'
  ],
  'description': 'Compute the inverse sine of a value in radians.',
  'examples': [
    'asin(0.5)',
    'asin(sin(2.3))'
  ],
  'seealso': [
    'sin',
    'acos',
    'asin'
  ]
};

},{}],86:[function(require,module,exports){
module.exports = {
  'name': 'atan',
  'category': 'Trigonometry',
  'syntax': [
    'atan(x)'
  ],
  'description': 'Compute the inverse tangent of a value in radians.',
  'examples': [
    'atan(0.5)',
    'atan(tan(2.3))'
  ],
  'seealso': [
    'tan',
    'acos',
    'asin'
  ]
};

},{}],87:[function(require,module,exports){
module.exports = {
  'name': 'atan2',
  'category': 'Trigonometry',
  'syntax': [
    'atan2(y, x)'
  ],
  'description':
      'Computes the principal value of the arc tangent of y/x in radians.',
  'examples': [
    'atan2(2, 2) / pi',
    'angle = 60 deg in rad',
    'x = cos(angle)',
    'y = sin(angle)',
    'atan2(y, x)'
  ],
  'seealso': [
    'sin',
    'cos',
    'tan'
  ]
};

},{}],88:[function(require,module,exports){
module.exports = {
  'name': 'cos',
  'category': 'Trigonometry',
  'syntax': [
    'cos(x)'
  ],
  'description': 'Compute the cosine of x in radians.',
  'examples': [
    'cos(2)',
    'cos(pi / 4) ^ 2',
    'cos(180 deg)',
    'cos(60 deg)',
    'sin(0.2)^2 + cos(0.2)^2'
  ],
  'seealso': [
    'acos',
    'sin',
    'tan'
  ]
};

},{}],89:[function(require,module,exports){
module.exports = {
  'name': 'cot',
  'category': 'Trigonometry',
  'syntax': [
    'cot(x)'
  ],
  'description': 'Compute the cotangent of x in radians. Defined as 1/tan(x)',
  'examples': [
    'cot(2)',
    '1 / tan(2)'
  ],
  'seealso': [
    'sec',
    'csc',
    'tan'
  ]
};

},{}],90:[function(require,module,exports){
module.exports = {
  'name': 'csc',
  'category': 'Trigonometry',
  'syntax': [
    'csc(x)'
  ],
  'description': 'Compute the cosecant of x in radians. Defined as 1/sin(x)',
  'examples': [
    'csc(2)',
    '1 / sin(2)'
  ],
  'seealso': [
    'sec',
    'cot',
    'sin'
  ]
};

},{}],91:[function(require,module,exports){
module.exports = {
  'name': 'sec',
  'category': 'Trigonometry',
  'syntax': [
    'sec(x)'
  ],
  'description': 'Compute the secant of x in radians. Defined as 1/cos(x)',
  'examples': [
    'sec(2)',
    '1 / cos(2)'
  ],
  'seealso': [
    'cot',
    'csc',
    'cos'
  ]
};

},{}],92:[function(require,module,exports){
module.exports = {
  'name': 'sin',
  'category': 'Trigonometry',
  'syntax': [
    'sin(x)'
  ],
  'description': 'Compute the sine of x in radians.',
  'examples': [
    'sin(2)',
    'sin(pi / 4) ^ 2',
    'sin(90 deg)',
    'sin(30 deg)',
    'sin(0.2)^2 + cos(0.2)^2'
  ],
  'seealso': [
    'asin',
    'cos',
    'tan'
  ]
};

},{}],93:[function(require,module,exports){
module.exports = {
  'name': 'tan',
  'category': 'Trigonometry',
  'syntax': [
    'tan(x)'
  ],
  'description': 'Compute the tangent of x in radians.',
  'examples': [
    'tan(0.5)',
    'sin(0.5) / cos(0.5)',
    'tan(pi / 4)',
    'tan(45 deg)'
  ],
  'seealso': [
    'atan',
    'sin',
    'cos'
  ]
};

},{}],94:[function(require,module,exports){
module.exports = {
  'name': 'in',
  'category': 'Units',
  'syntax': [
    'x in unit',
    'in(x, unit)'
  ],
  'description': 'Change the unit of a value.',
  'examples': [
    '5 inch in cm',
    '3.2kg in g',
    '16 bytes in bits'
  ],
  'seealso': []
};

},{}],95:[function(require,module,exports){
module.exports = {
  'name': 'clone',
  'category': 'Utils',
  'syntax': [
    'clone(x)'
  ],
  'description': 'Clone a variable. Creates a copy of primitive variables,and a deep copy of matrices',
  'examples': [
    'clone(3.5)',
    'clone(2 - 4i)',
    'clone(45 deg)',
    'clone([1, 2; 3, 4])',
    'clone("hello world")'
  ],
  'seealso': []
};

},{}],96:[function(require,module,exports){
module.exports = {
  'name': 'forEach',
  'category': 'Utils',
  'syntax': [
    'forEach(x, callback)'
  ],
  'description': 'Iterates over all elements of a matrix/array, and executes the given callback.',
  'examples': [
    'forEach([1, 2, 3], function(val) { console.log(val) })'
  ],
  'seealso': []
};

},{}],97:[function(require,module,exports){
module.exports = {
  'name': 'format',
  'category': 'Utils',
  'syntax': [
    'format(value)',
    'format(value, precision)'
  ],
  'description': 'Format a value of any type as string.',
  'examples': [
    'format(2.3)',
    'format(3 - 4i)',
    'format([])',
    'format(pi, 3)'
  ],
  'seealso': ['print']
};

},{}],98:[function(require,module,exports){
module.exports = {
  'name': 'import',
  'category': 'Utils',
  'syntax': [
    'import(string)'
  ],
  'description': 'Import functions from a file.',
  'examples': [
    'import("numbers")',
    'import("./mylib.js")'
  ],
  'seealso': []
};

},{}],99:[function(require,module,exports){
module.exports = {
  'name': 'map',
  'category': 'Utils',
  'syntax': [
    'map(x, callback)'
  ],
  'description': 'Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.',
  'examples': [
    'map([1, 2, 3], function(val) { return math.max(val, 1.5) })'
  ],
  'seealso': []
};

},{}],100:[function(require,module,exports){
module.exports = {
  'name': 'typeof',
  'category': 'Utils',
  'syntax': [
    'typeof(x)'
  ],
  'description': 'Get the type of a variable.',
  'examples': [
    'typeof(3.5)',
    'typeof(2 - 4i)',
    'typeof(45 deg)',
    'typeof("hello world")'
  ],
  'seealso': []
};

},{}],101:[function(require,module,exports){
// constants
exports.e = require('./constants/e');
exports.E = require('./constants/e');
exports['false'] = require('./constants/false');
exports.i = require('./constants/i');
exports['Infinity'] = require('./constants/Infinity');
exports.LN2 = require('./constants/LN2');
exports.LN10 = require('./constants/LN10');
exports.LOG2E = require('./constants/LOG2E');
exports.LOG10E = require('./constants/LOG10E');
exports.NaN = require('./constants/NaN');
exports.pi = require('./constants/pi');
exports.PI = require('./constants/pi');
exports.SQRT1_2 = require('./constants/SQRT1_2');
exports.SQRT2 = require('./constants/SQRT2');
exports.tau = require('./constants/tau');
exports['true'] = require('./constants/true');

// functions - arithmetic
exports.abs = require('./function/arithmetic/abs');
exports.add = require('./function/arithmetic/add');
exports.ceil = require('./function/arithmetic/ceil');
exports.cube = require('./function/arithmetic/cube');
exports.divide = require('./function/arithmetic/divide');
exports.edivide = require('./function/arithmetic/edivide');
exports.emultiply = require('./function/arithmetic/emultiply');
exports.epow = require('./function/arithmetic/epow');
exports.equal = require('./function/arithmetic/equal');
exports.exp = require('./function/arithmetic/exp');
exports.fix = require('./function/arithmetic/fix');
exports.floor = require('./function/arithmetic/floor');
exports.gcd = require('./function/arithmetic/gcd');
exports.larger = require('./function/arithmetic/larger');
exports.largereq = require('./function/arithmetic/largereq');
exports.lcm = require('./function/arithmetic/lcm');
exports.log = require('./function/arithmetic/log');
exports.log10 = require('./function/arithmetic/log10');
exports.mod = require('./function/arithmetic/mod');
exports.multiply = require('./function/arithmetic/multiply');
exports.pow = require('./function/arithmetic/pow');
exports.round = require('./function/arithmetic/round');
exports.sign = require('./function/arithmetic/sign');
exports.smaller = require('./function/arithmetic/smaller');
exports.smallereq = require('./function/arithmetic/smallereq');
exports.sqrt = require('./function/arithmetic/sqrt');
exports.square = require('./function/arithmetic/square');
exports.subtract = require('./function/arithmetic/subtract');
exports.unary = require('./function/arithmetic/unary');
exports.unequal = require('./function/arithmetic/unequal');
exports.xgcd = require('./function/arithmetic/xgcd');

// functions - complex
exports.arg = require('./function/complex/arg');
exports.conj = require('./function/complex/conj');
exports.re = require('./function/complex/re');
exports.im = require('./function/complex/im');

// functions - construction
exports.boolean = require('./function/construction/boolean');
exports.complex = require('./function/construction/complex');
exports.index = require('./function/construction/index');
exports.matrix = require('./function/construction/matrix');
exports.number = require('./function/construction/number');
exports.string = require('./function/construction/string');
exports.unit = require('./function/construction/unit');

// functions - epxression
exports['eval'] =  require('./function/expression/eval');
exports.help =  require('./function/expression/help');

// functions - matrix
exports.concat = require('./function/matrix/concat');
exports.det = require('./function/matrix/det');
exports.diag = require('./function/matrix/diag');
exports.eye = require('./function/matrix/eye');
exports.inv = require('./function/matrix/inv');
exports.ones = require('./function/matrix/ones');
exports.range = require('./function/matrix/range');
exports.size = require('./function/matrix/size');
exports.squeeze = require('./function/matrix/squeeze');
exports.subset = require('./function/matrix/subset');
exports.transpose = require('./function/matrix/transpose');
exports.zeros = require('./function/matrix/zeros');

// functions - probability
exports.factorial = require('./function/probability/factorial');
exports.distribution = require('./function/probability/distribution');
exports.pickRandom = require('./function/probability/pickRandom');
exports.random = require('./function/probability/random');
exports.randomInt = require('./function/probability/randomInt');

// functions - statistics
exports.min = require('./function/statistics/min');
exports.mean = require('./function/statistics/mean');
exports.max = require('./function/statistics/max');

// functions - trigonometry
exports.acos = require('./function/trigonometry/acos');
exports.asin = require('./function/trigonometry/asin');
exports.atan = require('./function/trigonometry/atan');
exports.atan2 = require('./function/trigonometry/atan2');
exports.cos = require('./function/trigonometry/cos');
exports.cot = require('./function/trigonometry/cot');
exports.csc = require('./function/trigonometry/csc');
exports.sec = require('./function/trigonometry/sec');
exports.sin = require('./function/trigonometry/sin');
exports.tan = require('./function/trigonometry/tan');

// functions - units
exports['in'] = require('./function/units/in');

// functions - utils
exports.clone =  require('./function/utils/clone');
exports.map =  require('./function/utils/map');
exports.forEach =  require('./function/utils/forEach');
exports.format =  require('./function/utils/format');
// exports.print =  require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
exports['import'] =  require('./function/utils/import');
exports['typeof'] =  require('./function/utils/typeof');

},{"./constants/Infinity":6,"./constants/LN10":7,"./constants/LN2":8,"./constants/LOG10E":9,"./constants/LOG2E":10,"./constants/NaN":11,"./constants/SQRT1_2":12,"./constants/SQRT2":13,"./constants/e":14,"./constants/false":15,"./constants/i":16,"./constants/pi":17,"./constants/tau":18,"./constants/true":19,"./function/arithmetic/abs":20,"./function/arithmetic/add":21,"./function/arithmetic/ceil":22,"./function/arithmetic/cube":23,"./function/arithmetic/divide":24,"./function/arithmetic/edivide":25,"./function/arithmetic/emultiply":26,"./function/arithmetic/epow":27,"./function/arithmetic/equal":28,"./function/arithmetic/exp":29,"./function/arithmetic/fix":30,"./function/arithmetic/floor":31,"./function/arithmetic/gcd":32,"./function/arithmetic/larger":33,"./function/arithmetic/largereq":34,"./function/arithmetic/lcm":35,"./function/arithmetic/log":36,"./function/arithmetic/log10":37,"./function/arithmetic/mod":38,"./function/arithmetic/multiply":39,"./function/arithmetic/pow":40,"./function/arithmetic/round":41,"./function/arithmetic/sign":42,"./function/arithmetic/smaller":43,"./function/arithmetic/smallereq":44,"./function/arithmetic/sqrt":45,"./function/arithmetic/square":46,"./function/arithmetic/subtract":47,"./function/arithmetic/unary":48,"./function/arithmetic/unequal":49,"./function/arithmetic/xgcd":50,"./function/complex/arg":51,"./function/complex/conj":52,"./function/complex/im":53,"./function/complex/re":54,"./function/construction/boolean":55,"./function/construction/complex":56,"./function/construction/index":57,"./function/construction/matrix":58,"./function/construction/number":59,"./function/construction/string":60,"./function/construction/unit":61,"./function/expression/eval":62,"./function/expression/help":63,"./function/matrix/concat":64,"./function/matrix/det":65,"./function/matrix/diag":66,"./function/matrix/eye":67,"./function/matrix/inv":68,"./function/matrix/ones":69,"./function/matrix/range":70,"./function/matrix/size":71,"./function/matrix/squeeze":72,"./function/matrix/subset":73,"./function/matrix/transpose":74,"./function/matrix/zeros":75,"./function/probability/distribution":76,"./function/probability/factorial":77,"./function/probability/pickRandom":78,"./function/probability/random":79,"./function/probability/randomInt":80,"./function/statistics/max":81,"./function/statistics/mean":82,"./function/statistics/min":83,"./function/trigonometry/acos":84,"./function/trigonometry/asin":85,"./function/trigonometry/atan":86,"./function/trigonometry/atan2":87,"./function/trigonometry/cos":88,"./function/trigonometry/cot":89,"./function/trigonometry/csc":90,"./function/trigonometry/sec":91,"./function/trigonometry/sin":92,"./function/trigonometry/tan":93,"./function/units/in":94,"./function/utils/clone":95,"./function/utils/forEach":96,"./function/utils/format":97,"./function/utils/import":98,"./function/utils/map":99,"./function/utils/typeof":100}],102:[function(require,module,exports){
var Node = require('./Node'),
    object = require('../../util/object'),
    string = require('../../util/string'),
    collection = require('../../type/collection'),
    Matrix = require('../../type/Matrix');

/**
 * @constructor ArrayNode
 * Holds an 1-dimensional array with nodes
 * @param {Object} math    The math namespace containing all functions
 * @param {Array} nodes    1 dimensional array with nodes
 * @extends {Node}
 */
function ArrayNode(math, nodes) {
  this.math = math;
  this.nodes = nodes || [];
}

ArrayNode.prototype = new Node();

/**
 * Evaluate the array
 * @return {Matrix | Array} results
 * @override
 */
ArrayNode.prototype.eval = function() {
  // evaluate all nodes in the array, and merge the results into a matrix
  var nodes = this.nodes,
      results = [];

  for (var i = 0, ii = nodes.length; i < ii; i++) {
    var node = nodes[i];
    var result = node.eval();
    results[i] = (result instanceof Matrix) ? result.valueOf() : result;
  }

  return (this.math.options.matrix.defaultType === 'array') ? results : new Matrix(results);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ArrayNode.prototype.find = function (filter) {
  var results = [];

  // check itself
  if (this.match(filter)) {
    results.push(this);
  }

  // search in all nodes
  var nodes = this.nodes;
  for (var r = 0, rows = nodes.length; r < rows; r++) {
    var nodes_r = nodes[r];
    for (var c = 0, cols = nodes_r.length; c < cols; c++) {
      results = results.concat(nodes_r[c].find(filter));
    }
  }

  return results;
};

/**
 * Merge nested Matrices in a two dimensional Array.
 * @param {Array} array    Two-dimensional array containing Matrices
 * @return {Array} merged  The merged array (two-dimensional)
 */
// TODO: cleanup merge function
function merge (array) {
  var merged = [];
  var rows = array.length;
  for (var r = 0; r < rows; r++) {
    var array_r = array[r];
    var cols = array_r.length;
    var submatrix = null;
    var submatrixRows = null;
    for (var c = 0; c < cols; c++) {
      var entry = object.clone(array_r[c]);
      var size;
      if (entry instanceof Matrix) {
        // get the data from the matrix
        size = entry.size();
        entry = entry.valueOf();
        if (size.length == 1) {
          entry = [entry];
          size = [1, size[0]];
        }
        else if (size.length > 2) {
          throw new Error('Cannot merge a multi dimensional matrix');
        }
      }
      else if (Array.isArray(entry)) {
        // change array into a 1xn matrix
        size = [1, entry.length];
        entry = [entry];
      }
      else {
        // change scalar into a 1x1 matrix
        size = [1, 1];
        entry = [[entry]];
      }

      // check the height of this row
      if (submatrix == null) {
        // first entry
        submatrix = entry;
        submatrixRows = size[0];
      }
      else if (size[0] == submatrixRows) {
        // merge
        for (var s = 0; s < submatrixRows; s++) {
          submatrix[s] = submatrix[s].concat(entry[s]);
        }
      }
      else {
        // no good...
        throw new Error('Dimension mismatch ' +
            '(' + size[0] + ' != ' + submatrixRows + ')');
      }
    }

    // merge the submatrix
    merged = merged.concat(submatrix);
  }

  return merged;
}

/**
 * Get string representation
 * @return {String} str
 * @override
 */
ArrayNode.prototype.toString = function() {
  return string.format(this.nodes);
};

module.exports = ArrayNode;

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/object":209,"../../util/string":210,"./Node":107}],103:[function(require,module,exports){
var Node = require('./Node');

/**
 * @constructor AssignmentNode
 * Define a symbol, like "a = 3.2"
 *
 * @param {String} name       Symbol name
 * @param {Node} expr         The expression defining the symbol
 * @param {Scope} scope       Scope to store the result
 */
function AssignmentNode(name, expr, scope) {
  this.name = name;
  this.expr = expr;
  this.scope = scope;
}

AssignmentNode.prototype = new Node();

/**
 * Evaluate the assignment
 * @return {*} result
 */
AssignmentNode.prototype.eval = function() {
  if (this.expr === undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  var result = this.expr.eval();
  this.scope.set(this.name, result);

  return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
AssignmentNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
AssignmentNode.prototype.toString = function() {
  return this.name + ' = ' + this.expr.toString();
};

module.exports = AssignmentNode;
},{"./Node":107}],104:[function(require,module,exports){
var Node = require('./Node');

/**
 * @constructor BlockNode
 * Holds a set with nodes
 * @extends {Node}
 */
function BlockNode() {
  this.params = [];
  this.visible = [];
}

BlockNode.prototype = new Node();

/**
 * Add a parameter
 * @param {Node} param
 * @param {Boolean} [visible]   true by default
 */
BlockNode.prototype.add = function (param, visible) {
  var index = this.params.length;
  this.params[index] = param;
  this.visible[index] = (visible != undefined) ? visible : true;
};

/**
 * Evaluate the set
 * @return {*[]} results
 * @override
 */
BlockNode.prototype.eval = function() {
  // evaluate the parameters
  var results = [];
  for (var i = 0, iMax = this.params.length; i < iMax; i++) {
    var result = this.params[i].eval();
    if (this.visible[i]) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
BlockNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 * @override
 */
BlockNode.prototype.toString = function() {
  var strings = [];

  for (var i = 0, iMax = this.params.length; i < iMax; i++) {
    if (this.visible[i]) {
      strings.push('\n  ' + this.params[i].toString());
    }
  }

  return '[' + strings.join(',') + '\n]';
};

module.exports = BlockNode;

},{"./Node":107}],105:[function(require,module,exports){
var Node = require('./Node'),
    string = require('../../util/string');

/**
 * @constructor ConstantNode
 * @param {*} value
 * @extends {Node}
 */
function ConstantNode(value) {
  this.value = value;
}

ConstantNode.prototype = new Node();

/**
 * Evaluate the constant (just return it)
 * @return {*} value
 */
ConstantNode.prototype.eval = function () {
  return this.value;
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
  return string.format(this.value);
};

module.exports = ConstantNode;

},{"../../util/string":210,"./Node":107}],106:[function(require,module,exports){
var Node = require('./Node'),
    error = require('../../util/error');

/**
 * @constructor FunctionNode
 * Function assignment
 *
 * @param {String} name           Function name
 * @param {String[]} variables    Variable names
 * @param {Node} expr             The function expression
 * @param {Scope} functionScope   Scope in which to write variable values
 * @param {Scope} scope           Scope to store the resulting function assignment
 */
function FunctionNode(name, variables, expr, functionScope, scope) {
  this.name = name;
  this.variables = variables;
  this.expr = expr;
  this.scope = scope;

  // create function
  this.fn = function () {
    var num = variables ? variables.length : 0;

    // validate correct number of arguments
    if (arguments.length != num) {
      throw new error.ArgumentsError(name, arguments.length, num);
    }

    // fill in the provided arguments in the functionScope variables
    for (var i = 0; i < num; i++) {
      functionScope.set(variables[i], arguments[i]);
    }

    // evaluate the expression
    return expr.eval();
  };

  this.fn.toString = function() {
    // TODO: what to return as toString?
    return name + '(' + variables.join(', ') + ')';
    //return name + '(' + variableNames.join(', ') + ') = ' + expr.toString();
  };
}

FunctionNode.prototype = new Node();

/**
 * Evaluate the function assignment
 * @return {function} fn
 */
FunctionNode.prototype.eval = function() {
  // put the definition in the scope
  this.scope.set(this.name, this.fn);

  return this.fn;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
FunctionNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * get string representation
 * @return {String} str
 */
FunctionNode.prototype.toString = function() {
  return this.fn.toString();
};

module.exports = FunctionNode;

},{"../../util/error":206,"./Node":107}],107:[function(require,module,exports){
/**
 * Node
 */
function Node() {}

/**
 * Evaluate the node
 * @return {*} result
 */
Node.prototype.eval = function () {
  throw new Error('Cannot evaluate a Node interface');
};

/**
 * Find any node in the node tree matching given filter. For example, to
 * find all nodes of type SymbolNode having name 'x':
 *
 *     var results = Node.find({
 *         type: SymbolNode,
 *         properties: {
 *             name: 'x'
 *         }
 *     });
 *
 * @param {Object} filter       Available parameters:
 *                                  {Function} type
 *                                  {Object<String, String>} properties
 * @return {Node[]} nodes       An array with nodes matching given filter criteria
 */
Node.prototype.find = function (filter) {
  return this.match(filter) ? [this] : [];
};

/**
 * Test if this object matches given filter
 * @param {Object} filter       Available parameters:
 *                              {Function} type
 *                              {Object<String, String>} properties
 * @return {Boolean} matches    True if there is a match
 */
Node.prototype.match = function (filter) {
  var match = true;

  if (filter) {
    if (filter.type && !(this instanceof filter.type)) {
      match = false;
    }
    if (match && filter.properties) {
      for (var prop in filter.properties) {
        if (filter.properties.hasOwnProperty(prop)) {
          if (this[prop] != filter.properties[prop]) {
            match = false;
            break;
          }
        }
      }
    }
  }

  return match;
};

/**
 * Get string representation
 * @return {String}
 */
Node.prototype.toString = function() {
  return '';
};

module.exports = Node;

},{}],108:[function(require,module,exports){
var Node = require('./Node');

/**
 * @constructor OperatorNode
 * An operator with two arguments, like 2+3
 * @param {String} name     Function name, for example '+'
 * @param {function} fn     Function, for example math.add
 * @param {Node[]} params   Parameters
 */
function OperatorNode (name, fn, params) {
  this.name = name;
  this.fn = fn;
  this.params = params;
}

OperatorNode.prototype = new Node();

/**
 * Evaluate the parameters
 * @return {*} result
 */
OperatorNode.prototype.eval = function() {
  return this.fn.apply(this, this.params.map(function (param) {
    return param.eval();
  }));
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
OperatorNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
OperatorNode.prototype.toString = function() {
  var params = this.params;

  switch (params.length) {
    case 1:
      if (this.name == '-') {
        // special case: unary minus
        return '-' + params[0].toString();
      }
      else {
        // for example '5!'
        return params[0].toString() + this.name;
      }

    case 2: // for example '2+3'
      var lhs = params[0].toString();
      if (params[0] instanceof OperatorNode) {
        lhs = '(' + lhs + ')';
      }
      var rhs = params[1].toString();
      if (params[1] instanceof OperatorNode) {
        rhs = '(' + rhs + ')';
      }
      return lhs + ' ' + this.name + ' ' + rhs;

    default: // this should occur. format as a function call
      return this.name + '(' + this.params.join(', ') + ')';
  }
};

module.exports = OperatorNode;

},{"./Node":107}],109:[function(require,module,exports){
var number= require('../../util/number'),

    Node = require('./Node'),
    RangeNode = require('./RangeNode'),
    SymbolNode = require('./SymbolNode'),

    Index = require('../../type/Index'),
    Range = require('../../type/Range'),

    isNumber = number.isNumber;

/**
 * @constructor ParamsNode
 * invoke a list with parameters on the results of a node
 * @param {Object} math             The math namespace containing all functions
 * @param {Node} object
 * @param {Node[]} params
 * @param {Scope[]} paramScopes     A scope for every parameter, where the
 *                                  index variable 'end' can be defined.
 */
function ParamsNode (math, object, params, paramScopes) {
  this.math = math;

  this.object = object;
  this.params = params;
  this.paramScopes = paramScopes;

  // check whether any of the params expressions uses the context symbol 'end'
  this.hasContextParams = false;
  if (params) {
    var filter = {
      type: SymbolNode,
      properties: {
        name: 'end'
      }
    };

    for (var i = 0, len = params.length; i < len; i++) {
      if (params[i].find(filter).length > 0) {
        this.hasContextParams = true;
        break;
      }
    }
  }
}

ParamsNode.prototype = new Node();

/**
 * Evaluate the parameters
 * @return {*} result
 */
ParamsNode.prototype.eval = function() {
  var i, len, params, results;

  // evaluate the object
  var object = this.object;
  if (object == undefined) {
    throw new Error ('Node undefined');
  }
  var obj = object.eval();

  // evaluate the values of context parameter 'end' when needed
  if (this.hasContextParams) {
    var paramScopes = this.paramScopes,
        size = this.math.size(obj).valueOf();

    if (paramScopes && size) {
      for (i = 0, len = this.params.length; i < len; i++) {
        var paramScope = paramScopes[i];
        if (paramScope) {
          paramScope.set('end', size[i]);
        }
      }
    }
  }

  if (typeof obj === 'function') {
    // evaluate the parameters
    params = this.params;
    results = [];
    for (i = 0, len = this.params.length; i < len; i++) {
      results[i] = params[i].eval();
    }

    // invoke a function with the parameters
    return obj.apply(this, results);
  }
  else {
    // evaluate the parameters as index
    params = this.params;
    results = [];
    for (i = 0, len = this.params.length; i < len; i++) {
      var param = params[i];
      var result;

      if (param instanceof RangeNode) {
        result = param.toRange();
      }
      else {
        result = param.eval();
      }

      // change from one-based to zero-based range
      if (result instanceof Range) {
        result.start --;
        result.end --;
      }
      else if (isNumber(result)) {
        // number
        result--;
      }
      else {
        throw new TypeError('Number or Range expected');
      }

      results[i] = result;
    }

    // get a subset of the object
    var index = Index.create(results);
    return this.math.subset(obj, index);
  }
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ParamsNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search object
  if (this.object) {
    nodes = nodes.concat(this.object.find(filter));
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
ParamsNode.prototype.toString = function() {
  // format the parameters like "(2, 4.2)"
  var str = this.object ? this.object.toString() : '';
  if (this.params) {
    str += '(' + this.params.join(', ') + ')';
  }
  return str;
};

module.exports = ParamsNode;

},{"../../type/Index":199,"../../type/Range":201,"../../util/number":208,"./Node":107,"./RangeNode":110,"./SymbolNode":111}],110:[function(require,module,exports){
var Node = require('./Node'),
    Range = require('../../type/Range');

/**
 * @constructor RangeNode
 * create a range
 * @param {Object} math             The math namespace containing all functions
 * @param {Node[]} params
 */
function RangeNode (math, params) {
  this.math = math;

  this.start = null;  // included lower-bound
  this.end = null;    // included upper-bound
  this.step = null;   // optional step

  if (params.length == 2) {
    this.start = params[0];
    this.end = params[1];
  }
  else if (params.length == 3) {
    this.start = params[0];
    this.step = params[1];
    this.end = params[2];
  }
  else {
    // TODO: better error message
    throw new SyntaxError('Wrong number of arguments');
  }
}

RangeNode.prototype = new Node();

/**
 * Evaluate the range
 * @return {*} result
 */
RangeNode.prototype.eval = function() {
  // evaluate the parameters
  var start = this.start.eval();
  var step = this.step ? this.step.eval() : 1;
  var end = this.end.eval();

  // generate the range (upper-bound included!)
  var array = [],
      x = start;
  if (step > 0) {
    while (x <= end) {
      array.push(x);
      x += step;
    }
  }
  else if (step < 0) {
    while (x >= end) {
      array.push(x);
      x += step;
    }
  }

  return array;
};

/**
 * Create a Range from a RangeNode
 * @return {Range} range
 */
RangeNode.prototype.toRange = function() {
  // evaluate the parameters
  var start = this.start.eval();
  var step = this.step ? this.step.eval() : 1;
  var end = this.end.eval();

  // upper-bound be included, so compensate for that
  // NOTE: this only works for integer values!
  end = this.math.add(end, (step > 0) ? 1 : -1);

  // create the range
  return new Range(start, end, step);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
RangeNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  if (this.start) {
    nodes = nodes.concat(this.start.find(filter));
  }
  if (this.step) {
    nodes = nodes.concat(this.step.find(filter));
  }
  if (this.end) {
    nodes = nodes.concat(this.end.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
RangeNode.prototype.toString = function() {
  // format the range like "start:step:end"
  var str = this.start.toString();
  if (this.step) {
    str += ':' + this.step.toString();
  }
  str += ':' + this.end.toString();

  return str;
};

module.exports = RangeNode;

},{"../../type/Range":201,"./Node":107}],111:[function(require,module,exports){
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
 * Get string representation
 * @return {String} str
 * @override
 */
SymbolNode.prototype.toString = function() {
  return this.name;
};

module.exports = SymbolNode;

},{"./Node":107}],112:[function(require,module,exports){
var number= require('../../util/number'),

    Node = require('./Node'),
    RangeNode = require('./RangeNode'),
    SymbolNode = require('./SymbolNode'),

    Index = require('../../type/Index'),
    Range = require('../../type/Range'),

    isNumber = number.isNumber;

/**
 * @constructor UpdateNode
 * Update a symbol value, like a(2,3) = 4.5
 *
 * @param {Object} math                 The math namespace containing all functions
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   One or more parameters
 * @param {Scope[]}  paramScopes        A scope for every parameter, where the
 *                                      index variable 'end' can be defined.
 * @param {Node} expr                   The expression defining the symbol
 * @param {Scope} scope                 Scope to store the result
 */
function UpdateNode(math, name, params, paramScopes, expr, scope) {
  this.math = math;

  this.name = name;
  this.params = params;
  this.paramScopes = paramScopes;
  this.expr = expr;
  this.scope = scope;

  // check whether any of the params expressions uses the context symbol 'end'
  this.hasContextParams = false;
  var filter = {
    type: SymbolNode,
    properties: {
      name: 'end'
    }
  };
  for (var i = 0, len = params.length; i < len; i++) {
    if (params[i].find(filter).length > 0) {
      this.hasContextParams = true;
      break;
    }
  }
}

UpdateNode.prototype = new Node();

/**
 * Evaluate the assignment
 * @return {*} result
 */
UpdateNode.prototype.eval = function() {
  if (this.expr === undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  var result;

  // test if definition is currently undefined
  var prevResult = this.scope.get(this.name);
  if (prevResult == undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  // evaluate the values of context parameter 'end' when needed
  if (this.hasContextParams) {
    var paramScopes = this.paramScopes,
        size = this.math.size(prevResult).valueOf();

    if (paramScopes && size) {
      for (var i = 0, len = this.params.length; i < len; i++) {
        var paramScope = paramScopes[i];
        if (paramScope) {
          paramScope.set('end', size[i]);
        }
      }
    }
  }

  // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
  var paramResults = [];
  this.params.forEach(function (param) {
    var result;

    if (param instanceof RangeNode) {
      result = param.toRange();
    }
    else {
      result = param.eval();
    }

    // change from one-based to zero-based range
    if (result instanceof Range) {
      result.start --;
      result.end --;
    }
    else if (isNumber(result)) {
      // number
      result--;
    }
    else {
      throw new TypeError('Number or Range expected');
    }

    paramResults.push(result);
  });

  // evaluate the expression
  var exprResult = this.expr.eval();

  // replace subset
  var index = Index.create(paramResults);
  result = this.math.subset(prevResult, index, exprResult);

  this.scope.set(this.name, result);

  return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
UpdateNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
UpdateNode.prototype.toString = function() {
  var str = '';

  str += this.name;
  if (this.params && this.params.length) {
    str += '(' + this.params.join(', ') + ')';
  }
  str += ' = ';
  str += this.expr.toString();

  return str;
};

module.exports = UpdateNode;

},{"../../type/Index":199,"../../type/Range":201,"../../util/number":208,"./Node":107,"./RangeNode":110,"./SymbolNode":111}],113:[function(require,module,exports){
/**
 * Custom node handlers,
 * (can be added to the exports object)
 */

},{}],114:[function(require,module,exports){
exports.AssignmentNode = require('./AssignmentNode');
exports.BlockNode = require('./BlockNode');
exports.ConstantNode = require('./ConstantNode');
exports.FunctionNode = require('./FunctionNode');
exports.ArrayNode = require('./ArrayNode');
exports.Node = require('./Node');
exports.OperatorNode = require('./OperatorNode');
exports.ParamsNode = require('./ParamsNode');
exports.RangeNode = require('./RangeNode');
exports.SymbolNode = require('./SymbolNode');
exports.UpdateNode = require('./UpdateNode');

exports.handlers = require('./handlers');

},{"./ArrayNode":102,"./AssignmentNode":103,"./BlockNode":104,"./ConstantNode":105,"./FunctionNode":106,"./Node":107,"./OperatorNode":108,"./ParamsNode":109,"./RangeNode":110,"./SymbolNode":111,"./UpdateNode":112,"./handlers":113}],115:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the absolute value of a value.
   *
   *     abs(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.abs = function abs(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('abs', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.abs(x);
    }

    if (isComplex(x)) {
      return Math.sqrt(x.re * x.re + x.im * x.im);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, abs);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return abs(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('abs', x);
  };
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],116:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Add two values
   *
   *     x + y
   *     add(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Number | Complex | Unit | String | Array | Matrix} res
   */
  math.add = function add(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('add', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number + number
        return x + y;
      }
      else if (isComplex(y)) {
        // number + complex
        return new Complex(
            x + y.re,
            y.im
        )
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex + number
        return new Complex(
            x.re + y,
            x.im
        )
      }
      else if (isComplex(y)) {
        // complex + complex
        return new Complex(
            x.re + y.re,
            x.im + y.im
        );
      }
    }
    else if (isUnit(x)) {
      if (isUnit(y)) {
        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        if (x.value == null) {
          throw new Error('Unit on left hand side of operator + has an undefined value');
        }

        if (y.value == null) {
          throw new Error('Unit on right hand side of operator + has an undefined value');
        }

        var res = x.clone();
        res.value += y.value;
        res.fixPrefix = false;
        return res;
      }
    }

    if (isString(x) || isString(y)) {
      return x + y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, add);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive value
      return add(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('add', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],117:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Round a value towards plus infinity
   *
   *     ceil(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.ceil = function ceil(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.ceil(x.re),
          Math.ceil(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, ceil);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return ceil(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('ceil', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],118:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the cube of a value
   *
   *     x .* x .* x
   *     cube(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.cube = function cube(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cube', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x * x * x;
    }

    if (isComplex(x)) {
      return math.multiply(math.multiply(x, x), x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cube);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cube(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cube', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],119:[function(require,module,exports){
module.exports = function(math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Divide two values.
   *
   *     x / y
   *     divide(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.divide = function divide(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('divide', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number / number
        return x / y;
      }
      else if (isComplex(y)) {
        // number / complex
        return _divideComplex(new Complex(x, 0), y);
      }
    }

    if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex / number
        return _divideComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex / complex
        return _divideComplex(x, y);
      }
    }

    if (isUnit(x)) {
      if (isNumBool(y)) {
        var res = x.clone();
        res.value /= y;
        return res;
      }
    }

    if (isCollection(x)) {
      if (isCollection(y)) {
        // TODO: implement matrix right division using pseudo inverse
        // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
        // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
        // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
        return math.multiply(x, math.inv(y));
      }
      else {
        // matrix / scalar
        return collection.deepMap2(x, y, divide);
      }
    }

    if (isCollection(y)) {
      // TODO: implement matrix right division using pseudo inverse
      return math.multiply(x, math.inv(y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive value
      return divide(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('divide', x, y);
  };

  /**
   * Divide two complex numbers. x / y or divide(x, y)
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex} res
   * @private
   */
  function _divideComplex (x, y) {
    var den = y.re * y.re + y.im * y.im;
    if (den != 0) {
      return new Complex(
          (x.re * y.re + x.im * y.im) / den,
          (x.im * y.re - x.re * y.im) / den
      );
    }
    else {
      // both y.re and y.im are zero
      return new Complex(
          (x.re != 0) ? (x.re / 0) : 0,
          (x.im != 0) ? (x.im / 0) : 0
      );
    }
  }
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],120:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection');

  /**
   * Divide two values element wise.
   *
   *     x ./ y
   *     edivide(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.edivide = function edivide(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('edivide', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.divide);
  };
};

},{"../../type/collection":203,"../../util/index":207}],121:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection');

  /**
   * Multiply two values element wise.
   *
   *     x .* y
   *     emultiply(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.emultiply = function emultiply(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('emultiply', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.multiply);
  };
};

},{"../../type/collection":203,"../../util/index":207}],122:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection');

  /**
   * Calculates the power of x to y element wise
   *
   *     x .^ y
   *     epow(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.epow = function epow(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('epow', arguments.length, 2);
    }

    return collection.deepMap2(x, y, math.pow);
  };
};

},{"../../type/collection":203,"../../util/index":207}],123:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x equals y,
   *
   *     x == y
   *     equal(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.equal = function equal(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('equal', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        return x == y;
      }
      else if (isComplex(y)) {
        return (x == y.re) && (y.im == 0);
      }
    }
    if (isComplex(x)) {
      if (isNumBool(y)) {
        return (x.re == y) && (x.im == 0);
      }
      else if (isComplex(y)) {
        return (x.re == y.re) && (x.im == y.im);
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
      return x == y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, equal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return equal(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('equal', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],124:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the exponent of a value
   *
   *     exp(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.exp = function exp (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('exp', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.exp(x);
    }
    if (isComplex(x)) {
      var r = Math.exp(x.re);
      return new Complex(
          r * Math.cos(x.im),
          r * Math.sin(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, exp);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return exp(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('exp', x);
  };
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],125:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards zero
   *
   *     fix(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.fix = function fix(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('fix', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (isComplex(x)) {
      return new Complex(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, fix);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return fix(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('fix', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],126:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards minus infinity
   *
   *     floor(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.floor = function floor(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('floor', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.floor(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.floor(x.re),
          Math.floor(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, floor);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return floor(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('floor', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],127:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   *     gcd(a, b)
   *     gcd(a, b, c, ...)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {... Number | Boolean | Array | Matrix} args    two or more integer numbers
   * @return {Number | Array | Matrix} greatest common divisor
   */
  math.gcd = function gcd(args) {
    var a = arguments[0],
        b = arguments[1],
        r; // remainder

    if (arguments.length == 2) {
      // two arguments
      if (isNumBool(a) && isNumBool(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function gcd must be integer numbers');
        }

        // http://en.wikipedia.org/wiki/Euclidean_algorithm
        while (b != 0) {
          r = a % b;
          a = b;
          b = r;
        }
        return (a < 0) ? -a : a;
      }

      // evaluate gcd element wise
      if (isCollection(a) || isCollection(b)) {
        return collection.deepMap2(a, b, gcd);
      }

      if (a.valueOf() !== a || b.valueOf() !== b) {
        // fallback on the objects primitive value
        return gcd(a.valueOf(), b.valueOf());
      }

      throw new util.error.UnsupportedTypeError('gcd', a, b);
    }

    if (arguments.length > 2) {
      // multiple arguments. Evaluate them iteratively
      for (var i = 1; i < arguments.length; i++) {
        a = gcd(a, arguments[i]);
      }
      return a;
    }

    // zero or one argument
    throw new SyntaxError('Function gcd expects two or more arguments');
  };
};

},{"../../type/collection":203,"../../util/index":207}],128:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is larger y
   *
   *    x > y
   *    larger(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.larger = function larger(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('larger', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x > y;
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value > y.value;
    }

    if (isString(x) || isString(y)) {
      return x > y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, larger);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return larger(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('larger', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],129:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is larger or equal to y
   *
   *     x >= y
   *     largereq(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.largereq = function largereq(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('largereq', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x >= y;
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value >= y.value;
    }

    if (isString(x) || isString(y)) {
      return x >= y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, largereq);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return largereq(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('largereq', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],130:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   *     lcm(a, b)
   *     lcm(a, b, c, ...)
   *
   * lcm is defined as:
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {... Number | Boolean | Array | Matrix} args    two or more integer numbers
   * @return {Number | Array | Matrix} least common multiple
   */
  math.lcm = function lcm(args) {
    var a = arguments[0],
        b = arguments[1],
        t;

    if (arguments.length == 2) {
      // two arguments
      if (isNumBool(a) && isNumBool(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function lcm must be integer numbers');
        }

        if (a == 0 || b == 0) {
          return 0;
        }

        // http://en.wikipedia.org/wiki/Euclidean_algorithm
        // evaluate gcd here inline to reduce overhead
        var prod = a * b;
        while (b != 0) {
          t = b;
          b = a % t;
          a = t;
        }
        return Math.abs(prod / a);
      }

      // evaluate lcm element wise
      if (isCollection(a) || isCollection(b)) {
        return collection.deepMap2(a, b, lcm);
      }

      if (a.valueOf() !== a || b.valueOf() !== b) {
        // fallback on the objects primitive value
        return lcm(a.valueOf(), b.valueOf());
      }

      throw new util.error.UnsupportedTypeError('lcm', a, b);
    }

    if (arguments.length > 2) {
      // multiple arguments. Evaluate them iteratively
      for (var i = 1; i < arguments.length; i++) {
        a = lcm(a, arguments[i]);
      }
      return a;
    }

    // zero or one argument
    throw new SyntaxError('Function lcm expects two or more arguments');
  };
};

},{"../../type/collection":203,"../../util/index":207}],131:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the logarithm of a value
   *
   *     log(x)
   *     log(x, base)
   *
   * base is optional. If not provided, the natural logarithm of x is calculated.
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @param {Number | Boolean | Complex} [base]
   * @return {Number | Complex | Array | Matrix} res
   */
  math.log = function log(x, base) {
    if (arguments.length == 1) {
      // calculate natural logarithm, log(x)
      if (isNumBool(x)) {
        if (x >= 0) {
          return Math.log(x);
        }
        else {
          // negative value -> complex value computation
          return log(new Complex(x, 0));
        }
      }

      if (isComplex(x)) {
        return new Complex (
            Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
            Math.atan2(x.im, x.re)
        );
      }

      if (isCollection(x)) {
        return collection.deepMap(x, log);
      }

      if (x.valueOf() !== x) {
        // fallback on the objects primitive values
        return log(x.valueOf());
      }

      throw new util.error.UnsupportedTypeError('log', x);
    }
    else if (arguments.length == 2) {
      // calculate logarithm for a specified base, log(x, base)
      return math.divide(log(x), log(base));
    }
    else {
      throw new util.error.ArgumentsError('log', arguments.length, 1, 2);
    }
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],132:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the 10-base logarithm of a value
   *
   *     log10(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.log10 = function log10(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('log10', arguments.length, 1);
    }

    if (isNumBool(x)) {
      if (x >= 0) {
        return Math.log(x) / Math.LN10;
      }
      else {
        // negative value -> complex value computation
        return log10(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      return new Complex (
          Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
          Math.atan2(x.im, x.re) / Math.LN10
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, log10);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return log10(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('log10', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],133:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isCollection = collection.isCollection;

  /**
   * Calculates the modulus, the remainder of an integer division.
   *
   *     x % y
   *     mod(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | Boolean | Array | Matrix} x
   * @param  {Number | Boolean | Array | Matrix} y
   * @return {Number | Array | Matrix} res
   */
  math.mod = function mod(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('mod', arguments.length, 2);
    }

    // see http://functions.wolfram.com/IntegerFunctions/Mod/

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number % number
        return _mod(x, y);
      }
      else if (isBoolean(y)) {
        // number % boolean
        return _mod(x, Number(y));
      }
    }
    else if (isBoolean(x)) {
      if (isNumber(y)) {
        // boolean % number
        return _mod(Number(x), y);
      }
      else if (isBoolean(y)) {
        // boolean % boolean
        return _mod(Number(x), Number(y));
      }
    }

    // TODO: implement mod for complex values

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, mod);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return mod(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('mod', x, y);
  };

  /**
   * Calculate the modulus of two numbers
   * @param {Number} x
   * @param {Number} y
   * @returns {number} res
   * @private
   */
  function _mod(x, y) {
    if (y > 0) {
      if (x > 0) {
        return x % y;
      }
      else if (x == 0) {
        return 0;
      }
      else { // x < 0
        return x - y * Math.floor(x / y);
      }
    }
    else if (y == 0) {
      return x;
    }
    else { // y < 0
      // TODO: implement mod for a negative divisor
      throw new Error('Cannot calculate mod for a negative divisor');
    }
  }
};

},{"../../type/collection":203,"../../util/index":207}],134:[function(require,module,exports){
module.exports = function(math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      array = util.array,
      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isArray = Array.isArray,
      isUnit = Unit.isUnit;

  /**
   * Multiply two values.
   *
   *     x * y
   *     multiply(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.multiply = function multiply(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number * number
        return x * y;
      }
      else if (isComplex(y)) {
        // number * complex
        return _multiplyComplex (new Complex(x, 0), y);
      }
      else if (isUnit(y)) {
        res = y.clone();
        res.value *= x;
        return res;
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex * number
        return _multiplyComplex (x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex * complex
        return _multiplyComplex (x, y);
      }
    }
    else if (isUnit(x)) {
      if (isNumBool(y)) {
        res = x.clone();
        res.value *= y;
        return res;
      }
    }
    else if (isArray(x)) {
      if (isArray(y)) {
        // array * array
        var sizeX = array.size(x);
        var sizeY = array.size(y);

        if (sizeX.length == 1) {
          if (sizeY.length == 1) {
            // vector * vector
            if (sizeX[0] != sizeY[0]) {
              throw new RangeError('Dimensions mismatch in multiplication. ' +
                  'Length of A must match length of B ' +
                  '(A is ' + sizeX[0] +
                  ', B is ' + sizeY[0] +
                  sizeX[0] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyVectorVector(x, y);
          }
          else if (sizeY.length == 2) {
            // vector * matrix
            if (sizeX[0] != sizeY[0]) {
              throw new RangeError('Dimensions mismatch in multiplication. ' +
                  'Length of A must match rows of B ' +
                  '(A is ' + sizeX[0] +
                  ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
                  sizeX[0] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyVectorMatrix(x, y);
          }
          else {
            throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                '(B has ' + sizeY.length + ' dimensions)');
          }
        }
        else if (sizeX.length == 2) {
          if (sizeY.length == 1) {
            // matrix * vector
            if (sizeX[1] != sizeY[0]) {
              throw new RangeError('Dimensions mismatch in multiplication. ' +
                  'Columns of A must match length of B ' +
                  '(A is ' + sizeX[0] + 'x' + sizeX[0] +
                  ', B is ' + sizeY[0] + ', ' +
                  sizeX[1] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyMatrixVector(x, y);
          }
          else if (sizeY.length == 2) {
            // matrix * matrix
            if (sizeX[1] != sizeY[0]) {
              throw new RangeError('Dimensions mismatch in multiplication. ' +
                  'Columns of A must match rows of B ' +
                  '(A is ' + sizeX[0] + 'x' + sizeX[1] +
                  ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
                  sizeX[1] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyMatrixMatrix(x, y);
          }
          else {
            throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                '(B has ' + sizeY.length + ' dimensions)');
          }
        }
        else {
          throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
              '(A has ' + sizeX.length + ' dimensions)');
        }
      }
      else if (y instanceof Matrix) {
        // array * matrix
        return new Matrix(multiply(x, y.valueOf()));
      }
      else {
        // array * scalar
        return collection.deepMap2(x, y, multiply);
      }
    }
    else if (x instanceof Matrix) {
      if (y instanceof Matrix) {
        // matrix * matrix
        return new Matrix(multiply(x.valueOf(), y.valueOf()));
      }
      else {
        // matrix * array
        // matrix * scalar
        return new Matrix(multiply(x.valueOf(), y));
      }
    }

    if (isArray(y)) {
      // scalar * array
      return collection.deepMap2(x, y, multiply);
    }
    else if (y instanceof Matrix) {
      // scalar * matrix
      return new Matrix(collection.deepMap2(x, y.valueOf(), multiply));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return multiply(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('multiply', x, y);
  };

  /**
   * Multiply two 2-dimensional matrices.
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A 2d matrix
   * @return {Array} result
   * @private
   */
  function _multiplyMatrixMatrix(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = x.length,
        cols = y[0].length,
        num = x[0].length;

    for (var r = 0; r < rows; r++) {
      res[r] = [];
      for (var c = 0; c < cols; c++) {
        var result = null;
        for (var n = 0; n < num; n++) {
          var p = math.multiply(x[r][n], y[n][c]);
          result = (result === null) ? p : math.add(result, p);
        }
        res[r][c] = result;
      }
    }

    return res;
  }

  /**
   * Multiply a vector with a 2-dimensional matrix
   * The size of the matrices is not validated.
   * @param {Array} x   A vector
   * @param {Array} y   A 2d matrix
   * @return {Array} result
   * @private
   */
  function _multiplyVectorMatrix(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = y.length,
        cols = y[0].length;

    for (var c = 0; c < cols; c++) {
      var result = null;
      for (var r = 0; r < rows; r++) {
        var p = math.multiply(x[r], y[r][c]);
        result = (r === 0) ? p : math.add(result, p);
      }
      res[c] = result;
    }

    return res;
  }

  /**
   * Multiply a 2-dimensional matrix with a vector
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A vector
   * @return {Array} result
   * @private
   */
  function _multiplyMatrixVector(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = x.length,
        cols = x[0].length;

    for (var r = 0; r < rows; r++) {
      var result = null;
      for (var c = 0; c < cols; c++) {
        var p = math.multiply(x[r][c], y[c]);
        result = (c === 0) ? p : math.add(result, p);
      }
      res[r] = result;
    }

    return res;
  }

  /**
   * Multiply two vectors, calculate the dot product
   * The size of the matrices is not validated.
   * @param {Array} x   A vector
   * @param {Array} y   A vector
   * @return {Number} dotProduct
   * @private
   */
  function _multiplyVectorVector(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var len = x.length,
        dot = null;

    if (len) {
      dot = 0;

      for (var i = 0, ii = x.length; i < ii; i++) {
        dot = math.add(dot, math.multiply(x[i], y[i]));
      }
    }

    return dot;
  }

  /**
   * Multiply two complex numbers. x * y or multiply(x, y)
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex | Number} res
   * @private
   */
  function _multiplyComplex (x, y) {
    // Note: we test whether x or y are pure real or pure complex,
    // to prevent unnecessary NaN values. For example, Infinity*i should
    // result in Infinity*i, and not in NaN+Infinity*i

    if (x.im == 0) {
      // x is pure real
      if (y.im == 0) {
        // y is pure real
        return x.re * y.re;
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            0,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re,
            x.re * y.im
        );
      }
    }
    else if (x.re == 0) {
      // x is pure complex
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            0,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return -x.im * y.im;
      }
      else {
        // y has a real and complex part
        return new Complex(
            -x.im * y.im,
            x.im * y.re
        );
      }
    }
    else {
      // x has a real and complex part
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            x.re * y.re,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            -x.im * y.im,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re - x.im * y.im,
            x.re * y.im + x.im * y.re
        );
      }
    }
  }
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],135:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,
      isNumBool = util.number.isNumBool,
      isArray = Array.isArray,
      isInteger = util.number.isInteger,
      isComplex = Complex.isComplex;

  /**
   * Calculates the power of x to y
   *
   *     x ^ y
   *     pow(x, y)
   *
   * @param  {Number | Boolean | Complex | Array | Matrix} x
   * @param  {Number | Boolean | Complex} y
   * @return {Number | Complex | Array | Matrix} res
   */
  math.pow = function pow(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('pow', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        if (isInteger(y) || x >= 0) {
          // real value computation
          return Math.pow(x, y);
        }
        else {
          return powComplex(new Complex(x, 0), new Complex(y, 0));
        }
      }
      else if (isComplex(y)) {
        return powComplex(new Complex(x, 0), y);
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        return powComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        return powComplex(x, y);
      }
    }
    else if (isArray(x)) {
      if (!isNumBool(y) || !isInteger(y) || y < 0) {
        throw new TypeError('For A^b, b must be a positive integer ' +
            '(value is ' + y + ')');
      }
      // verify that A is a 2 dimensional square matrix
      var s = array.size(x);
      if (s.length != 2) {
        throw new Error('For A^b, A must be 2 dimensional ' +
            '(A has ' + s.length + ' dimensions)');
      }
      if (s[0] != s[1]) {
        throw new Error('For A^b, A must be square ' +
            '(size is ' + s[0] + 'x' + s[1] + ')');
      }

      if (y == 0) {
        // return the identity matrix
        return math.eye(s[0]);
      }
      else {
        // value > 0
        var res = x;
        for (var i = 1; i < y; i++) {
          res = math.multiply(x, res);
        }
        return res;
      }
    }
    else if (x instanceof Matrix) {
      return new Matrix(pow(x.valueOf(), y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return pow(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('pow', x, y);
  };

  /**
   * Calculates the power of x to y, x^y, for two complex numbers.
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex} res
   * @private
   */
  function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = math.log(x);
    var temp2 = math.multiply(temp1, y);
    return math.exp(temp2);
  }
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],136:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards the nearest integer
   *
   *     round(x)
   *     round(x, n)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @param {Number | Boolean | Array} [n] number of decimals (by default n=0)
   * @return {Number | Complex | Array | Matrix} res
   */
  math.round = function round(x, n) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('round', arguments.length, 1, 2);
    }

    if (n == undefined) {
      // round (x)
      if (isNumBool(x)) {
        return Math.round(x);
      }

      if (isComplex(x)) {
        return new Complex (
            Math.round(x.re),
            Math.round(x.im)
        );
      }

      if (isCollection(x)) {
        return collection.deepMap(x, round);
      }

      if (x.valueOf() !== x) {
        // fallback on the objects primitive value
        return round(x.valueOf());
      }

      throw new util.error.UnsupportedTypeError('round', x);
    }
    else {
      // round (x, n)
      if (!isNumber(n) || !isInteger(n)) {
        throw new TypeError('Number of decimals in function round must be an integer');
      }
      if (n < 0 || n > 9) {
        throw new Error ('Number of decimals in function round must be in te range of 0-9');
      }

      if (isNumBool(x)) {
        return roundNumber(x, n);
      }

      if (isComplex(x)) {
        return new Complex (
            roundNumber(x.re, n),
            roundNumber(x.im, n)
        );
      }

      if (isCollection(x) || isCollection(n)) {
        return collection.deepMap2(x, n, round);
      }

      if (x.valueOf() !== x || n.valueOf() !== n) {
        // fallback on the objects primitive values
        return round(x.valueOf(), n.valueOf());
      }

      throw new util.error.UnsupportedTypeError('round', x, n);
    }
  };

  /**
   * round a number to the given number of decimals, or to zero if decimals is
   * not provided
   * @param {Number} value
   * @param {Number} [decimals]  number of decimals, between 0 and 15 (0 by default)
   * @return {Number} roundedValue
   */
  function roundNumber (value, decimals) {
    if (decimals) {
      var p = Math.pow(10, decimals);
      return Math.round(value * p) / p;
    }
    else {
      return Math.round(value);
    }
  }
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],137:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      number = util.number,
      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the sign of a value.
   *
   *     sign(x)
   *
   * The sign of a value x is 1 when x > 1, -1 when x < 0, and 0 when x == 0
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sign = function sign(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sign', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return number.sign(x);
    }

    if (isComplex(x)) {
      var abs = Math.sqrt(x.re * x.re + x.im * x.im);
      return new Complex(x.re / abs, x.im / abs);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sign);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sign(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sign', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],138:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x is smaller y
   *
   *     x < y
   *     smaller(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.smaller = function smaller(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('smaller', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x < y;
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value < y.value;
    }

    if (isString(x) || isString(y)) {
      return x < y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, smaller);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return smaller(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('smaller', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],139:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value a is smaller or equal to b
   *
   *     a <= b
   *     smallereq(a, b)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, the absolute values of a and b are compared.
   *
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.smallereq = function smallereq(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('smallereq', arguments.length, 2);
    }

    if (isNumBool(x) && isNumBool(y)) {
      return x <= y;
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value <= y.value;
    }

    if (isString(x) || isString(y)) {
      return x <= y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, smallereq);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return smallereq(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('smallereq', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],140:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the square root of a value
   *
   *     sqrt(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumBool(x)) {
      if (x >= 0) {
        return Math.sqrt(x);
      }
      else {
        return sqrt(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      var r = Math.sqrt(x.re * x.re + x.im * x.im);
      if (x.im >= 0) {
        return new Complex(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
      else {
        return new Complex(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            -0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sqrt);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sqrt(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sqrt', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],141:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the square of a value
   *
   *     x .* x
   *     square(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.square = function square(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('square', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x * x;
    }

    if (isComplex(x)) {
      return math.multiply(x, x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, square);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return square(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('square', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],142:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Subtract two values
   *
   *     x - y
   *     subtract(x, y)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.subtract = function subtract(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('subtract', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number - number
        return x - y;
      }
      else if (isComplex(y)) {
        // number - complex
        return new Complex (
            x - y.re,
            - y.im
        );
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex - number
        return new Complex (
            x.re - y,
            x.im
        )
      }
      else if (isComplex(y)) {
        // complex - complex
        return new Complex (
            x.re - y.re,
            x.im - y.im
        )
      }
    }
    else if (isUnit(x)) {
      if (isUnit(y)) {
        if (!x.equalBase(y)) {
          throw new Error('Units do not match');
        }

        if (x.value == null) {
          throw new Error('Unit on left hand side of operator - has an undefined value');
        }

        if (y.value == null) {
          throw new Error('Unit on right hand side of operator - has an undefined value');
        }

        var res = x.clone();
        res.value -= y.value;
        res.fixPrefix = false;

        return res;
      }
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, subtract);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return subtract(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('subtract', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],143:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Inverse the sign of a value.
   *
   *     -x
   *     unary(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.unary = function unary(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('unary', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return -x;
    }
    else if (isComplex(x)) {
      return new Complex(
          -x.re,
          -x.im
      );
    }
    else if (isUnit(x)) {
      var res = x.clone();
      res.value = -x.value;
      return res;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, unary);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return unary(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('unary', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],144:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Check if value x unequals y, x != y
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
   */
  math.unequal = function unequal(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        return x != y;
      }
      else if (isComplex(y)) {
        return (x != y.re) || (y.im != 0);
      }
    }

    if (isComplex(x)) {
      if (isNumBool(y)) {
        return (x.re != y) || (x.im != 0);
      }
      else if (isComplex(y)) {
        return (x.re != y.re) || (x.im != y.im);
      }
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value != y.value;
    }

    if (isString(x) || isString(y)) {
      return x != y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, unequal);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return unequal(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('unequal', x, y);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],145:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      isNumBool = util.number.isNumBool,
      isInteger = util.number.isInteger;

  /**
   * Calculate the extended greatest common divisor for two values.
   *
   *     xgcd(a, b)
   *
   * @param {Number | Boolean} a  An integer number
   * @param {Number | Boolean} b  An integer number
   * @return {Array}              An array containing 3 integers [div, m, n]
   *                              where div = gcd(a, b) and a*m + b*n = div
   *
   * @see http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
   */
  math.xgcd = function xgcd(a, b) {
    if (arguments.length == 2) {
      // two arguments
      if (isNumBool(a) && isNumBool(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function xgcd must be integer numbers');
        }

        return _xgcd(a, b);
      }

      throw new util.error.UnsupportedTypeError('xgcd', a, b);
    }

    // zero or one argument
    throw new SyntaxError('Function xgcd expects two arguments');
  };

  /**
   * Calculate xgcd for two numbers
   * @param {Number} a
   * @param {Number} b
   * @private
   */
  function _xgcd(a, b) {
    //*
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        x = 0, lastx = 1,
        y = 1, lasty = 0;

    while (b) {
      q = Math.floor(a / b);
      r = a % b;

      t = x;
      x = lastx - q * x;
      lastx = t;

      t = y;
      y = lasty - q * y;
      lasty = t;

      a = b;
      b = r;
    }

    if (a < 0) {
      return [-a, a ? -lastx : 0, -lasty];
    }
    else {
      return [a, a ? lastx : 0, lasty];
    }
  }
};

},{"../../util/index":207}],146:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the argument of a complex value.
   * If x = a + bi, the argument is computed as atan2(b, a).
   *
   *     arg(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} res
   */
  math.arg = function arg(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('arg', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.atan2(0, x);
    }

    if (isComplex(x)) {
      return Math.atan2(x.im, x.re);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, arg);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return arg(x.valueOf());
    }

    // handle other types just as non-complex values
    return math.atan2(0, x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],147:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      object = util.object,
      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the complex conjugate of a complex value.
   * If x = a+bi, the complex conjugate is a-bi.
   *
   *     conj(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.conj = function conj(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('conj', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x;
    }

    if (isComplex(x)) {
      return new Complex(x.re, -x.im);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, conj);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return conj(x.valueOf());
    }

    // return a clone of the value for non-complex values
    return object.clone(x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],148:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the imaginary part of a complex number.
   *
   *     im(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} im
   */
  math.im = function im(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('im', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 0;
    }

    if (isComplex(x)) {
      return x.im;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, im);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return im(x.valueOf());
    }

    // return 0 for all non-complex values
    return 0;
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],149:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      object = util.object,
      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the real part of a complex number.
   *
   *     re(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} re
   */
  math.re = function re(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('re', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x;
    }

    if (isComplex(x)) {
      return x.re;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, re);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return re(x.valueOf());
    }

    // return a clone of the value itself for all non-complex values
    return object.clone(x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],150:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isString = util.string.isString;

  /**
   * Create a boolean or convert a string or number to a boolean.
   * In case of a number, true is returned for non-zero numbers, and false in
   * case of zero.
   * Strings can be 'true' or 'false', or can contain a number.
   * @param {String | Number | Boolean | Array | Matrix} value
   * @return {Boolean | Array | Matrix} bool
   */
  math['boolean'] = function bool (value) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('boolean', arguments.length, 0, 1);
    }

    if (value === 'true' || value === true) {
      return true;
    }

    if (value === 'false' || value === false) {
      return false;
    }

    if (value instanceof Boolean) {
      return value ? true : false;
    }

    if (isNumber(value)) {
      return (value !== 0);
    }

    if (isString(value)) {
      // try case insensitive
      var lcase = value.toLowerCase();
      if (lcase === 'true') {
        return true;
      }
      else if (lcase === 'false') {
        return false;
      }

      // test whether value is a valid number
      var num = Number(value);
      if (value != '' && !isNaN(num)) {
        return (num !== 0);
      }
    }

    if (isCollection(value)) {
      return collection.deepMap(value, bool);
    }

    throw new SyntaxError(value.toString() + ' is no valid boolean');
  };
};

},{"../../type/collection":203,"../../util/index":207}],151:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex;

  /**
   * Create a complex value or convert a value to a complex value.
   *
   * The method accepts the following arguments:
   *     complex()                           creates a complex value with zero
   *                                         as real and imaginary part.
   *     complex(re : number, im : string)   creates a complex value with provided
   *                                         values for real and imaginary part.
   *     complex(re : number)                creates a complex value with provided
   *                                         real value and zero imaginary part.
   *     complex(complex : Complex)          clones the provided complex value.
   *     complex(arg : string)               parses a string into a complex value.
   *     complex(array : Array)              converts the elements of the array
   *                                         or matrix element wise into a
   *                                         complex value.
   *
   * Example usage:
   *     var a = math.complex(3, -4);     // 3 - 4i
   *     a.re = 5;                        // a = 5 - 4i
   *     var i = a.im;                    // -4;
   *     var b = math.complex('2 + 6i');  // 2 + 6i
   *     var c = math.complex();          // 0 + 0i
   *     var d = math.add(a, b);          // 5 + 2i
   *
   * @param {* | Array | Matrix} [args]
   * @return {Complex | Array | Matrix} value
   */
  math.complex = function complex(args) {
    switch (arguments.length) {
      case 0:
        // no parameters. Set re and im zero
        return new Complex(0, 0);
        break;

      case 1:
        // parse string into a complex number
        var arg = arguments[0];

        if (isNumber(arg)) {
          return new Complex(arg, 0);
        }

        if (isComplex(arg)) {
          // create a clone
          return arg.clone();
        }

        if (isString(arg)) {
          var c = Complex.parse(arg);
          if (c) {
            return c;
          }
          else {
            throw new SyntaxError('String "' + arg + '" is no valid complex number');
          }
        }

        if (isCollection(arg)) {
          return collection.deepMap(arg, complex);
        }

        if (isBoolean(arg)) {
          return new Complex(Number(arg), 0);
        }

        throw new TypeError(
            'Two numbers or a single string expected in function complex');
        break;

      case 2:
        // re and im provided
        return new Complex(arguments[0], arguments[1]);
        break;

      default:
        throw new util.error.ArgumentsError('complex', arguments.length, 0, 2);
    }
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],152:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Index = require('../../type/Index');

  /**
   * Create an index. An Index can store ranges having start, step, and end
   * for multiple dimensions.
   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
   *
   * Usage:
   *     var index = math.index(range1, range2, ...);
   *
   * Where each range can be any of:
   *     An array [start, end]
   *     An array [start, end, step]
   *     A number
   *     null, this will create select the whole dimension
   *
   * The parameters start, end, and step must be integer numbers.
   *
   * @param {...*} ranges
   */
  math.index = function matrix(ranges) {
    var i = new Index();
    Index.apply(i, arguments);
    return i;
  };
};

},{"../../type/Index":199,"../../util/index":207}],153:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix');

  /**
   * Create a matrix. The function creates a new math.type.Matrix object.
   *
   * The method accepts the following arguments:
   *     matrix()       creates an empty matrix
   *     matrix(data)   creates a matrix with initial data.
   *
   * Example usage:
   *     var m = matrix([[1, 2], [3, 4]);
   *     m.size();                        // [2, 2]
   *     m.resize([3, 2], 5);
   *     m.valueOf();                     // [[1, 2], [3, 4], [5, 5]]
   *     m.get([1, 0])                    // 3
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @return {Matrix} matrix
   */
  math.matrix = function matrix(data) {
    if (arguments.length > 1) {
      throw new util.error.ArgumentsError('matrix', arguments.length, 0, 1);
    }

    return new Matrix(data);
  };
};

},{"../../type/Matrix":200,"../../util/index":207}],154:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Create a number or convert a string to a number
   * @param {String | Number | Boolean | Array | Matrix} [value]
   * @return {Number | Array | Matrix} num
   */
  math.number = function number (value) {
    switch (arguments.length) {
      case 0:
        return 0;

      case 1:
        if (isCollection(value)) {
          return collection.deepMap(value, number);
        }

        var num = Number(value);
        if (isNaN(num)) {
          num = Number(value.valueOf());
        }
        if (isNaN(num)) {
          throw new SyntaxError(value.toString() + ' is no valid number');
        }
        return num;
      default:
        throw new util.error.ArgumentsError('number', arguments.length, 0, 1);
    }
  };
};

},{"../../type/collection":203,"../../util/index":207}],155:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Parser = require('../../expression/Parser');

  /**
   * Create a parser. The function creates a new math.expression.Parser object.
   *
   *    parser()
   *
   * Example usage:
   *     var parser = new math.parser();
   *
   *     // evaluate expressions
   *     var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
   *     var b = parser.eval('sqrt(-4)');        // 2i
   *     var c = parser.eval('2 inch in cm');    // 5.08 cm
   *     var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
   *
   *     // define variables and functions
   *     parser.eval('x = 7 / 2');               // 3.5
   *     parser.eval('x + 3');                   // 6.5
   *     parser.eval('function f(x, y) = x^y');  // f(x, y)
   *     parser.eval('f(2, 3)');                 // 8
   *
   *     // get and set variables and functions
   *     var x = parser.get('x');                // 7
   *     var f = parser.get('f');                // function
   *     var g = f(3, 2);                        // 9
   *     parser.set('h', 500);
   *     var i = parser.eval('h / 2');           // 250
   *     parser.set('hello', function (name) {
 *         return 'hello, ' + name + '!';
 *     });
   *     parser.eval('hello("user")');           // "hello, user!"
   *
   *     // clear defined functions and variables
   *     parser.clear();
   *
   * @return {Parser} Parser
   */
  math.parser = function parser() {
    return new Parser(math);
  };
};

},{"../../expression/Parser":4,"../../util/index":207}],156:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      number = util.number,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection;

  /**
   * Create a string or convert any object into a string.
   * Elements of Arrays and Matrices are processed element wise
   * @param {* | Array | Matrix} [value]
   * @return {String | Array | Matrix} str
   */
  math.string = function string (value) {
    switch (arguments.length) {
      case 0:
        return '';

      case 1:
        if (isNumber(value)) {
          return number.format(value);
        }

        if (isCollection(value)) {
          return collection.deepMap(value, string);
        }

        if (value === null) {
          return 'null';
        }

        return value.toString();

      default:
        throw new util.error.ArgumentsError('string', arguments.length, 0, 1);
    }
  };
};

},{"../../type/collection":203,"../../util/index":207}],157:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection,
      isString = util.string.isString;

  /**
   * Create a unit. Depending on the passed arguments, the function
   * will create and return a new math.type.Unit object.
   *
   * The method accepts the following arguments:
   *     unit(unit : string)
   *     unit(value : number, unit : string
   *
   * Example usage:
   *     var a = math.unit(5, 'cm');          // 50 mm
   *     var b = math.unit('23 kg');          // 23 kg
   *     var c = math.in(a, math.unit('m');   // 0.05 m
   *
   * @param {* | Array | Matrix} args
   * @return {Unit | Array | Matrix} value
   */
  math.unit = function unit(args) {
    switch(arguments.length) {
      case 1:
        // parse a string
        var arg = arguments[0];

        if (arg instanceof Unit) {
          // create a clone of the unit
          return arg.clone();
        }

        if (isString(arg)) {
          if (Unit.isPlainUnit(arg)) {
            return new Unit(null, arg); // a pure unit
          }

          var u = Unit.parse(arg);        // a unit with value, like '5cm'
          if (u) {
            return u;
          }

          throw new SyntaxError('String "' + arg + '" is no valid unit');
        }

        if (isCollection(args)) {
          return collection.deepMap(args, unit);
        }

        throw new TypeError('A string or a number and string expected in function unit');
        break;

      case 2:
        // a number and a unit
        return new Unit(arguments[0], arguments[1]);
        break;

      default:
        throw new util.error.ArgumentsError('unit', arguments.length, 1, 2);
    }
  };
};

},{"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],158:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Scope = require('../../expression/Scope'),

      collection = require('../../type/collection'),

      isString = util.string.isString,
      isCollection = collection.isCollection;

  /**
   * Evaluate an expression.
   *
   * Syntax:
   *
   *     math.eval(expr)
   *     math.eval(expr, scope)
   *     math.eval([expr1, expr2, expr3, ...])
   *     math.eval([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     math.eval('(2+3)/4');                // 1.25
   *     math.eval('sqrt(3^2 + 4^2)');        // 5
   *     math.eval('sqrt(-4)');               // 2i
   *     math.eval(['a=3', 'b=4', 'a*b']);,   // [3, 4, 12]
   *
   *     var scope = {a:3, b:4};
   *     math.eval('a * b', scope);           // 12
   *
   * @param {String | String[] | Matrix} expr
   * @param {Scope | Object} [scope]
   * @return {*} res
   * @throws {Error}
   */
  math.eval = function _eval (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('eval', arguments.length, 1, 2);
    }

    // instantiate a scope
    var evalScope;
    if (scope) {
      if (scope instanceof Scope) {
        evalScope = scope;
      }
      else {
        evalScope = new Scope(math, scope);
      }
    }
    else {
      evalScope = new Scope(math);
    }

    if (isString(expr)) {
      // evaluate a single expression
      var node = math.parse(expr, evalScope);
      return node.eval();
    }
    else if (isCollection(expr)) {
      // evaluate an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        var node = math.parse(elem, evalScope);
        return node.eval();
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  };
};

},{"../../expression/Scope":5,"../../type/collection":203,"../../util/index":207}],159:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Help = require('../../type/Help');

  /**
   * Retrieve help on a function or data type.
   * Help files are retrieved from the documentation in math.expression.docs.
   * @param {function | string | Object} search
   * @return {Help} help
   */
  math.help = function help(search) {
    if (arguments.length != 1) {
      throw new SyntaxError('Wrong number of arguments in function help ' +
          '(' + arguments.length + ' provided, 1 expected)');
    }

    var text = null;
    if ((search instanceof String) || (typeof(search) === 'string')) {
      text = search;
    }
    else {
      var prop;
      for (prop in math) {
        // search in functions and constants
        if (math.hasOwnProperty(prop)) {
          if (search === math[prop]) {
            text = prop;
            break;
          }
        }
      }

      if (!text) {
        // search data type
        for (prop in math.type) {
          if (math.type.hasOwnProperty(prop)) {
            if (search === math.type[prop]) {
              text = prop;
              break;
            }
          }
        }
      }
    }

    if (!text) {
      throw new Error('Could not find search term "' + search + '"');
    }
    else {
      var doc = math.expression.docs[text];
      if (!doc) {
        throw new Error('No documentation found on "' + text + '"');
      }
      return new Help(math, doc);
    }
  };
};

},{"../../type/Help":198,"../../util/index":207}],160:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      isString = util.string.isString,
      isArray = Array.isArray,

      // types
      Complex = require('./../../type/Complex'),
      Matrix = require('./../../type/Matrix'),
      Unit = require('./../../type/Unit'),
      collection = require('../../type/collection'),

      // scope and nodes
      Scope = require('./../../expression/Scope'),
      AssignmentNode = require('../../expression/node/AssignmentNode'),
      BlockNode = require('../../expression/node/BlockNode'),
      ConstantNode = require('../../expression/node/ConstantNode'),
      FunctionNode = require('../../expression/node/FunctionNode'),
      ArrayNode = require('../../expression/node/ArrayNode'),
      OperatorNode = require('../../expression/node/OperatorNode'),
      ParamsNode = require('../../expression/node/ParamsNode'),
      RangeNode = require('../../expression/node/RangeNode'),
      SymbolNode = require('../../expression/node/SymbolNode'),
      UpdateNode = require('../../expression/node/UpdateNode'),
      handlers = require('../../expression/node/handlers');

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, scope)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     var node = math.parse('sqrt(3^2 + 4^2)');
   *     node.eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = math.parse('a * b', scope); // 12
   *     node.eval(); // 12
   *     scope.a = 5;
   *     node.eval(); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].eval(); // 12
   *
   * @param {String | String[] | Matrix} expr
   * @param {Scope | Object} [scope]
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  math.parse = function parse (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('parse', arguments.length, 1, 2);
    }

    // instantiate a scope
    var parseScope;
    if (scope) {
      if (scope instanceof Scope) {
        parseScope = scope;
      }
      else {
        parseScope = new Scope(math, scope);
      }
    }
    else {
      parseScope = new Scope(math);
    }

    if (isString(expr)) {
      // parse a single expression
      expression = expr || '';
      return parseStart(parseScope);
    }
    else if (isArray(expr) || expr instanceof Matrix) {
      // parse an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        expression = elem || '';
        return parseStart(parseScope);
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  };

// token types enumeration
  var TOKENTYPE = {
    NULL : 0,
    DELIMITER : 1,
    NUMBER : 2,
    SYMBOL : 3,
    UNKNOWN : 4
  };

// map with all delimiters
  var DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '\"': true,
    '\n': true,
    ';': true,

    '+': true,
    '-': true,
    '*': true,
    '.*': true,
    '/': true,
    './': true,
    '%': true,
    '^': true,
    '.^': true,
    '!': true,
    '\'': true,
    '=': true,
    ':': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true
  };

    // map with all named delimiters
  var NAMED_DELIMITERS = {
      'mod': true
  };

  var expression = '';  // current expression
  var index = 0;        // current index in expr
  var c = '';           // current token character in expr
  var token = '';       // current token
  var token_type = TOKENTYPE.NULL; // type of the token

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first() {
    index = 0;
    c = expression.charAt(0);
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next() {
    index++;
    c = expression.charAt(index);
  }

  /**
   * Preview the next character from the expression.
   * @return {String} cNext
   * @private
   */
  function nextPreview() {
    return expression.charAt(index + 1);
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and token_type
   * @private
   */
  function getToken() {
    token_type = TOKENTYPE.NULL;
    token = '';

    // skip over whitespaces
    while (c == ' ' || c == '\t') {  // space or tab
      next();
    }

    // skip comment
    if (c == '#') {
      while (c != '\n' && c != '') {
        next();
      }
    }

    // check for end of expression
    if (c == '') {
      // token is still empty
      token_type = TOKENTYPE.DELIMITER;
      return;
    }

    // check for delimiters consisting of 2 characters
    var c2 = c + nextPreview();
    if (DELIMITERS[c2]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c2;
      next();
      next();
      return;
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for a number
    if (isDigitDot(c)) {
      token_type = TOKENTYPE.NUMBER;

      // get number, can have a single dot
      if (c == '.') {
        token += c;
        next();

        if (!isDigit(c)) {
          // this is no legal number, it is just a dot
          token_type = TOKENTYPE.UNKNOWN;
        }
      }
      else {
        while (isDigit(c)) {
          token += c;
          next();
        }
        if (c == '.') {
          token += c;
          next();
        }
      }
      while (isDigit(c)) {
        token += c;
        next();
      }

      // check for scientific notation like "2.3e-4" or "1.23e50"
      if (c == 'E' || c == 'e') {
        token += c;
        next();

        if (c == '+' || c == '-') {
          token += c;
          next();
        }

        // Scientific notation MUST be followed by an exponent
        if (!isDigit(c)) {
          // this is no legal number, exponent is missing.
          token_type = TOKENTYPE.UNKNOWN;
        }

        while (isDigit(c)) {
          token += c;
          next();
        }
      }

      return;
    }

    // check for variables, functions, named operators
    if (isAlpha(c)) {
      while (isAlpha(c) || isDigit(c)) {
        token += c;
        next();
      }

      if (NAMED_DELIMITERS[token]) {
        token_type = TOKENTYPE.DELIMITER;
      }
      else {
        token_type = TOKENTYPE.SYMBOL;
      }

      return;
    }

    // something unknown is found, wrong characters -> a syntax error
    token_type = TOKENTYPE.UNKNOWN;
    while (c != '') {
      token += c;
      next();
    }
    throw createSyntaxError('Syntax error in part "' + token + '"');
  }

  /**
   * Check if a given name is valid
   * if not, an error is thrown
   * @param {String} name
   * @return {boolean} valid
   * @private
   */
    // TODO: check for valid symbol name
  function isValidSymbolName (name) {
    for (var i = 0, iMax = name.length; i < iMax; i++) {
      var c = name.charAt(i);
      //var valid = (isAlpha(c) || (i > 0 && isDigit(c))); // TODO: allow digits in symbol name
      var valid = (isAlpha(c));
      if (!valid) {
        return false;
      }
    }

    return true;
  }

  /**
   * checks if the given char c is a letter (upper or lower case)
   * or underscore
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isAlpha (c) {
    return ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_');
  }

  /**
   * checks if the given char c is a digit or dot
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isDigitDot (c) {
    return ((c >= '0' && c <= '9') ||
        c == '.');
  }

  /**
   * checks if the given char c is a digit
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isDigit (c) {
    return ((c >= '0' && c <= '9'));
  }

  /**
   * Start of the parse levels below, in order of precedence
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseStart (scope) {
    // get the first character in expression
    first();

    getToken();

    var node;
    if (token == '') {
      // empty expression
      node = new ConstantNode(undefined);
    }
    else {
      node = parseBlock(scope);
    }

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (token != '') {
      if (token_type == TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
        throw createError('Unknown operator ' + token);
      }
      else {
        throw createSyntaxError('Unexpected part "' + token + '"');
      }
    }

    return node;
  }

  /**
   * Parse a block with expressions. Expressions can be separated by a newline
   * character '\n', or by a semicolon ';'. In case of a semicolon, no output
   * of the preceding line is returned.
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseBlock (scope) {
    var node, block, visible;

    if (token != '\n' && token != ';' && token != '') {
      node = parseAns(scope);
    }

    while (token == '\n' || token == ';') {
      if (!block) {
        // initialize the block
        block = new BlockNode();
        if (node) {
          visible = (token != ';');
          block.add(node, visible);
        }
      }

      getToken();
      if (token != '\n' && token != ';' && token != '') {
        node = parseAns(scope);

        visible = (token != ';');
        block.add(node, visible);
      }
    }

    if (block) {
      return block;
    }

    if (!node) {
      node = parseAns(scope);
    }

    return node;
  }

  /**
   * Parse assignment of ans.
   * Ans is assigned when the expression itself is no variable or function
   * assignment
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAns (scope) {
    var expression = parseFunctionAssignment(scope);

    // create a variable definition for ans
    var name = 'ans';
    return new AssignmentNode(name, expression, scope);
  }

  /**
   * Parse a function assignment like "function f(a,b) = a*b"
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseFunctionAssignment (scope) {
    // TODO: keyword 'function' must become a reserved keyword
    // TODO: replace the 'function' keyword with an assignment operator '=>'
    if (token_type == TOKENTYPE.SYMBOL && token == 'function') {
      // get function name
      getToken();
      if (token_type != TOKENTYPE.SYMBOL) {
        throw createSyntaxError('Function name expected');
      }
      var name = token;

      // get parenthesis open
      getToken();
      if (token != '(') {
        throw createSyntaxError('Opening parenthesis ( expected');
      }

      // get function variables
      var functionScope = scope.createSubScope();
      var variables = [];
      while (true) {
        getToken();
        if (token_type == TOKENTYPE.SYMBOL) {
          // store variable name
          variables.push(token);
        }
        else {
          throw createSyntaxError('Variable name expected');
        }

        getToken();
        if (token == ',') {
          // ok, nothing to do, read next variable
        }
        else if (token == ')') {
          // end of variable list encountered. break loop
          break;
        }
        else {
          throw createSyntaxError('Comma , or closing parenthesis ) expected"');
        }
      }

      getToken();
      if (token != '=') {
        throw createSyntaxError('Equal sign = expected');
      }

      // parse the expression, with the correct function scope
      getToken();
      var expression = parseAssignment(functionScope);

      return new FunctionNode(name, variables, expression, functionScope, scope);
    }

    return parseAssignment(scope);
  }

  /**
   * Assignment of a variable, can be a variable like "a=2.3" or a updating an
   * existing variable like "matrix(2,3:5)=[6,7,8]"
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAssignment (scope) {
    var name, params, paramScopes, expr;

    var node = parseRange(scope);

    if (token == '=') {
      if (node instanceof SymbolNode) {
        // parse the expression, with the correct function scope
        getToken();
        name = node.name;
        params = null;
        expr = parseAssignment(scope);
        return new AssignmentNode(name, expr, scope);
      }
      else if ((node instanceof ParamsNode) && (node.object instanceof SymbolNode)) {
        // parse the expression, with the correct function scope
        getToken();
        name = node.object.name;
        params = node.params;
        paramScopes = node.paramScopes;
        expr = parseAssignment(scope);
        return new UpdateNode(math, name, params, paramScopes, expr, scope);
      }
      else {
        throw createSyntaxError('Symbol expected at the left hand side ' +
            'of assignment operator =');
      }
    }

    return node;
  }

  /**
   * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseRange (scope) {
    var node, params = [];

    if (token == ':') {
      // implicit start=1 (one-based)
      node = new ConstantNode(1);
    }
    else {
      // explicit start
      node = parseConditions(scope);
    }

    if (token == ':') {
      params.push(node);

      // parse step and end
      while (token == ':') {
        getToken();
        if (token == ')' || token == ',' || token == '') {
          // implicit end
          params.push(new SymbolNode('end', scope));
        }
        else {
          // explicit end
          params.push(parseConditions(scope));
        }
      }

      if (params.length) {
        node = new RangeNode(math, params);
      }
    }

    return node;
  }

  /**
   * conditions like and, or, in
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseConditions (scope) {
    var node, operators, name, fn, params;

    node = parseBitwiseConditions(scope);

    // TODO: precedence of And above Or?
    // TODO: implement a method for unit to number conversion
    operators = {
      'in' : math['in']
      /* TODO: implement conditions
       'and' : 'and',
       '&&' : 'and',
       'or': 'or',
       '||': 'or',
       'xor': 'xor'
       */
    };

    while (operators[token] !== undefined) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseBitwiseConditions(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * conditional operators and bitshift
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseBitwiseConditions (scope) {
    var node = parseComparison(scope);

    /* TODO: implement bitwise conditions
     var operators = {
     '&' : bitwiseand,
     '|' : bitwiseor,
     // todo: bitwise xor?
     '<<': bitshiftleft,
     '>>': bitshiftright
     };
     while (operators[token] !== undefined) {
     var name = token;
     var fn = operators[name];

     getToken();
     var params = [node, parseComparison()];
     node = new OperatorNode(name, fn, params);
     }
     */

    return node;
  }

  /**
   * comparison operators
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseComparison (scope) {
    var node, operators, name, fn, params;

    node = parseAddSubtract(scope);

    operators = {
      '==': math.equal,
      '!=': math.unequal,
      '<': math.smaller,
      '>': math.larger,
      '<=': math.smallereq,
      '>=': math.largereq
    };
    while (operators[token] !== undefined) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseAddSubtract(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * add or subtract
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAddSubtract (scope)  {
    var node, operators, name, fn, params;

    node = parseMultiplyDivide(scope);

    operators = {
      '+': math.add,
      '-': math.subtract
    };
    while (operators[token] !== undefined) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseMultiplyDivide(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * multiply, divide, modulus
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide (scope) {
    var node, operators, name, fn, params;

    node = parseUnary(scope);

    operators = {
      '*': math.multiply,
      '.*': math.emultiply,
      '/': math.divide,
      './': math.edivide,
      '%': math.mod,
      'mod': math.mod
    };

    while (operators[token] !== undefined) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseUnary(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Unary minus
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseUnary (scope) {
    var name, fn, params;

    if (token == '-') {
      name = token;
      fn = math.unary;
      getToken();
      params = [parseUnary(scope)];

      return new OperatorNode(name, fn, params);
    }

    return parsePow(scope);
  }

  /**
   * power
   * Node: power operator is right associative
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parsePow (scope) {
    var node, leftNode, nodes, ops, name, fn, params;

    nodes = [
      parseFactorial(scope)
    ];
    ops = [];

    // stack all operands of a chained power operator (like '2^3^3')
    while (token == '^' || token == '.^') {
      ops.push(token);
      getToken();
      nodes.push(parseFactorial(scope));
    }

    // evaluate the operands from right to left (right associative)
    node = nodes.pop();
    while (nodes.length) {
      leftNode = nodes.pop();
      name = ops.pop();
      fn = (name == '^') ? math.pow : math.epow;
      params = [leftNode, node];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Factorial
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseFactorial (scope)  {
    var node, name, fn, params;

    node = parseTranspose(scope);

    while (token == '!') {
      name = token;
      fn = math.factorial;
      getToken();
      params = [node];

      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Transpose
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseTranspose (scope)  {
    var node, name, fn, params;

    node = parseNodeHandler(scope);

    while (token == '\'') {
      name = token;
      fn = math.transpose;
      getToken();
      params = [node];

      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Parse a custom node handler. A node handler can be used to process
   * nodes in a custom way, for example for handling a plot.
   *
   * A handler must be defined in the namespace math.expression.node.handlers,
   * and must extend math.expression.node.Node, and the handler must contain
   * functions eval(), find(filter), and toString().
   *
   * For example:
   *
   *     math.expression.node.handlers['plot'] = PlotHandler;
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params, paramScopes);
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)');
   *
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseNodeHandler (scope) {
    var params,
        paramScopes,
        paramScope,
        handler;

    if (token_type == TOKENTYPE.SYMBOL && handlers[token]) {
      handler = handlers[token];

      getToken();

      // parse parameters
      if (token == '(') {
        params = [];
        paramScopes = [];

        getToken();

        if (token != ')') {
          paramScope = scope.createSubScope();
          paramScopes.push(paramScope);
          params.push(parseRange(paramScope));

          // parse a list with parameters
          while (token == ',') {
            getToken();

            paramScope = scope.createSubScope();
            paramScopes.push(paramScope);
            params.push(parseRange(paramScope));
          }
        }

        if (token != ')') {
          throw createSyntaxError('Parenthesis ) expected');
        }
        getToken();
      }

      // create a new node handler
      //noinspection JSValidateTypes
      return new handler(params, paramScopes);
    }

    return parseSymbol(scope);
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseSymbol (scope) {
    var node, name;

    if (token_type == TOKENTYPE.SYMBOL) {
      name = token;

      getToken();

      // create a symbol
      node = new SymbolNode(name, scope);

      // parse parameters
      return parseParams(scope, node);
    }

    return parseString(scope);
  }

  /**
   * parse parameters, enclosed in parenthesis
   * @param {Scope} scope
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @return {Node} node
   * @private
   */
  function parseParams (scope, node) {
    var bracket,
        params,
        paramScopes,
        paramScope;

    while (token == '(') {
      bracket = token;
      params = [];
      paramScopes = [];

      getToken();

      if (token != ')') {
        paramScope = scope.createSubScope();
        paramScopes.push(paramScope);
        params.push(parseRange(paramScope));

        // parse a list with parameters
        while (token == ',') {
          getToken();

          paramScope = scope.createSubScope();
          paramScopes.push(paramScope);
          params.push(parseRange(paramScope));
        }
      }

      if ((bracket == '(' && token != ')')) {
        throw createSyntaxError('Parenthesis ) expected');
      }
      getToken();

      node = new ParamsNode(math, node, params, paramScopes);
    }

    return node;
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseString (scope) {
    var node, str, tPrev;

    if (token == '"') {
      // string "..."
      str = '';
      tPrev = '';
      while (c != '' && (c != '\"' || tPrev == '\\')) { // also handle escape character
        str += c;
        tPrev = c;
        next();
      }

      getToken();
      if (token != '"') {
        throw createSyntaxError('End of string " expected');
      }
      getToken();

      // create constant
      node = new ConstantNode(str);

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseMatrix(scope);
  }

  /**
   * parse the matrix
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseMatrix (scope) {
    var array, params, rows, cols;

    if (token == '[') {
      // matrix [...]

      // skip newlines
      getToken();
      while (token == '\n') {
        getToken();
      }

      if (token != ']') {
        // this is a non-empty matrix
        var row = parseRow(scope);

        if (token == ';') {
          // 2 dimensional array
          rows = 1;
          params = [row];

          // the rows of the matrix are separated by dot-comma's
          while (token == ';') {
            getToken();

            // skip newlines
            while (token == '\n') {
              getToken();
            }

            params[rows] = parseRow(scope);
            rows++;

            // skip newlines
            while (token == '\n') {
              getToken();
            }
          }

          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          getToken();

          // check if the number of columns matches in all rows
          cols = (params.length > 0) ? params[0].length : 0;
          for (var r = 1; r < rows; r++) {
            if (params[r].length != cols) {
              throw createError('Number of columns must match ' +
                  '(' + params[r].length + ' != ' + cols + ')');
            }
          }

          array = new ArrayNode(math, params);
        }
        else {
          // 1 dimensional vector
          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          getToken();

          array = row;
        }
      }
      else {
        // this is an empty matrix "[ ]"
        getToken();
        array = new ArrayNode(math, []);
      }

      // parse parameters
      array = parseParams(scope, array);

      return array;
    }

    return parseNumber(scope);
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @param {Scope} scope
   * @return {ArrayNode} node
   */
  function parseRow (scope) {
    var params = [parseAssignment(scope)];
    var len = 1;

    while (token == ',') {
      getToken();

      // skip newlines
      while (token == '\n') {
        getToken();
      }

      // parse expression
      params[len] = parseAssignment(scope);
      len++;

      // skip newlines
      while (token == '\n') {
        getToken();
      }
    }

    return new ArrayNode(math, params);
  }

  /**
   * parse a number
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseNumber (scope) {
    var node, value, number;

    if (token_type == TOKENTYPE.NUMBER) {
      // this is a number
      if (token == '.') {
        number = 0;
      } else {
        number = Number(token);
      }
      getToken();

      /* TODO: implicit multiplication?
       // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
       // check for implicit multiplication
       if (token_type == TOKENTYPE.VARIABLE) {
       node = multiply(node, parsePow());
       }
       //*/

      if (token_type == TOKENTYPE.SYMBOL) {
        if (token == 'i' || token == 'I') {
          value = new Complex(0, number);
          getToken();
          return new ConstantNode(value);
        }

        if (Unit.isPlainUnit(token)) {
          value = new Unit(number, token);
          getToken();
          return new ConstantNode(value);
        }

        throw createTypeError('Unknown unit "' + token + '"');
      }

      // just a regular number
      node = new ConstantNode(number);

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseParentheses(scope);
  }

  /**
   * parentheses
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseParentheses (scope) {
    var node;

    // check if it is a parenthesized expression
    if (token == '(') {
      // parentheses (...)
      getToken();
      node = parseAssignment(scope); // start again

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      getToken();

      /* TODO: implicit multiplication?
       // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
       // check for implicit multiplication
       if (token_type == TOKENTYPE.VARIABLE) {
       node = multiply(node, parsePow());
       }
       //*/

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseEnd(scope);
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @param {Scope} scope
   * @return {Node} res
   * @private
   */
  function parseEnd (scope) {
    if (token == '') {
      // syntax error or unexpected end of expression
      throw createSyntaxError('Unexpected end of expression');
    } else {
      throw createSyntaxError('Value expected');
    }
  }

  /**
   * Shortcut for getting the current row value (one based)
   * Returns the line of the currently handled expression
   * @private
   */
  function row () {
    // TODO: also register row number during parsing
    return undefined;
  }

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1;
  }

  /**
   * Build up an error message
   * @param {String} message
   * @return {String} message with row and column information
   * @private
   */
  function createErrorMessage (message) {
    var r = row();
    var c = col();
    if (r === undefined) {
      if (c === undefined) {
        return message;
      } else {
        return message + ' (char ' + c + ')';
      }
    } else {
      return message + ' (line ' + r + ', char ' + c + ')';
    }
  }

  /**
   * Create an error
   * @param {String} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    return new SyntaxError(createErrorMessage(message));
  }

  /**
   * Create an error
   * @param {String} message
   * @return {TypeError} instantiated error
   * @private
   */
  function createTypeError(message) {
    return new TypeError(createErrorMessage(message));
  }

  /**
   * Create an error
   * @param {String} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (message) {
    return new Error(createErrorMessage(message));
  }
};

},{"../../expression/node/ArrayNode":102,"../../expression/node/AssignmentNode":103,"../../expression/node/BlockNode":104,"../../expression/node/ConstantNode":105,"../../expression/node/FunctionNode":106,"../../expression/node/OperatorNode":108,"../../expression/node/ParamsNode":109,"../../expression/node/RangeNode":110,"../../expression/node/SymbolNode":111,"../../expression/node/UpdateNode":112,"../../expression/node/handlers":113,"../../type/collection":203,"../../util/index":207,"./../../expression/Scope":5,"./../../type/Complex":197,"./../../type/Matrix":200,"./../../type/Unit":202}],161:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      object = util.object,
      array = util.array,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Concatenate two or more matrices
   * Usage:
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where the optional dim is the zero-based number of the dimension to be
   * concatenated.
   *
   * @param {... Array | Matrix} args
   * @return {Array | Matrix} res
   */
  math.concat = function concat (args) {
    var i,
        len = arguments.length,
        dim = -1,  // zero-based dimension
        prevDim,
        asMatrix = false,
        matrices = [];  // contains multi dimensional arrays

    for (i = 0; i < len; i++) {
      var arg = arguments[i];

      // test whether we need to return a Matrix (if not we return an Array)
      if (arg instanceof Matrix) {
        asMatrix = true;
      }

      if ((i == len - 1) && isNumber(arg)) {
        // last argument contains the dimension on which to concatenate
        prevDim = dim;
        dim = arg;

        if (!isInteger(dim) || dim < 0) {
          throw new TypeError('Dimension number must be a positive integer ' +
              '(dim = ' + dim + ')');
        }

        if (i > 0 && dim > prevDim) {
          throw new RangeError('Dimension out of range ' +
              '(' + dim + ' > ' + prevDim + ')');
        }
      }
      else if (isCollection(arg)) {
        // this is a matrix or array
        var matrix = object.clone(arg).valueOf();
        var size = array.size(arg.valueOf());
        matrices[i] = matrix;
        prevDim = dim;
        dim = size.length - 1;

        // verify whether each of the matrices has the same number of dimensions
        if (i > 0 && dim != prevDim) {
          throw new RangeError('Dimension mismatch ' +
              '(' + prevDim + ' != ' + dim + ')');
        }
      }
      else {
        throw new util.error.UnsupportedTypeError('concat', arg);
      }
    }

    if (matrices.length == 0) {
      throw new SyntaxError('At least one matrix expected');
    }

    var res = matrices.shift();
    while (matrices.length) {
      res = _concat(res, matrices.shift(), dim, 0);
    }

    return asMatrix ? new Matrix(res) : res;
  };

  /**
   * Recursively concatenate two matrices.
   * The contents of the matrices is not cloned.
   * @param {Array} a             Multi dimensional array
   * @param {Array} b             Multi dimensional array
   * @param {Number} concatDim    The dimension on which to concatenate (zero-based)
   * @param {Number} dim          The current dim (zero-based)
   * @return {Array} c            The concatenated matrix
   * @private
   */
  function _concat(a, b, concatDim, dim) {
    if (dim < concatDim) {
      // recurse into next dimension
      if (a.length != b.length) {
        throw new Error('Dimensions mismatch (' + a.length + ' != ' + b.length + ')');
      }

      var c = [];
      for (var i = 0; i < a.length; i++) {
        c[i] = _concat(a[i], b[i], concatDim, dim + 1);
      }
      return c;
    }
    else {
      // concatenate this dimension
      return a.concat(b);
    }
  }
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],162:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      array = util.array,
      string = util.string;

  /**
   * @constructor det
   * Calculate the determinant of a matrix
   *
   *     det(x)
   *
   * @param {Array | Matrix} x
   * @return {Number} determinant
   */
  math.det = function det (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('det', arguments.length, 1);
    }

    var size = array.size(x.valueOf());
    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);
        break;

      case 1:
        // vector
        if (size[0] == 1) {
          return object.clone(x.valueOf()[0]);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows == cols) {
          return _det(x.valueOf(), rows, cols);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + string.format(size) + ')');
    }
  };

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {Number} rows     Number of rows of the matrix (zero-based)
   * @param {Number} cols     Number of columns of the matrix (zero-based)
   * @returns {Number} det
   * @private
   */
  function _det (matrix, rows, cols) {
    if (rows == 1) {
      // this is a 1 x 1 matrix
      return matrix[0][0];
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return math.subtract(
          math.multiply(matrix[0][0], matrix[1][1]),
          math.multiply(matrix[1][0], matrix[0][1])
      );
    }
    else {
      // this is an n x n matrix
      var d = 1;
      var lead = 0;
      for (var r = 0; r < rows; r++) {
        if (lead >= cols) {
          break;
        }
        var i = r;
        // Find the pivot element.
        while (matrix[i][lead] == 0) {
          i++;
          if (i == rows) {
            i = r;
            lead++;
            if (lead == cols) {
              // We found the last pivot.
              if (object.deepEqual(matrix, eye(rows).valueOf())) {
                return math.round(d, 6);
              } else {
                return 0;
              }
            }
          }
        }
        if (i != r) {
          // Swap rows i and r, which negates the determinant.
          for (var a = 0; a < cols; a++) {
            var temp = matrix[i][a];
            matrix[i][a] = matrix[r][a];
            matrix[r][a] = temp;
          }
          d *= -1;
        }
        // Scale row r and the determinant simultaneously.
        var div = matrix[r][lead];
        for (var a = 0; a < cols; a++) {
          matrix[r][a] = matrix[r][a] / div;
        }
        d *= div;
        // Back-substitute upwards.
        for (var j = 0; j < rows; j++) {
          if (j != r) {
            // Taking linear combinations does not change the det.
            var c = matrix[j][lead];
            for (var a = 0; a < cols; a++) {
              matrix[j][a] = matrix[j][a] - matrix[r][a] * c;
            }
          }
        }
        lead++; // Now looking for a pivot further right.
      }
      // If reduction did not result in the identity, the matrix is singular.
      if (object.deepEqual(matrix, math.eye(rows).valueOf())) {
        return math.round(d, 6);
      } else {
        return 0;
      }
    }
  }
};

},{"../../type/Matrix":200,"../../util/index":207}],163:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      object = util.object,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix
   *
   *     diag(v)
   *     diag(v, k)
   *     diag(X)
   *     diag(X, k)
   *
   * TODO: more documentation on diag
   *
   * @param {Number | Matrix | Array} x
   * @param {Number} [k]
   * @return {Matrix | Array} matrix
   */
  math.diag = function diag (x, k) {
    var data, vector, i, iMax;

    if (arguments.length != 1 && arguments.length != 2) {
      throw new util.error.ArgumentsError('diag', arguments.length, 1, 2);
    }

    if (k) {
      if (!isNumber(k) || !isInteger(k)) {
        throw new TypeError ('Second parameter in function diag must be an integer');
      }
    }
    else {
      k = 0;
    }
    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    // convert to matrix
    if (!(x instanceof Matrix)) {
      x = new Matrix(x);
    }
    // TODO: simplify this, more strict in accepting only a vector with size [n]

    // get as array when the matrix is a vector
    var s;
    if (x.isVector()) {
      x = x.toVector();
      s = [x.length];
    }
    else {
      s = x.size();
    }

    switch (s.length) {
      case 1:
        // x is a vector. create diagonal matrix
        vector = x.valueOf();
        var matrix = new Matrix();
        matrix.resize([vector.length + kSub, vector.length + kSuper]);
        data = matrix.valueOf();
        iMax = vector.length;
        for (i = 0; i < iMax; i++) {
          data[i + kSub][i + kSuper] = object.clone(vector[i]);
        }
        return (math.options.matrix.defaultType === 'array') ? matrix.valueOf() : matrix;
        break;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        data = x.valueOf();
        iMax = Math.min(s[0] - kSub, s[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = object.clone(data[i + kSub][i + kSuper]);
        }
        return (math.options.matrix.defaultType === 'array') ? vector : new Matrix(vector);
        break;

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  };
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],164:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isArray = Array.isArray;

  /**
   * Create an identity matrix with size m x n
   *
   *     eye(m)
   *     eye(m, n)
   *
   * TODO: more documentation on eye
   *
   * @param {...Number | Matrix | Array} size
   * @return {Matrix | Array} matrix
   */
  math.eye = function eye (size) {
    var args = collection.argsToArray(arguments);
    if (args.length == 0) {
      args = [1, 1];
    }
    else if (args.length == 1) {
      args[1] = args[0];
    }
    else if (args.length > 2) {
      throw new util.error.ArgumentsError('eye', args.length, 0, 2);
    }

    var rows = args[0],
        cols = args[1];

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
      if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
        throw new Error('Parameters in function eye must be positive integers');
      }
    }

    // create and args the matrix
    var matrix = new Matrix();
    matrix.resize(args);

    // fill in ones on the diagonal
    var minimum = math.min(args);
    var data = matrix.valueOf();
    for (var d = 0; d < minimum; d++) {
      data[d][d] = 1;
    }

    var asMatrix = (size instanceof Matrix) ? true :
        (isArray(size) ? false : (math.options.matrix.defaultType === 'matrix'));

    return asMatrix ? matrix : matrix.valueOf();
  };
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],165:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      string = util.string;

  /**
   * Calculate the inverse of a matrix
   *
   *     inv(x)
   *
   * TODO: more documentation on inv
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} inv
   */
  math.inv = function inv (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('inv', arguments.length, 1);
    }
    var size = math.size(x).valueOf();
    switch (size.length) {
      case 0:
        // scalar
        return math.divide(1, x);
        break;

      case 1:
        // vector
        if (size[0] == 1) {
          if (x instanceof Matrix) {
            return new Matrix([
              math.divide(1, x.valueOf()[0])
            ]);
          }
          else {
            return [
              math.divide(1, x[0])
            ];
          }
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows == cols) {
          if (x instanceof Matrix) {
            return new Matrix(
                _inv(x.valueOf(), rows, cols)
            );
          }
          else {
            // return an Array
            return _inv(x, rows, cols);
          }
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + string.format(size) + ')');
    }
  };

  /**
   * Calculate the inverse of a square matrix
   * @param {Array[]} matrix  A square matrix
   * @param {Number} rows     Number of rows
   * @param {Number} cols     Number of columns, must equal rows
   * @return {Array[]} inv    Inverse matrix
   * @private
   */
  function _inv (matrix, rows, cols){
    var r, s, f, value, temp;

    if (rows == 1) {
      // this is a 1 x 1 matrix
      value = matrix[0][0];
      if (value == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [[
        math.divide(1, value)
      ]];
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      var d = math.det(matrix);
      if (d == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [
        [
          math.divide(matrix[1][1], d),
          math.divide(math.unary(matrix[0][1]), d)
        ],
        [
          math.divide(math.unary(matrix[1][0]), d),
          math.divide(matrix[0][0], d)
        ]
      ];
    }
    else {
      // this is a matrix of 3 x 3 or larger
      // calculate inverse using gauss-jordan elimination
      //      http://en.wikipedia.org/wiki/Gaussian_elimination
      //      http://mathworld.wolfram.com/MatrixInverse.html
      //      http://math.uww.edu/~mcfarlat/inverse.htm

      // make a copy of the matrix (only the arrays, not of the elements)
      var A = matrix.concat();
      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      }

      // create an identity matrix which in the end will contain the
      // matrix inverse
      var B = math.eye(rows).valueOf();

      // loop over all columns, and perform row reductions
      for (var c = 0; c < cols; c++) {
        // element Acc should be non zero. if not, swap content
        // with one of the lower rows
        r = c;
        while (r < rows && A[r][c] == 0) {
          r++;
        }
        if (r == rows || A[r][c] == 0) {
          throw Error('Cannot calculate inverse, determinant is zero');
        }
        if (r != c) {
          temp = A[c]; A[c] = A[r]; A[r] = temp;
          temp = B[c]; B[c] = B[r]; B[r] = temp;
        }

        // eliminate non-zero values on the other rows at column c
        var Ac = A[c],
            Bc = B[c];
        for (r = 0; r < rows; r++) {
          var Ar = A[r],
              Br = B[r];
          if(r != c) {
            // eliminate value at column c and row r
            if (Ar[c] != 0) {
              f = math.divide(math.unary(Ar[c]), Ac[c]);

              // add (f * row c) to row r to eliminate the value
              // at column c
              for (s = c; s < cols; s++) {
                Ar[s] = math.add(Ar[s], math.multiply(f, Ac[s]));
              }
              for (s = 0; s < cols; s++) {
                Br[s] = math.add(Br[s],  math.multiply(f, Bc[s]));
              }
            }
          }
          else {
            // normalize value at Acc to 1,
            // divide each value on row r with the value at Acc
            f = Ac[c];
            for (s = c; s < cols; s++) {
              Ar[s] = math.divide(Ar[s], f);
            }
            for (s = 0; s < cols; s++) {
              Br[s] = math.divide(Br[s], f);
            }
          }
        }
      }
      return B;
    }
  }
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],166:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,

      isArray = Array.isArray;

  /**
   * Create a matrix filled with ones
   *
   *     ones(n)
   *     ones(m, n)
   *     ones([m, n])
   *     ones([m, n, p, ...])
   *
   * @param {...Number | Array} size
   * @return {Array | Matrix | Number} matrix
   */
  math.ones = function ones (size) {
    var args = collection.argsToArray(arguments);
    var asMatrix = (size instanceof Matrix) ? true :
        (isArray(size) ? false : (math.options.matrix.defaultType === 'matrix'));

    if (args.length == 0) {
      // output a scalar
      return 1;
    }
    else {
      // output an array or matrix
      var res = [];
      var defaultValue = 1;
      array.resize(res, args, defaultValue);
      return asMatrix ? new Matrix(res) : res;
    }
  };
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],167:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isString = util.string.isString,
      isNumber = util.number.isNumber;

  /**
   * Create an array from a range.
   *
   * The method accepts the following arguments
   *     range(str)                   Create a range from a string, where the
   *                                  string contains the start, optional step,
   *                                  and end, separated by a colon.
   *     range(start, end)            Create a range with start and end and a
   *                                  default step size of 1
   *     range(start, end, step)      Create a range with start, step, and end.
   *
   * Example usage:
   *     math.range(2, 6);        // [2,3,4,5]
   *     math.range(2, -3, -1);   // [2,1,0,-1,-2]
   *     math.range('2:1:6');     // [2,3,4,5]
   *
   * @param {...*} args
   * @return {Array | Matrix} range
   */
  math.range = function range(args) {
    var start, end, step;

    switch (arguments.length) {
      case 1:
        // parse string into a range
        if (isString(args)) {
          var r = _parse(args);
          if (!r){
            throw new SyntaxError('String "' + r + '" is no valid range');
          }

          start = r.start;
          end = r.end;
          step = r.step;
        }
        else {
          throw new TypeError(
              'Two or three numbers or a single string expected in function range');
        }
        break;

      case 2:
        // range(start, end)
        start = arguments[0];
        end = arguments[1];
        step = 1;
        break;

      case 3:
        // range(start, end, step)
        start = arguments[0];
        end = arguments[1];
        step = arguments[2];
        break;

      default:
        throw new util.error.ArgumentsError('range', arguments.length, 2, 3);
    }

    if (!isNumber(start)) {
      throw new TypeError('Parameter start must be a number');
    }
    if (!isNumber(end)) {
      throw new TypeError('Parameter end must be a number');
    }
    if (!isNumber(step)) {
      throw new TypeError('Parameter step must be a number');
    }

    var array = [],
        x = start;
    if (step > 0) {
      while (x < end) {
        array.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        array.push(x);
        x += step;
      }
    }

    return (math.options.matrix.defaultType === 'array') ? array : new Matrix(array);
  };

  /**
   * Parse a string into a range,
   * The string contains the start, optional step, and end, separated by a colon.
   * If the string does not contain a valid range, null is returned.
   * For example str='0:2:11'.
   * @param {String} str
   * @return {Object | null} range Object containing properties start, end, step
   * @private
   */
  function _parse (str) {
    var args = str.split(':');
    var nums = args.map(function (arg) {
      return Number(arg);
    });

    var invalid = nums.some(function (num) {
      return isNaN(num);
    });
    if(invalid) {
      return null;
    }

    switch (nums.length) {
      case 2:
        return {
          start: nums[0],
          end: nums[1],
          step: 1
        };

      case 3:
        return {
          start: nums[0],
          end: nums[2],
          step: nums[1]
        };

      default:
        return null;
    }
  }

};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],168:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      Matrix = require('../../type/Matrix'),

      array = util.array,
      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit;

  /**
   * Calculate the size of a matrix or scalar
   *
   *     size(x)
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.size = function size (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('size', arguments.length, 1);
    }

    if (isNumber(x) || isComplex(x) || isUnit(x) || isBoolean(x) || x == null) {
      return [];
    }

    if (isString(x)) {
      return [x.length];
    }

    if (Array.isArray(x)) {
      return array.size(x);
    }

    if (x instanceof Matrix) {
      return new Matrix(x.size());
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return size(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('size', x);
  };
};

},{"../../type/Complex":197,"../../type/Matrix":200,"../../type/Unit":202,"../../util/index":207}],169:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      array = util.array,
      isArray = Array.isArray;

  /**
   * Remove singleton dimensions from a matrix
   *
   *     squeeze(x)
   *
   * @param {Matrix | Array} x
   * @return {Matrix | Array} res
   */
  math.squeeze = function squeeze (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('squeeze', arguments.length, 1);
    }

    if (isArray(x)) {
      return array.squeeze(object.clone(x));
    }
    else if (x instanceof Matrix) {
      return new Matrix(array.squeeze(x.toArray()));
    }
    else {
      // scalar
      return object.clone(x);
    }
  };
};

},{"../../type/Matrix":200,"../../util/index":207}],170:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      Index = require('../../type/Index'),

      array = util.array,
      isString = util.string.isString,
      isArray = Array.isArray;

  /**
   * Get or set a subset of a matrix or string
   *
   * Usage:
   *     var subset = math.subset(value, index)               // retrieve subset
   *     var value = math.subset(value, index, replacement)   // replace subset
   *
   * Where:
   *     {Array | Matrix | String} value  An array, matrix, or string
   *     {Index} index                    An index containing ranges for each
   *                                      dimension
   *     {*} replacement                  An array, matrix, or scalar
   *
   * @param args
   * @return res
   */
  math.subset = function subset (args) {
    switch (arguments.length) {
      case 2: // get subset
        return _getSubset(arguments[0], arguments[1]);

      case 3: // set subset
        return _setSubset(arguments[0], arguments[1], arguments[2]);

      default: // wrong number of arguments
        throw new util.error.ArgumentsError('subset', arguments.length, 2, 3);
    }
  };

  /**
   * Retrieve a subset of an value such as an Array, Matrix, or String
   * @param {Array | Matrix | String} value Object from which to get a subset
   * @param {Index} index                   An index containing ranges for each
   *                                        dimension
   * @returns {Array | Matrix | *} subset
   * @private
   */
  function _getSubset(value, index) {
    var m, subset;

    if (isArray(value)) {
      m = new Matrix(value);
      subset = m.subset(index);
      return subset.valueOf();
    }
    else if (value instanceof Matrix) {
      return value.subset(index);
    }
    else if (isString(value)) {
      return _getSubstring(value, index);
    }
    else {
      throw new util.error.UnsupportedTypeError('subset', value);
    }
  }

  /**
   * Retrieve a subset of a string
   * @param {String} str            String from which to get a substring
   * @param {Index} index           An index containing ranges for each dimension
   * @returns {string} substring
   * @private
   */
  function _getSubstring(str, index) {
    if (!(index instanceof Index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new RangeError('Dimension mismatch (' + index.size().length + ' != 1)');
    }

    var range = index.range(0);

    var substr = '';
    var strLen = str.length;
    range.forEach(function (v) {
      array.validateIndex(v, strLen);
      substr += str.charAt(v);
    });

    return substr;
  }

  /**
   * Replace a subset in an value such as an Array, Matrix, or String
   * @param {Array | Matrix | String} value Object to be replaced
   * @param {Index} index                   An index containing ranges for each
   *                                        dimension
   * @param {Array | Matrix | *} replacement
   * @returns {*} result
   * @private
   */
  function _setSubset(value, index, replacement) {
    var m;

    if (isArray(value)) {
      m = new Matrix(math.clone(value));
      m.subset(index, replacement);
      return m.valueOf();
    }
    else if (value instanceof Matrix) {
      return value.clone().subset(index, replacement);
    }
    else if (isString(value)) {
      return _setSubstring(value, index, replacement);
    }
    else {
      throw new util.error.UnsupportedTypeError('subset', value);
    }
  }

  /**
   * Replace a substring in a string
   * @param {String} str            String to be replaced
   * @param {Index} index           An index containing ranges for each dimension
   * @param {String} replacement    Replacement string
   * @returns {string} result
   * @private
   */
  function _setSubstring(str, index, replacement) {
    if (!(index instanceof Index)) {
      // TODO: better error message
      throw new TypeError('Index expected');
    }
    if (index.size().length != 1) {
      throw new RangeError('Dimension mismatch (' + index.size().length + ' != 1)');
    }

    var range = index.range(0);
    var len = range.size()[0];

    if (len != replacement.length) {
      throw new RangeError('Dimension mismatch ' +
          '(' + range.size()[0] + ' != ' + replacement.length + ')');
    }

    // copy the string into an array with characters
    var strLen = str.length;
    var chars = [];
    for (var i = 0; i < strLen; i++) {
      chars[i] = str.charAt(i);
    }

    range.forEach(function (v, i) {
      array.validateIndex(v);
      chars[v] = replacement.charAt(i);
    });

    // initialize undefined characters with a space
    if (chars.length > strLen) {
      for (i = strLen - 1, len = chars.length; i < len; i++) {
        if (!chars[i]) {
          chars[i] = ' ';
        }
      }
    }

    return chars.join('');
  }
};

},{"../../type/Index":199,"../../type/Matrix":200,"../../util/index":207}],171:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      object = util.object,
      string = util.string;

  /**
   * Create the transpose of a matrix
   *
   *     transpose(x)
   *
   * @param {Array | Matrix} x
   * @return {Array | Matrix} transpose
   */
  math.transpose = function transpose (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);
        break;

      case 1:
        // vector
        return object.clone(x);
        break;

      case 2:
        // two dimensional array
        var rows = size[1],
            cols = size[0],
            asMatrix = (x instanceof Matrix),
            data = x.valueOf(),
            transposed = [],
            transposedRow,
            clone = object.clone;

        if (rows === 0) {
          // whoops
          throw new RangeError('Cannot transpose a 2D matrix with no rows' +
              '(size: ' + string.format(size) + ')');
        }

        for (var r = 0; r < rows; r++) {
          transposedRow = transposed[r] = [];
          for (var c = 0; c < cols; c++) {
            transposedRow[c] = clone(data[c][r]);
          }
        }
        if (cols == 0) {
          transposed[0] = [];
        }

        return asMatrix ? new Matrix(transposed) : transposed;
        break;

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + string.format(size) + ')');
    }
  };
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],172:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,
      isArray = Array.isArray;

  /**
   * create a matrix filled with zeros
   *
   *     zeros(n)
   *     zeros(m, n)
   *     zeros([m, n])
   *     zeros([m, n, p, ...])
   *
   * @param {...Number | Array} size
   * @return {Array | Matrix | Number} matrix
   */
  math.zeros = function zeros (size) {
    var args = collection.argsToArray(arguments);
    var asMatrix = (size instanceof Matrix) ? true :
        (isArray(size) ? false : (math.options.matrix.defaultType === 'matrix'));

    if (args.length == 0) {
      // output a scalar
      return 0;
    }
    else {
      // output an array or matrix
      var res = [];
      var defaultValue = 0;
      array.resize(res, args, defaultValue);

      return asMatrix ? new Matrix(res) : res;
    }
  };
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],173:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Compute the factorial of a value
   *
   *     x!
   *     factorial(x)
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * @Param {Number | Array | Matrix} x
   * @return {Number | Array | Matrix} res
   */
  math.factorial = function factorial (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (!isInteger(x) || x < 0) {
        throw new TypeError('Positive integer value expected in function factorial');
      }

      var value = x,
          res = value;
      value--;
      while (value > 1) {
        res *= value;
        value--;
      }

      if (res == 0) {
        res = 1;        // 0! is per definition 1
      }

      return res;
    }

    if (isBoolean(x)) {
      return 1; // factorial(1) = 1, factorial(0) = 1
    }

    if (isCollection(x)) {
      return collection.deepMap(x, factorial);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return factorial(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('factorial', x);
  };
};

},{"../../type/collection":203,"../../util/index":207}],174:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection');

  /**
   * Return a random number between 0 and 1
   *
   *     random()
   *
   * @return {Number} res
   */

  // Each distribution is a function that takes no argument and when called returns
  // a number between 0 and 1.
  var distributions = {

    uniform: function() {
      return Math.random;
    },

    // Implementation of normal distribution using Box-Muller transform
    // ref : http://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
    // We take : mean = 0.5, standard deviation = 1/6
    // so that 99.7% values are in [0, 1].
    normal: function() {
      return function() {
        var u1, u2,
            picked = -1;
        // We reject values outside of the interval [0, 1]
        // TODO: check if it is ok to do that?
        while (picked < 0 || picked > 1) {
          u1 = Math.random();
          u2 = Math.random();
          picked = 1/6 * Math.pow(-2 * Math.log(u1), 0.5) * Math.cos(2 * Math.PI * u2) + 0.5;
        }
        return picked;
      }
    }
  };

  /**
   * Create a distribution object.
   * @param {String} name           Name of a distribution.
   *                                Choose from 'uniform', 'normal'.
   * @return {Object} distribution  A distribution object containing functions:
   *                                    random([size, min, max])
   *                                    randomInt([min, max])
   *                                    pickRandom(array)
   */
  math.distribution = function(name) {
    if (!distributions.hasOwnProperty(name))
      throw new Error('unknown distribution ' + name);

    var args = Array.prototype.slice.call(arguments, 1),
        distribution = distributions[name].apply(this, args);

    return (function(distribution) {

      // This is the public API for all distributions
      var randFunctions = {

        random: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3) {
            throw new util.error.ArgumentsError('random', arguments.length, 0, 3);

          // `random(max)` or `random(size)`
          } else if (arguments.length === 1) {
            if (Array.isArray(arg1))
              size = arg1;
            else
              max = arg1;
          // `random(min, max)` or `random(size, max)`
          } else if (arguments.length === 2) {
            if (Array.isArray(arg1))
              size = arg1;
            else {
              min = arg1;
              max = arg2;
            }
          // `random(size, min, max)`
          } else {
            size = arg1;
            min = arg2;
            max = arg3;
          }

          if (max === undefined) max = 1;
          if (min === undefined) min = 0;
          if (size !== undefined) {
            var res = _randomDataForMatrix(size, min, max, _random);
            return (math.options.matrix.defaultType === 'array') ? res : new Matrix(res);
          }
          else return _random(min, max);
        },

        randomInt: function(arg1, arg2, arg3) {
          var size, min, max;
          if (arguments.length > 3 || arguments.length < 1)
            throw new util.error.ArgumentsError('randomInt', arguments.length, 1, 3);

          // `randomInt(max)`
          else if (arguments.length === 1) max = arg1;
          // `randomInt(min, max)` or `randomInt(size, max)`
          else if (arguments.length === 2) {
            if (Object.prototype.toString.call(arg1) === '[object Array]')
              size = arg1;
            else {
              min = arg1;
              max = arg2;
            }
          // `randomInt(size, min, max)`
          } else {
            size = arg1;
            min = arg2;
            max = arg3;
          }

          if (min === undefined) min = 0;
          if (size !== undefined) {
            var res = _randomDataForMatrix(size, min, max, _randomInt);
            return (math.options.matrix.defaultType === 'array') ? res : new Matrix(res);
          }
          else return _randomInt(min, max);
        },

        pickRandom: function(possibles) {
          if (arguments.length !== 1) {
            throw new util.error.ArgumentsError('pickRandom', arguments.length, 1);
          }
          if (!Array.isArray(possibles)) {
            throw new util.error.UnsupportedTypeError('pickRandom', possibles);
          }

          // TODO: add support for matrices
          return possibles[Math.floor(Math.random() * possibles.length)];
        }

      };

      var _random = function(min, max) {
        return min + distribution() * (max - min);
      };

      var _randomInt = function(min, max) {
        return Math.floor(min + distribution() * (max - min));
      };

      // This is a function for generating a random matrix recursively.
      var _randomDataForMatrix = function(size, min, max, randFunc) {
        var data = [], length, i;
        size = size.slice(0);

        if (size.length > 1) {
          for (i = 0, length = size.shift(); i < length; i++)
            data.push(_randomDataForMatrix(size, min, max, randFunc));
        } else {
          for (i = 0, length = size.shift(); i < length; i++)
            data.push(randFunc(min, max));
        }

        return data;
      };

      return randFunctions;

    })(distribution);

  };

  // Default random functions use uniform distribution
  // TODO: put random functions in separate files?
  var uniformRandFunctions = math.distribution('uniform');
  math.random = uniformRandFunctions.random;
  math.randomInt = uniformRandFunctions.randomInt;
  math.pickRandom = uniformRandFunctions.pickRandom;
};

},{"../../type/Matrix":200,"../../type/collection":203,"../../util/index":207}],175:[function(require,module,exports){
module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the maximum value of a list of values
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     max(a, b, c, ...)
   *     max(A)
   *     max(A, dim)
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.max = function max(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function max requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // max([a, b, c, d, ...])
        return _max(args);
      }
      else if (arguments.length == 2) {
        // max([a, b, c, d, ...], dim)
        return collection.reduce(arguments[0], arguments[1], _getlarger);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // max(a, b, c, d, ...)
      return _max(arguments);
    }
  };

  function _getlarger(x, y){
	  if( math.larger(x,y) )
		  return x;
	  else
		  return y;
  }

  /**
   * Recursively calculate the maximum value in an n-dimensional array
   * @param {Array} array
   * @return {Number} max
   * @private
   */
  function _max(array) {
    var max = null;

    collection.deepForEach(array, function (value) {
      if (max === null || math.larger(value, max)) {
        max = value;
      }
    });

    if (max === null) {
      throw new Error('Cannot calculate max of an empty array');
    }

    return max;
  }
};

},{"../../type/Matrix":200,"../../type/collection":203}],176:[function(require,module,exports){
module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the mean value of a list of values
   * In case of a multi dimensional array, the mean of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     mean(a, b, c, ...)
   *     mean(A)
   *     mean(A, dim)
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.mean = function mean(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function mean requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // mean([a, b, c, d, ...])
        return _mean(args);
      }
      else if (arguments.length == 2) {
        // mean([a, b, c, d, ...], dim)
        return _nmean(arguments[0], arguments[1]);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // mean(a, b, c, d, ...)
      return _mean(arguments);
    }
  };

  /**
   * Calculate the mean value in an n-dimensional array, returning a
   * n-1 dimensional array
   * @param {Array} array
   * @param {Number} dim
   * @return {Number} mean
   * @private
   */
  function _nmean(array, dim){
	  var sum;
	  sum = collection.reduce(array, dim, math.add);
	  return math.divide(sum, size(array)[dim]);
  };

  /**
   * Recursively calculate the mean value in an n-dimensional array
   * @param {Array} array
   * @return {Number} mean
   * @private
   */
  function _mean(array) {
    var sum = 0;
    var num = 0;

    collection.deepForEach(array, function (value) {
      sum = math.add(sum, value);
      num++;
    });

    if (num === 0) {
      throw new Error('Cannot calculate mean of an empty array');
    }

    return math.divide(sum, num);
  }
};

},{"../../type/Matrix":200,"../../type/collection":203}],177:[function(require,module,exports){
module.exports = function (math) {
  var Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      isCollection = collection.isCollection;

  /**
   * Compute the minimum value of a list of values.
   * In case of a multi dimensional array, the minimum of the flattened array
   * will be calculated. When dim is provided, the maximum over the selected
   * dimension will be calculated.
   *
   *     min(a, b, c, ...)
   *     min(A)
   *     min(A, dim)
   *
   * @param {... *} args  A single matrix or multiple scalar values
   * @return {*} res
   */
  math.min = function min(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function min requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // min([a, b, c, d, ...])
        return _min(args);
      }
      else if (arguments.length == 2) {
        // min([a, b, c, d, ...], dim)
        return collection.reduce(arguments[0], arguments[1], _getsmaller);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // min(a, b, c, d, ...)
      return _min(arguments);
    }
  };

  function _getsmaller(x, y){
	  if( math.smaller(x,y) )
		  return x;
	  else
		  return y;
  }

  /**
   * Recursively calculate the minimum value in an n-dimensional array
   * @param {Array} array
   * @return {Number} min
   * @private
   */
  function _min(array) {
    var min = null;

    collection.deepForEach(array, function (value) {
      if (min === null || math.smaller(value, min)) {
        min = value;
      }
    });

    if (min === null) {
      throw new Error('Cannot calculate min of an empty array');
    }

    return min;
  }
};

},{"../../type/Matrix":200,"../../type/collection":203}],178:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse cosine of a value
   *
   *     acos(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseCosine.html
   */
  math.acos = function acos(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('acos', arguments.length, 1);
    }

    if (isNumBool(x)) {
      if (x >= -1 && x <= 1) {
        return Math.acos(x);
      }
      else {
        return acos(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
      var temp1 = new Complex(
          x.im * x.im - x.re * x.re + 1.0,
          -2.0 * x.re * x.im
      );
      var temp2 = math.sqrt(temp1);
      var temp3;
      if (temp2 instanceof Complex) {
        temp3 = new Complex(
            temp2.re - x.im,
            temp2.im + x.re
        )
      }
      else {
        temp3 = new Complex(
            temp2 - x.im,
            x.re
        )
      }
      var temp4 = math.log(temp3);

      // 0.5*pi = 1.5707963267948966192313216916398
      if (temp4 instanceof Complex) {
        return new Complex(
            1.57079632679489661923 - temp4.im,
            temp4.re
        );
      }
      else {
        return new Complex(
            1.57079632679489661923,
            temp4
        );
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acos);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return acos(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('acos', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],179:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse sine of a value
   *
   *     asin(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseSine.html
   */
  math.asin = function asin(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('asin', arguments.length, 1);
    }

    if (isNumBool(x)) {
      if (x >= -1 && x <= 1) {
        return Math.asin(x);
      }
      else {
        return asin(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      // asin(z) = -i*log(iz + sqrt(1-z^2))
      var re = x.re;
      var im = x.im;
      var temp1 = new Complex(
          im * im - re * re + 1.0,
          -2.0 * re * im
      );

      var temp2 = math.sqrt(temp1);
      var temp3;
      if (temp2 instanceof Complex) {
        temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );
      }
      else {
        temp3 = new Complex(
            temp2 - im,
            re
        );
      }

      var temp4 = math.log(temp3);

      if (temp4 instanceof Complex) {
        return new Complex(temp4.im, -temp4.re);
      }
      else {
        return new Complex(0, -temp4);
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, asin);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return asin(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('asin', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],180:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse tangent of a value
   *
   *     atan(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseTangent.html
   */
  math.atan = function atan(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('atan', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.atan(x);
    }

    if (isComplex(x)) {
      // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
      var re = x.re;
      var im = x.im;
      var den = re * re + (1.0 - im) * (1.0 - im);

      var temp1 = new Complex(
          (1.0 - im * im - re * re) / den,
          (-2.0 * re) / den
      );
      var temp2 = math.log(temp1);

      if (temp2 instanceof Complex) {
        return new Complex(
            -0.5 * temp2.im,
            0.5 * temp2.re
        );
      }
      else {
        return new Complex(
            0,
            0.5 * temp2
        );
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, atan);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return atan(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('atan', x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],181:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Computes the principal value of the arc tangent of y/x in radians
   *
   *     atan2(y, x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} y
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseTangent.html
   */
  math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumBool(y)) {
      if (isNumBool(x)) {
        return Math.atan2(y, x);
      }
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }
    else if (isComplex(y)) {
      if (isNumBool(x)) {
        return Math.atan2(y.re, x);
      }
      /* TODO: support for complex computation of atan2
       else if (isComplex(x)) {
       return Math.atan2(y.re, x.re);
       }
       */
    }

    if (isCollection(y) || isCollection(x)) {
      return collection.deepMap2(y, x, atan2);
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return atan2(y.valueOf(), x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('atan2', y, x);
  };
};

},{"../../type/Complex":197,"../../type/collection":203,"../../util/index":207}],182:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the cosine of a value
   *
   *     cos(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/Cosine.html
   */
  math.cos = function cos(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cos', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.cos(x);
    }

    if (isComplex(x)) {
      // cos(z) = (exp(iz) + exp(-iz)) / 2
      return new Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp(x.im)),
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) - Math.exp(x.im))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cos is no angle');
      }
      return Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cos);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cos(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cos', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],183:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the cotangent of a value. cot(x) is defined as 1 / tan(x)
   *
   *     cot(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.cot = function cot(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cot', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 1 / Math.tan(x);
    }

    if (isComplex(x)) {
      var den = Math.exp(-4.0 * x.im) -
          2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

      return new Complex(
          2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
          (Math.exp(-4.0 * x.im) - 1.0) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return 1 / Math.tan(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cot);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cot(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cot', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],184:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the cosecant of a value, csc(x) = 1/sin(x)
   *
   *     csc(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.csc = function csc(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('csc', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 1 / Math.sin(x);
    }

    if (isComplex(x)) {
      // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
      var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) -
          0.5 * Math.cos(2.0 * x.re);

      return new Complex (
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csc is no angle');
      }
      return 1 / Math.sin(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, csc);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return csc(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('csc', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],185:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the secant of a value, sec(x) = 1/cos(x)
   *
   *     sec(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sec = function sec(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sec', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 1 / Math.cos(x);
    }

    if (isComplex(x)) {
      // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
      var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
          0.5 * Math.cos(2.0 * x.re);
      return new Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
          0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sec is no angle');
      }
      return 1 / Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sec);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sec(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sec', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],186:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the sine of a value
   *
   *     sin(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/Sine.html
   */
  math.sin = function sin(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sin', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.sin(x);
    }

    if (isComplex(x)) {
      return new Complex(
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp( x.im)),
          0.5 * Math.cos(x.re) * (Math.exp( x.im) - Math.exp(-x.im))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sin is no angle');
      }
      return Math.sin(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sin);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sin(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sin', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],187:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Calculate the tangent of a value
   *
   *     tan(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/Tangent.html
   */
  math.tan = function tan(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('tan', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.tan(x);
    }

    if (isComplex(x)) {
      var den = Math.exp(-4.0 * x.im) +
          2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
          1.0;

      return new Complex(
          2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
          (1.0 - Math.exp(-4.0 * x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tan is no angle');
      }
      return Math.tan(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, tan);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return tan(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('tan', x);
  };
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],188:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Change the unit of a value.
   *
   *     x in unit
   *     in(x, unit)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Unit | Array | Matrix} x
   * @param {Unit | Array | Matrix} unit
   * @return {Unit | Array | Matrix} res
   */
  math['in'] = function unit_in(x, unit) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('in', arguments.length, 2);
    }

    if (isUnit(x)) {
      if (isUnit(unit) || isString(unit)) {
        return x['in'](unit);
      }
    }

    // TODO: add support for string, in that case, convert to unit

    if (isCollection(x) || isCollection(unit)) {
      return collection.deepMap2(x, unit, unit_in);
    }

    if (x.valueOf() !== x || unit.valueOf() !== unit) {
      // fallback on the objects primitive value
      return unit_in(x.valueOf(), unit.valueOf());
    }

    throw new util.error.UnsupportedTypeError('in', x, unit);
  };
};

},{"../../type/Unit":202,"../../type/collection":203,"../../util/index":207}],189:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      object = util.object;

  /**
   * Clone an object
   *
   *     clone(x)
   *
   * @param {*} x
   * @return {*} clone
   */
  math.clone = function clone (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('clone', arguments.length, 1);
    }

    return object.clone(x);
  };
};

},{"../../util/index":207}],190:[function(require,module,exports){
module.exports = function (math) {
  var error = require('../../util/error'),
      isMatrix = require('../../type/Matrix').isMatrix;

  /**
   * Execute a callback method on each entry of the matrix or the array.
   * @param {Matrix/array} x      The container to iterate on.
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  math.forEach = function (x, callback) {
    if (arguments.length != 2) {
      throw new error.ArgumentsError('forEach', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _forEachArray(x, callback);
    } else if (isMatrix(x)) {
      return x.forEach(callback);
    } else {
      throw new error.UnsupportedTypeError('forEach', x);
    }
  };

  function _forEachArray (array, callback) {
    var index = [];
    var recurse = function (value, dim) {
      if (Array.isArray(value)) {
        value.forEach(function (child, i) {
          index[dim] = i; // zero-based index
          recurse(child, dim + 1);
        });
      }
      else {
        callback(value, index, array);
      }
    };
    recurse(array, 0);
  };

};
},{"../../type/Matrix":200,"../../util/error":206}],191:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      string = util.string;

  /**
   * Format a value of any type into a string.
   *
   * Syntax:
   *
   *    format(value)
   *    format(value, options)
   *    format(value, precision)
   *    format(value, fn)
   *
   * Where:
   *
   *    {*} value        The value to be formatted
   *    {Object} options An object with formatting options. Available options:
   *                     {String} notation
   *                         Number notation. Choose from:
   *                         'fixed'          Always use regular number notation.
   *                                          For example '123.40' and '14000000'
   *                         'scientific'     Always use scientific notation.
   *                                          For example '1.234e+2' and '1.4e+7'
   *                         'auto' (default) Regular number notation for numbers
   *                                          having an absolute value between
   *                                          `lower` and `upper` bounds, and uses
   *                                          scientific notation elsewhere.
   *                                          Lower bound is included, upper bound
   *                                          is excluded.
   *                                          For example '123.4' and '1.4e7'.
   *                     {Number} precision   A number between 0 and 16 to round
   *                                          the digits of the number.
   *                                          In case of notations 'scientific' and
   *                                          'auto', `precision` defines the total
   *                                          number of significant digits returned
   *                                          and is undefined by default.
   *                                          In case of notation 'fixed',
   *                                          `precision` defines the number of
   *                                          significant digits after the decimal
   *                                          point, and is 0 by default.
   *                     {Object} scientific  An object containing two parameters,
   *                                          {Number} lower and {Number} upper,
   *                                          used by notation 'auto' to determine
   *                                          when to return scientific notation.
   *                                          Default values are `lower=1e-3` and
   *                                          `upper=1e5`.
   *                                          Only applicable for notation `auto`.
   *    {Function} fn    A custom formatting function. Can be used to override the
   *                     built-in notations. Function `fn` is called with `value` as
   *                     parameter and must return a string. Is useful for example to
   *                     format all values inside a matrix in a particular way.
   *
   * Examples:
   *
   *    format(6.4);                                        // '6.4'
   *    format(1240000);                                    // '1.24e6'
   *    format(1/3);                                        // '0.3333333333333333'
   *    format(1/3, 3);                                     // '0.333'
   *    format(21385, 2);                                   // '21000'
   *    format(12.071, {notation: 'fixed'});                // '12'
   *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
   *    format(52.8,   {notation: 'scientific'});           // '5.28e+1'
   *
   *
   * Example usage:
   *     math.format(2/7);                // '0.2857142857142857'
   *     math.format(math.pi, 3);         // '3.14'
   *     math.format(new Complex(2, 3));  // '2 + 3i'
   *
   * @param {*} value             Value to be stringified
   * @param {Object | Function | Number} [options]
   * @return {String} str The formatted value
   */
  math.format = function format (value, options) {
    var num = arguments.length;
    if (num !== 1 && num !== 2) {
      throw new util.error.ArgumentsError('format', num, 1, 2);
    }

    return string.format(value, options);
  };
};

},{"../../util/index":207}],192:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),

      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit;

  /**
   * Import functions from an object or a file
   * @param {function | String | Object} object
   * @param {Object} [options]        Available options:
   *                                  {Boolean} override
   *                                      If true, existing functions will be
   *                                      overwritten. False by default.
   *                                  {Boolean} wrap
   *                                      If true (default), the functions will
   *                                      be wrapped in a wrapper function which
   *                                      converts data types like Matrix to
   *                                      primitive data types like Array.
   *                                      The wrapper is needed when extending
   *                                      math.js with libraries which do not
   *                                      support the math.js data types.
   */
// TODO: return status information
  math['import'] = function math_import(object, options) {
    var name;
    var opts = {
      override: false,
      wrap: true
    };
    if (options && options instanceof Object) {
      util.object.extend(opts, options);
    }

    if (isString(object)) {
      // a string with a filename
      if (typeof (require) !== 'undefined') {
        // load the file using require
        var _module = require(object);
        math_import(_module);
      }
      else {
        throw new Error('Cannot load file: require not available.');
      }
    }
    else if (isSupportedType(object)) {
      // a single function
      name = object.name;
      if (name) {
        if (opts.override || math[name] === undefined) {
          _import(name, object, opts);
        }
      }
      else {
        throw new Error('Cannot import an unnamed function or object');
      }
    }
    else if (object instanceof Object) {
      // a map with functions
      for (name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            _import(name, value, opts);
          }
          else {
            math_import(value);
          }
        }
      }
    }
  };

  /**
   * Add a property to the math namespace and create a chain proxy for it.
   * @param {String} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _import(name, value, options) {
    if (options.override || math[name] === undefined) {
      // add to math namespace
      if (options.wrap && typeof value === 'function') {
        // create a wrapper around the function
        math[name] = function () {
          var args = [];
          for (var i = 0, len = arguments.length; i < len; i++) {
            args[i] = arguments[i].valueOf();
          }
          return value.apply(math, args);
        };
      }
      else {
        // just create a link to the function or value
        math[name] = value;
      }

      // create a proxy for the Selector
      math.chaining.Selector.createProxy(name, value);
    }
  }

  /**
   * Check whether given object is a supported type
   * @param object
   * @return {Boolean}
   * @private
   */
  function isSupportedType(object) {
    return (typeof object == 'function') ||
        isNumber(object) || isString(object) ||
        isComplex(object) || isUnit(object);
    // TODO: add boolean?
  }
};

},{"../../type/Complex":197,"../../type/Unit":202,"../../util/index":207}],193:[function(require,module,exports){
module.exports = function (math) {
  var error = require('../../util/error'),
      isMatrix = require('../../type/Matrix').isMatrix;

  /**
   * Create a new matrix or array with the results of the callback function executed on
   * each entry of the matrix/array.
   * @param {Matrix/array} x      The container to iterate on.
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @return {Matrix/array} container
   */
  math.map = function (x, callback) {
    if (arguments.length != 2) {
      throw new error.ArgumentsError('map', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _mapArray(x, callback);
    } else if (isMatrix(x)) {
      return x.map(callback);
    } else {
      throw new error.UnsupportedTypeError('map', x);
    }
  };

  function _mapArray (arrayIn, callback) {
    var index = [];
    var recurse = function (value, dim) {
      if (Array.isArray(value)) {
        return value.map(function (child, i) {
          index[dim] = i;
          return recurse(child, dim + 1);
        });
      }
      else {
        return callback(value, index, arrayIn);
      }
    };

    return recurse(arrayIn, 0);
  };
};

},{"../../type/Matrix":200,"../../util/error":206}],194:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index'),
      string = util.string,

      isString = string.isString;

  /**
   * Interpolate values into a string template.
   *     math.print(template, values)
   *     math.print(template, values, precision)
   *
   * Example usage:
   *
   *     // the following outputs: 'The value of pi is 3.141592654'
   *     math.format('The value of pi is $pi', {pi: math.pi}, 10);
   *
   *     // the following outputs: 'hello Mary! The date is 2013-03-23'
   *     math.format('Hello $user.name! The date is $date', {
   *       user: {
   *         name: 'Mary',
   *       },
   *       date: new Date().toISOString().substring(0, 10)
   *     });
   *
   * @param {String} template
   * @param {Object} values
   * @param {Number} [precision]  Number of digits to format numbers.
   *                              If not provided, the value will not be rounded.
   * @return {String} str
   */
  math.print = function print (template, values, precision) {
    var num = arguments.length;
    if (num != 2 && num != 3) {
      throw new util.error.ArgumentsError('print', num, 2, 3);
    }

    if (!isString(template)) {
      throw new TypeError('String expected as first parameter in function format');
    }
    if (!(values instanceof Object)) {
      throw new TypeError('Object expected as second parameter in function format');
    }

    // format values into a string
    return template.replace(/\$([\w\.]+)/g, function (original, key) {
          var keys = key.split('.');
          var value = values[keys.shift()];
          while (keys.length && value !== undefined) {
            var k = keys.shift();
            value = k ? value[k] : value + '.';
          }

          if (value !== undefined) {
            if (!isString(value)) {
              return math.format(value, precision);
            }
            else {
              return value;
            }
          }

          return original;
        }
    );
  };
};

},{"../../util/index":207}],195:[function(require,module,exports){
module.exports = function (math) {
  /**
   * Wrap any value in a Selector, allowing to perform chained operations on
   * the value.
   *
   * All methods available in the math.js library can be called upon the selector,
   * and then will be evaluated with the value itself as first argument.
   * The selector can be closed by executing selector.done(), which will return
   * the final value.
   *
   * Example usage:
   *     math.select(3)
   *         .add(4)
   *         .subtract(2)
   *         .done();     // 5
   *     math.select( [[1, 2], [3, 4]] )
   *         .set([1, 1], 8)
   *         .multiply(3)
   *         .done();     // [[24, 6], [9, 12]]
   *
   * The Selector has a number of special functions:
   * - done()     Finalize the chained operation and return the selectors value.
   * - valueOf()  The same as done()
   * - toString() Executes math.format() onto the selectors value, returning
   *              a string representation of the value.
   * - get(...)   Get a subselection of the selectors value. Only applicable when
   *              the value has a method get, for example when value is a Matrix
   *              or Array.
   * - set(...)   Replace a subselection of the selectors value. Only applicable
   *              when the value has a method get, for example when value is a
   *              Matrix or Array.
   *
   * @param {*} value
   * @return {math.chaining.Selector} selector
   */
  math.select = function select(value) {
    // TODO: check number of arguments
    return new math.chaining.Selector(value);
  };
};

},{}],196:[function(require,module,exports){
module.exports = function (math) {
  var util = require('../../util/index');

  /**
   * Determine the type of a variable
   *
   *     typeof(x)
   *
   * @param {*} x
   * @return {String} type  Lower case type, for example "number", "string",
   *                        "array".
   */
  math['typeof'] = function _typeof (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('typeof', arguments.length, 1);
    }

    return util.types.type(x);
  };
};

},{"../../util/index":207}],197:[function(require,module,exports){
var util = require('../util/index'),
    number = util.number,

    isNumber = util.number.isNumber,
    isString = util.string.isString;

/**
 * @constructor Complex
 *
 * A complex value can be constructed in the following ways:
 *     var a = new Complex();
 *     var b = new Complex(re, im);
 *     var c = Complex.parse(str);
 *
 * Example usage:
 *     var a = new Complex(3, -4);      // 3 - 4i
 *     a.re = 5;                        // a = 5 - 4i
 *     var i = a.im;                    // -4;
 *     var b = Complex.parse('2 + 6i'); // 2 + 6i
 *     var c = new Complex();           // 0 + 0i
 *     var d = math.add(a, b);          // 5 + 2i
 *
 * @param {Number} re       The real part of the complex value
 * @param {Number} [im]     The imaginary part of the complex value
 */
function Complex(re, im) {
  if (!(this instanceof Complex)) {
    throw new SyntaxError(
        'Complex constructor must be called with the new operator');
  }

  switch (arguments.length) {
    case 0:
      this.re = 0;
      this.im = 0;
      break;

    case 2:
      if (!isNumber(re) || !isNumber(im)) {
        throw new TypeError(
            'Two numbers expected in Complex constructor');
      }
      this.re = re;
      this.im = im;
      break;

    default:
      if (arguments.length != 0 && arguments.length != 2) {
        throw new SyntaxError(
            'Two or zero arguments expected in Complex constructor');
      }
      break;
  }
}

/**
 * Test whether value is a Complex value
 * @param {*} value
 * @return {Boolean} isComplex
 */
Complex.isComplex = function isComplex(value) {
  return (value instanceof Complex);
};

// private variables and functions for the parser
var text, index, c;

function skipWhitespace() {
  while (c == ' ' || c == '\t') {
    next();
  }
}

function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c == '.');
}

function isDigit (c) {
  return ((c >= '0' && c <= '9'));
}

function next() {
  index++;
  c = text.charAt(index);
}

function revert(oldIndex) {
  index = oldIndex;
  c = text.charAt(index);
}

function parseNumber () {
  var number = '';
  var oldIndex;
  oldIndex = index;

  if (c == '+') {
    next();
  }
  else if (c == '-') {
    number += c;
    next();
  }

  if (!isDigitDot(c)) {
    // a + or - must be followed by a digit
    revert(oldIndex);
    return null;
  }

  // get number, can have a single dot
  if (c == '.') {
    number += c;
    next();
    if (!isDigit(c)) {
      // this is no legal number, it is just a dot
      revert(oldIndex);
      return null;
    }
  }
  else {
    while (isDigit(c)) {
      number += c;
      next();
    }
    if (c == '.') {
      number += c;
      next();
    }
  }
  while (isDigit(c)) {
    number += c;
    next();
  }

  // check for scientific notation like "2.3e-4" or "1.23e50"
  if (c == 'E' || c == 'e') {
    number += c;
    next();

    if (c == '+' || c == '-') {
      number += c;
      next();
    }

    // Scientific notation MUST be followed by an exponent
    if (!isDigit(c)) {
      // this is no legal number, exponent is missing.
      revert(oldIndex);
      return null;
    }

    while (isDigit(c)) {
      number += c;
      next();
    }
  }

  return number;
}

function parseComplex () {
  // check for 'i', '-i', '+i'
  var cnext = text.charAt(index + 1);
  if (c == 'I' || c == 'i') {
    next();
    return '1';
  }
  else if ((c == '+' || c == '-') && (cnext == 'I' || cnext == 'i')) {
    var number = (c == '+') ? '1' : '-1';
    next();
    next();
    return number;
  }

  return null;
}

/**
 * Parse a complex number from a string. For example Complex.parse("2 + 3i")
 * will return a Complex value where re = 2, im = 3.
 * Returns null if provided string does not contain a valid complex number.
 * @param {String} str
 * @returns {Complex | null} complex
 */
Complex.parse = function parse (str) {
  text = str;
  index = -1;
  c = '';

  if (!isString(text)) {
    return null;
  }

  next();
  skipWhitespace();
  var first = parseNumber();
  if (first) {
    if (c == 'I' || c == 'i') {
      // pure imaginary number
      next();
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
    else {
      // complex and real part
      skipWhitespace();
      var separator = c;
      if (separator != '+' && separator != '-') {
        // pure real number
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), 0);
      }
      else {
        // complex and real part
        next();
        skipWhitespace();
        var second = parseNumber();
        if (second) {
          if (c != 'I' && c != 'i') {
            // 'i' missing at the end of the complex number
            return null;
          }
          next();
        }
        else {
          second = parseComplex();
          if (!second) {
            // imaginary number missing after separator
            return null;
          }
        }

        if (separator == '-') {
          if (second[0] == '-') {
            second =  '+' + second.substring(1);
          }
          else {
            second = '-' + second;
          }
        }

        next();
        skipWhitespace();
        if (c) {
          // garbage at the end. not good.
          return null;
        }

        return new Complex(Number(first), Number(second));
      }
    }
  }
  else {
    // check for 'i', '-i', '+i'
    first = parseComplex();
    if (first) {
      skipWhitespace();
      if (c) {
        // garbage at the end. not good.
        return null;
      }

      return new Complex(0, Number(first));
    }
  }

  return null;
};

/**
 * Create a copy of the complex value
 * @return {Complex} clone
 */
Complex.prototype.clone = function clone () {
  return new Complex(this.re, this.im);
};

/**
 * Test whether this complex number equals an other complex value.
 * Two complex numbers are equal when both their real and imaginary parts
 * are equal.
 * @param {Complex} other
 * @return {boolean} isEqual
 */
Complex.prototype.equals = function equals (other) {
  return (this.re === other.re) && (this.im === other.im);
};

/**
 * Get a string representation of the complex number,
 * with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {String} str
 */
Complex.prototype.format = function format (options) {
  var str = '',
      strRe = number.format(this.re, options),
      strIm = number.format(this.im, options);

  if (this.im == 0) {
    // real value
    str = strRe;
  }
  else if (this.re == 0) {
    // purely complex value
    if (this.im == 1) {
      str = 'i';
    }
    else if (this.im == -1) {
      str = '-i';
    }
    else {
      str = strIm + 'i';
    }
  }
  else {
    // complex value
    if (this.im > 0) {
      if (this.im == 1) {
        str = strRe + ' + i';
      }
      else {
        str = strRe + ' + ' + strIm + 'i';
      }
    }
    else {
      if (this.im == -1) {
        str = strRe + ' - i';
      }
      else {
        str = strRe + ' - ' + strIm.substring(1) + 'i';
      }
    }
  }

  return str;
};

/**
 * Get a string representation of the complex number.
 * @return {String} str
 */
Complex.prototype.toString = function toString () {
  return this.format();
};

// exports
module.exports = Complex;

// to trick my IDE which doesn't get it
exports.isComplex = Complex.isComplex;
exports.parse = Complex.parse;

util.types.addType('complex', Complex);

},{"../util/index":207}],198:[function(require,module,exports){
var util = require('../util/index'),
    object = util.object,
    string = util.string;

/**
 * Documentation object
 * @param {Object} math The math.js namespace
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @constructor
 */
function Help (math, doc) {
  this.math = math;
  this.doc = doc;
}

/**
 * Test whether a value is an instance of Help
 * @param {*} value
 * @return {Boolean} isHelp
 */
Help.isHelp = function isHelp (value) {
  return (value instanceof Help);
};

/**
 * Generate readable description from a Help object
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toString = function () {
  var doc = this.doc || {};
  var desc = '\n';

  if (doc.name) {
    desc += 'Name: ' + doc.name + '\n\n';
  }
  if (doc.category) {
    desc += 'Category: ' + doc.category + '\n\n';
  }
  if (doc.description) {
    desc += 'Description:\n    ' + doc.description + '\n\n';
  }
  if (doc.syntax) {
    desc += 'Syntax:\n    ' + doc.syntax.join('\n    ') + '\n\n';
  }
  if (doc.examples) {
    var parser = this.math.parser();
    desc += 'Examples:\n';
    for (var i = 0; i < doc.examples.length; i++) {
      var expr = doc.examples[i];
      var res;
      try {
        res = parser.eval(expr);
      }
      catch (e) {
        res = e;
      }
      desc += '    ' + expr + '\n';
      if (res && !(res instanceof Help)) {
        desc += '        ' + string.format(res) + '\n';
      }
    }
    desc += '\n';
  }
  if (doc.seealso) {
    desc += 'See also: ' + doc.seealso.join(', ') + '\n';
  }

  return desc;
};

// TODO: implement a toHTML function in Help

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
  return object.extend({}, this.doc);
};

// exports
module.exports = Help;

// to trick my IDE which doesn't get it
exports.isHelp = Help.isHelp;

util.types.addType('help', Help);

},{"../util/index":207}],199:[function(require,module,exports){
var util = require('../util/index'),

    Range = require('./Range'),

    number = util.number,

    isNumber = number.isNumber,
    isInteger = number.isInteger,
    isArray = Array.isArray,
    validateIndex = util.array.validateIndex;

/**
 * @Constructor Index
 * Create an index. An Index can store ranges having start, step, and end
 * for multiple dimensions.
 * Matrix.get, Matrix.set, and math.subset accept an Index as input.
 *
 * Usage:
 *     var index = new Index(range1, range2, ...);
 *
 * Where each range can be any of:
 *     An array [start, end]
 *     An array [start, end, step]
 *     A number
 *     An instance of Range
 *
 * The parameters start, end, and step must be integer numbers.
 *
 * @param {...*} ranges
 */
function Index(ranges) {
  if (!(this instanceof Index)) {
    throw new SyntaxError(
        'Index constructor must be called with the new operator');
  }

  this._ranges = [];

  for (var i = 0, ii = arguments.length; i < ii; i++) {
    var arg = arguments[i];

    if (arg instanceof Range) {
      this._ranges.push(arg);
    }
    else {
      if (arg) {
        arg = arg.valueOf();
      }

      if (isArray(arg)) {
        this._ranges.push(_createRange(arg));
      }
      else if (isNumber(arg)) {
        this._ranges.push(_createRange([arg, arg + 1]));
      }
      // TODO: implement support for wildcard '*'
      // TODO: implement support for a string 'start:step:end'
      else {
        throw new TypeError('Range expected as Array, Number, or String');
      }
    }
  }
}

/**
 * Parse an argument into a range and validate the range
 * @param {Array} arg  An array with [start: Number, end: Number] and
 *                     optional a third element step:Number
 * @return {Range} range
 * @private
 */
function _createRange(arg) {
  // TODO: make function _createRange simpler/faster

  // test whether all arguments are integers
  var num = arg.length;
  for (var i = 0; i < num; i++) {
    if (!isNumber(arg[i]) || !isInteger(arg[i])) {
      throw new TypeError('Index parameters must be integer numbers');
    }
  }

  switch (arg.length) {
    case 2:
      return new Range(arg[0], arg[1]); // start, end
    case 3:
      return new Range(arg[0], arg[1], arg[2]); // start, end, step
    default:
      // TODO: improve error message
      throw new SyntaxError('Wrong number of arguments in Index (2 or 3 expected)');
  }
}

/**
 * Create a clone of the index
 * @return {Index} clone
 */
Index.prototype.clone = function clone () {
  var index = new Index();
  index._ranges = util.object.clone(this._ranges);
  return index;
};

/**
 * Test whether an object is an Index
 * @param {*} object
 * @return {Boolean} isIndex
 */
Index.isIndex = function isIndex(object) {
  return (object instanceof Index);
};

/**
 * Create an index from an array with ranges/numbers
 * @param {Array.<Array | Number>} ranges
 * @return {Index} index
 * @private
 */
Index.create = function create(ranges) {
  var index = new Index();
  Index.apply(index, ranges);
  return index;
};

/**
 * Retrieve the size of the index.
 * @returns {Number[]} size
 */
Index.prototype.size = function () {
  var size = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];

    if (range instanceof Range) {
      size.push(range.size()[0]);
    }
    else {
      size.push(null);
    }
  }

  return size;
};

/**
 * Loop over each of the ranges of the index
 * @param {function} callback   Called for each range with a Range as first
 *                              argument, the dimension as second, and the
 *                              index object as third.
 */
Index.prototype.forEach = function (callback) {
  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    callback(this._ranges[i], i, this);
  }
};

/**
 * Retrieve the range for a given dimension number from the index
 * @param {Number} dim                  Number of the dimension
 * @returns {Range | undefined} range
 */
Index.prototype.range = function (dim) {
  return this._ranges[dim];
};

/**
 * Expand the Index into an array.
 * For example new Index([0,3], [2,7]) returns [[0,1,2], [2,3,4,5,6]]
 * @returns {Array} array
 */
Index.prototype.toArray = function () {
  var array = [];
  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i],
        row = [],
        x = range.start,
        end = range.end,
        step = range.step;

    if (step > 0) {
      while (x < end) {
        row.push(x);
        x += step;
      }
    }
    else if (step < 0) {
      while (x > end) {
        row.push(x);
        x += step;
      }
    }

    array.push(row);
  }

  return array;
};

/**
 * Get the primitive value of the Index, a two dimensional array.
 * Equivalent to Index.toArray().
 * @returns {Array} array
 */
Index.prototype.valueOf = Index.prototype.toArray;

/**
 * Get the string representation of the index, for example '[2:6]' or '[0:2:10, 4:7]'
 * @returns {String} str
 */
Index.prototype.toString = function () {
  var strings = [];

  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
    var range = this._ranges[i];
    var str = number.format(range.start);
    if (range.step != 1) {
      str += ':' + number.format(range.step);
    }
    str += ':' + number.format(range.end);
    strings.push(str);
  }

  return '[' + strings.join(',') + ']';
};

/**
 * Test whether a multidimensional array contains a scalar
 * @param array
 * @returns {*}
 */
function isScalar(array) {
  while (isArray(array)) {
    if (array.length !== 1) {
      return false;
    }
    array = array[0];
  }

  return true;
}

/**
 * Retrieve the scalar value from a multidimensional matrix containing only
 * a single scalar.
 * @param array
 * @returns {*} scalar
 * @private
 */
function toScalar(array) {
  while (isArray(array)) {
    if (array.length !== 1) {
      throw new Error('Array does not contain a single scalar');
    }
    array = array[0];
  }

  return array;
}

// exports
module.exports = Index;

// to trick my IDE which doesn't get it
exports.isIndex = Index.isIndex;
exports.create = Index.create;

util.types.addType('index', Index);

},{"../util/index":207,"./Range":201}],200:[function(require,module,exports){
var util = require('../util/index'),
    Index = require('./Index'),

    number = util.number,
    string = util.string,
    array = util.array,
    object = util.object,

    isArray = Array.isArray;

/**
 * @constructor Matrix
 *
 * A Matrix is a wrapper around an Array. A matrix can hold a multi dimensional
 * array. A matrix can be constructed as:
 *     var matrix = new Matrix(data)
 *
 * Matrix contains the functions to resize, get and set values, get the size,
 * clone the matrix and to convert the matrix to a vector, array, or scalar.
 * Furthermore, one can iterate over the matrix using map and forEach.
 * The internal Array of the Matrix can be accessed using the method valueOf.
 *
 * Example usage:
 *     var matrix = new Matrix([[1, 2], [3, 4]);
 *     matix.size();              // [2, 2]
 *     matrix.resize([3, 2], 5);
 *     matrix.valueOf();          // [[1, 2], [3, 4], [5, 5]]
 *     matrix.subset([1,2])       // 3 (indexes are zero-based)
 *
 * @param {Array | Matrix} [data]    A multi dimensional array
 */
function Matrix(data) {
  if (!(this instanceof Matrix)) {
    throw new SyntaxError(
        'Matrix constructor must be called with the new operator');
  }

  if (data instanceof Matrix) {
    // clone data from a Matrix
    this._data = data.clone()._data;
  }
  else if (Array.isArray(data)) {
    // use array as is
    this._data = data;
  }
  else if (data != null) {
    // unsupported type
    throw new TypeError('Unsupported type of data (' + util.types.type(data) + ')');
  }
  else {
    // nothing provided
    this._data = [];
  }

  // verify the size of the array
  this._size = array.size(this._data);
}

/**
 * Test whether an object is a Matrix
 * @param {*} object
 * @return {Boolean} isMatrix
 */
Matrix.isMatrix = function isMatrix(object) {
  return (object instanceof Matrix);
};

/**
 * Get a subset of the matrix, or replace a subset of the matrix.
 *
 * Usage:
 *     var subset = matrix.subset(index)               // retrieve subset
 *     var value = matrix.subset(index, replacement)   // replace subset
 *
 * @param {Index} index
 * @param {Array | Matrix | *} [replacement]
 */
Matrix.prototype.subset = function subset(index, replacement) {
  switch (arguments.length) {
    case 1: return _get(this, index);
    case 2: return _set(this, index, replacement);
    default:
      throw new util.error.ArgumentsError('subset', arguments.length, 1, 2);
  }
};

/**
 * Get a value or a submatrix of the matrix.
 * @param {Index} index   Zero-based index
 */
// TODO: Matrix.get is deprecated since version 0.13.0, remove it some day
Matrix.prototype.get = function get(index) {
  throw new Error('Matrix.get is removed. Use matrix.subet(index) instead.');
};


/**
 * Replace a value or a submatrix in the matrix.
 * Indexes are zero-based.
 * @param {Index} index
 * @param {Matrix | Array | *} submatrix
 * @return {Matrix} matrix
 */
// TODO: Matrix.set is deprecated since version 0.13.0, remove it some day
Matrix.prototype.set = function set (index, submatrix) {
  throw new Error('Matrix.set is removed. Use matrix.subet(index, replacement) instead.');
};

/**
 * Get a value or a submatrix of the matrix.
 * @param {Matrix} matrix
 * @param {Index} index   Zero-based index
 */
function _get (matrix, index) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  var size = index.size();
  var isScalar = !size.some(function (i) {
    return (i != 1);
  });

  if (size.length != matrix._size.length) {
    throw new RangeError('Dimension mismatch ' +
        '(' + size.length + ' != ' + matrix._size.length + ')');
  }

  if (isScalar) {
    // return a single value
    switch (size.length) {
      case 1:     return _getScalar1D(matrix._data, index);
      case 2:     return _getScalar2D(matrix._data, index);
      default:    return _getScalar(matrix._data, index);
    }
  }
  else {
    // return a submatrix
    var submatrix;
    switch (size.length) {
      case 1: submatrix = new Matrix(_getSubmatrix1D(matrix._data, index)); break;
      case 2: submatrix = new Matrix(_getSubmatrix2D(matrix._data, index)); break;
      default: submatrix = new Matrix(_getSubmatrix(matrix._data, index, 0)); break;
    }
    // TODO: more efficient when creating an empty matrix and setting _data and _size manually

    // squeeze matrix output
    while (isArray(submatrix._data) && submatrix._data.length == 1) {
      submatrix._data = submatrix._data[0];
      submatrix._size.shift();
    }

    return submatrix;
  }
}

/**
 * Get a single value from an array. The method tests whether:
 * - index is a non-negative integer
 * - index does not exceed the dimensions of array
 * @param {Array} arr
 * @param {Number} index   Zero-based index
 * @return {*} value
 * @private
 */
function _getElement (arr, index) {
  array.validateIndex(index, arr.length);
  return arr[index]; // zero-based index
}

/**
 * Get a single value from the matrix. The value will be a copy of the original
 * value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar (data, index) {
  index.forEach(function (range) {
    data = _getElement(data, range.start);
  });
  return object.clone(data);
}

/**
 * Get a single value from a one dimensional matrix.
 * The value will be a copy of the original value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar1D (data, index) {
  return _getElement(data, index.range(0).start);
}

/**
 * Get a single value from a two dimensional matrix.
 * The value will be a copy of the original value in the matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {*} scalar
 * @private
 */
function _getScalar2D (data, index) {
  return _getElement(_getElement(data, index.range(0).start), index.range(1).start);
}

/**
 * Get a submatrix of a zero dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix1D (data, index) {
  var range = index.range(0);

  return range.map(function (i) {
    return _getElement(data, i);
  });
}

/**
 * Get a submatrix of a 2 dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix2D (data, index) {
  var rows = index.range(0);
  var cols = index.range(1);

  return rows.map(function (row) {
    var child = _getElement(data, row);
    return cols.map(function (col) {
      return _getElement(child, col);
    });
  });
}

/**
 * Get a submatrix of a multi dimensional matrix.
 * Index is not checked for correct number of dimensions.
 * @param {Array} data
 * @param {Index} index
 * @param {number} dim
 * @return {Array} submatrix
 * @private
 */
function _getSubmatrix (data, index, dim) {
  var last = (dim == index.size().length - 1);
  var range = index.range(dim);

  if (last) {
    return range.map(function (i) {
      return _getElement(data, i);
    });
  }
  else {
    return range.map(function (i) {
      var child = _getElement(data, i);
      return _getSubmatrix(child, index, dim + 1);
    });
  }
}

/**
 * Replace a value or a submatrix in the matrix.
 * Indexes are zero-based.
 * @param {Matrix} matrix
 * @param {Index} index
 * @param {Matrix | Array | *} submatrix
 * @return {Matrix} matrix
 */
function _set (matrix, index, submatrix) {
  if (!(index instanceof Index)) {
    throw new TypeError('Invalid index');
  }

  var size = index.size();
  var isScalar = !size.some(function (i) {
    return (i != 1);
  });

  if (size.length < matrix._size.length) {
    throw new RangeError('Dimension mismatch ' +
        '(' + size.length + ' != ' + matrix._size.length + ')');
  }

  if (submatrix instanceof Matrix) {
    submatrix = submatrix.valueOf();
  }

  // calculate the size of the submatrix
  var subsize = array.size(submatrix);

  if (isScalar) {
    // set a scalar

    // check whether submatrix is a scalar
    if (subsize.length != 0) {
      throw new TypeError('Scalar value expected');
    }

    switch (index.length) {
      case 1:  _setScalar1D(matrix._data, matrix._size, index, submatrix); break;
      case 2:  _setScalar2D(matrix._data, matrix._size, index, submatrix); break;
      default: _setScalar(matrix._data, matrix._size, index, submatrix); break;
    }
  }
  else {
    // set a submatrix

    // unsqueeze the submatrix when needed
    for (var i = 0, ii = size.length - subsize.length; i < ii; i++) {
      submatrix = [submatrix];
    }

    var newSize = matrix._size.concat();
    _setSubmatrix (matrix._data, newSize, index, 0, submatrix);
    if (!object.deepEqual(matrix._size, newSize)) {
      _init(matrix._data);
      matrix.resize(newSize);
    }
  }

  return matrix;
}

/**
 * Replace a single value in an array. The method tests whether index is a
 * non-negative integer
 * @param {Array} arr
 * @param {Number} index   Zero-based index
 * @param {*} value
 * @private
 */
function _setElement (arr, index, value) {
  array.validateIndex(index);
  if (Array.isArray(value)) {
    throw new TypeError('Dimension mismatch, value expected instead of array');
  }
  arr[index] = value; // zero-based index
}

/**
 * Replace a single value in a multi dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index
 * @param {*} value
 * @private
 */
function _setScalar (data, size, index, value) {
  var resized = false;
  if (index.size().length > size.length) {
    // dimension added
    resized = true;
  }

  index.forEach(function (range, i) {
    var v = range.start;
    array.validateIndex(v);
    if ((size[i] == null) || (v + 1 > size[i])) {
      size[i] = v + 1; // size is index + 1 as index is zero-based
      resized = true;
    }
  });

  if (resized) {
    array.resize(data, size, 0);
  }

  var len = size.length;
  index.forEach(function (range, dim) {
    var i = range.start;
    if (dim < len - 1) {
      data = data[i]; // zero-based index
    }
    else {
      data[i] = value; // zero-based index
    }
  });
}

/**
 * Replace a single value in a zero dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index
 * @param {*} value
 * @private
 */
function _setScalar1D (data, size, index, value) {
  var row = index.range(0).start;
  array.validateIndex(row);
  if (row + 1 > size[0]) {
    array.resize(data, [row + 1], 0); // size is index + 1 as index is zero-based
    size[0] = row + 1;
  }
  data[row] = value; // zero-based index
}

/**
 * Replace a single value in a two dimensional matrix
 * @param {Array} data
 * @param {Number[]} size
 * @param {Index} index  zero-based index
 * @param {*} value
 * @private
 */
function _setScalar2D (data, size, index, value) {
  var row = index.range(0).start;
  var col = index.range(1).start;
  array.validateIndex(row);
  array.validateIndex(col);

  var resized = false;
  if (row + 1 > (size[0] || 0)) {
    size[0] = row + 1;   // size is index + 1 as index is zero-based
    resized = true;
  }
  if (col + 1 > (size[1] || 0)) {
    size[1] = col + 1;   // size is index + 1 as index is zero-based
    resized = true;
  }
  if (resized) {
    array.resize(data, size, 0);
  }

  data[row][col] = value; // zero-based index
}

/**
 * Replace a submatrix of a multi dimensional matrix.
 * @param {Array} data
 * @param {Array} size
 * @param {Index} index
 * @param {number} dim
 * @param {Array} submatrix
 * @private
 */
function _setSubmatrix (data, size, index, dim, submatrix) {
  var last = (dim == index.size().length - 1);
  var range = index.range(dim);

  var len = (range.size()[0]);
  if (len != submatrix.length) {
    throw new RangeError('Dimensions mismatch ' +
        '(' + len + ' != '+ submatrix.length + ')');
  }

  if (last) {
    range.forEach(function (dataIndex, subIndex) {
      _setElement(data, dataIndex, submatrix[subIndex]);
      if (dataIndex + 1 > (size[dim] || 0)) {
        size[dim] = dataIndex + 1;
      }
    });
  }
  else {
    range.forEach(function (dataIndex, subIndex) {
      var child = data[dataIndex];
      if (!Array.isArray(child)) {
        data[dataIndex] = child = [child];
      }
      if (dataIndex + 1 > (size[dim] || 0)) {
        size[dim] = dataIndex + 1;
      }
      _setSubmatrix(child, size, index, dim + 1, submatrix[subIndex]);
    });
  }
}

/**
 * Recursively initialize all undefined values in the array with zeros
 * @param array
 * @private
 */
function _init(array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var value = array[i];
    if (Array.isArray(value)) {
      _init(value);
    }
    else if (value == undefined) {
      array[i] = 0;
    }
  }
}

/**
 * Resize the matrix
 * @param {Number[]} size
 * @param {*} [defaultValue]        Default value, filled in on new entries.
 *                                  If not provided, the matrix will be filled
 *                                  with zeros.
 */
Matrix.prototype.resize = function resize(size, defaultValue) {
  array.resize(this._data, size, defaultValue);
  this._size = object.clone(size);
};

/**
 * Create a clone of the matrix
 * @return {Matrix} clone
 */
Matrix.prototype.clone = function clone() {
  var matrix = new Matrix();
  matrix._data = object.clone(this._data);
  matrix._size = object.clone(this._size);
  return matrix;
};

/**
 * Retrieve the size of the matrix.
 * @returns {Number[]} size
 */
Matrix.prototype.size = function size() {
  return this._size;
};

/**
 * Create a new matrix with the results of the callback function executed on
 * each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @return {Matrix} matrix
 */
Matrix.prototype.map = function map(callback) {
  var me = this;
  var matrix = new Matrix();
  var index = [];
  var recurse = function (value, dim) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        index[dim] = i; // zero-based index
        return recurse(child, dim + 1);
      });
    }
    else {
      return callback(value, index, me);
    }
  };
  matrix._data = recurse(this._data, 0);
  matrix._size = object.clone(this._size);

  return matrix;
};

/**
 * Execute a callback method on each entry of the matrix.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Matrix.prototype.forEach = function forEach(callback) {
  var me = this;
  var index = [];
  var recurse = function (value, dim) {
    if (Array.isArray(value)) {
      value.forEach(function (child, i) {
        index[dim] = i; // zero-based index
        recurse(child, dim + 1);
      });
    }
    else {
      callback(value, index, me);
    }
  };
  recurse(this._data, 0);
};

/**
 * Create a scalar with a copy of the data of the Matrix
 * Will return null if the matrix does not consist of a scalar value
 * @return {* | null} scalar
 */
Matrix.prototype.toScalar = function toScalar() {
  var scalar = this._data;
  while (Array.isArray(scalar) && scalar.length == 1) {
    scalar = scalar[0];
  }

  if (Array.isArray(scalar)) {
    return null;
  }
  else {
    return object.clone(scalar);
  }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Matrix.prototype.isScalar = function isScalar() {
  return this._size.every(function (s) {
    return (s <= 1);
  });
};

/**
 * Create a vector with a copy of the data of the Matrix
 * Returns null if the Matrix does not contain a vector
 *
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {Array | null} vector
 */
Matrix.prototype.toVector = function toVector() {
  var count = 0;
  var dim = undefined;
  var index = [];
  this._size.forEach(function (length, i) {
    if (length > 1) {
      count++;
      dim = i;
    }
    index[i] = 0;
  });

  if (count == 0) {
    // scalar or empty
    var scalar = this.toScalar();
    if (scalar) {
      return [scalar];
    }
    else {
      return [];
    }
  }
  else if (count == 1) {
    // valid vector
    var vector = [];
    var recurse = function (data) {
      if (Array.isArray(data)) {
        data.forEach(recurse);
      }
      else {
        vector.push(data);
      }
    };
    recurse(this._data);
    return vector;
  }
  else {
    // count > 1, this is no vector
    return null;
  }
};

/**
 * Test if the matrix contains a vector.
 * A matrix is a vector when it has 0 or 1 dimensions, or has multiple
 * dimensions where maximum one of the dimensions has a size larger than 1.
 * return {boolean} isVector
 */
Matrix.prototype.isVector = function isVector() {
  var count = 0;
  this._size.forEach(function (length) {
    if (length > 1) {
      count++;
    }
  });
  return (count <= 1);
};

/**
 * Create an Array with a copy of the data of the Matrix
 * @returns {Array} array
 */
Matrix.prototype.toArray = function toArray() {
  return object.clone(this._data);
};

/**
 * Get the primitive value of the Matrix: a multidimensional array
 * @returns {Array} array
 */
Matrix.prototype.valueOf = function valueOf() {
  return this._data;
};

/**
 * Get a string representation of the matrix, with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {String} str
 */
Matrix.prototype.format = function format(options) {
  return string.format(this._data, options);
};

/**
 * Get a string representation of the matrix
 * @returns {String} str
 */
Matrix.prototype.toString = function toString() {
  return string.format(this._data);
};

// exports
module.exports = Matrix;

// to trick my IDE which doesn't get it
exports.isMatrix = Matrix.isMatrix;

util.types.addType('matrix', Matrix);

},{"../util/index":207,"./Index":199}],201:[function(require,module,exports){
var util = require('../util/index'),

    number = util.number,
    string = util.string,
    array = util.array;

/**
 * @constructor Range
 * Create a range. A range has a start, step, and end, and contains functions
 * to iterate over the range.
 *
 * A range can be constructed as:
 *     var range = new Range(start, end);
 *     var range = new Range(start, end, step);
 *
 * To get the result of the range:
 *     range.forEach(function (x) {
 *         console.log(x);
 *     });
 *     range.map(function (x) {
 *         return math.sin(x);
 *     });
 *     range.toArray();
 *
 * Example usage:
 *     var c = new Range(2, 6);         // 2:1:5
 *     c.toArray();                     // [2, 3, 4, 5]
 *     var d = new Range(2, -3, -1);    // 2:-1:-2
 *     d.toArray();                     // [2, 1, 0, -1, -2]
 *
 * @param {Number} start  included lower bound
 * @param {Number} end    excluded upper bound
 * @param {Number} [step] step size, default value is 1
 */
function Range(start, end, step) {
  if (!(this instanceof Range)) {
    throw new SyntaxError(
        'Range constructor must be called with the new operator');
  }

  if (start != null && !number.isNumber(start)) {
    throw new TypeError('Parameter start must be a number');
  }
  if (end != null && !number.isNumber(end)) {
    throw new TypeError('Parameter end must be a number');
  }
  if (step != null && !number.isNumber(step)) {
    throw new TypeError('Parameter step must be a number');
  }

  this.start = (start != null) ? start : 0;
  this.end   = (end != null) ? end : 0;
  this.step  = (step != null) ? step : 1;
}

/**
 * Parse a string into a range,
 * The string contains the start, optional step, and end, separated by a colon.
 * If the string does not contain a valid range, null is returned.
 * For example str='0:2:11'.
 * @param {String} str
 * @return {Range | null} range
 */
Range.parse = function parse (str) {
  if (!string.isString(str)) {
    return null;
  }

  var args = str.split(':');
  var nums = args.map(function (arg) {
    return Number(arg);
  });

  var invalid = nums.some(function (num) {
    return isNaN(num);
  });
  if(invalid) {
    return null;
  }

  switch (nums.length) {
    case 2: return new Range(nums[0], nums[1]);
    case 3: return new Range(nums[0], nums[2], nums[1]);
    default: return null;
  }
};

/**
 * Create a clone of the range
 * @return {Range} clone
 */
Range.prototype.clone = function clone() {
  return new Range(this.start, this.end, this.step);
};

/**
 * Test whether an object is a Range
 * @param {*} object
 * @return {Boolean} isRange
 */
Range.isRange = function isRange(object) {
  return (object instanceof Range);
};

/**
 * Retrieve the size of the range.
 * @returns {Number[]} size
 */
Range.prototype.size = function size() {
  var len = 0,
      start = Number(this.start),
      step = Number(this.step),
      end = Number(this.end),
      diff = end - start;

  if (number.sign(step) == number.sign(diff)) {
    len = Math.ceil((diff) / step);
  }
  else if (diff == 0) {
    len = 0;
  }

  if (isNaN(len)) {
    len = 0;
  }
  return [len];
};

/**
 * Execute a callback function for each value in the range.
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 */
Range.prototype.forEach = function forEach(callback) {
  var x = Number(this.start);
  var step = Number(this.step);
  var end = Number(this.end);
  var i = 0;

  if (step > 0) {
    while (x < end) {
      callback(x, i, this);
      x += step;
      i++;
    }
  }
  else if (step < 0) {
    while (x > end) {
      callback(x, i, this);
      x += step;
      i++;
    }
  }
};

/**
 * Execute a callback function for each value in the Range, and return the
 * results as an array
 * @param {function} callback   The callback method is invoked with three
 *                              parameters: the value of the element, the index
 *                              of the element, and the Matrix being traversed.
 * @returns {Array} array
 */
Range.prototype.map = function map(callback) {
  var array = [];
  this.forEach(function (value, index, obj) {
    array[index] = callback(value, index, obj);
  });
  return array;
};

/**
 * Create an Array with a copy of the Ranges data
 * @returns {Array} array
 */
Range.prototype.toArray = function toArray() {
  var array = [];
  this.forEach(function (value, index) {
    array[index] = value;
  });
  return array;
};

/**
 * Create an array with a copy of the Ranges data.
 * This method is equal to Range.toArray.
 * @return {Array} vector
 */
Range.prototype.toVector = Range.prototype.toArray;

/**
 * Test if the range contains a vector. For a range, this is always the case
 * return {boolean} isVector
 */
Range.prototype.isVector = function isVector() {
  return true;
};

/**
 * Create a scalar with a copy of the data of the Range
 * Will return null if the range does not consist of a scalar value
 * @return {* | null} scalar
 */
Range.prototype.toScalar = function toScalar() {
  var array = this.toArray();
  if (array.length == 1) {
    return array[0];
  }
  else {
    return null;
  }
};

/**
 * Test whether the matrix is a scalar.
 * @return {boolean} isScalar
 */
Range.prototype.isScalar = function isScalar() {
  return (this.size()[0] == 1);
};

/**
 * Get the primitive value of the Range, a one dimensional array
 * @returns {Array} array
 */
Range.prototype.valueOf = function valueOf() {
  // TODO: implement a caching mechanism for range.valueOf()
  return this.toArray();
};

/**
 * Get a string representation of the range, with optional formatting options.
 * Output is formatted as 'start:step:end', for example '2:6' or '0:0.2:11'
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {String} str
 */
Range.prototype.format = function format(options) {
  var str = number.format(this.start, options);

  if (this.step != 1) {
    str += ':' + number.format(this.step, options);
  }
  str += ':' + number.format(this.end, options);
  return str;
};

/**
 * Get a string representation of the range.
 * @returns {String}
 */
Range.prototype.toString = function toString() {
  return this.format();
};

// exports
module.exports = Range;

// to trick my IDE which doesn't get it
exports.isRange = Range.isRange;
exports.parse = Range.parse;

util.types.addType('range', Range);

},{"../util/index":207}],202:[function(require,module,exports){
var util = require('../util/index'),

    number = util.number,
    string = util.string,
    isNumber = util.number.isNumber,
    isString = util.string.isString;

/**
 * @constructor Unit
 *
 * A unit can be constructed in the following ways:
 *     var a = new Unit(value, unit);
 *     var b = new Unit(null, unit);
 *     var c = Unit.parse(str);
 *
 * Example usage:
 *     var a = new Unit(5, 'cm');               // 50 mm
 *     var b = Unit.parse('23 kg');             // 23 kg
 *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
 *
 * @param {Number} [value]  A value like 5.2
 * @param {String} [unit]   A unit like "cm" or "inch"
 */
function Unit(value, unit) {
  if (!(this instanceof Unit)) {
    throw new Error('Unit constructor must be called with the new operator');
  }

  if (value != null && !isNumber(value)) {
    throw new TypeError('First parameter in Unit constructor must be a number');
  }
  if (unit != null && !isString(unit)) {
    throw new TypeError('Second parameter in Unit constructor must be a string');
  }

  if (unit != null) {
    // find the unit and prefix from the string
    var res = _findUnit(unit);
    if (!res) {
      throw new SyntaxError('String "' + unit + '" is no unit');
    }
    this.unit = res.unit;
    this.prefix = res.prefix;
  }
  else {
    this.unit = UNIT_NONE;
    this.prefix = PREFIX_NONE;  // link to a list with supported prefixes
  }

  if (value != null) {
    this.value = this._normalize(value);
    this.fixPrefix = false;  // is set true by the methods Unit.in and math.in
  }
  else {
    this.value = null;
    this.fixPrefix = true;
  }
}

// private variables and functions for the Unit parser
var text, index, c;

function skipWhitespace() {
  while (c == ' ' || c == '\t') {
    next();
  }
}

function isDigitDot (c) {
  return ((c >= '0' && c <= '9') || c == '.');
}

function isDigit (c) {
  return ((c >= '0' && c <= '9'));
}

function next() {
  index++;
  c = text.charAt(index);
}

function revert(oldIndex) {
  index = oldIndex;
  c = text.charAt(index);
}

function parseNumber () {
  var number = '';
  var oldIndex;
  oldIndex = index;

  if (c == '+') {
    next();
  }
  else if (c == '-') {
    number += c;
    next();
  }

  if (!isDigitDot(c)) {
    // a + or - must be followed by a digit
    revert(oldIndex);
    return null;
  }

  // get number, can have a single dot
  if (c == '.') {
    number += c;
    next();
    if (!isDigit(c)) {
      // this is no legal number, it is just a dot
      revert(oldIndex);
      return null;
    }
  }
  else {
    while (isDigit(c)) {
      number += c;
      next();
    }
    if (c == '.') {
      number += c;
      next();
    }
  }
  while (isDigit(c)) {
    number += c;
    next();
  }

  // check for scientific notation like "2.3e-4" or "1.23e50"
  if (c == 'E' || c == 'e') {
    number += c;
    next();

    if (c == '+' || c == '-') {
      number += c;
      next();
    }

    // Scientific notation MUST be followed by an exponent
    if (!isDigit(c)) {
      // this is no legal number, exponent is missing.
      revert(oldIndex);
      return null;
    }

    while (isDigit(c)) {
      number += c;
      next();
    }
  }

  return number;
}

function parseUnit() {
  var unit = '';

  skipWhitespace();
  while (c && c != ' ' && c != '\t') {
    unit += c;
    next();
  }

  return unit || null;
}

/**
 * Parse a string into a unit. Returns null if the provided string does not
 * contain a valid unit.
 * @param {String} str        A string like "5.2 inch", "4e2 kg"
 * @return {Unit | null} unit
 */
Unit.parse = function parse(str) {
  text = str;
  index = -1;
  c = '';

  if (!isString(text)) {
    return null;
  }

  next();
  skipWhitespace();
  var value = parseNumber();
  var unit;
  if (value) {
    unit = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    if (value && unit) {
      return new Unit(Number(value), unit);
    }
  }
  else {
    unit = parseUnit();

    next();
    skipWhitespace();
    if (c) {
      // garbage at the end. not good.
      return null;
    }

    return new Unit(null, unit)
  }

  return null;
};

/**
 * Test whether value is of type Unit
 * @param {*} value
 * @return {Boolean} isUnit
 */
Unit.isUnit = function isUnit(value) {
  return (value instanceof Unit);
};

/**
 * create a copy of this unit
 * @return {Unit} clone
 */
Unit.prototype.clone = function () {
  var clone = new Unit();

  for (var p in this) {
    if (this.hasOwnProperty(p)) {
      clone[p] = this[p];
    }
  }

  return clone;
};

/**
 * Normalize a value, based on its currently set unit
 * @param {Number} value
 * @return {Number} normalized value
 * @private
 */
Unit.prototype._normalize = function(value) {
  return (value + this.unit.offset) *
      this.unit.value * this.prefix.value;
};

/**
 * Unnormalize a value, based on its currently set unit
 * @param {Number} value
 * @param {Number} [prefixValue]    Optional prefix value to be used
 * @return {Number} unnormalized value
 * @private
 */
Unit.prototype._unnormalize = function (value, prefixValue) {
  if (prefixValue == undefined) {
    return value / this.unit.value / this.prefix.value -
        this.unit.offset;
  }
  else {
    return value / this.unit.value / prefixValue -
        this.unit.offset;
  }
};

/**
 * Find a unit from a string
 * @param {String} str              A string like 'cm' or 'inch'
 * @returns {Object | null} result  When found, an object with fields unit and
 *                                  prefix is returned. Else, null is returned.
 * @private
 */
function _findUnit(str) {
  for (var i = 0, iMax = UNITS.length; i < iMax; i++) {
    var UNIT = UNITS[i];

    if (string.endsWith(str, UNIT.name) ) {
      var prefixLen = (str.length - UNIT.name.length);
      var prefixName = str.substring(0, prefixLen);
      var prefix = UNIT.prefixes[prefixName];
      if (prefix !== undefined) {
        // store unit, prefix, and value
        return {
          unit: UNIT,
          prefix: prefix
        };
      }
    }
  }

  return null;
}

/**
 * Test if the given expression is a unit.
 * The unit can have a prefix but cannot have a value.
 * @param {String} unit   A plain unit without value. Can have prefix, like "cm"
 * @return {Boolean}      true if the given string is a unit
 */
Unit.isPlainUnit = function (unit) {
  return (_findUnit(unit) != null);
};

/**
 * check if this unit has given base unit
 * @param {BASE_UNITS | undefined} base
 */
Unit.prototype.hasBase = function(base) {
  if (this.unit.base === undefined) {
    return (base === undefined);
  }
  return (this.unit.base === base);
};

/**
 * Check if this unit has a base equal to another base
 * @param {Unit} other
 * @return {Boolean} true if equal base
 */
Unit.prototype.equalBase = function(other) {
  return (this.unit.base === other.unit.base);
};

/**
 * Check if this unit equals another unit
 * @param {Unit} other
 * @return {Boolean} true if both units are equal
 */
Unit.prototype.equals = function(other) {
  return (this.equalBase(other) && this.value == other.value);
};

/**
 * Create a clone of this unit with a representation
 * @param {String | Unit} plainUnit   A plain unit, without value. Can have prefix, like "cm"
 * @returns {Unit} unit having fixed, specified unit
 */
Unit.prototype['in'] = function (plainUnit) {
  var other;
  if (isString(plainUnit)) {
    other = new Unit(null, plainUnit);

    if (!this.equalBase(other)) {
      throw new Error('Units do not match');
    }

    other.value = this.value;
    return other;
  }
  else if (plainUnit instanceof Unit) {
    if (!this.equalBase(plainUnit)) {
      throw new Error('Units do not match');
    }
    if (plainUnit.value != null) {
      throw new Error('Cannot convert to a unit with a value');
    }
    if (plainUnit.unit == null) {
      throw new Error('Unit expected on the right hand side of function in');
    }

    other = plainUnit.clone();
    other.value = this.value;
    other.fixPrefix = true;
    return other;
  }
  else {
    throw new Error('String or Unit expected as parameter');
  }
};

/**
 * Return the value of the unit when represented with given plain unit
 * @param {String | Unit} plainUnit    For example 'cm' or 'inch'
 * @return {Number} value
 */
Unit.prototype.toNumber = function (plainUnit) {
  var other = this['in'](plainUnit);
  var prefix = this.fixPrefix ? other._bestPrefix() : other.prefix;
  return other._unnormalize(other.value, prefix.value);
};


/**
 * Get a string representation of the unit.
 * @return {String}
 */
Unit.prototype.toString = function toString() {
  return this.format();
};

/**
 * Get a string representation of the Unit, with optional formatting options.
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {String}
 */
Unit.prototype.format = function format(options) {
  var value,
      str;

  if (!this.fixPrefix) {
    var bestPrefix = this._bestPrefix();
    value = this._unnormalize(this.value, bestPrefix.value);
    str = (this.value != null) ? number.format(value, options) + ' ' : '';
    str += bestPrefix.name + this.unit.name;
  }
  else {
    value = this._unnormalize(this.value);
    str = (this.value != null) ? number.format(value, options) + ' ' : '';
    str += this.prefix.name + this.unit.name;
  }
  return str;
};

/**
 * Calculate the best prefix using current value.
 * @returns {Object} prefix
 * @private
 */
Unit.prototype._bestPrefix = function () {
  // find the best prefix value (resulting in the value of which
  // the absolute value of the log10 is closest to zero,
  // though with a little offset of 1.2 for nicer values: you get a
  // sequence 1mm 100mm 500mm 0.6m 1m 10m 100m 500m 0.6km 1km ...
  var absValue = Math.abs(this.value / this.unit.value);
  var bestPrefix = PREFIX_NONE;
  var bestDiff = Math.abs(
      Math.log(absValue / bestPrefix.value) / Math.LN10 - 1.2);

  var prefixes = this.unit.prefixes;
  for (var p in prefixes) {
    if (prefixes.hasOwnProperty(p)) {
      var prefix = prefixes[p];
      if (prefix.scientific) {
        var diff = Math.abs(
            Math.log(absValue / prefix.value) / Math.LN10 - 1.2);

        if (diff < bestDiff) {
          bestPrefix = prefix;
          bestDiff = diff;
        }
      }
    }
  }

  return bestPrefix;
};

var PREFIXES = {
  'NONE': {
    '': {'name': '', 'value': 1, 'scientific': true}
  },
  'SHORT': {
    '': {'name': '', 'value': 1, 'scientific': true},

    'da': {'name': 'da', 'value': 1e1, 'scientific': false},
    'h': {'name': 'h', 'value': 1e2, 'scientific': false},
    'k': {'name': 'k', 'value': 1e3, 'scientific': true},
    'M': {'name': 'M', 'value': 1e6, 'scientific': true},
    'G': {'name': 'G', 'value': 1e9, 'scientific': true},
    'T': {'name': 'T', 'value': 1e12, 'scientific': true},
    'P': {'name': 'P', 'value': 1e15, 'scientific': true},
    'E': {'name': 'E', 'value': 1e18, 'scientific': true},
    'Z': {'name': 'Z', 'value': 1e21, 'scientific': true},
    'Y': {'name': 'Y', 'value': 1e24, 'scientific': true},

    'd': {'name': 'd', 'value': 1e-1, 'scientific': false},
    'c': {'name': 'c', 'value': 1e-2, 'scientific': false},
    'm': {'name': 'm', 'value': 1e-3, 'scientific': true},
    // 'µ': {'name': 'µ', 'value': 1e-6, 'scientific': true},
    'u': {'name': 'u', 'value': 1e-6, 'scientific': true},
    'n': {'name': 'n', 'value': 1e-9, 'scientific': true},
    'p': {'name': 'p', 'value': 1e-12, 'scientific': true},
    'f': {'name': 'f', 'value': 1e-15, 'scientific': true},
    'a': {'name': 'a', 'value': 1e-18, 'scientific': true},
    'z': {'name': 'z', 'value': 1e-21, 'scientific': true},
    'y': {'name': 'y', 'value': 1e-24, 'scientific': true}
  },
  'LONG': {
    '': {'name': '', 'value': 1, 'scientific': true},

    'deca': {'name': 'deca', 'value': 1e1, 'scientific': false},
    'hecto': {'name': 'hecto', 'value': 1e2, 'scientific': false},
    'kilo': {'name': 'kilo', 'value': 1e3, 'scientific': true},
    'mega': {'name': 'mega', 'value': 1e6, 'scientific': true},
    'giga': {'name': 'giga', 'value': 1e9, 'scientific': true},
    'tera': {'name': 'tera', 'value': 1e12, 'scientific': true},
    'peta': {'name': 'peta', 'value': 1e15, 'scientific': true},
    'exa': {'name': 'exa', 'value': 1e18, 'scientific': true},
    'zetta': {'name': 'zetta', 'value': 1e21, 'scientific': true},
    'yotta': {'name': 'yotta', 'value': 1e24, 'scientific': true},

    'deci': {'name': 'deci', 'value': 1e-1, 'scientific': false},
    'centi': {'name': 'centi', 'value': 1e-2, 'scientific': false},
    'milli': {'name': 'milli', 'value': 1e-3, 'scientific': true},
    'micro': {'name': 'micro', 'value': 1e-6, 'scientific': true},
    'nano': {'name': 'nano', 'value': 1e-9, 'scientific': true},
    'pico': {'name': 'pico', 'value': 1e-12, 'scientific': true},
    'femto': {'name': 'femto', 'value': 1e-15, 'scientific': true},
    'atto': {'name': 'atto', 'value': 1e-18, 'scientific': true},
    'zepto': {'name': 'zepto', 'value': 1e-21, 'scientific': true},
    'yocto': {'name': 'yocto', 'value': 1e-24, 'scientific': true}
  },
  'BINARY_SHORT': {
    '': {'name': '', 'value': 1, 'scientific': true},
    'k': {'name': 'k', 'value': 1024, 'scientific': true},
    'M': {'name': 'M', 'value': Math.pow(1024, 2), 'scientific': true},
    'G': {'name': 'G', 'value': Math.pow(1024, 3), 'scientific': true},
    'T': {'name': 'T', 'value': Math.pow(1024, 4), 'scientific': true},
    'P': {'name': 'P', 'value': Math.pow(1024, 5), 'scientific': true},
    'E': {'name': 'E', 'value': Math.pow(1024, 6), 'scientific': true},
    'Z': {'name': 'Z', 'value': Math.pow(1024, 7), 'scientific': true},
    'Y': {'name': 'Y', 'value': Math.pow(1024, 8), 'scientific': true},

    'Ki': {'name': 'Ki', 'value': 1024, 'scientific': true},
    'Mi': {'name': 'Mi', 'value': Math.pow(1024, 2), 'scientific': true},
    'Gi': {'name': 'Gi', 'value': Math.pow(1024, 3), 'scientific': true},
    'Ti': {'name': 'Ti', 'value': Math.pow(1024, 4), 'scientific': true},
    'Pi': {'name': 'Pi', 'value': Math.pow(1024, 5), 'scientific': true},
    'Ei': {'name': 'Ei', 'value': Math.pow(1024, 6), 'scientific': true},
    'Zi': {'name': 'Zi', 'value': Math.pow(1024, 7), 'scientific': true},
    'Yi': {'name': 'Yi', 'value': Math.pow(1024, 8), 'scientific': true}
  },
  'BINARY_LONG': {
    '': {'name': '', 'value': 1, 'scientific': true},
    'kilo': {'name': 'kilo', 'value': 1024, 'scientific': true},
    'mega': {'name': 'mega', 'value': Math.pow(1024, 2), 'scientific': true},
    'giga': {'name': 'giga', 'value': Math.pow(1024, 3), 'scientific': true},
    'tera': {'name': 'tera', 'value': Math.pow(1024, 4), 'scientific': true},
    'peta': {'name': 'peta', 'value': Math.pow(1024, 5), 'scientific': true},
    'exa': {'name': 'exa', 'value': Math.pow(1024, 6), 'scientific': true},
    'zetta': {'name': 'zetta', 'value': Math.pow(1024, 7), 'scientific': true},
    'yotta': {'name': 'yotta', 'value': Math.pow(1024, 8), 'scientific': true},

    'kibi': {'name': 'kibi', 'value': 1024, 'scientific': true},
    'mebi': {'name': 'mebi', 'value': Math.pow(1024, 2), 'scientific': true},
    'gibi': {'name': 'gibi', 'value': Math.pow(1024, 3), 'scientific': true},
    'tebi': {'name': 'tebi', 'value': Math.pow(1024, 4), 'scientific': true},
    'pebi': {'name': 'pebi', 'value': Math.pow(1024, 5), 'scientific': true},
    'exi': {'name': 'exi', 'value': Math.pow(1024, 6), 'scientific': true},
    'zebi': {'name': 'zebi', 'value': Math.pow(1024, 7), 'scientific': true},
    'yobi': {'name': 'yobi', 'value': Math.pow(1024, 8), 'scientific': true}
  }
};

var PREFIX_NONE = {'name': '', 'value': 1, 'scientific': true};

var BASE_UNITS = {
  'NONE': {},

  'LENGTH': {},               // meter
  'MASS': {},                 // kilogram
  'TIME': {},                 // second
  'CURRENT': {},              // ampere
  'TEMPERATURE': {},          // kelvin
  'LUMINOUS_INTENSITY': {},   // candela
  'AMOUNT_OF_SUBSTANCE': {},  // mole

  'FORCE': {},        // Newton
  'SURFACE': {},      // m2
  'VOLUME': {},       // m3
  'ANGLE': {},        // rad
  'BIT': {}           // bit (digital)
};

BASE_UNIT_NONE = {};

UNIT_NONE = {'name': '', 'base': BASE_UNIT_NONE, 'value': 1, 'offset': 0};

var UNITS = [
  // length
  {'name': 'meter', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'inch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0},
  {'name': 'foot', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
  {'name': 'yard', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
  {'name': 'mile', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
  {'name': 'link', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
  {'name': 'rod', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
  {'name': 'chain', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
  {'name': 'angstrom', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1e-10, 'offset': 0},

  {'name': 'm', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  //{'name': 'in', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0254, 'offset': 0}, not supported, In is an operator
  {'name': 'ft', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.3048, 'offset': 0},
  {'name': 'yd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.9144, 'offset': 0},
  {'name': 'mi', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 1609.344, 'offset': 0},
  {'name': 'li', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.201168, 'offset': 0},
  {'name': 'rd', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 5.029210, 'offset': 0},
  {'name': 'ch', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 20.1168, 'offset': 0},
  {'name': 'mil', 'base': BASE_UNITS.LENGTH, 'prefixes': PREFIXES.NONE, 'value': 0.0000254, 'offset': 0}, // 1/1000 inch

  // Surface
  {'name': 'm2', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'sqin', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.00064516, 'offset': 0}, // 645.16 mm2
  {'name': 'sqft', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.09290304, 'offset': 0}, // 0.09290304 m2
  {'name': 'sqyd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 0.83612736, 'offset': 0}, // 0.83612736 m2
  {'name': 'sqmi', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 2589988.110336, 'offset': 0}, // 2.589988110336 km2
  {'name': 'sqrd', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 25.29295, 'offset': 0}, // 25.29295 m2
  {'name': 'sqch', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 404.6873, 'offset': 0}, // 404.6873 m2
  {'name': 'sqmil', 'base': BASE_UNITS.SURFACE, 'prefixes': PREFIXES.NONE, 'value': 6.4516e-10, 'offset': 0}, // 6.4516 * 10^-10 m2

  // Volume
  {'name': 'm3', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'L', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0}, // litre
  {'name': 'litre', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},
  {'name': 'cuin', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 1.6387064e-5, 'offset': 0}, // 1.6387064e-5 m3
  {'name': 'cuft', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.028316846592, 'offset': 0}, // 28.316 846 592 L
  {'name': 'cuyd', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.764554857984, 'offset': 0}, // 764.554 857 984 L
  {'name': 'teaspoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000005, 'offset': 0}, // 5 mL
  {'name': 'tablespoon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000015, 'offset': 0}, // 15 mL
  //{'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.000240, 'offset': 0}, // 240 mL  // not possible, we have already another cup

  // Liquid volume
  {'name': 'minim', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL
  {'name': 'fluiddram', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
  {'name': 'fluidounce', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
  {'name': 'gill', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
  {'name': 'cup', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
  {'name': 'pint', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
  {'name': 'quart', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
  {'name': 'gallon', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
  {'name': 'beerbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
  {'name': 'oilbarrel', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
  {'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L

  //{'name': 'min', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00000006161152, 'offset': 0}, // 0.06161152 mL // min is already in use as minute
  {'name': 'fldr', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0000036966911, 'offset': 0},  // 3.696691 mL
  {'name': 'floz', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.00002957353, 'offset': 0}, // 29.57353 mL
  {'name': 'gi', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0001182941, 'offset': 0}, // 118.2941 mL
  {'name': 'cp', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0002365882, 'offset': 0}, // 236.5882 mL
  {'name': 'pt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0004731765, 'offset': 0}, // 473.1765 mL
  {'name': 'qt', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.0009463529, 'offset': 0}, // 946.3529 mL
  {'name': 'gal', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.003785412, 'offset': 0}, // 3.785412 L
  {'name': 'bbl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1173478, 'offset': 0}, // 117.3478 L
  {'name': 'obl', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.1589873, 'offset': 0}, // 158.9873 L
  //{'name': 'hogshead', 'base': BASE_UNITS.VOLUME, 'prefixes': PREFIXES.NONE, 'value': 0.2384810, 'offset': 0}, // 238.4810 L // TODO: hh?

  // Mass
  {'name': 'g', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 0.001, 'offset': 0},
  {'name': 'gram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.LONG, 'value': 0.001, 'offset': 0},

  {'name': 'ton', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 907.18474, 'offset': 0},
  {'name': 'tonne', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.SHORT, 'value': 1000, 'offset': 0},

  {'name': 'grain', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
  {'name': 'dram', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
  {'name': 'ounce', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
  {'name': 'poundmass', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
  {'name': 'hundredweight', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},
  {'name': 'stick', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 115e-3, 'offset': 0},

  {'name': 'gr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 64.79891e-6, 'offset': 0},
  {'name': 'dr', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 1.7718451953125e-3, 'offset': 0},
  {'name': 'oz', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 28.349523125e-3, 'offset': 0},
  {'name': 'lbm', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 453.59237e-3, 'offset': 0},
  {'name': 'cwt', 'base': BASE_UNITS.MASS, 'prefixes': PREFIXES.NONE, 'value': 45.359237, 'offset': 0},

  // Time
  {'name': 's', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'min', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'h', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'seconds', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'second', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'sec', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'minutes', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'minute', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 60, 'offset': 0},
  {'name': 'hours', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'hour', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 3600, 'offset': 0},
  {'name': 'day', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},
  {'name': 'days', 'base': BASE_UNITS.TIME, 'prefixes': PREFIXES.NONE, 'value': 86400, 'offset': 0},

  // Angles
  {'name': 'rad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'deg', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.017453292519943295769236907684888, 'offset': 0},  // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
  {'name': 'grad', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 0.015707963267948966192313216916399, 'offset': 0}, // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
  {'name': 'cycle', 'base': BASE_UNITS.ANGLE, 'prefixes': PREFIXES.NONE, 'value': 6.2831853071795864769252867665793, 'offset': 0},  // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793

  // Electric current
  {'name': 'A', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'ampere', 'base': BASE_UNITS.CURRENT, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},

  // Temperature
  // K(C) = °C + 273.15
  // K(F) = (°F + 459.67) / 1.8
  // K(R) = °R / 1.8
  {'name': 'K', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'degC', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
  {'name': 'degF', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
  {'name': 'degR', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},
  {'name': 'kelvin', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'celsius', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 273.15},
  {'name': 'fahrenheit', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 459.67},
  {'name': 'rankine', 'base': BASE_UNITS.TEMPERATURE, 'prefixes': PREFIXES.NONE, 'value': 1/1.8, 'offset': 0},

  // amount of substance
  {'name': 'mol', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'mole', 'base': BASE_UNITS.AMOUNT_OF_SUBSTANCE, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

  // luminous intensity
  {'name': 'cd', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  {'name': 'candela', 'base': BASE_UNITS.LUMINOUS_INTENSITY, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  // TODO: units STERADIAN
  //{'name': 'sr', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},
  //{'name': 'steradian', 'base': BASE_UNITS.STERADIAN, 'prefixes': PREFIXES.NONE, 'value': 1, 'offset': 0},

  // Force
  {'name': 'N', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.SHORT, 'value': 1, 'offset': 0},
  {'name': 'newton', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.LONG, 'value': 1, 'offset': 0},
  {'name': 'lbf', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},
  {'name': 'poundforce', 'base': BASE_UNITS.FORCE, 'prefixes': PREFIXES.NONE, 'value': 4.4482216152605, 'offset': 0},

  // Binary
  {'name': 'b', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 1, 'offset': 0},
  {'name': 'bits', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 1, 'offset': 0},
  {'name': 'B', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_SHORT, 'value': 8, 'offset': 0},
  {'name': 'bytes', 'base': BASE_UNITS.BIT, 'prefixes': PREFIXES.BINARY_LONG, 'value': 8, 'offset': 0}
];

Unit.PREFIXES = PREFIXES;
Unit.BASE_UNITS = BASE_UNITS;
Unit.UNITS = UNITS;


// exports
module.exports = Unit;

// to trick my IDE which doesn't get it
exports.isUnit = Unit.isUnit;
exports.isPlainUnit = Unit.isPlainUnit;
exports.parse = Unit.parse;

util.types.addType('unit', Unit);

},{"../util/index":207}],203:[function(require,module,exports){
// utility methods for arrays and matrices

var util = require('../util/index'),

    Matrix = require('./Matrix'),

    isArray = util.array.isArray,
    isString = util.string.isString;

/**
 * Convert function arguments to an array. Arguments can have the following
 * signature:
 *     fn()
 *     fn(n)
 *     fn(m, n, p, ...)
 *     fn([m, n, p, ...])
 * @param {...Number | Array | Matrix} args
 * @returns {Array} array
 */
exports.argsToArray = function argsToArray(args) {
  var array;
  if (args.length == 0) {
    // fn()
    array = [];
  }
  else if (args.length == 1) {
    // fn(n)
    // fn([m, n, p, ...])
    array = args[0];
    if (array instanceof Matrix) {
      array = array.toVector();
    }
    if (!isArray(array)) {
      array = [array];
    }
  }
  else {
    // fn(m, n, p, ...)
    array = Array.prototype.slice.apply(args);
  }
  return array;
};


/**
 * Test whether a value is a collection: an Array or Matrix
 * @param {*} x
 * @returns {boolean} isCollection
 */
exports.isCollection = function isCollection (x) {
  return (isArray(x) || (x instanceof Matrix));
};

/**
 * Execute the callback function element wise for each element in array and any
 * nested array
 * Returns an array with the results
 * @param {Array | Matrix} array
 * @param {function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @return {Array | Matrix} res
 */
exports.deepMap = function deepMap(array, callback) {
  if (array && (typeof array.map === 'function')) {
    return array.map(function (x) {
      return deepMap(x, callback);
    });
  }
  else {
    return callback(array);
  }
};

/**
 * Execute the callback function element wise for each entry in two given arrays,
 * and for any nested array. Objects can also be scalar objects.
 * Returns an array with the results.
 * @param {Array | Matrix | Object} array1
 * @param {Array | Matrix | Object} array2
 * @param {function} callback   The callback is called with two parameters:
 *                              value1 and value2, which contain the current
 *                              element of both arrays.
 * @return {Array | Matrix} res
 */
exports.deepMap2 = function deepMap2(array1, array2, callback) {
  var res, len, i;

  if (isArray(array1)) {
    if (isArray(array2)) {
      // callback(array, array)
      if (array1.length != array2.length) {
        throw new RangeError('Dimension mismatch ' +
            '(' +  array1.length + ' != ' + array2.length + ')');
      }

      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1[i], array2[i], callback);
      }
    }
    else if (array2 instanceof Matrix) {
      // callback(array, matrix)
      res = deepMap2(array1, array2.valueOf(), callback);
      return new Matrix(res);
    }
    else {
      // callback(array, object)
      res = [];
      len = array1.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1[i], array2, callback);
      }
    }
  }
  else if (array1 instanceof Matrix) {
    if (array2 instanceof Matrix) {
      // callback(matrix, matrix)
      res = deepMap2(array1.valueOf(), array2.valueOf(), callback);
      return new Matrix(res);
    }
    else {
      // callback(matrix, array)
      // callback(matrix, object)
      res = deepMap2(array1.valueOf(), array2, callback);
      return new Matrix(res);
    }
  }
  else {
    if (isArray(array2)) {
      // callback(object, array)
      res = [];
      len = array2.length;
      for (i = 0; i < len; i++) {
        res[i] = deepMap2(array1, array2[i], callback);
      }
    }
    else {
      // callback(object, object)
      res = callback(array1, array2);
    }
  }

  return res;
};

/**
 * Reduce a given matrix or array to a new matrix or
 * array with one less dimension, aplying the given
 * callback in the selected dimension.
 * @param {Array | Matrix} mat
 * @param {Integer} dimension
 * @param {function} callback
 * @return {Array | Matrix} res
 */
exports.reduce = function reduce (mat, dim, callback) {
	if (mat instanceof Matrix) {
		return new Matrix(_reduce(mat.valueOf(), dim, callback));
	}else {
		return _reduce(mat, dim, callback);
	}
}

function _reduce(mat, dim, callback){
	if(dim<=0){
		if( !isArray(mat[0]) ){
			var i;
			var val = mat[0];
			for(i=1; i<mat.length; i++){
				val = callback(val, mat[i]);
			}
			return val;
		}else{
			var tran = _switch(mat);
			var i;
			var ret = [];
			for(i=0; i<tran.length; i++){
				ret[i] = _reduce(tran[i], dim-1, callback);
			}
			return ret
		}
	}else{
		var i;
		var ret = [];
		for(i=0; i<mat.length; i++){
			ret[i] = _reduce(mat[i], dim-1, callback);
		}
		return ret;
	}
}

function _switch(mat){
    var I = mat.length;
    var J = mat[0].length;
    var i, j;
    var ret = new Array();
    for( j=0; j<J; j++) {
        var tmp = new Array();
        for( i=0; i<I; i++) {
            tmp.push(mat[i][j]);
        }
        ret.push(tmp);
    }
    return ret;
}

/**
 * Recursively loop over all elements in a given multi dimensional array
 * and invoke the callback on each of the elements.
 * @param {Array | Matrix} array
 * @param {function} callback     The callback method is invoked with one
 *                                parameter: the current element in the array
 */
exports.deepForEach = function deepForEach (array, callback) {
  if (array instanceof Matrix) {
    array = array.valueOf();
  }

  for (var i = 0, ii = array.length; i < ii; i++) {
    var value = array[i];

    if (isArray(value)) {
      deepForEach(value, callback);
    }
    else {
      callback(value);
    }
  }
};

},{"../util/index":207,"./Matrix":200}],204:[function(require,module,exports){
var number = require('./number'),
    string = require('./string'),
    object = require('./object'),
    types = require('./types'),
    isArray = Array.isArray;

/**
 * Recursively calculate the size of a multi dimensional array.
 * @param {Array} x
 * @Return {Number[]} size
 * @private
 */
function _size(x) {
  if (Array.isArray(x)) {
    var len = x.length;

    var size = len ? _size(x[0]) : [];
    size.unshift(len);
    return size;
  }
  else {
    return [];
  }
}

/**
 * Calculate the size of a multi dimensional array.
 * All elements in the array are checked for matching dimensions using the
 * method validate
 * @param {Array} x
 * @Return {Number[]} size
 * @throws RangeError
 */
exports.size = function size (x) {
  // calculate the size
  var s = _size(x);

  // verify the size
  exports.validate(x, s);
  // TODO: don't validate here? only in a Matrix constructor?

  return s;
};

/**
 * Recursively validate whether each element in a multi dimensional array
 * has a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with the size of each dimension
 * @param {Number} dim   Current dimension
 * @throws RangeError
 * @private
 */
function _validate(array, size, dim) {
  var i;
  var len = array.length;

  if (len != size[dim]) {
    throw new RangeError('Dimension mismatch (' + len + ' != ' + size[dim] + ')');
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      var child = array[i];
      if (!Array.isArray(child)) {
        throw new RangeError('Dimension mismatch ' +
            '(' + (size.length - 1) + ' < ' + size.length + ')');
      }
      _validate(array[i], size, dimNext);
    }
  }
  else {
    // last dimension. none of the childs may be an array
    for (i = 0; i < len; i++) {
      if (Array.isArray(array[i])) {
        throw new RangeError('Dimension mismatch ' +
            '(' + (size.length + 1) + ' > ' + size.length + ')');
      }
    }
  }
}

/**
 * Validate whether each element in a multi dimensional array has
 * a size corresponding to the provided size array.
 * @param {Array} array    Array to be validated
 * @param {Number[]} size  Array with the size of each dimension
 * @throws RangeError
 */
exports.validate = function validate(array, size) {
  var isScalar = (size.length == 0);
  if (isScalar) {
    // scalar
    if (Array.isArray(array)) {
      throw new RangeError('Dimension mismatch (' + array.length + ' != 0)');
    }
  }
  else {
    // array
    _validate(array, size, 0);
  }
};

/**
 * Test whether index is an integer number with index >= 0 and index < length
 * @param {*} index         Zero-based index
 * @param {Number} [length] Length of the array
 */
exports.validateIndex = function validateIndex (index, length) {
  if (!number.isNumber(index) || !number.isInteger(index)) {
    throw new TypeError('Index must be an integer (value: ' + index + ')');
  }
  if (index < 0) {
    throw new RangeError('Index out of range (' + index + ' < 0)');
  }
  if (length !== undefined && index >= length) {
    throw new RangeError('Index out of range (' + index + ' > ' + (length - 1) +  ')');
  }
};

/**
 * Recursively resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {Number[]} size       Array with the size of each dimension
 * @param {Number} dim          Current dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              0 by default.
 * @private
 */
function _resize (array, size, dim, defaultValue) {
  if (!Array.isArray(array)) {
    throw new TypeError('Array expected');
  }

  var len = array.length,
      newLen = size[dim];

  if (len != newLen) {
    if(newLen > array.length) {
      // enlarge
      for (var i = array.length; i < newLen; i++) {
        array[i] = defaultValue ? object.clone(defaultValue) : 0;
      }
    }
    else {
      // shrink
      array.length = size[dim];
    }
    len = array.length;
  }

  if (dim < size.length - 1) {
    // recursively validate each child array
    var dimNext = dim + 1;
    for (i = 0; i < len; i++) {
      child = array[i];
      if (!Array.isArray(child)) {
        child = [child];
        array[i] = child;
      }
      _resize(child, size, dimNext, defaultValue);
    }
  }
  else {
    // last dimension
    for (i = 0; i < len; i++) {
      var child = array[i];
      while (Array.isArray(child)) {
        child = child[0];
      }
      array[i] = child;
    }
  }
}

/**
 * Resize a multi dimensional array
 * @param {Array} array         Array to be resized
 * @param {Array.<Number>} size Array with the size of each dimension
 * @param {*} [defaultValue]    Value to be filled in in new entries,
 *                              0 by default
 */
exports.resize = function resize(array, size, defaultValue) {
  // TODO: what to do with scalars, when size=[] ?

  // check the type of size
  if (!Array.isArray(size)) {
    throw new TypeError('Size must be an array (size is ' + types.type(size) + ')');
  }

  // check whether size contains positive integers
  size.forEach(function (value) {
    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
      throw new TypeError('Invalid size, must contain positive integers ' +
          '(size: ' + string.format(size) + ')');
    }
  });

  /* TODO: cleanup
  var hasZeros = (size.indexOf(0) != -1);
  if (hasZeros) {
    // array where all dimensions are zero
    size.forEach(function (value) {
      if (value != 0) {
        throw new RangeError('Invalid size, all dimensions must be ' +
            'either zero or non-zero (size: ' + string.format(size) + ')');
      }
    });
  }
  */

  // recursively resize
  _resize(array, size, 0, defaultValue);
};

/**
 * Squeeze a multi dimensional array
 * @param {Array} array
 * @return {Array} array
 * @private
 */
exports.squeeze = function squeeze(array) {
  while(isArray(array) && array.length === 1) {
    array = array[0];
  }

  return array;
};

/**
 * Unsqueeze a multi dimensional array: add dimensions when missing
 * @param {Array} array
 * @param {Number} dims   Number of desired dimensions
 * @return {Array} array
 * @private
 */
exports.unsqueeze = function unsqueeze(array, dims) {
  var size = exports.size(array);

  for (var i = 0, ii = (dims - size.length); i < ii; i++) {
    array = [array];
  }

  return array;
};

/**
 * Test whether an object is an array
 * @param {*} value
 * @return {Boolean} isArray
 */
exports.isArray = Array.isArray;
},{"./number":208,"./object":209,"./string":210,"./types":211}],205:[function(require,module,exports){
/**
 * Test whether value is a Boolean
 * @param {*} value
 * @return {Boolean} isBoolean
 */
exports.isBoolean = function isBoolean(value) {
  return (value instanceof Boolean) || (typeof value == 'boolean');
};

},{}],206:[function(require,module,exports){
var types = require('./types');

/**
 * Create a TypeError with message:
 *      'Function <fn> does not support a parameter of type <type>';
 * @param {String} name   Function name
 * @param {*} value1
 * @param {*} [value2]
 * @extends TypeError
 */
exports.UnsupportedTypeError = function UnsupportedTypeError(name, value1, value2) {
  if (arguments.length == 2) {
    var t = types.type(value1);
    this.message = 'Function ' + name + '(' + t + ') not supported';
  }
  else if (arguments.length > 2) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
      args.push(types.type(arguments[i]));
    }
    this.message = 'Function ' + name + '(' + args.join(', ') + ') not supported';
  }
  else {
    this.message = 'Unsupported parameter in function ' + name;
  }
};

exports.UnsupportedTypeError.prototype = new TypeError();
exports.UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

/**
 * Create a syntax error with the message:
 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
 * @param {String} name   Function name
 * @param {Number} count  Actual argument count
 * @param {Number} min    Minimum required argument count
 * @param {Number} [max]  Maximum required argument count
 * @extends SyntaxError
 */
exports.ArgumentsError = function ArgumentsError(name, count, min, max) {
  this.message = 'Wrong number of arguments in function ' + name +
      ' (' + count + ' provided, ' +
      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';
};

exports.ArgumentsError.prototype = new SyntaxError();
exports.ArgumentsError.prototype.name = 'ArgumentError';

},{"./types":211}],207:[function(require,module,exports){
exports.array = require('./array');
exports.boolean = require('./boolean');
exports.error = require('./error');
exports.number = require('./number');
exports.object = require('./object');
exports.string = require('./string');
exports.types = require('./types');

},{"./array":204,"./boolean":205,"./error":206,"./number":208,"./object":209,"./string":210,"./types":211}],208:[function(require,module,exports){
/**
 * Test whether value is a Number
 * @param {*} value
 * @return {Boolean} isNumber
 */
exports.isNumber = function isNumber(value) {
  return (value instanceof Number) || (typeof value == 'number');
};

/**
 * Test whether value is a Number or a Boolean
 * @param {*} value
 * @return {Boolean} isNumberOrBoolean
 */
exports.isNumBool = function isNumBool(value) {
  var type = typeof value;
  return (type === 'number') || (type === 'boolean') ||
      (value instanceof Number) || (value instanceof Boolean);
};

/**
 * Check if a number is integer
 * @param {Number | Boolean} value
 * @return {Boolean} isInteger
 */
exports.isInteger = function isInteger(value) {
  return (value == Math.round(value));
  // Note: we use ==, not ===, as we can have Booleans as well
};

/**
 * Calculate the sign of a number
 * @param {Number} x
 * @returns {*}
 */
exports.sign = function sign (x) {
  if (x > 0) {
    return 1;
  }
  else if (x < 0) {
    return -1;
  }
  else {
    return 0;
  }
};

/**
 * Convert a number to a formatted string representation.
 *
 * Syntax:
 *
 *    format(value)
 *    format(value, options)
 *    format(value, precision)
 *    format(value, fn)
 *
 * Where:
 *
 *    {Number} value   The value to be formatted
 *    {Object} options An object with formatting options. Available options:
 *                     {String} notation
 *                         Number notation. Choose from:
 *                         'fixed'          Always use regular number notation.
 *                                          For example '123.40' and '14000000'
 *                         'scientific'     Always use scientific notation.
 *                                          For example '1.234e+2' and '1.4e+7'
 *                         'auto' (default) Regular number notation for numbers
 *                                          having an absolute value between
 *                                          `lower` and `upper` bounds, and uses
 *                                          scientific notation elsewhere.
 *                                          Lower bound is included, upper bound
 *                                          is excluded.
 *                                          For example '123.4' and '1.4e7'.
 *                     {Number} precision   A number between 0 and 16 to round
 *                                          the digits of the number.
 *                                          In case of notations 'scientific' and
 *                                          'auto', `precision` defines the total
 *                                          number of significant digits returned
 *                                          and is undefined by default.
 *                                          In case of notation 'fixed',
 *                                          `precision` defines the number of
 *                                          significant digits after the decimal
 *                                          point, and is 0 by default.
 *                     {Object} scientific  An object containing two parameters,
 *                                          {Number} lower and {Number} upper,
 *                                          used by notation 'auto' to determine
 *                                          when to return scientific notation.
 *                                          Default values are `lower=1e-3` and
 *                                          `upper=1e5`.
 *                                          Only applicable for notation `auto`.
 *    {Function} fn    A custom formatting function. Can be used to override the
 *                     built-in notations. Function `fn` is called with `value` as
 *                     parameter and must return a string. Is useful for example to
 *                     format all values inside a matrix in a particular way.
 *
 * Examples:
 *
 *    format(6.4);                                        // '6.4'
 *    format(1240000);                                    // '1.24e6'
 *    format(1/3);                                        // '0.3333333333333333'
 *    format(1/3, 3);                                     // '0.333'
 *    format(21385, 2);                                   // '21000'
 *    format(12.071, {notation: 'fixed'});                // '12'
 *    format(2.3,    {notation: 'fixed', precision: 2});  // '2.30'
 *    format(52.8,   {notation: 'scientific'});           // '5.28e+1'
 *
 * @param {Number} value
 * @param {Object | Function | Number} [options]
 * @return {String} str The formatted value
 */
exports.format = function format(value, options) {
  if (typeof options === 'function') {
    // handle format(value, fn)
    return options(value);
  }

  // handle special cases
  if (value === Infinity) {
    return 'Infinity';
  }
  else if (value === -Infinity) {
    return '-Infinity';
  }
  else if (isNaN(value)) {
    return 'NaN';
  }

  // default values for options
  var notation = 'auto';
  var precision = undefined;

  if (options !== undefined) {
    // determine notation from options
    if (options.notation) {
      notation = options.notation;
    }

    // determine precision from options
    if (options) {
      if (exports.isNumber(options)) {
        precision = options;
      }
      else if (options.precision) {
        precision = options.precision;
      }
    }
  }

  // handle the various notations
  switch (notation) {
    case 'fixed':
      return value.toFixed(precision);

    case 'scientific':
      return exports.toScientific(value, precision);

    case 'auto':
      // determine lower and upper bound for scientific notation.
      var lower = 1e-3;
      var upper = 1e5;
      if (options && options.scientific) {
        if (options.scientific.lower !== undefined) {
          lower = options.scientific.lower;
        }
        if (options.scientific.upper !== undefined) {
          upper = options.scientific.upper;
        }
      }

      // handle special case zero
      if (value === 0) {
        return '0';
      }

      // determine whether or not to output scientific notation
      var abs = Math.abs(value);
      var str;
      if (abs >= lower && abs < upper) {
        // normal number notation
        str = parseFloat(value.toPrecision(precision)) + '';
      }
      else {
        // scientific notation
        str = exports.toScientific(value, precision)
            .replace(/e\+/, 'e'); // remove unnecessary e+ character
      }

      // remove trailing zeros after the decimal point
      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
        var digits = arguments[2];
        var e = arguments[4];
        return (digits !== '.') ? digits + e : e;
      });

    default:
      throw new Error('Unknown notation "' + notation + '". ' +
          'Choose "auto", "scientific", or "fixed".');
  }
};

/**
 * Format a number in scientific notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
 * @param {Number} value
 * @param {Number} [precision]  Number of digits in formatted output.
 *                              If not provided, the maximum available digits
 *                              is used.
 * @returns {string} str
 */
exports.toScientific = function toScientific (value, precision) {
  if (precision !== undefined) {
    return value.toExponential(precision - 1);
  }
  else {
    return value.toExponential();
  }
};

},{}],209:[function(require,module,exports){
var number = require('./number'),
    string = require('./string'),
    bool = require('./boolean');

/**
 * Clone an object
 *
 *     clone(x)
 *
 * @param {*} x
 * @return {*} clone
 */
exports.clone = function clone(x) {
  if (x == null) {
    // null or undefined
    return x;
  }

  if (typeof(x.clone) === 'function') {
    return x.clone();
  }

  if (number.isNumber(x) || string.isString(x) || bool.isBoolean(x)) {
    return x;
  }

  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value);
    });
  }

  if (x instanceof Object) {
    var m = {};
    for (var key in x) {
      if (x.hasOwnProperty(key)) {
        m[key] = clone(x[key]);
      }
    }
  }

  throw new TypeError('Cannot clone ' + x);
};

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
exports.extend = function extend (a, b) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      a[prop] = b[prop];
    }
  }
  return a;
};

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
exports.deepExtend = function deepExtend (a, b) {
  for (var prop in b) {
    if (b.hasOwnProperty(prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {};
        }
        if (a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop]);
        }
        else {
          a[prop] = b[prop];
        }
      } else {
        a[prop] = b[prop];
      }
    }
  }
  return a;
};

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
exports.deepEqual = function deepEqual (a, b) {
  var prop, i, len;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false;
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!exports.deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false;
    }

    for (prop in a) {
      if (a.hasOwnProperty(prop)) {
        if (!exports.deepEqual(a[prop], b[prop])) {
          return false;
        }
      }
    }
    for (prop in b) {
      if (b.hasOwnProperty(prop)) {
        if (!exports.deepEqual(a[prop], b[prop])) {
          return false;
        }
      }
    }
    return true;
  }
  else {
    return (a.valueOf() == b.valueOf());
  }
};

},{"./boolean":205,"./number":208,"./string":210}],210:[function(require,module,exports){
var number = require('./number');

/**
 * Test whether value is a String
 * @param {*} value
 * @return {Boolean} isString
 */
exports.isString = function isString(value) {
  return (value instanceof String) || (typeof value == 'string');
};

/**
 * Check if a text ends with a certain string.
 * @param {String} text
 * @param {String} search
 */
exports.endsWith = function endsWith(text, search) {
  var start = text.length - search.length;
  var end = text.length;
  return (text.substring(start, end) === search);
};

/**
 * Format a value of any type into a string.
 *
 * Usage:
 *     math.format(value)
 *     math.format(value, precision)
 *
 * Example usage:
 *     math.format(2/7);                // '0.2857142857142857'
 *     math.format(math.pi, 3);         // '3.14'
 *     math.format(new Complex(2, 3));  // '2 + 3i'
 *     math.format('hello');            // '"hello"'
 *
 * @param {*} value             Value to be stringified
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @return {String} str
 */
exports.format = function format(value, options) {
  if (number.isNumber(value)) {
    return number.format(value, options);
  }

  if (Array.isArray(value)) {
    return formatArray(value, options);
  }

  if (exports.isString(value)) {
    return '"' + value + '"';
  }

  if (value instanceof Object) {
    if (typeof value.format === 'function') {
      return value.format(options);
    }
    else {
      return value.toString();
    }
  }

  return String(value);
};

/**
 * Recursively format an n-dimensional matrix
 * Example output: "[[1, 2], [3, 4]]"
 * @param {Array} array
 * @param {Object | Number | Function} [options]  Formatting options. See
 *                                                lib/util/number:format for a
 *                                                description of the available
 *                                                options.
 * @returns {String} str
 */
function formatArray (array, options) {
  if (Array.isArray(array)) {
    var str = '[';
    var len = array.length;
    for (var i = 0; i < len; i++) {
      if (i != 0) {
        str += ', ';
      }
      str += formatArray(array[i], options);
    }
    str += ']';
    return str;
  }
  else {
    return exports.format(array, options);
  }
}

},{"./number":208}],211:[function(require,module,exports){
/**
 * Determine the type of a variable
 *
 *     typeof(x)
 *
 * @param {*} x
 * @return {String} type  Lower case type, for example "number", "string",
 *                        "array".
 */
exports.type = function type (x) {
  var type = typeof x,
      name;

  if (type === 'object') {
    if (x === null) {
      return 'null';
    }
    if (x instanceof Boolean) {
      return 'boolean';
    }
    if (x instanceof Number) {
      return 'number';
    }
    if (x instanceof String) {
      return 'string';
    }
    if (Array.isArray(x)) {
      return 'array';
    }
    if (x instanceof Date) {
      return 'date';
    }
    if (x.constructor) {
      // search data types
      for (name in types) {
        if (types.hasOwnProperty(name)) {
          if (x.constructor == types[name]) {
            return name.toLowerCase();
          }
        }
      }

      // try the constructors name as last resort
      if (x.constructor.name) {
        return x.constructor.name.toLowerCase();
      }
    }
  }

  return type;
};

/**
 * Custom registered types, for example {'matrix': Matrix}
 * @private
 */
var types = {};

/**
 * Register a new type, for example addType('matrix', Matrix)
 * @param {String} name                     Lower case name of the type
 * @param {Function} type                   Prototype function of the type
 */
exports.addType = function addType (name, type) {
  types[name] = type;
};

},{}]},{},[1])(1)
});
;/**
 * Compatibility shims for legacy JavaScript engines
 */

// http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj){
    for(var i = 0; i < this.length; i++){
      if(this[i] == obj){
        return i;
      }
    }
    return -1;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope || this, this[i], i, this);
    }
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);

    // 7. Let k be 0
    k = 0;

    // 8. Repeat, while k < len
    while(k < len) {

      var kValue, mappedValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.

        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }

    // 9. return A
    return A;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function(fun /*, thisp */) {
    "use strict";

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisp */) {
    "use strict";

    if (this == null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function") {
      throw new TypeError();
    }

    var thisp = arguments[1];
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
              ? this
              : oThis,
              aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
