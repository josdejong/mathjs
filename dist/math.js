/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * @version 1.2.0
 * @date    2014-12-25
 *
 * @license
 * Copyright (C) 2013-2014 Jos de Jong <wjosdejong@gmail.com>
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

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["math"] = factory();
	else
		root["math"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var object = __webpack_require__(3);
	var digits = __webpack_require__(4).digits;

	/**
	 * math.js factory function.
	 *
	 * @param {Object} [config] Available configuration options:
	 *                            {String} matrix
	 *                              A string 'matrix' (default) or 'array'.
	 *                            {String} number
	 *                              A string 'number' (default) or 'bignumber'
	 *                            {Number} precision
	 *                              The number of significant digits for BigNumbers.
	 *                              Not applicable for Numbers.
	 */
	function create (config) {
	  // simple test for ES5 support
	  if (typeof Object.create !== 'function') {
	    throw new Error('ES5 not supported by this JavaScript engine. ' +
	        'Please load the es5-shim and es5-sham library for compatibility.');
	  }

	  // create namespace
	  var math = {};

	  // create configuration options. These are private
	  var _config = {
	    // type of default matrix output. Choose 'matrix' (default) or 'array'
	    matrix: 'matrix',

	    // type of default number output. Choose 'number' (default) or 'bignumber'
	    number: 'number',

	    // number of significant digits in BigNumbers
	    precision: 64,

	    // minimum relative difference between two compared values,
	    // used by all comparison functions
	    epsilon: 1e-14
	  };

	  /**
	   * Set configuration options for math.js, and get current options
	   * @param {Object} [options] Available options:
	   *                            {String} matrix
	   *                              A string 'matrix' (default) or 'array'.
	   *                            {String} number
	   *                              A string 'number' (default) or 'bignumber'
	   *                            {Number} precision
	   *                              The number of significant digits for BigNumbers.
	   *                              Not applicable for Numbers.
	   * @return {Object} Returns the current configuration
	   */
	  math.config = function(options) {
	    if (options) {
	      // merge options
	      object.deepExtend(_config, options);

	      if (options.precision) {
	        math.type.BigNumber.config({
	          precision: options.precision
	        });
	      }

	      // reload the constants (they depend on option number and precision)
	      // this must be done after math.type.BigNumber.config is applied
	      __webpack_require__(2)(math, _config);

	      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
	      if (options.number && options.number.defaultType) {
	        throw new Error('setting `number.defaultType` is deprecated. Use `number` instead.')
	      }

	      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
	      if (options.number && options.number.precision) {
	        throw new Error('setting `number.precision` is deprecated. Use `precision` instead.')
	      }

	      // TODO: remove deprecated setting some day (deprecated since version 0.17.0)
	      if (options.matrix && options.matrix.defaultType) {
	        throw new Error('setting `matrix.defaultType` is deprecated. Use `matrix` instead.')
	      }

	      // TODO: remove deprecated setting some day (deprecated since version 0.15.0)
	      if (options.matrix && options.matrix['default']) {
	        throw new Error('setting `matrix.default` is deprecated. Use `matrix` instead.')
	      }

	      // TODO: remove deprecated setting some day (deprecated since version 0.20.0)
	      if (options.decimals) {
	        throw new Error('setting `decimals` is deprecated. Use `precision` instead.')
	      }
	    }

	    // return a clone of the settings
	    return object.clone(_config);
	  };

	  /**
	   * math.js factory function. Creates a new instance of math.js
	   *
	   * @param {Object} [config] Available configuration options:
	   *                            {String} matrix
	   *                              A string 'matrix' (default) or 'array'.
	   *                            {String} number
	   *                              A string 'number' (default) or 'bignumber'
	   *                            {Number} precision
	   *                              The number of significant digits for BigNumbers.
	   *                              Not applicable for Numbers.
	   */
	  math.create = create;

	  // create a new BigNumber factory for this instance of math.js
	  var BigNumber = __webpack_require__(159).constructor();

	  // extend BigNumber with a function clone
	  if (typeof BigNumber.prototype.clone !== 'function') {
	    /**
	     * Clone a bignumber
	     * @return {BigNumber} clone
	     */
	    BigNumber.prototype.clone = function() {
	      return this; // just return itself (a BigNumber is immutable)
	    };
	  }

	  // extend BigNumber with a function convert
	  if (typeof BigNumber.convert !== 'function') {
	    /**
	     * Try to convert a Number in to a BigNumber.
	     * If the number has 15 or mor significant digits, the Number cannot be
	     * converted to BigNumber and will return the original number.
	     * @param {Number} number
	     * @return {BigNumber | Number} bignumber
	     */
	    BigNumber.convert = function(number) {
	      if (digits(number) > 15) {
	        return number;
	      }
	      else {
	        return new BigNumber(number);
	      }
	    };
	  }
	  else {
	    throw new Error('Cannot add function convert to BigNumber: function already exists');
	  }

	  // errors
	  math.error = __webpack_require__(5);

	  // types (Matrix, Complex, Unit, ...)
	  math.type = {};
	  math.type.Complex = __webpack_require__(6);
	  math.type.Range = __webpack_require__(7);
	  math.type.Index = __webpack_require__(8);
	  math.type.Matrix = __webpack_require__(9);
	  math.type.Unit = __webpack_require__(10);
	  math.type.Help = __webpack_require__(11);
	  math.type.ResultSet = __webpack_require__(12);
	  math.type.BigNumber = BigNumber;

	  math.collection = __webpack_require__(13);

	  // expression (parse, Parser, nodes, docs)
	  math.expression = {};
	  math.expression.node = __webpack_require__(16);
	  math.expression.parse = __webpack_require__(14);
	  math.expression.Parser = __webpack_require__(15);
	  math.expression.docs = __webpack_require__(17);

	  // expression parser
	  __webpack_require__(29)(math, _config);
	  __webpack_require__(30)(math, _config);
	  __webpack_require__(31)(math, _config);
	  __webpack_require__(32)(math, _config);

	  // functions - arithmetic
	  __webpack_require__(33)(math, _config);
	  __webpack_require__(34)(math, _config);
	  __webpack_require__(35)(math, _config);
	  __webpack_require__(36)(math, _config);
	  __webpack_require__(37)(math, _config);
	  __webpack_require__(38)(math, _config);
	  __webpack_require__(39)(math, _config);
	  __webpack_require__(40)(math, _config);
	  __webpack_require__(41)(math, _config);
	  __webpack_require__(42)(math, _config);
	  __webpack_require__(43)(math, _config);
	  __webpack_require__(44)(math, _config);
	  __webpack_require__(45)(math, _config);
	  __webpack_require__(46)(math, _config);
	  __webpack_require__(47)(math, _config);
	  __webpack_require__(48)(math, _config);
	  __webpack_require__(49)(math, _config);
	  __webpack_require__(50)(math, _config);
	  __webpack_require__(51)(math, _config);
	  __webpack_require__(52)(math, _config);
	  __webpack_require__(53)(math, _config);
	  __webpack_require__(54)(math, _config);
	  __webpack_require__(55)(math, _config);
	  __webpack_require__(56)(math, _config);
	  __webpack_require__(57)(math, _config);
	  __webpack_require__(58)(math, _config);
	  __webpack_require__(59)(math, _config);
	  __webpack_require__(60)(math, _config);
	  __webpack_require__(61)(math, _config);

	  // functions - bitwise
	  __webpack_require__(62)(math, _config);
	  __webpack_require__(63)(math, _config);
	  __webpack_require__(64)(math, _config);
	  __webpack_require__(65)(math, _config);
	  __webpack_require__(66)(math, _config);
	  __webpack_require__(67)(math, _config);
	  __webpack_require__(68)(math, _config);

	  // functions - complex
	  __webpack_require__(69)(math, _config);
	  __webpack_require__(70)(math, _config);
	  __webpack_require__(71)(math, _config);
	  __webpack_require__(72)(math, _config);

	  // functions - construction
	  __webpack_require__(73)(math, _config);
	  __webpack_require__(74)(math, _config);
	  __webpack_require__(75)(math, _config);
	  __webpack_require__(76)(math, _config);
	  __webpack_require__(77)(math, _config);
	  __webpack_require__(78)(math, _config);
	  __webpack_require__(79)(math, _config);
	  __webpack_require__(80)(math, _config);
	  __webpack_require__(81)(math, _config);
	  __webpack_require__(82)(math, _config);

	  // functions - logical
	  __webpack_require__(83)(math, _config);
	  __webpack_require__(84)(math, _config);
	  __webpack_require__(85)(math, _config);
	  __webpack_require__(86)(math, _config);

	  // functions - matrix
	  __webpack_require__(87)(math, _config);
	  __webpack_require__(88)(math, _config);
	  __webpack_require__(89)(math, _config);
	  __webpack_require__(90)(math, _config);
	  __webpack_require__(91)(math, _config);
	  __webpack_require__(92)(math, _config);
	  __webpack_require__(93)(math, _config);
	  __webpack_require__(94)(math, _config);
	  __webpack_require__(95)(math, _config);
	  __webpack_require__(96)(math, _config);
	  __webpack_require__(97)(math, _config);
	  __webpack_require__(98)(math, _config);
	  __webpack_require__(99)(math, _config);
	  __webpack_require__(100)(math, _config);
	  __webpack_require__(101)(math, _config);
	  __webpack_require__(102)(math, _config);

	  // functions - probability
	  //require('./function/probability/distribution')(math, _config); // TODO: rethink math.distribution
	  __webpack_require__(103)(math, _config);
	  __webpack_require__(104)(math, _config);
	  __webpack_require__(105)(math, _config);
	  __webpack_require__(106)(math, _config);
	  __webpack_require__(107)(math, _config);
	  __webpack_require__(108)(math, _config);
	  __webpack_require__(109)(math, _config);

	  // functions - relational
	  __webpack_require__(110)(math, _config);
	  __webpack_require__(111)(math, _config);
	  __webpack_require__(112)(math, _config);
	  __webpack_require__(113)(math, _config);
	  __webpack_require__(114)(math, _config);
	  __webpack_require__(115)(math, _config);
	  __webpack_require__(116)(math, _config);
	  __webpack_require__(117)(math, _config);

	  // functions - statistics
	  __webpack_require__(118)(math, _config);
	  __webpack_require__(119)(math, _config);
	  __webpack_require__(120)(math, _config);
	  __webpack_require__(121)(math, _config);
	  __webpack_require__(122)(math, _config);
	  __webpack_require__(123)(math, _config);
	  __webpack_require__(124)(math, _config);
	  __webpack_require__(125)(math, _config);

	  // functions - trigonometry
	  __webpack_require__(126)(math, _config);
	  __webpack_require__(127)(math, _config);
	  __webpack_require__(128)(math, _config);
	  __webpack_require__(129)(math, _config);
	  __webpack_require__(130)(math, _config);
	  __webpack_require__(131)(math, _config);
	  __webpack_require__(132)(math, _config);
	  __webpack_require__(133)(math, _config);
	  __webpack_require__(134)(math, _config);
	  __webpack_require__(135)(math, _config);
	  __webpack_require__(136)(math, _config);
	  __webpack_require__(137)(math, _config);
	  __webpack_require__(138)(math, _config);
	  __webpack_require__(139)(math, _config);
	  __webpack_require__(140)(math, _config);
	  __webpack_require__(141)(math, _config);

	  // functions - units
	  __webpack_require__(142)(math, _config);

	  // functions - utils
	  __webpack_require__(143)(math, _config);
	  __webpack_require__(144)(math, _config);
	  __webpack_require__(145)(math, _config);
	  __webpack_require__(146)(math, _config);
	  __webpack_require__(147)(math, _config);
	  __webpack_require__(148)(math, _config);
	  __webpack_require__(149)(math, _config);
	  __webpack_require__(150)(math, _config);
	  __webpack_require__(151)(math, _config);

	  // TODO: deprecated since version 0.25.0, remove some day.
	  math.ifElse = function () {
	    throw new Error('Function ifElse is deprecated. Use the conditional operator instead.');
	  };

	  // constants
	  __webpack_require__(2)(math, _config);

	  // attach transform functions (for converting one-based indices to zero-based)
	  __webpack_require__(18)(math, _config);
	  __webpack_require__(19)(math, _config);
	  __webpack_require__(20)(math, _config);
	  __webpack_require__(21)(math, _config);
	  __webpack_require__(22)(math, _config);
	  __webpack_require__(23)(math, _config);
	  __webpack_require__(24)(math, _config);
	  __webpack_require__(25)(math, _config);
	  __webpack_require__(26)(math, _config);
	  __webpack_require__(27)(math, _config);

	  // selector (we initialize after all functions are loaded)
	  math.chaining = {};
	  math.chaining.Chain = __webpack_require__(28)(math, _config);
	  math.chaining.Selector = math.chaining.Chain; // TODO: deprecate in v2.0

	  // apply provided configuration options
	  math.config(_config); // apply the default options
	  math.config(config);  // apply custom options

	  // return the new instance
	  return math;
	}

	// create a default instance of math.js
	var math = create();

	if (typeof window !== 'undefined') {
	  window.mathjs = math; // TODO: deprecate the mathjs namespace some day (replaced with 'math' since version 0.25.0)
	}

	// export the default instance
	module.exports = math;



/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var bignumber = __webpack_require__(152);
	  var Complex = __webpack_require__(6);
	  var BigNumber = math.type.BigNumber;

	  var big = config.number === 'bignumber';

	  // TODO: in case of support for defineProperty, we can lazy evaluate the BigNumber constants by creating them as properties (calculation of PI is slow for example)
	  math.pi          = big ? bignumber.pi(config.precision)  : Math.PI;
	  math.tau         = big ? bignumber.tau(config.precision) : Math.PI * 2;
	  math.e           = big ? bignumber.e(config.precision)   : Math.E;
	  math.phi         = big ? bignumber.phi(config.precision) : 1.61803398874989484820458683436563811772030917980576286213545; // golden ratio, (1+sqrt(5))/2

	  math.i           = new Complex(0, 1);

	  math['Infinity'] = Infinity;
	  math['NaN']      = NaN;
	  math['true']     = true;
	  math['false']    = false;
	  math['null']     = null;
	  math['uninitialized'] = __webpack_require__(153).UNINITIALIZED;

	  // uppercase constants (for compatibility with built-in Math)
	  math.E           = math.e;
	  math.LN2         = big ? new BigNumber(2).ln()                        : Math.LN2;
	  math.LN10        = big ? new BigNumber(10).ln()                       : Math.LN10;
	  math.LOG2E       = big ? new BigNumber(1).div(new BigNumber(2).ln())  : Math.LOG2E;
	  math.LOG10E      = big ? new BigNumber(1).div(new BigNumber(10).ln()) : Math.LOG10E;
	  math.PI          = math.pi;
	  math.SQRT1_2     = big ? new BigNumber(0.5).sqrt()                    : Math.SQRT1_2;
	  math.SQRT2       = big ? new BigNumber(2).sqrt()                      : Math.SQRT2;

	  // meta information
	  math.version = __webpack_require__(154);
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Clone an object
	 *
	 *     clone(x)
	 *
	 * Can clone any primitive type, array, and object.
	 * If x has a function clone, this function will be invoked to clone the object.
	 *
	 * @param {*} x
	 * @return {*} clone
	 */
	exports.clone = function clone(x) {
	  var type = typeof x;

	  // immutable primitive types
	  if (type === 'number' || type === 'string' || type === 'boolean' ||
	      x === null || x === undefined) {
	    return x;
	  }

	  // use clone function of the object when available
	  if (typeof x.clone === 'function') {
	    return x.clone();
	  }

	  // array
	  if (Array.isArray(x)) {
	    return x.map(function (value) {
	      return clone(value);
	    });
	  }

	  if (x instanceof Number)  return new Number(x.valueOf());
	  if (x instanceof String)  return new String(x.valueOf());
	  if (x instanceof Boolean) return new Boolean(x.valueOf());
	  if (x instanceof Date)    return new Date(x.valueOf());
	  if (x instanceof RegExp)  throw new TypeError('Cannot clone ' + x);  // TODO: clone a RegExp

	  // object
	  var m = {};
	  for (var key in x) {
	    if (x.hasOwnProperty(key)) {
	      m[key] = clone(x[key]);
	    }
	  }
	  return m;
	};

	/**
	 * Extend object a with the properties of object b
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 */
	exports.extend = function(a, b) {
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
	  // TODO: add support for Arrays to deepExtend
	  if (Array.isArray(b)) {
	    throw new TypeError('Arrays are not supported by deepExtend');
	  }

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
	      } else if (Array.isArray(b[prop])) {
	        throw new TypeError('Arrays are not supported by deepExtend');
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

	    if (a.length != b.length) {
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
	      //noinspection JSUnfilteredForInLoop
	      if (!exports.deepEqual(a[prop], b[prop])) {
	        return false;
	      }
	    }
	    for (prop in b) {
	      //noinspection JSUnfilteredForInLoop
	      if (!exports.deepEqual(a[prop], b[prop])) {
	        return false;
	      }
	    }
	    return true;
	  }
	  else {
	    return (typeof a === typeof b) && (a == b);
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Test whether value is a Number
	 * @param {*} value
	 * @return {Boolean} isNumber
	 */
	exports.isNumber = function(value) {
	  return (value instanceof Number) || (typeof value == 'number');
	};

	/**
	 * Check if a number is integer
	 * @param {Number | Boolean} value
	 * @return {Boolean} isInteger
	 */
	exports.isInteger = function(value) {
	  return (value == Math.round(value));
	  // Note: we use ==, not ===, as we can have Booleans as well
	};

	/**
	 * Calculate the sign of a number
	 * @param {Number} x
	 * @returns {*}
	 */
	exports.sign = function(x) {
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
	 *                         'exponential'    Always use exponential notation.
	 *                                          For example '1.234e+2' and '1.4e+7'
	 *                         'auto' (default) Regular number notation for numbers
	 *                                          having an absolute value between
	 *                                          `lower` and `upper` bounds, and uses
	 *                                          exponential notation elsewhere.
	 *                                          Lower bound is included, upper bound
	 *                                          is excluded.
	 *                                          For example '123.4' and '1.4e7'.
	 *                     {Number} precision   A number between 0 and 16 to round
	 *                                          the digits of the number.
	 *                                          In case of notations 'exponential' and
	 *                                          'auto', `precision` defines the total
	 *                                          number of significant digits returned
	 *                                          and is undefined by default.
	 *                                          In case of notation 'fixed',
	 *                                          `precision` defines the number of
	 *                                          significant digits after the decimal
	 *                                          point, and is 0 by default.
	 *                     {Object} exponential An object containing two parameters,
	 *                                          {Number} lower and {Number} upper,
	 *                                          used by notation 'auto' to determine
	 *                                          when to return exponential notation.
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
	 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
	 *
	 * @param {Number} value
	 * @param {Object | Function | Number} [options]
	 * @return {String} str The formatted value
	 */
	exports.format = function(value, options) {
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

	  if (options) {
	    // determine notation from options
	    if (options.notation) {
	      notation = options.notation;
	    }

	    // determine precision from options
	    if (exports.isNumber(options)) {
	      precision = options;
	    }
	    else if (options.precision) {
	      precision = options.precision;
	    }
	  }

	  // handle the various notations
	  switch (notation) {
	    case 'fixed':
	      return exports.toFixed(value, precision);

	    case 'exponential':
	      return exports.toExponential(value, precision);

	    case 'auto':
	      // determine lower and upper bound for exponential notation.
	        // TODO: implement support for upper and lower to be BigNumbers themselves
	      var lower = 1e-3;
	      var upper = 1e5;
	      if (options && options.exponential) {
	        if (options.exponential.lower !== undefined) {
	          lower = options.exponential.lower;
	        }
	        if (options.exponential.upper !== undefined) {
	          upper = options.exponential.upper;
	        }
	      }

	      // handle special case zero
	      if (value === 0) return '0';

	      // determine whether or not to output exponential notation
	      var str;
	      var abs = Math.abs(value);
	      if (abs >= lower && abs < upper) {
	        // normal number notation
	        // Note: IE7 does not allow value.toPrecision(undefined)
	        var valueStr = precision ?
	            value.toPrecision(Math.min(precision, 21)) :
	            value.toPrecision();
	        str = parseFloat(valueStr) + '';
	      }
	      else {
	        // exponential notation
	        str = exports.toExponential(value, precision);
	      }

	      // remove trailing zeros after the decimal point
	      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
	        var digits = arguments[2];
	        var e = arguments[4];
	        return (digits !== '.') ? digits + e : e;
	      });

	    default:
	      throw new Error('Unknown notation "' + notation + '". ' +
	          'Choose "auto", "exponential", or "fixed".');
	  }
	};

	/**
	 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	 * @param {Number} value
	 * @param {Number} [precision]  Number of digits in formatted output.
	 *                              If not provided, the maximum available digits
	 *                              is used.
	 * @returns {string} str
	 */
	exports.toExponential = function(value, precision) {
	  if (precision !== undefined) {
	    return value.toExponential(Math.min(precision - 1, 20));
	  }
	  else {
	    return value.toExponential();
	  }
	};

	/**
	 * Format a number with fixed notation.
	 * @param {Number} value
	 * @param {Number} [precision=0]        Optional number of decimals after the
	 *                                      decimal point. Zero by default.
	 */
	exports.toFixed = function(value, precision) {
	  return value.toFixed(Math.min(precision, 20));
	};

	/**
	 * Count the number of significant digits of a number.
	 *
	 * For example:
	 *   2.34 returns 3
	 *   0.0034 returns 2
	 *   120.5e+30 returns 4
	 *
	 * @param {Number} value
	 * @return {Number} digits   Number of significant digits
	 */
	exports.digits = function(value) {
	  return value
	      .toExponential()
	      .replace(/e.*$/, '')          // remove exponential notation
	      .replace( /^0\.?0*|\./, '')   // remove decimal point and leading zeros
	      .length
	};

	/**
	 * Minimum number added to one that makes the result different than one
	 */
	exports.DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

	/**
	 * Compares two floating point numbers.
	 * @param {Number} x          First value to compare
	 * @param {Number} y          Second value to compare
	 * @param {Number} [epsilon]  The maximum relative difference between x and y
	 *                            If epsilon is undefined or null, the function will
	 *                            test whether x and y are exactly equal.
	 * @return {boolean} whether the two numbers are equal
	*/
	exports.nearlyEqual = function(x, y, epsilon) {
	  // if epsilon is null or undefined, test whether x and y are exactly equal
	  if (epsilon == null) return x == y;

	  // use "==" operator, handles infinities
	  if (x == y) return true;

	  // NaN
	  if (isNaN(x) || isNaN(y)) return false;

	  // at this point x and y should be finite
	  if(isFinite(x) && isFinite(y)) {
	    // check numbers are very close, needed when comparing numbers near zero
	    var diff = Math.abs(x - y);
	    if (diff < exports.DBL_EPSILON) {
	      return true;
	    }
	    else {
	      // use relative error
	      return diff <= Math.max(Math.abs(x), Math.abs(y)) * epsilon;
	    }
	  }

	  // Infinite and Number or negative Infinite and positive Infinite cases
	  return false;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.ArgumentsError = __webpack_require__(155);
	exports.DimensionError = __webpack_require__(156);
	exports.IndexError = __webpack_require__(157);
	exports.UnsupportedTypeError = __webpack_require__(158);

	// TODO: implement an InvalidValueError?


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),
	    Unit = __webpack_require__(10),
	    number = util.number,

	    isNumber = util.number.isNumber,
	    isUnit = Unit.isUnit,
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
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  switch (arguments.length) {
	    case 0:
	      this.re = 0;
	      this.im = 0;
	      break;

	    case 1:
	      var arg = arguments[0];
	      if (typeof arg === 'object') {
	        if('re' in arg && 'im' in arg) {
	          var construct = new Complex(arg.re, arg.im); // pass on input validation
	          this.re = construct.re;
	          this.im = construct.im;
	          break;
	        } else if ('r' in arg && 'phi' in arg) {
	          var construct = Complex.fromPolar(arg.r, arg.phi);
	          this.re = construct.re;
	          this.im = construct.im;
	          break;
	        }
	      } 
	      throw new SyntaxError('Object with the re and im or r and phi properties expected.');

	    case 2:
	      if (!isNumber(re) || !isNumber(im)) {
	        throw new TypeError('Two numbers expected in Complex constructor');
	      }
	      this.re = re;
	      this.im = im;
	      break;

	    default:
	      throw new SyntaxError('One, two or three arguments expected in Complex constructor');
	  }
	}

	/**
	 * Test whether value is a Complex value
	 * @param {*} value
	 * @return {Boolean} isComplex
	 */
	Complex.isComplex = function (value) {
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

	  // check for exponential notation like "2.3e-4" or "1.23e50"
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
	Complex.parse = function (str) {
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
	 * Create a complex number from polar coordinates
	 *
	 * Usage:
	 *
	 *     Complex.fromPolar(r: Number, phi: Number) : Complex
	 *     Complex.fromPolar({r: Number, phi: Number}) : Complex
	 *
	 * @param {*} args...
	 * @return {Complex}
	 */
	Complex.fromPolar = function (args) {
	  switch (arguments.length) {
	    case 1:
	      var arg = arguments[0];
	      if(typeof arg === 'object') {
	        return Complex.fromPolar(arg.r, arg.phi);
	      }
	      throw new TypeError('Input has to be an object with r and phi keys.');

	    case 2:
	      var r = arguments[0],
	        phi = arguments[1];
	      if(isNumber(r)) {
	        if (isUnit(phi) && phi.hasBase(Unit.BASE_UNITS.ANGLE)) {
	          // convert unit to a number in radians
	          phi = phi.toNumber('rad');
	        }

	        if(isNumber(phi)) {
	          return new Complex(r * Math.cos(phi), r * Math.sin(phi));
	        }

	        throw new TypeError('Phi is not a number nor an angle unit.');
	      } else {
	        throw new TypeError('Radius r is not a number.');
	      }

	    default:
	      throw new SyntaxError('Wrong number of arguments in function fromPolar');
	  }
	};

	/*
	 * Return the value of the complex number in polar notation
	 * The angle phi will be set in the interval of [-pi, pi].
	 * @return {{r: number, phi: number}} Returns and object with properties r and phi.
	 */
	Complex.prototype.toPolar = function() {
	  return {
	    r: Math.sqrt(this.re * this.re + this.im * this.im),
	    phi: Math.atan2(this.im, this.re)
	  };
	};

	/**
	 * Create a copy of the complex value
	 * @return {Complex} clone
	 */
	Complex.prototype.clone = function () {
	  return new Complex(this.re, this.im);
	};

	/**
	 * Test whether this complex number equals an other complex value.
	 * Two complex numbers are equal when both their real and imaginary parts
	 * are equal.
	 * @param {Complex} other
	 * @return {boolean} isEqual
	 */
	Complex.prototype.equals = function (other) {
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
	Complex.prototype.format = function (options) {
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
	Complex.prototype.toString = function () {
	  return this.format();
	};

	/**
	 * Returns a string representation of the complex number.
	 * @return {String} str
	 */
	Complex.prototype.valueOf = Complex.prototype.toString;

	// exports
	module.exports = Complex;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160);

	var number = util.number;
	var string = util.string;
	var array = util.array;

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
	    throw new SyntaxError('Constructor must be called with the new operator');
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

	  this.start = (start != null) ? parseFloat(start) : 0;
	  this.end   = (end != null) ? parseFloat(end) : 0;
	  this.step  = (step != null) ? parseFloat(step) : 1;
	}

	/**
	 * Parse a string into a range,
	 * The string contains the start, optional step, and end, separated by a colon.
	 * If the string does not contain a valid range, null is returned.
	 * For example str='0:2:11'.
	 * @param {String} str
	 * @return {Range | null} range
	 */
	Range.parse = function (str) {
	  if (!string.isString(str)) {
	    return null;
	  }

	  var args = str.split(':');
	  var nums = args.map(function (arg) {
	    return parseFloat(arg);
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
	Range.prototype.clone = function () {
	  return new Range(this.start, this.end, this.step);
	};

	/**
	 * Test whether an object is a Range
	 * @param {*} object
	 * @return {Boolean} isRange
	 */
	Range.isRange = function (object) {
	  return (object instanceof Range);
	};

	/**
	 * Retrieve the size of the range.
	 * Returns an array containing one number, the number of elements in the range.
	 * @returns {Number[]} size
	 */
	Range.prototype.size = function () {
	  var len = 0,
	      start = this.start,
	      step = this.step,
	      end = this.end,
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
	 * Calculate the minimum value in the range
	 * @return {Number | undefined} min
	 */
	Range.prototype.min = function () {
	  var size = this.size()[0];

	  if (size > 0) {
	    if (this.step > 0) {
	      // positive step
	      return this.start;
	    }
	    else {
	      // negative step
	      return this.start + (size - 1) * this.step;
	    }
	  }
	  else {
	    return undefined;
	  }
	};

	/**
	 * Calculate the maximum value in the range
	 * @return {Number | undefined} max
	 */
	Range.prototype.max = function () {
	  var size = this.size()[0];

	  if (size > 0) {
	    if (this.step > 0) {
	      // positive step
	      return this.start + (size - 1) * this.step;
	    }
	    else {
	      // negative step
	      return this.start;
	    }
	  }
	  else {
	    return undefined;
	  }
	};


	/**
	 * Execute a callback function for each value in the range.
	 * @param {function} callback   The callback method is invoked with three
	 *                              parameters: the value of the element, the index
	 *                              of the element, and the Matrix being traversed.
	 */
	Range.prototype.forEach = function (callback) {
	  var x = this.start;
	  var step = this.step;
	  var end = this.end;
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
	Range.prototype.map = function (callback) {
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
	Range.prototype.toArray = function () {
	  var array = [];
	  this.forEach(function (value, index) {
	    array[index] = value;
	  });
	  return array;
	};

	/**
	 * Get the primitive value of the Range, a one dimensional array
	 * @returns {Array} array
	 */
	Range.prototype.valueOf = function () {
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
	Range.prototype.format = function (options) {
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
	Range.prototype.toString = function () {
	  return this.format();
	};

	// exports
	module.exports = Range;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),

	    Range = __webpack_require__(7),

	    number = util.number,

	    isNumber = number.isNumber,
	    isInteger = number.isInteger,
	    isArray = Array.isArray;

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
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this._ranges = [];
	  this._isScalar = true;

	  for (var i = 0, ii = arguments.length; i < ii; i++) {
	    var arg = arguments[i];

	    if (arg instanceof Range) {
	      this._ranges.push(arg);
	      this._isScalar = false;
	    }
	    else if (isArray(arg)) {
	      this._ranges.push(_createRange(arg));
	      this._isScalar = false;
	    }
	    else if (isNumber(arg)) {
	      this._ranges.push(_createRange([arg, arg + 1]));
	    }
	    // TODO: implement support for wildcard '*'
	    else {
	      var primitive = arg.valueOf(); // for example turn a Matrix into an Array
	      if (isArray(primitive)) {
	        this._ranges.push(_createRange(primitive));
	        this._isScalar = false;
	      }
	      else {
	        throw new TypeError('Ranges must be an Array, Number, or Range');
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
	Index.prototype.clone = function () {
	  var index = new Index();
	  index._ranges = util.object.clone(this._ranges);
	  index._isScalar = this._isScalar;
	  return index;
	};

	/**
	 * Test whether an object is an Index
	 * @param {*} object
	 * @return {Boolean} isIndex
	 */
	Index.isIndex = function (object) {
	  return (object instanceof Index);
	};

	/**
	 * Create an index from an array with ranges/numbers
	 * @param {Array.<Array | Number>} ranges
	 * @return {Index} index
	 * @private
	 */
	Index.create = function (ranges) {
	  var index = new Index();
	  Index.apply(index, ranges);
	  return index;
	};

	/**
	 * Retrieve the size of the index, the number of elements for each dimension.
	 * @returns {Number[]} size
	 */
	Index.prototype.size = function () {
	  var size = [];

	  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
	    var range = this._ranges[i];

	    size[i] = range.size()[0];
	  }

	  return size;
	};

	/**
	 * Get the maximum value for each of the indexes ranges.
	 * @returns {Number[]} max
	 */
	Index.prototype.max = function () {
	  var values = [];

	  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
	    var range = this._ranges[i];
	    values[i] = range.max();
	  }

	  return values;
	};

	/**
	 * Get the minimum value for each of the indexes ranges.
	 * @returns {Number[]} min
	 */
	Index.prototype.min = function () {
	  var values = [];

	  for (var i = 0, ii = this._ranges.length; i < ii; i++) {
	    var range = this._ranges[i];

	    values[i] = range.min();
	  }

	  return values;
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
	 * @returns {Range | null} range
	 */
	Index.prototype.range = function(dim) {
	  return this._ranges[dim] || null;
	};

	/**
	 * Test whether this index contains only a single value.
	 *
	 * This is the case when the index is created with only scalar values as ranges,
	 * not for ranges resolving into a single value.
	 * @return {boolean} isScalar
	 */
	Index.prototype.isScalar = function () {
	  return this._isScalar;
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

	  return '[' + strings.join(', ') + ']';
	};

	// exports
	module.exports = Index;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),
	    DimensionError = __webpack_require__(156),

	    Index = __webpack_require__(8),

	    number = util.number,
	    string = util.string,
	    array = util.array,
	    object = util.object,

	    isArray = Array.isArray,
	    validateIndex = array.validateIndex;

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
	 * The internal Array of the Matrix can be accessed using the function valueOf.
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
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  if (data instanceof Matrix) {
	    // clone data from a Matrix
	    this._data = data.clone()._data;
	  }
	  else if (isArray(data)) {
	    // use array
	    // replace nested Matrices with Arrays
	    this._data = preprocess(data);
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
	Matrix.isMatrix = function (object) {
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
	 * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	 *                                  the matrix is resized. If not provided,
	 *                                  new matrix elements will be filled with zeros.
	 */
	Matrix.prototype.subset = function (index, replacement, defaultValue) {
	  switch (arguments.length) {
	    case 1:
	      return _get(this, index);

	    // intentional fall through
	    case 2:
	    case 3:
	      return _set(this, index, replacement, defaultValue);

	    default:
	      throw new SyntaxError('Wrong number of arguments');
	  }
	};

	/**
	 * Get a single element from the matrix.
	 * @param {Number[]} index   Zero-based index
	 * @return {*} value
	 */
	Matrix.prototype.get = function (index) {
	  if (!isArray(index)) {
	    throw new TypeError('Array expected');
	  }
	  if (index.length != this._size.length) {
	    throw new DimensionError(index.length, this._size.length);
	  }

	  var data = this._data;
	  for (var i = 0, ii = index.length; i < ii; i++) {
	    var index_i = index[i];
	    validateIndex(index_i, data.length);
	    data = data[index_i];
	  }

	  return object.clone(data);
	};

	/**
	 * Replace a single element in the matrix.
	 * @param {Number[]} index   Zero-based index
	 * @param {*} value
	 * @param {*} [defaultValue]        Default value, filled in on new entries when
	 *                                  the matrix is resized. If not provided,
	 *                                  new matrix elements will be left undefined.
	 * @return {Matrix} self
	 */
	Matrix.prototype.set = function (index, value, defaultValue) {
	  var i, ii;

	  // validate input type and dimensions
	  if (!isArray(index)) {
	    throw new Error('Array expected');
	  }
	  if (index.length < this._size.length) {
	    throw new DimensionError(index.length, this._size.length, '<');
	  }

	  // enlarge matrix when needed
	  var size = index.map(function (i) {
	    return i + 1;
	  });
	  _fit(this, size, defaultValue);

	  // traverse over the dimensions
	  var data = this._data;
	  for (i = 0, ii = index.length - 1; i < ii; i++) {
	    var index_i = index[i];
	    validateIndex(index_i, data.length);
	    data = data[index_i];
	  }

	  // set new value
	  index_i = index[index.length - 1];
	  validateIndex(index_i, data.length);
	  data[index_i] = value;

	  return this;
	};

	/**
	 * Get a submatrix of this matrix
	 * @param {Matrix} matrix
	 * @param {Index} index   Zero-based index
	 * @private
	 */
	function _get (matrix, index) {
	  if (!(index instanceof Index)) {
	    throw new TypeError('Invalid index');
	  }

	  var isScalar = index.isScalar();
	  if (isScalar) {
	    // return a scalar
	    return matrix.get(index.min());
	  }
	  else {
	    // validate dimensions
	    var size = index.size();
	    if (size.length != matrix._size.length) {
	      throw new DimensionError(size.length, matrix._size.length);
	    }

	    // validate if any of the ranges in the index is out of range
	    var min = index.min();
	    var max = index.max();
	    for (var i = 0, ii = matrix._size.length; i < ii; i++) {
	      validateIndex(min[i], matrix._size[i]);
	      validateIndex(max[i], matrix._size[i]);
	    }

	    // retrieve submatrix
	    // TODO: more efficient when creating an empty matrix and setting _data and _size manually
	    return new Matrix(_getSubmatrix(matrix._data, index, size.length, 0));
	  }
	}

	/**
	 * Recursively get a submatrix of a multi dimensional matrix.
	 * Index is not checked for correct number or length of dimensions.
	 * @param {Array} data
	 * @param {Index} index
	 * @param {number} dims   Total number of dimensions
	 * @param {number} dim    Current dimension
	 * @return {Array} submatrix
	 * @private
	 */
	function _getSubmatrix (data, index, dims, dim) {
	  var last = (dim == dims - 1);
	  var range = index.range(dim);

	  if (last) {
	    return range.map(function (i) {
	      return data[i];
	    });
	  }
	  else {
	    return range.map(function (i) {
	      var child = data[i];
	      return _getSubmatrix(child, index, dims, dim + 1);
	    });
	  }
	}

	/**
	 * Replace a submatrix in this matrix
	 * Indexes are zero-based.
	 * @param {Matrix} matrix
	 * @param {Index} index
	 * @param {Matrix | Array | *} submatrix
	 * @param {*} defaultValue          Default value, filled in on new entries when
	 *                                  the matrix is resized.
	 * @return {Matrix} matrix
	 * @private
	 */
	function _set (matrix, index, submatrix, defaultValue) {
	  if (!(index instanceof Index)) {
	    throw new TypeError('Invalid index');
	  }

	  // get index size and check whether the index contains a single value
	  var iSize = index.size(),
	      isScalar = index.isScalar();

	  // calculate the size of the submatrix, and convert it into an Array if needed
	  var sSize;
	  if (submatrix instanceof Matrix) {
	    sSize = submatrix.size();
	    submatrix = submatrix.valueOf();
	  }
	  else {
	    sSize = array.size(submatrix);
	  }

	  if (isScalar) {
	    // set a scalar

	    // check whether submatrix is a scalar
	    if (sSize.length != 0) {
	      throw new TypeError('Scalar expected');
	    }

	    matrix.set(index.min(), submatrix, defaultValue);
	  }
	  else {
	    // set a submatrix

	    // validate dimensions
	    if (iSize.length < matrix._size.length) {
	      throw new DimensionError(iSize.length, matrix._size.length, '<');
	    }

	    if (sSize.length < iSize.length) {
	      // calculate number of missing outer dimensions
	      var i = 0;
	      var outer = 0;
	      while (iSize[i] === 1 && sSize[i] === 1) {
	        i++;
	      }
	      while (iSize[i] === 1) {
	        outer++;
	        i++;
	      }

	      // unsqueeze both outer and inner dimensions
	      submatrix = array.unsqueeze(submatrix, iSize.length, outer, sSize);
	    }

	    // check whether the size of the submatrix matches the index size
	    if (!object.deepEqual(iSize, sSize)) {
	      throw new DimensionError(iSize, sSize, '>');
	    }

	    // enlarge matrix when needed
	    var size = index.max().map(function (i) {
	      return i + 1;
	    });
	    _fit(matrix, size, defaultValue);

	    // insert the sub matrix
	    var dims = iSize.length,
	        dim = 0;
	    _setSubmatrix (matrix._data, index, submatrix, dims, dim);
	  }

	  return matrix;
	}

	/**
	 * Replace a submatrix of a multi dimensional matrix.
	 * @param {Array} data
	 * @param {Index} index
	 * @param {Array} submatrix
	 * @param {number} dims   Total number of dimensions
	 * @param {number} dim
	 * @private
	 */
	function _setSubmatrix (data, index, submatrix, dims, dim) {
	  var last = (dim == dims - 1),
	      range = index.range(dim);

	  if (last) {
	    range.forEach(function (dataIndex, subIndex) {
	      validateIndex(dataIndex);
	      data[dataIndex] = submatrix[subIndex];
	    });
	  }
	  else {
	    range.forEach(function (dataIndex, subIndex) {
	      validateIndex(dataIndex);
	      _setSubmatrix(data[dataIndex], index, submatrix[subIndex], dims, dim + 1);
	    });
	  }
	}

	/**
	 * Resize the matrix
	 * @param {Number[]} size
	 * @param {*} [defaultValue=0]      Default value, filled in on new entries.
	 *                                  If not provided, the matrix elements will
	 *                                  be filled with zeros.
	 * @return {Matrix} self            The matrix itself is returned
	 */
	Matrix.prototype.resize = function (size, defaultValue) {
	  this._size = object.clone(size);
	  this._data = array.resize(this._data, this._size, defaultValue);

	  // return the matrix itself
	  return this;
	};

	/**
	 * Enlarge the matrix when it is smaller than given size.
	 * If the matrix is larger or equal sized, nothing is done.
	 * @param {Matrix} matrix           The matrix to be resized
	 * @param {Number[]} size
	 * @param {*} defaultValue          Default value, filled in on new entries.
	 * @private
	 */
	function _fit(matrix, size, defaultValue) {
	  var newSize = object.clone(matrix._size),
	      changed = false;

	  // add dimensions when needed
	  while (newSize.length < size.length) {
	    newSize.push(0);
	    changed = true;
	  }

	  // enlarge size when needed
	  for (var i = 0, ii = size.length; i < ii; i++) {
	    if (size[i] > newSize[i]) {
	      newSize[i] = size[i];
	      changed = true;
	    }
	  }

	  if (changed) {
	    // resize only when size is changed
	    matrix.resize(newSize, defaultValue);
	  }
	}

	/**
	 * Create a clone of the matrix
	 * @return {Matrix} clone
	 */
	Matrix.prototype.clone = function () {
	  var matrix = new Matrix();
	  matrix._data = object.clone(this._data);
	  matrix._size = object.clone(this._size);
	  return matrix;
	};

	/**
	 * Retrieve the size of the matrix.
	 * @returns {Number[]} size
	 */
	Matrix.prototype.size = function() {
	  return this._size;
	};

	/**
	 * Create a new matrix with the results of the callback function executed on
	 * each entry of the matrix.
	 * @param {function} callback   The callback function is invoked with three
	 *                              parameters: the value of the element, the index
	 *                              of the element, and the Matrix being traversed.
	 * @return {Matrix} matrix
	 */
	Matrix.prototype.map = function (callback) {
	  var me = this;
	  var matrix = new Matrix();

	  var recurse = function (value, index) {
	    if (isArray(value)) {
	      return value.map(function (child, i) {
	        return recurse(child, index.concat(i));
	      });
	    }
	    else {
	      return callback(value, index, me);
	    }
	  };
	  matrix._data = recurse(this._data, []);
	  matrix._size = object.clone(this._size);

	  return matrix;
	};

	/**
	 * Execute a callback function on each entry of the matrix.
	 * @param {function} callback   The callback function is invoked with three
	 *                              parameters: the value of the element, the index
	 *                              of the element, and the Matrix being traversed.
	 */
	Matrix.prototype.forEach = function (callback) {
	  var me = this;

	  var recurse = function (value, index) {
	    if (isArray(value)) {
	      value.forEach(function (child, i) {
	        recurse(child, index.concat(i));
	      });
	    }
	    else {
	      callback(value, index, me);
	    }
	  };
	  recurse(this._data, []);
	};

	/**
	 * Create an Array with a copy of the data of the Matrix
	 * @returns {Array} array
	 */
	Matrix.prototype.toArray = function () {
	  return object.clone(this._data);
	};

	/**
	 * Get the primitive value of the Matrix: a multidimensional array
	 * @returns {Array} array
	 */
	Matrix.prototype.valueOf = function () {
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
	Matrix.prototype.format = function (options) {
	  return string.format(this._data, options);
	};

	/**
	 * Get a string representation of the matrix
	 * @returns {String} str
	 */
	Matrix.prototype.toString = function () {
	  return string.format(this._data);
	};

	/**
	 * Preprocess data, which can be an Array or Matrix with nested Arrays and
	 * Matrices. Replaces all nested Matrices with Arrays
	 * @param {Array} data
	 * @return {Array} data
	 */
	function preprocess(data) {
	  for (var i = 0, ii = data.length; i < ii; i++) {
	    var elem = data[i];
	    if (isArray(elem)) {
	      data[i] = preprocess(elem);
	    }
	    else if (elem instanceof Matrix) {
	      data[i] = preprocess(elem._data);
	    }
	  }

	  return data;
	}

	// exports
	module.exports = Matrix;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),

	    number = util.number,
	    string = util.string,
	    isNumber = util.number.isNumber,
	    isString = util.string.isString;

	/**
	 * @constructor Unit
	 *
	 * A unit can be constructed in the following ways:
	 *     var a = new Unit(value, name);
	 *     var b = new Unit(null, name);
	 *     var c = Unit.parse(str);
	 *
	 * Example usage:
	 *     var a = new Unit(5, 'cm');               // 50 mm
	 *     var b = Unit.parse('23 kg');             // 23 kg
	 *     var c = math.in(a, new Unit(null, 'm');  // 0.05 m
	 *
	 * @param {Number} [value]  A value like 5.2
	 * @param {String} [name]   A unit name like "cm" or "inch". Can include a prefix
	 */
	function Unit(value, name) {
	  if (!(this instanceof Unit)) {
	    throw new Error('Constructor must be called with the new operator');
	  }

	  if (value != undefined && !isNumber(value)) {
	    throw new TypeError('First parameter in Unit constructor must be a number');
	  }
	  if (name != undefined && (!isString(name) || name == '')) {
	    throw new TypeError('Second parameter in Unit constructor must be a string');
	  }

	  if (name != undefined) {
	    // find the unit and prefix from the string
	    var res = _findUnit(name);
	    if (!res) {
	      throw new SyntaxError('Unknown unit "' + name + '"');
	    }
	    this.unit = res.unit;
	    this.prefix = res.prefix;
	  }
	  else {
	    this.unit = UNIT_NONE;
	    this.prefix = PREFIX_NONE;  // link to a list with supported prefixes
	  }

	  this.value = (value != undefined) ? this._normalize(value) : null;
	  this.fixPrefix = false; // if true, function format will not search for the
	                          // best prefix but leave it as initially provided.
	                          // fixPrefix is set true by the method Unit.to
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

	  // check for exponential notation like "2.3e-4" or "1.23e50"
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
	  var unitName = '';

	  skipWhitespace();
	  while (c && c != ' ' && c != '\t') {
	    unitName += c;
	    next();
	  }

	  return unitName || null;
	}

	/**
	 * Parse a string into a unit. Returns null if the provided string does not
	 * contain a valid unit.
	 * @param {String} str        A string like "5.2 inch", "4e2 kg"
	 * @return {Unit | null} unit
	 */
	Unit.parse = function(str) {
	  text = str;
	  index = -1;
	  c = '';

	  if (!isString(text)) {
	    return null;
	  }

	  next();
	  skipWhitespace();
	  var value = parseNumber();
	  var name;
	  if (value) {
	    name = parseUnit();

	    next();
	    skipWhitespace();
	    if (c) {
	      // garbage at the end. not good.
	      return null;
	    }

	    if (value && name) {
	      try {
	        // constructor will throw an error when unit is not found
	        return new Unit(Number(value), name);
	      }
	      catch (err) {}
	    }
	  }
	  else {
	    name = parseUnit();

	    next();
	    skipWhitespace();
	    if (c) {
	      // garbage at the end. not good.
	      return null;
	    }

	    if (name) {
	      try {
	        // constructor will throw an error when unit is not found
	        return new Unit(null, name);
	      }
	      catch (err) {}
	    }
	  }

	  return null;
	};

	/**
	 * Test whether value is of type Unit
	 * @param {*} value
	 * @return {Boolean} isUnit
	 */
	Unit.isUnit = function(value) {
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
	  return (value + this.unit.offset) * this.unit.value * this.prefix.value;
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
	    return value / this.unit.value / this.prefix.value - this.unit.offset;
	  }
	  else {
	    return value / this.unit.value / prefixValue - this.unit.offset;
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
	  for (var name in UNITS) {
	    if (UNITS.hasOwnProperty(name)) {
	      if (string.endsWith(str, name) ) {
	        var unit = UNITS[name];
	        var prefixLen = (str.length - name.length);
	        var prefixName = str.substring(0, prefixLen);
	        var prefix = unit.prefixes[prefixName];
	        if (prefix !== undefined) {
	          // store unit, prefix, and value
	          return {
	            unit: unit,
	            prefix: prefix
	          };
	        }
	      }
	    }
	  }

	  return null;
	}

	/**
	 * Test if the given expression is a unit.
	 * The unit can have a prefix but cannot have a value.
	 * @param {String} name   A string to be tested whether it is a value less unit.
	 *                        The unit can have prefix, like "cm"
	 * @return {Boolean}      true if the given string is a unit
	 */
	Unit.isValuelessUnit = function (name) {
	  return (_findUnit(name) != null);
	};

	/**
	 * check if this unit has given base unit
	 * @param {BASE_UNITS | undefined} base
	 */
	Unit.prototype.hasBase = function(base) {
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
	 * @param {String | Unit} valuelessUnit   A unit without value. Can have prefix, like "cm"
	 * @returns {Unit} unit having fixed, specified unit
	 */
	Unit.prototype.to = function (valuelessUnit) {
	  var other;
	  var value = this.value == null ? this._normalize(1) : this.value;
	  if (isString(valuelessUnit)) {
	    other = new Unit(null, valuelessUnit);

	    if (!this.equalBase(other)) {
	      throw new Error('Units do not match');
	    }

	    other.value = value;
	    other.fixPrefix = true;
	    return other;
	  }
	  else if (valuelessUnit instanceof Unit) {
	    if (!this.equalBase(valuelessUnit)) {
	      throw new Error('Units do not match');
	    }
	    if (valuelessUnit.value !== null) {
	      throw new Error('Cannot convert to a unit with a value');
	    }

	    other = valuelessUnit.clone();
	    other.value = value;
	    other.fixPrefix = true;
	    return other;
	  }
	  else {
	    throw new Error('String or Unit expected as parameter');
	  }
	};

	/**
	 * Return the value of the unit when represented with given valueless unit
	 * @param {String | Unit} valuelessUnit    For example 'cm' or 'inch'
	 * @return {Number} value
	 */
	Unit.prototype.toNumber = function (valuelessUnit) {
	  var other = this.to(valuelessUnit);
	  return other._unnormalize(other.value, other.prefix.value);
	};


	/**
	 * Get a string representation of the unit.
	 * @return {String}
	 */
	Unit.prototype.toString = function() {
	  return this.format();
	};

	/**
	 * Returns the string representation of the unit.
	 * @return {String}
	 */
	Unit.prototype.valueOf = Unit.prototype.toString;

	/**
	 * Get a string representation of the Unit, with optional formatting options.
	 * @param {Object | Number | Function} [options]  Formatting options. See
	 *                                                lib/util/number:format for a
	 *                                                description of the available
	 *                                                options.
	 * @return {String}
	 */
	Unit.prototype.format = function(options) {
	  var value,
	      str;

	  if (this.value !== null && !this.fixPrefix) {
	    var bestPrefix = this._bestPrefix();
	    value = this._unnormalize(this.value, bestPrefix.value);
	    str = number.format(value, options) + ' ';
	    str += bestPrefix.name + this.unit.name;
	  }
	  else {
	    value = this._unnormalize(this.value);
	    str = (this.value !== null) ? (number.format(value, options) + ' ') : '';
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
	  NONE: {
	    '': {name: '', value: 1, scientific: true}
	  },
	  SHORT: {
	    '': {name: '', value: 1, scientific: true},

	    'da': {name: 'da', value: 1e1, scientific: false},
	    'h': {name: 'h', value: 1e2, scientific: false},
	    'k': {name: 'k', value: 1e3, scientific: true},
	    'M': {name: 'M', value: 1e6, scientific: true},
	    'G': {name: 'G', value: 1e9, scientific: true},
	    'T': {name: 'T', value: 1e12, scientific: true},
	    'P': {name: 'P', value: 1e15, scientific: true},
	    'E': {name: 'E', value: 1e18, scientific: true},
	    'Z': {name: 'Z', value: 1e21, scientific: true},
	    'Y': {name: 'Y', value: 1e24, scientific: true},

	    'd': {name: 'd', value: 1e-1, scientific: false},
	    'c': {name: 'c', value: 1e-2, scientific: false},
	    'm': {name: 'm', value: 1e-3, scientific: true},
	    'u': {name: 'u', value: 1e-6, scientific: true},
	    'n': {name: 'n', value: 1e-9, scientific: true},
	    'p': {name: 'p', value: 1e-12, scientific: true},
	    'f': {name: 'f', value: 1e-15, scientific: true},
	    'a': {name: 'a', value: 1e-18, scientific: true},
	    'z': {name: 'z', value: 1e-21, scientific: true},
	    'y': {name: 'y', value: 1e-24, scientific: true}
	  },
	  LONG: {
	    '': {name: '', value: 1, scientific: true},

	    'deca': {name: 'deca', value: 1e1, scientific: false},
	    'hecto': {name: 'hecto', value: 1e2, scientific: false},
	    'kilo': {name: 'kilo', value: 1e3, scientific: true},
	    'mega': {name: 'mega', value: 1e6, scientific: true},
	    'giga': {name: 'giga', value: 1e9, scientific: true},
	    'tera': {name: 'tera', value: 1e12, scientific: true},
	    'peta': {name: 'peta', value: 1e15, scientific: true},
	    'exa': {name: 'exa', value: 1e18, scientific: true},
	    'zetta': {name: 'zetta', value: 1e21, scientific: true},
	    'yotta': {name: 'yotta', value: 1e24, scientific: true},

	    'deci': {name: 'deci', value: 1e-1, scientific: false},
	    'centi': {name: 'centi', value: 1e-2, scientific: false},
	    'milli': {name: 'milli', value: 1e-3, scientific: true},
	    'micro': {name: 'micro', value: 1e-6, scientific: true},
	    'nano': {name: 'nano', value: 1e-9, scientific: true},
	    'pico': {name: 'pico', value: 1e-12, scientific: true},
	    'femto': {name: 'femto', value: 1e-15, scientific: true},
	    'atto': {name: 'atto', value: 1e-18, scientific: true},
	    'zepto': {name: 'zepto', value: 1e-21, scientific: true},
	    'yocto': {name: 'yocto', value: 1e-24, scientific: true}
	  },
	  SQUARED: {
	    '': {name: '', value: 1, scientific: true},

	    'da': {name: 'da', value: 1e2, scientific: false},
	    'h': {name: 'h', value: 1e4, scientific: false},
	    'k': {name: 'k', value: 1e6, scientific: true},
	    'M': {name: 'M', value: 1e12, scientific: true},
	    'G': {name: 'G', value: 1e18, scientific: true},
	    'T': {name: 'T', value: 1e24, scientific: true},
	    'P': {name: 'P', value: 1e30, scientific: true},
	    'E': {name: 'E', value: 1e36, scientific: true},
	    'Z': {name: 'Z', value: 1e42, scientific: true},
	    'Y': {name: 'Y', value: 1e48, scientific: true},

	    'd': {name: 'd', value: 1e-2, scientific: false},
	    'c': {name: 'c', value: 1e-4, scientific: false},
	    'm': {name: 'm', value: 1e-6, scientific: true},
	    'u': {name: 'u', value: 1e-12, scientific: true},
	    'n': {name: 'n', value: 1e-18, scientific: true},
	    'p': {name: 'p', value: 1e-24, scientific: true},
	    'f': {name: 'f', value: 1e-30, scientific: true},
	    'a': {name: 'a', value: 1e-36, scientific: true},
	    'z': {name: 'z', value: 1e-42, scientific: true},
	    'y': {name: 'y', value: 1e-42, scientific: true}
	  },
	  CUBIC: {
	    '': {name: '', value: 1, scientific: true},

	    'da': {name: 'da', value: 1e3, scientific: false},
	    'h': {name: 'h', value: 1e6, scientific: false},
	    'k': {name: 'k', value: 1e9, scientific: true},
	    'M': {name: 'M', value: 1e18, scientific: true},
	    'G': {name: 'G', value: 1e27, scientific: true},
	    'T': {name: 'T', value: 1e36, scientific: true},
	    'P': {name: 'P', value: 1e45, scientific: true},
	    'E': {name: 'E', value: 1e54, scientific: true},
	    'Z': {name: 'Z', value: 1e63, scientific: true},
	    'Y': {name: 'Y', value: 1e72, scientific: true},

	    'd': {name: 'd', value: 1e-3, scientific: false},
	    'c': {name: 'c', value: 1e-6, scientific: false},
	    'm': {name: 'm', value: 1e-9, scientific: true},
	    'u': {name: 'u', value: 1e-18, scientific: true},
	    'n': {name: 'n', value: 1e-27, scientific: true},
	    'p': {name: 'p', value: 1e-36, scientific: true},
	    'f': {name: 'f', value: 1e-45, scientific: true},
	    'a': {name: 'a', value: 1e-54, scientific: true},
	    'z': {name: 'z', value: 1e-63, scientific: true},
	    'y': {name: 'y', value: 1e-72, scientific: true}
	  },
	  BINARY_SHORT: {
	    '': {name: '', value: 1, scientific: true},
	    'k': {name: 'k', value: 1024, scientific: true},
	    'M': {name: 'M', value: Math.pow(1024, 2), scientific: true},
	    'G': {name: 'G', value: Math.pow(1024, 3), scientific: true},
	    'T': {name: 'T', value: Math.pow(1024, 4), scientific: true},
	    'P': {name: 'P', value: Math.pow(1024, 5), scientific: true},
	    'E': {name: 'E', value: Math.pow(1024, 6), scientific: true},
	    'Z': {name: 'Z', value: Math.pow(1024, 7), scientific: true},
	    'Y': {name: 'Y', value: Math.pow(1024, 8), scientific: true},

	    'Ki': {name: 'Ki', value: 1024, scientific: true},
	    'Mi': {name: 'Mi', value: Math.pow(1024, 2), scientific: true},
	    'Gi': {name: 'Gi', value: Math.pow(1024, 3), scientific: true},
	    'Ti': {name: 'Ti', value: Math.pow(1024, 4), scientific: true},
	    'Pi': {name: 'Pi', value: Math.pow(1024, 5), scientific: true},
	    'Ei': {name: 'Ei', value: Math.pow(1024, 6), scientific: true},
	    'Zi': {name: 'Zi', value: Math.pow(1024, 7), scientific: true},
	    'Yi': {name: 'Yi', value: Math.pow(1024, 8), scientific: true}
	  },
	  BINARY_LONG: {
	    '': {name: '', value: 1, scientific: true},
	    'kilo': {name: 'kilo', value: 1024, scientific: true},
	    'mega': {name: 'mega', value: Math.pow(1024, 2), scientific: true},
	    'giga': {name: 'giga', value: Math.pow(1024, 3), scientific: true},
	    'tera': {name: 'tera', value: Math.pow(1024, 4), scientific: true},
	    'peta': {name: 'peta', value: Math.pow(1024, 5), scientific: true},
	    'exa': {name: 'exa', value: Math.pow(1024, 6), scientific: true},
	    'zetta': {name: 'zetta', value: Math.pow(1024, 7), scientific: true},
	    'yotta': {name: 'yotta', value: Math.pow(1024, 8), scientific: true},

	    'kibi': {name: 'kibi', value: 1024, scientific: true},
	    'mebi': {name: 'mebi', value: Math.pow(1024, 2), scientific: true},
	    'gibi': {name: 'gibi', value: Math.pow(1024, 3), scientific: true},
	    'tebi': {name: 'tebi', value: Math.pow(1024, 4), scientific: true},
	    'pebi': {name: 'pebi', value: Math.pow(1024, 5), scientific: true},
	    'exi': {name: 'exi', value: Math.pow(1024, 6), scientific: true},
	    'zebi': {name: 'zebi', value: Math.pow(1024, 7), scientific: true},
	    'yobi': {name: 'yobi', value: Math.pow(1024, 8), scientific: true}
	  }
	};

	var PREFIX_NONE = {name: '', value: 1, scientific: true};

	var BASE_UNITS = {
	  NONE: {},

	  LENGTH: {},               // meter
	  MASS: {},                 // kilogram
	  TIME: {},                 // second
	  CURRENT: {},              // ampere
	  TEMPERATURE: {},          // kelvin
	  LUMINOUS_INTENSITY: {},   // candela
	  AMOUNT_OF_SUBSTANCE: {},  // mole

	  FORCE: {},                // Newton
	  SURFACE: {},              // m2
	  VOLUME: {},               // m3
	  ANGLE: {},                // rad
	  BIT: {}                   // bit (digital)
	};

	var BASE_UNIT_NONE = {};

	var UNIT_NONE = {name: '', base: BASE_UNIT_NONE, value: 1, offset: 0};

	var UNITS = {
	  // length
	  meter: {name: 'meter', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.LONG, value: 1, offset: 0},
	  inch: {name: 'inch', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0254, offset: 0},
	  foot: {name: 'foot', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.3048, offset: 0},
	  yard: {name: 'yard', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.9144, offset: 0},
	  mile: {name: 'mile', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1609.344, offset: 0},
	  link: {name: 'link', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.201168, offset: 0},
	  rod: {name: 'rod', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 5.029210, offset: 0},
	  chain: {name: 'chain', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 20.1168, offset: 0},
	  angstrom: {name: 'angstrom', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1e-10, offset: 0},

	  m: {name: 'm', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
	  'in': {name: 'in', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0254, offset: 0},
	  ft: {name: 'ft', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.3048, offset: 0},
	  yd: {name: 'yd', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.9144, offset: 0},
	  mi: {name: 'mi', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 1609.344, offset: 0},
	  li: {name: 'li', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.201168, offset: 0},
	  rd: {name: 'rd', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 5.029210, offset: 0},
	  ch: {name: 'ch', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 20.1168, offset: 0},
	  mil: {name: 'mil', base: BASE_UNITS.LENGTH, prefixes: PREFIXES.NONE, value: 0.0000254, offset: 0}, // 1/1000 inch

	  // Surface
	  m2: {name: 'm2', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.SQUARED, value: 1, offset: 0},
	  sqin: {name: 'sqin', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.00064516, offset: 0}, // 645.16 mm2
	  sqft: {name: 'sqft', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.09290304, offset: 0}, // 0.09290304 m2
	  sqyd: {name: 'sqyd', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 0.83612736, offset: 0}, // 0.83612736 m2
	  sqmi: {name: 'sqmi', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 2589988.110336, offset: 0}, // 2.589988110336 km2
	  sqrd: {name: 'sqrd', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 25.29295, offset: 0}, // 25.29295 m2
	  sqch: {name: 'sqch', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 404.6873, offset: 0}, // 404.6873 m2
	  sqmil: {name: 'sqmil', base: BASE_UNITS.SURFACE, prefixes: PREFIXES.NONE, value: 6.4516e-10, offset: 0}, // 6.4516 * 10^-10 m2

	  // Volume
	  m3: {name: 'm3', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.CUBIC, value: 1, offset: 0},
	  L: {name: 'L', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0}, // litre
	  l: {name: 'l', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0}, // litre
	  litre: {name: 'litre', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.LONG, value: 0.001, offset: 0},
	  cuin: {name: 'cuin', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 1.6387064e-5, offset: 0}, // 1.6387064e-5 m3
	  cuft: {name: 'cuft', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.028316846592, offset: 0}, // 28.316 846 592 L
	  cuyd: {name: 'cuyd', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.764554857984, offset: 0}, // 764.554 857 984 L
	  teaspoon: {name: 'teaspoon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000005, offset: 0}, // 5 mL
	  tablespoon: {name: 'tablespoon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000015, offset: 0}, // 15 mL
	  //{name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.000240, offset: 0}, // 240 mL  // not possible, we have already another cup
	  drop: {name: 'drop', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 5e-8, offset: 0},  // 0.05 mL = 5e-8 m3
	  gtt: {name: 'gtt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 5e-8, offset: 0},  // 0.05 mL = 5e-8 m3

	  // Liquid volume
	  minim: {name: 'minim', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL
	  fluiddram: {name: 'fluiddram', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0000036966911, offset: 0},  // 3.696691 mL
	  fluidounce: {name: 'fluidounce', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00002957353, offset: 0}, // 29.57353 mL
	  gill: {name: 'gill', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0001182941, offset: 0}, // 118.2941 mL
	  cc: {name: 'cc', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 1e-6, offset: 0}, // 1e-6 L
	  cup: {name: 'cup', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0002365882, offset: 0}, // 236.5882 mL
	  pint: {name: 'pint', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0004731765, offset: 0}, // 473.1765 mL
	  quart: {name: 'quart', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0009463529, offset: 0}, // 946.3529 mL
	  gallon: {name: 'gallon', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.003785412, offset: 0}, // 3.785412 L
	  beerbarrel: {name: 'beerbarrel', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1173478, offset: 0}, // 117.3478 L
	  oilbarrel: {name: 'oilbarrel', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1589873, offset: 0}, // 158.9873 L
	  hogshead: {name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L

	  //{name: 'min', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00000006161152, offset: 0}, // 0.06161152 mL // min is already in use as minute
	  fldr: {name: 'fldr', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0000036966911, offset: 0},  // 3.696691 mL
	  floz: {name: 'floz', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.00002957353, offset: 0}, // 29.57353 mL
	  gi: {name: 'gi', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0001182941, offset: 0}, // 118.2941 mL
	  cp: {name: 'cp', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0002365882, offset: 0}, // 236.5882 mL
	  pt: {name: 'pt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0004731765, offset: 0}, // 473.1765 mL
	  qt: {name: 'qt', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.0009463529, offset: 0}, // 946.3529 mL
	  gal: {name: 'gal', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.003785412, offset: 0}, // 3.785412 L
	  bbl: {name: 'bbl', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1173478, offset: 0}, // 117.3478 L
	  obl: {name: 'obl', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.1589873, offset: 0}, // 158.9873 L
	  //{name: 'hogshead', base: BASE_UNITS.VOLUME, prefixes: PREFIXES.NONE, value: 0.2384810, offset: 0}, // 238.4810 L // TODO: hh?

	  // Mass
	  g: {name: 'g', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 0.001, offset: 0},
	  gram: {name: 'gram', base: BASE_UNITS.MASS, prefixes: PREFIXES.LONG, value: 0.001, offset: 0},

	  ton: {name: 'ton', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 907.18474, offset: 0},
	  tonne: {name: 'tonne', base: BASE_UNITS.MASS, prefixes: PREFIXES.SHORT, value: 1000, offset: 0},

	  grain: {name: 'grain', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 64.79891e-6, offset: 0},
	  dram: {name: 'dram', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 1.7718451953125e-3, offset: 0},
	  ounce: {name: 'ounce', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 28.349523125e-3, offset: 0},
	  poundmass: {name: 'poundmass', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 453.59237e-3, offset: 0},
	  hundredweight: {name: 'hundredweight', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 45.359237, offset: 0},
	  stick: {name: 'stick', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 115e-3, offset: 0},

	  gr: {name: 'gr', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 64.79891e-6, offset: 0},
	  dr: {name: 'dr', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 1.7718451953125e-3, offset: 0},
	  oz: {name: 'oz', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 28.349523125e-3, offset: 0},
	  lbm: {name: 'lbm', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 453.59237e-3, offset: 0},
	  cwt: {name: 'cwt', base: BASE_UNITS.MASS, prefixes: PREFIXES.NONE, value: 45.359237, offset: 0},

	  // Time
	  s: {name: 's', base: BASE_UNITS.TIME, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
	  min: {name: 'min', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 60, offset: 0},
	  h: {name: 'h', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 3600, offset: 0},
	  second: {name: 'second', base: BASE_UNITS.TIME, prefixes: PREFIXES.LONG, value: 1, offset: 0},
	  sec: {name: 'sec', base: BASE_UNITS.TIME, prefixes: PREFIXES.LONG, value: 1, offset: 0},
	  minute: {name: 'minute', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 60, offset: 0},
	  hour: {name: 'hour', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 3600, offset: 0},
	  day: {name: 'day', base: BASE_UNITS.TIME, prefixes: PREFIXES.NONE, value: 86400, offset: 0},

	  // Angle
	  rad: {name: 'rad', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  // deg = rad / (2*pi) * 360 = rad / 0.017453292519943295769236907684888
	  deg: {name: 'deg', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 0.017453292519943295769236907684888, offset: 0},
	  // grad = rad / (2*pi) * 400  = rad / 0.015707963267948966192313216916399
	  grad: {name: 'grad', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 0.015707963267948966192313216916399, offset: 0},
	  // cycle = rad / (2*pi) = rad / 6.2831853071795864769252867665793
	  cycle: {name: 'cycle', base: BASE_UNITS.ANGLE, prefixes: PREFIXES.NONE, value: 6.2831853071795864769252867665793, offset: 0},

	  // Electric current
	  A: {name: 'A', base: BASE_UNITS.CURRENT, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
	  ampere: {name: 'ampere', base: BASE_UNITS.CURRENT, prefixes: PREFIXES.LONG, value: 1, offset: 0},

	  // Temperature
	  // K(C) = °C + 273.15
	  // K(F) = (°F + 459.67) / 1.8
	  // K(R) = °R / 1.8
	  K: {name: 'K', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  degC: {name: 'degC', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 273.15},
	  degF: {name: 'degF', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 459.67},
	  degR: {name: 'degR', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 0},
	  kelvin: {name: 'kelvin', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  celsius: {name: 'celsius', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1, offset: 273.15},
	  fahrenheit: {name: 'fahrenheit', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 459.67},
	  rankine: {name: 'rankine', base: BASE_UNITS.TEMPERATURE, prefixes: PREFIXES.NONE, value: 1/1.8, offset: 0},

	  // amount of substance
	  mol: {name: 'mol', base: BASE_UNITS.AMOUNT_OF_SUBSTANCE, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  mole: {name: 'mole', base: BASE_UNITS.AMOUNT_OF_SUBSTANCE, prefixes: PREFIXES.NONE, value: 1, offset: 0},

	  // luminous intensity
	  cd: {name: 'cd', base: BASE_UNITS.LUMINOUS_INTENSITY, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  candela: {name: 'candela', base: BASE_UNITS.LUMINOUS_INTENSITY, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  // TODO: units STERADIAN
	  //{name: 'sr', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},
	  //{name: 'steradian', base: BASE_UNITS.STERADIAN, prefixes: PREFIXES.NONE, value: 1, offset: 0},

	  // Force
	  N: {name: 'N', base: BASE_UNITS.FORCE, prefixes: PREFIXES.SHORT, value: 1, offset: 0},
	  newton: {name: 'newton', base: BASE_UNITS.FORCE, prefixes: PREFIXES.LONG, value: 1, offset: 0},
	  lbf: {name: 'lbf', base: BASE_UNITS.FORCE, prefixes: PREFIXES.NONE, value: 4.4482216152605, offset: 0},
	  poundforce: {name: 'poundforce', base: BASE_UNITS.FORCE, prefixes: PREFIXES.NONE, value: 4.4482216152605, offset: 0},

	  // Binary
	  b: {name: 'b', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_SHORT, value: 1, offset: 0},
	  bits: {name: 'bits', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_LONG, value: 1, offset: 0},
	  B: {name: 'B', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_SHORT, value: 8, offset: 0},
	  bytes: {name: 'bytes', base: BASE_UNITS.BIT, prefixes: PREFIXES.BINARY_LONG, value: 8, offset: 0}
	};

	// plurals
	var PLURALS = {
	  meters: 'meter',
	  inches: 'inch',
	  feet: 'foot',
	  yards: 'yard',
	  miles: 'mile',
	  links: 'link',
	  rods: 'rod',
	  chains: 'chain',
	  angstroms: 'angstrom',

	  litres: 'litre',
	  teaspoons: 'teaspoon',
	  tablespoons: 'tablespoon',
	  minims: 'minim',
	  fluiddrams: 'fluiddram',
	  fluidounces: 'fluidounce',
	  gills: 'gill',
	  cups: 'cup',
	  pints: 'pint',
	  quarts: 'quart',
	  gallons: 'gallon',
	  beerbarrels: 'beerbarrel',
	  oilbarrels: 'oilbarrel',
	  hogsheads: 'hogshead',
	  gtts: 'gtt',

	  grams: 'gram',
	  tons: 'ton',
	  tonnes: 'tonne',
	  grains: 'grain',
	  drams: 'dram',
	  ounces: 'ounce',
	  poundmasses: 'poundmass',
	  hundredweights: 'hundredweight',
	  sticks: 'stick',

	  seconds: 'second',
	  minutes: 'minute',
	  hours: 'hour',
	  days: 'day',

	  radians: 'rad',
	  degrees: 'deg',
	  gradients: 'grad',
	  cycles: 'cycle',

	  amperes: 'ampere',
	  moles: 'mole'
	};

	for (var name in PLURALS) {
	  /* istanbul ignore next (we cannot really test next statement) */
	  if (PLURALS.hasOwnProperty(name)) {
	    var unit = UNITS[PLURALS[name]];
	    var plural = Object.create(unit);
	    plural.name = name;
	    UNITS[name] = plural;
	  }
	}

	// aliases
	UNITS.lt = UNITS.l;
	UNITS.liter = UNITS.litre;
	UNITS.liters = UNITS.litres;
	UNITS.lb = UNITS.lbm;
	UNITS.lbs = UNITS.lbm;


	Unit.PREFIXES = PREFIXES;
	Unit.BASE_UNITS = BASE_UNITS;
	Unit.UNITS = UNITS;

	// end of unit aliases


	// exports
	module.exports = Unit;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),
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
	  if (!(this instanceof Help)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // TODO: throw an error when math or doc is not provided

	  this.math = math;
	  this.doc = doc;
	}

	/**
	 * Test whether a value is an instance of Help
	 * @param {*} value
	 * @return {Boolean} isHelp
	 */
	Help.isHelp = function (value) {
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
	      if (res !== undefined && !(res instanceof Help)) {
	        desc += '        ' + string.format(res, {precision: 14}) + '\n';
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
	  return object.clone(this.doc);
	};

	/**
	 * Returns a string representation of the Help object
	 */
	Help.prototype.valueOf = Help.prototype.toString;

	// exports
	module.exports = Help;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * A ResultSet contains a list or results
	 * @param {Array} entries
	 * @constructor
	 */
	function ResultSet(entries) {
	  if (!(this instanceof ResultSet)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.entries = entries || [];
	}

	/**
	 * Returns the array with results hold by this ResultSet
	 * @returns {Array} entries
	 */
	ResultSet.prototype.valueOf = function () {
	  return this.entries;
	};

	/**
	 * Returns the stringified results of the ResultSet
	 * @returns {String} string
	 */
	ResultSet.prototype.toString = function () {
	  return '[' + this.entries.join(', ') + ']';
	};

	module.exports = ResultSet;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// utility methods for arrays and matrices
	'use strict';

	var util = __webpack_require__(160),

	    IndexError = __webpack_require__(157),
	    DimensionError = __webpack_require__(156),

	    Matrix = __webpack_require__(9),

	    array = util.array,
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
	exports.argsToArray = function(args) {
	  if (args.length == 0) {
	    // fn()
	    return [];
	  }
	  else if (args.length == 1) {
	    // fn(n)
	    // fn([m, n, p, ...])
	    var array = args[0];
	    if (array instanceof Matrix) {
	      array = array.valueOf();
	    }
	    if (!isArray(array)) {
	      array = [array];
	    }
	    return array;
	  }
	  else {
	    // fn(m, n, p, ...)
	    return util.array.argsToArray(args);
	  }
	};


	/**
	 * Test whether a value is a collection: an Array or Matrix
	 * @param {*} x
	 * @returns {boolean} isCollection
	 */
	exports.isCollection = function(x) {
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
	        throw new DimensionError(array1.length, array2.length);
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
	    else if (array2 instanceof Matrix) {
	      // callback(object, matrix)
	      res = deepMap2(array1, array2.valueOf(), callback);
	      return new Matrix(res);
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
	 * array with one less dimension, applying the given
	 * callback in the selected dimension.
	 * @param {Array | Matrix} mat
	 * @param {Number} dim
	 * @param {function} callback
	 * @return {Array | Matrix} res
	 */
	exports.reduce = function(mat, dim, callback) {
	  var size = isArray(mat) ? array.size(mat) : mat.size();
	  if (dim < 0) {
	    // TODO: would be more clear when throwing a DimensionError here
	    throw new IndexError(dim);
	  }
	  if (dim >= size.length) {
	    // TODO: would be more clear when throwing a DimensionError here
	    throw new IndexError(dim, size.length);
	  }

		if (mat instanceof Matrix) {
			return new Matrix(_reduce(mat.valueOf(), dim, callback));
		}else {
			return _reduce(mat, dim, callback);
		}
	};

	/**
	 * Recursively reduce a matrix
	 * @param {Array} mat
	 * @param {Number} dim
	 * @param {Function} callback
	 * @returns {Array} ret
	 * @private
	 */
	function _reduce(mat, dim, callback){
	  var i, ret, val, tran;

		if(dim<=0){
			if( !isArray(mat[0]) ){
				val = mat[0];
				for(i=1; i<mat.length; i++){
					val = callback(val, mat[i]);
				}
				return val;
			}else{
				tran = _switch(mat);
				ret = [];
				for(i=0; i<tran.length; i++){
					ret[i] = _reduce(tran[i], dim-1, callback);
				}
				return ret
			}
		}else{
			ret = [];
			for(i=0; i<mat.length; i++){
				ret[i] = _reduce(mat[i], dim-1, callback);
			}
			return ret;
		}
	}

	/**
	 * Transpose a matrix
	 * @param {Array} mat
	 * @returns {Array} ret
	 * @private
	 */
	function _switch(mat){
	  var I = mat.length;
	  var J = mat[0].length;
	  var i, j;
	  var ret = [];
	  for( j=0; j<J; j++) {
	    var tmp = [];
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


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var util = __webpack_require__(160),

	    ArgumentsError = __webpack_require__(155),

	    isString = util.string.isString,
	    isArray = Array.isArray,
	    type = util.types.type,

	    // types
	    Complex = __webpack_require__(6),
	    Matrix = __webpack_require__(9),
	    Unit = __webpack_require__(10),
	    collection = __webpack_require__(13),

	    // scope and nodes
	    ArrayNode = __webpack_require__(161),
	    AssignmentNode = __webpack_require__(162),
	    BlockNode = __webpack_require__(163),
	    ConditionalNode = __webpack_require__(164),
	    ConstantNode = __webpack_require__(165),
	    FunctionAssignmentNode = __webpack_require__(166),
	    IndexNode = __webpack_require__(167),
	    OperatorNode = __webpack_require__(168),
	    FunctionNode = __webpack_require__(169),
	    RangeNode = __webpack_require__(170),
	    SymbolNode = __webpack_require__(171),
	    UpdateNode = __webpack_require__(172);

	/**
	 * Parse an expression. Returns a node tree, which can be evaluated by
	 * invoking node.eval();
	 *
	 * Syntax:
	 *
	 *     parse(expr)
	 *     parse(expr, options)
	 *     parse([expr1, expr2, expr3, ...])
	 *     parse([expr1, expr2, expr3, ...], options)
	 *
	 * Example:
	 *
	 *     var node = parse('sqrt(3^2 + 4^2)');
	 *     node.compile(math).eval(); // 5
	 *
	 *     var scope = {a:3, b:4}
	 *     var node = parse('a * b'); // 12
	 *     var code = node.compile(math);
	 *     code.eval(scope); // 12
	 *     scope.a = 5;
	 *     code.eval(scope); // 20
	 *
	 *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
	 *     nodes[2].compile(math).eval(); // 12
	 *
	 * @param {String | String[] | Matrix} expr
	 * @param {{nodes: Object<String, Node>}} [options]  Available options:
	 *                                                   - `nodes` a set of custom nodes
	 * @return {Node | Node[]} node
	 * @throws {Error}
	 */
	function parse (expr, options) {
	  if (arguments.length != 1 && arguments.length != 2) {
	    throw new ArgumentsError('parse', arguments.length, 1, 2);
	  }

	  // pass extra nodes
	  extra_nodes = (options && options.nodes) ? options.nodes : {};

	  if (isString(expr)) {
	    // parse a single expression
	    expression = expr;
	    return parseStart();
	  }
	  else if (isArray(expr) || expr instanceof Matrix) {
	    // parse an array or matrix with expressions
	    return collection.deepMap(expr, function (elem) {
	      if (!isString(elem)) throw new TypeError('String expected');

	      expression = elem;
	      return parseStart();
	    });
	  }
	  else {
	    // oops
	    throw new TypeError('String or matrix expected');
	  }
	}

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
	  '~': true,
	  '!': true,
	  '&': true,
	  '|': true,
	  '^|': true,
	  '\'': true,
	  '=': true,
	  ':': true,
	  '?': true,

	  '==': true,
	  '!=': true,
	  '<': true,
	  '>': true,
	  '<=': true,
	  '>=': true,

	  '<<': true,
	  '>>': true,
	  '>>>': true
	};

	// map with all named delimiters
	var NAMED_DELIMITERS = {
	  'mod': true,
	  'to': true,
	  'in': true,
	  'and': true,
	  'xor': true,
	  'or': true,
	  'not': true
	};

	var extra_nodes = {};             // current extra nodes
	var expression = '';              // current expression
	var index = 0;                    // current index in expr
	var c = '';                       // current token character in expr
	var token = '';                   // current token
	var token_type = TOKENTYPE.NULL;  // type of the token
	var nesting_level = 0;            // level of nesting inside parameters, used to ignore newline characters
	var conditional_level = null;     // when a conditional is being parsed, the level of the conditional is stored here

	/**
	 * Get the first character from the expression.
	 * The character is stored into the char c. If the end of the expression is
	 * reached, the function puts an empty string in c.
	 * @private
	 */
	function first() {
	  index = 0;
	  c = expression.charAt(0);
	  nesting_level = 0;
	  conditional_level = null;
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
	 * Preview the second next character from the expression.
	 * @return {String} cNext
	 * @private
	 */
	function nextNextPreview() {
	  return expression.charAt(index + 2);
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
	  // space, tab, and newline when inside parameters
	  while (c == ' ' || c == '\t' || (c == '\n' && nesting_level)) {
	    // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
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

	  // check for new line character
	  if (c == '\n' && !nesting_level) {
	    token_type = TOKENTYPE.DELIMITER;
	    token = c;
	    next();
	    return;
	  }

	  // check for delimiters consisting of 3 characters
	  var c2 = c + nextPreview();
	  var c3 = c2 + nextNextPreview();
	  if (c3.length == 3 && DELIMITERS[c3]) {
	    token_type = TOKENTYPE.DELIMITER;
	    token = c3;
	    next();
	    next();
	    next();
	    return;
	  }

	  // check for delimiters consisting of 2 characters
	  if (c2.length == 2 && DELIMITERS[c2]) {
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

	    // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
	    c2 = nextPreview();
	    if ((c == 'E' || c == 'e') && (isDigit(c2) || c2 == '-' || c2 == '+')) {
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
	 * Get next token and skip newline tokens
	 */
	function getTokenSkipNewline () {
	  do {
	    getToken();
	  }
	  while (token == '\n');
	}

	/**
	 * Open parameters.
	 * New line characters will be ignored until closeParams() is called
	 */
	function openParams() {
	  nesting_level++;
	}

	/**
	 * Close parameters.
	 * New line characters will no longer be ignored
	 */
	function closeParams() {
	  nesting_level--;
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
	 * @return {Node} node
	 * @private
	 */
	function parseStart () {
	  // get the first character in expression
	  first();

	  getToken();

	  var node = parseBlock();

	  // check for garbage at the end of the expression
	  // an expression ends with a empty character '' and token_type DELIMITER
	  if (token != '') {
	    if (token_type == TOKENTYPE.DELIMITER) {
	      // user entered a not existing operator like "//"

	      // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
	      throw createError('Unexpected operator ' + token);
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
	 * @return {Node} node
	 * @private
	 */
	function parseBlock () {
	  var node;
	  var blocks = [];
	  var visible;

	  if (token == '') {
	    // empty expression
	    return new ConstantNode('undefined', 'undefined');
	  }

	  if (token != '\n' && token != ';') {
	    node = parseFunctionAssignment();
	  }

	  // TODO: simplify this loop
	  while (token == '\n' || token == ';') {
	    if (blocks.length == 0 && node) {
	      visible = (token != ';');
	      blocks.push({
	        node: node,
	        visible: visible
	      });
	    }

	    getToken();
	    if (token != '\n' && token != ';' && token != '') {
	      node = parseFunctionAssignment();

	      visible = (token != ';');
	      blocks.push({
	        node: node,
	        visible: visible
	      });
	    }
	  }

	  if (blocks.length > 0) {
	    return new BlockNode(blocks);
	  }
	  else {
	    return node;
	  }
	}

	/**
	 * Parse a function assignment like "function f(a,b) = a*b"
	 * @return {Node} node
	 * @private
	 */
	function parseFunctionAssignment () {
	  // TODO: function assignment using keyword 'function' is deprecated since version 0.18.0, cleanup some day
	  if (token_type == TOKENTYPE.SYMBOL && token == 'function') {
	    throw createSyntaxError('Deprecated keyword "function". ' +
	        'Functions can now be assigned without it, like "f(x) = x^2".');
	  }

	  return parseAssignment();
	}

	/**
	 * Assignment of a variable, can be a variable like "a=2.3" or a updating an
	 * existing variable like "matrix(2,3:5)=[6,7,8]"
	 * @return {Node} node
	 * @private
	 */
	function parseAssignment () {
	  var name, args, expr, valid;

	  var node = parseConditional();

	  if (token == '=') {
	    if (node instanceof SymbolNode) {
	      // parse a variable assignment like 'a = 2/3'
	      name = node.name;
	      getTokenSkipNewline();
	      expr = parseAssignment();
	      return new AssignmentNode(name, expr);
	    }
	    else if (node instanceof IndexNode) {
	      // parse a matrix subset assignment like 'A[1,2] = 4'
	      getTokenSkipNewline();
	      expr = parseAssignment();
	      return new UpdateNode(node, expr);
	    }
	    else if (node instanceof FunctionNode) {
	      // parse function assignment like 'f(x) = x^2'
	      valid = true;
	      args = [];

	      name = node.name;
	      node.args.forEach(function (arg, index) {
	        if (arg instanceof SymbolNode) {
	          args[index] = arg.name;
	        }
	        else {
	          valid = false;
	        }
	      });

	      if (valid) {
	        getTokenSkipNewline();
	        expr = parseAssignment();
	        return new FunctionAssignmentNode(name, args, expr);
	      }
	    }

	    throw createSyntaxError('Invalid left hand side of assignment operator =');
	  }

	  return node;
	}

	/**
	 * conditional operation
	 *
	 *     condition ? truePart : falsePart
	 *
	 * Note: conditional operator is right-associative
	 *
	 * @return {Node} node
	 * @private
	 */
	function parseConditional () {
	  var node = parseLogicalOr();

	  while (token == '?') {
	    // set a conditional level, the range operator will be ignored as long
	    // as conditional_level == nesting_level.
	    var prev = conditional_level;
	    conditional_level = nesting_level;
	    getTokenSkipNewline();

	    var condition = node;
	    var trueExpr = parseLogicalOr();

	    if (token != ':') throw createSyntaxError('False part of conditional expression expected');

	    conditional_level = null;
	    getTokenSkipNewline();

	    var falseExpr = parseConditional(); // Note: check for conditional operator again, right associativity

	    node = new ConditionalNode(condition, trueExpr, falseExpr);

	    // restore the previous conditional level
	    conditional_level = prev;
	  }

	  return node;
	}

	/**
	 * logical or, 'x or y'
	 * @return {Node} node
	 * @private
	 */
	function parseLogicalOr() {
	  var node = parseLogicalXor();

	  while (token == 'or') {
	    getTokenSkipNewline();
	    node = new OperatorNode('or', 'or', [node, parseLogicalXor()]);
	  }

	  return node;
	}

	/**
	 * logical exclusive or, 'x xor y'
	 * @return {Node} node
	 * @private
	 */
	function parseLogicalXor() {
	  var node = parseLogicalAnd();

	  while (token == 'xor') {
	    getTokenSkipNewline();
	    node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd()]);
	  }

	  return node;
	}

	/**
	 * logical and, 'x and y'
	 * @return {Node} node
	 * @private
	 */
	function parseLogicalAnd() {
	  var node = parseBitwiseOr();

	  while (token == 'and') {
	    getTokenSkipNewline();
	    node = new OperatorNode('and', 'and', [node, parseBitwiseOr()]);
	  }

	  return node;
	}

	/**
	 * bitwise or, 'x | y'
	 * @return {Node} node
	 * @private
	 */
	function parseBitwiseOr() {
	  var node = parseBitwiseXor();

	  while (token == '|') {
	    getTokenSkipNewline();
	    node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor()]);
	  }

	  return node;
	}

	/**
	 * bitwise exclusive or (xor), 'x ^| y'
	 * @return {Node} node
	 * @private
	 */
	function parseBitwiseXor() {
	  var node = parseBitwiseAnd();

	  while (token == '^|') {
	    getTokenSkipNewline();
	    node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd()]);
	  }

	  return node;
	}

	/**
	 * bitwise and, 'x & y'
	 * @return {Node} node
	 * @private
	 */
	function parseBitwiseAnd () {
	  var node = parseRelational();

	  while (token == '&') {
	    getTokenSkipNewline();
	    node = new OperatorNode('&', 'bitAnd', [node, parseRelational()]);
	  }

	  return node;
	}

	/**
	 * relational operators
	 * @return {Node} node
	 * @private
	 */
	function parseRelational () {
	  var node, operators, name, fn, params;

	  node = parseShift();

	  operators = {
	    '==': 'equal',
	    '!=': 'unequal',
	    '<': 'smaller',
	    '>': 'larger',
	    '<=': 'smallerEq',
	    '>=': 'largerEq'
	  };
	  while (token in operators) {
	    name = token;
	    fn = operators[name];

	    getTokenSkipNewline();
	    params = [node, parseShift()];
	    node = new OperatorNode(name, fn, params);
	  }

	  return node;
	}

	/**
	 * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
	 * @return {Node} node
	 * @private
	 */
	function parseShift () {
	  var node, operators, name, fn, params;

	  node = parseConversion();

	  operators = {
	    '<<' : 'leftShift',
	    '>>' : 'rightArithShift',
	    '>>>' : 'rightLogShift'
	  };

	  while (token in operators) {
	    name = token;
	    fn = operators[name];

	    getTokenSkipNewline();
	    params = [node, parseConversion()];
	    node = new OperatorNode(name, fn, params);
	  }

	  return node;
	}

	/**
	 * conversion operators 'to' and 'in'
	 * @return {Node} node
	 * @private
	 */
	function parseConversion () {
	  var node, operators, name, fn, params;

	  node = parseRange();

	  operators = {
	    'to' : 'to',
	    'in' : 'to'   // alias of 'to'
	  };

	  while (token in operators) {
	    name = token;
	    fn = operators[name];

	    getTokenSkipNewline();
	    params = [node, parseRange()];
	    node = new OperatorNode(name, fn, params);
	  }

	  return node;
	}

	/**
	 * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
	 * @return {Node} node
	 * @private
	 */
	function parseRange () {
	  var node, params = [];

	  if (token == ':') {
	    // implicit start=1 (one-based)
	    node = new ConstantNode('1', 'number');
	  }
	  else {
	    // explicit start
	    node = parseAddSubtract();
	  }

	  if (token == ':' && (conditional_level !== nesting_level)) {
	    // we ignore the range operator when a conditional operator is being processed on the same level
	    params.push(node);

	    // parse step and end
	    while (token == ':' && params.length < 3) {
	      getTokenSkipNewline();

	      if (token == ')' || token == ']' || token == ',' || token == '') {
	        // implicit end
	        params.push(new SymbolNode('end'));
	      }
	      else {
	        // explicit end
	        params.push(parseAddSubtract());
	      }
	    }

	    if (params.length == 3) {
	      // params = [start, step, end]
	      node = new RangeNode(params[0], params[2], params[1]); // start, end, step
	    }
	    else { // length == 2
	      // params = [start, end]
	      node = new RangeNode(params[0], params[1]); // start, end
	    }
	  }

	  return node;
	}

	/**
	 * add or subtract
	 * @return {Node} node
	 * @private
	 */
	function parseAddSubtract ()  {
	  var node, operators, name, fn, params;

	  node = parseMultiplyDivide();

	  operators = {
	    '+': 'add',
	    '-': 'subtract'
	  };
	  while (token in operators) {
	    name = token;
	    fn = operators[name];

	    getTokenSkipNewline();
	    params = [node, parseMultiplyDivide()];
	    node = new OperatorNode(name, fn, params);
	  }

	  return node;
	}

	/**
	 * multiply, divide, modulus
	 * @return {Node} node
	 * @private
	 */
	function parseMultiplyDivide () {
	  var node, operators, name, fn, params;

	  node = parseUnary();

	  operators = {
	    '*': 'multiply',
	    '.*': 'dotMultiply',
	    '/': 'divide',
	    './': 'dotDivide',
	    '%': 'mod',
	    'mod': 'mod'
	  };

	  if (token in operators) {
	    while (token in operators) {
	      name = token;
	      fn = operators[name];

	      getTokenSkipNewline();
	      params = [node, parseUnary()];
	      node = new OperatorNode(name, fn, params);
	    }
	  }

	  // parse implicit multiplication
	  if ((token_type == TOKENTYPE.SYMBOL) ||
	      (token == 'in' && (node instanceof ConstantNode)) ||
	      (token_type == TOKENTYPE.NUMBER && !(node instanceof ConstantNode)) ||
	      (token == '(' || token == '[')) {
	    // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
	    // number:      implicit multiplication like '(2+3)2'
	    //              Note: we don't allow implicit multiplication between numbers,
	    //              like '2 3'. I'm not sure whether that is a good idea.
	    // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)', '2[1,2,3]'
	    node = new OperatorNode('*', 'multiply', [node, parseMultiplyDivide()]);
	  }

	  return node;
	}

	/**
	 * Unary plus and minus, and logical and bitwise not
	 * @return {Node} node
	 * @private
	 */
	function parseUnary () {
	  var name, params;
	  var fn = {
	    '-': 'unaryMinus',
	    '+': 'unaryPlus',
	    '~': 'bitNot',
	    'not': 'not'
	  }[token];

	  if (fn) {
	    name = token;

	    getTokenSkipNewline();
	    params = [parseUnary()];

	    return new OperatorNode(name, fn, params);
	  }

	  return parsePow();
	}

	/**
	 * power
	 * Note: power operator is right associative
	 * @return {Node} node
	 * @private
	 */
	function parsePow () {
	  var node, name, fn, params;

	  node = parseLeftHandOperators();

	  if (token == '^' || token == '.^') {
	    name = token;
	    fn = (name == '^') ? 'pow' : 'dotPow';

	    getTokenSkipNewline();
	    params = [node, parseUnary()]; // Go back to unary, we can have '2^-3'
	    node = new OperatorNode(name, fn, params);
	  }

	  return node;
	}

	/**
	 * Left hand operators: factorial x!, transpose x'
	 * @return {Node} node
	 * @private
	 */
	function parseLeftHandOperators ()  {
	  var node, operators, name, fn, params;

	  node = parseCustomNodes();

	  operators = {
	    '!': 'factorial',
	    '\'': 'transpose'
	  };

	  while (token in operators) {
	    name = token;
	    fn = operators[name];

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
	 * A handler must be passed as second argument of the parse function.
	 * - must extend math.expression.node.Node
	 * - must contain a function _compile(defs: Object) : String
	 * - must contain a function find(filter: Object) : Node[]
	 * - must contain a function toString() : String
	 * - the constructor is called with a single argument containing all parameters
	 *
	 * For example:
	 *
	 *     nodes = {
	 *       'plot': PlotHandler
	 *     };
	 *
	 * The constructor of the handler is called as:
	 *
	 *     node = new PlotHandler(params);
	 *
	 * The handler will be invoked when evaluating an expression like:
	 *
	 *     node = math.parse('plot(sin(x), x)', nodes);
	 *
	 * @return {Node} node
	 * @private
	 */
	function parseCustomNodes () {
	  var params = [], handler;

	  if (token_type == TOKENTYPE.SYMBOL && extra_nodes[token]) {
	    handler = extra_nodes[token];

	    getToken();

	    // parse parameters
	    if (token == '(') {
	      params = [];

	      openParams();
	      getToken();

	      if (token != ')') {
	        params.push(parseConditional());

	        // parse a list with parameters
	        while (token == ',') {
	          getToken();
	          params.push(parseConditional());
	        }
	      }

	      if (token != ')') {
	        throw createSyntaxError('Parenthesis ) expected');
	      }
	      closeParams();
	      getToken();
	    }

	    // create a new node handler
	    //noinspection JSValidateTypes
	    return new handler(params);
	  }

	  return parseSymbol();
	}

	/**
	 * parse symbols: functions, variables, constants, units
	 * @return {Node} node
	 * @private
	 */
	function parseSymbol () {
	  var node, name;

	  if (token_type == TOKENTYPE.SYMBOL ||
	      (token_type == TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
	    name = token;

	    getToken();

	    // parse function parameters and matrix index
	    node = parseFunctions(name);
	    node = parseIndex(node);
	    return node;
	  }

	  return parseString();
	}

	/**
	 * parse a function call like fn(a, b, c)
	 * @param {string} name    Function name
	 * @return {FunctionNode | SymbolNode} node
	 * @private
	 */
	function parseFunctions (name) {
	  var params;

	  if (token == '(') {
	    params = [];

	    openParams();
	    getToken();

	    if (token != ')') {
	      params.push(parseConditional());

	      // parse a list with parameters
	      while (token == ',') {
	        getToken();
	        params.push(parseConditional());
	      }
	    }

	    if (token != ')') {
	      throw createSyntaxError('Parenthesis ) expected');
	    }
	    closeParams();
	    getToken();

	    return new FunctionNode(name, params);
	  }

	  return new SymbolNode(name);
	}

	/**
	 * parse index parameters, enclosed in square brackets [...], for example A[2,3]
	 * @param {Node} node    Node on which to apply the parameters. If there
	 *                       are no parameters in the expression, the node
	 *                       itself is returned
	 * @return {Node} node
	 * @private
	 */
	function parseIndex (node) {
	  var params;

	  while (token == '[') {
	    params = [];

	    openParams();
	    getToken();

	    if (token != ']') {
	      params.push(parseConditional());

	      // parse a list with parameters
	      while (token == ',') {
	        getToken();
	        params.push(parseConditional());
	      }
	    }

	    if (token != ']') {
	      throw createSyntaxError('Parenthesis ] expected');
	    }
	    closeParams();
	    getToken();

	    node = new IndexNode(node, params);
	  }

	  return node;
	}

	/**
	 * parse a string.
	 * A string is enclosed by double quotes
	 * @return {Node} node
	 * @private
	 */
	function parseString () {
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
	    node = new ConstantNode(str, 'string');

	    // parse index parameters
	    node = parseIndex(node);

	    return node;
	  }

	  return parseMatrix();
	}

	/**
	 * parse the matrix
	 * @return {Node} node
	 * @private
	 */
	function parseMatrix () {
	  var array, params, rows, cols;

	  if (token == '[') {
	    // matrix [...]
	    openParams();
	    getToken();

	    if (token != ']') {
	      // this is a non-empty matrix
	      var row = parseRow();

	      if (token == ';') {
	        // 2 dimensional array
	        rows = 1;
	        params = [row];

	        // the rows of the matrix are separated by dot-comma's
	        while (token == ';') {
	          getToken();

	          params[rows] = parseRow();
	          rows++;
	        }

	        if (token != ']') {
	          throw createSyntaxError('End of matrix ] expected');
	        }
	        closeParams();
	        getToken();

	        // check if the number of columns matches in all rows
	        cols = params[0].nodes.length;
	        for (var r = 1; r < rows; r++) {
	          if (params[r].nodes.length != cols) {
	            throw createError('Column dimensions mismatch ' +
	                '(' + params[r].nodes.length + ' != ' + cols + ')');
	          }
	        }

	        array = new ArrayNode(params);
	      }
	      else {
	        // 1 dimensional vector
	        if (token != ']') {
	          throw createSyntaxError('End of matrix ] expected');
	        }
	        closeParams();
	        getToken();

	        array = row;
	      }
	    }
	    else {
	      // this is an empty matrix "[ ]"
	      closeParams();
	      getToken();
	      array = new ArrayNode([]);
	    }

	    return array;
	  }

	  return parseNumber();
	}

	/**
	 * Parse a single comma-separated row from a matrix, like 'a, b, c'
	 * @return {ArrayNode} node
	 */
	function parseRow () {
	  var params = [parseAssignment()];
	  var len = 1;

	  while (token == ',') {
	    getToken();

	    // parse expression
	    params[len] = parseAssignment();
	    len++;
	  }

	  return new ArrayNode(params);
	}

	/**
	 * parse a number
	 * @return {Node} node
	 * @private
	 */
	function parseNumber () {
	  var number;

	  if (token_type == TOKENTYPE.NUMBER) {
	    // this is a number
	    number = token;
	    getToken();

	    return new ConstantNode(number, 'number');
	  }

	  return parseParentheses();
	}

	/**
	 * parentheses
	 * @return {Node} node
	 * @private
	 */
	function parseParentheses () {
	  var node;

	  // check if it is a parenthesized expression
	  if (token == '(') {
	    // parentheses (...)
	    openParams();
	    getToken();

	    node = parseAssignment(); // start again

	    if (token != ')') {
	      throw createSyntaxError('Parenthesis ) expected');
	    }
	    closeParams();
	    getToken();

	    return node;
	  }

	  return parseEnd();
	}

	/**
	 * Evaluated when the expression is not yet ended but expected to end
	 * @return {Node} res
	 * @private
	 */
	function parseEnd () {
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
	/* TODO: implement keeping track on the row number
	function row () {
	  return null;
	}
	*/

	/**
	 * Shortcut for getting the current col value (one based)
	 * Returns the column (position) where the last token starts
	 * @private
	 */
	function col () {
	  return index - token.length + 1;
	}

	/**
	 * Create an error
	 * @param {String} message
	 * @return {SyntaxError} instantiated error
	 * @private
	 */
	function createSyntaxError (message) {
	  var c = col();
	  var error = new SyntaxError(message + ' (char ' + c + ')');
	  error['char'] = c;

	  return error;
	}

	/**
	 * Create an error
	 * @param {String} message
	 * @return {Error} instantiated error
	 * @private
	 */
	function createError (message) {
	  var c = col();
	  var error = new Error(message + ' (char ' + c + ')');
	  error['char'] = c;

	  return error;
	}

	module.exports = parse;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _parse = __webpack_require__(14);

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
	        'Constructor must be called with the new operator');
	  }

	  if (!(math instanceof Object)) {
	    throw new TypeError('Object expected as parameter math');
	  }

	  this.math = math;
	  this.scope = {};
	}

	/**
	 * Parse an expression and return the parsed function node.
	 * The node tree can be compiled via `code = node.compile(math)`,
	 * and the compiled code can be executed as `code.eval([scope])`
	 * @param {String} expr
	 * @return {Node} node
	 * @throws {Error}
	 */
	Parser.prototype.parse = function (expr) {
	  throw new Error('Parser.parse is deprecated. Use math.parse instead.');
	};

	/**
	 * Parse and compile an expression, return the compiled javascript code.
	 * The node can be evaluated via code.eval([scope])
	 * @param {String} expr
	 * @return {{eval: function}} code
	 * @throws {Error}
	 */
	Parser.prototype.compile = function (expr) {
	  throw new Error('Parser.compile is deprecated. Use math.compile instead.');
	};

	/**
	 * Parse and evaluate the given expression
	 * @param {String} expr   A string containing an expression, for example "2+3"
	 * @return {*} result     The result, or undefined when the expression was empty
	 * @throws {Error}
	 */
	Parser.prototype.eval = function (expr) {
	  // TODO: validate arguments
	  return _parse(expr)
	      .compile(this.math)
	      .eval(this.scope);
	};

	/**
	 * Get a variable (a function or variable) by name from the parsers scope.
	 * Returns undefined when not found
	 * @param {String} name
	 * @return {* | undefined} value
	 */
	Parser.prototype.get = function (name) {
	  // TODO: validate arguments
	  return this.scope[name];
	};

	/**
	 * Set a symbol (a function or variable) by name from the parsers scope.
	 * @param {String} name
	 * @param {* | undefined} value
	 */
	Parser.prototype.set = function (name, value) {
	  // TODO: validate arguments
	  return this.scope[name] = value;
	};

	/**
	 * Remove a variable from the parsers scope
	 * @param {String} name
	 */
	Parser.prototype.remove = function (name) {
	  // TODO: validate arguments
	  delete this.scope[name];
	};

	/**
	 * Clear the scope with variables and functions
	 */
	Parser.prototype.clear = function () {
	  for (var name in this.scope) {
	    if (this.scope.hasOwnProperty(name)) {
	      delete this.scope[name];
	    }
	  }
	};

	module.exports = Parser;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.ArrayNode = __webpack_require__(161);
	exports.AssignmentNode = __webpack_require__(162);
	exports.BlockNode = __webpack_require__(163);
	exports.ConditionalNode = __webpack_require__(164);
	exports.ConstantNode = __webpack_require__(165);
	exports.IndexNode = __webpack_require__(167);
	exports.FunctionAssignmentNode = __webpack_require__(166);
	exports.FunctionNode = __webpack_require__(169);
	exports.Node = __webpack_require__(173);
	exports.OperatorNode = __webpack_require__(168);
	exports.RangeNode = __webpack_require__(170);
	exports.SymbolNode = __webpack_require__(171);
	exports.UpdateNode = __webpack_require__(172);


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// constants
	exports.e = __webpack_require__(177);
	exports.E = __webpack_require__(177);
	exports['false'] = __webpack_require__(178);
	exports.i = __webpack_require__(179);
	exports['Infinity'] = __webpack_require__(180);
	exports.LN2 = __webpack_require__(181);
	exports.LN10 = __webpack_require__(182);
	exports.LOG2E = __webpack_require__(183);
	exports.LOG10E = __webpack_require__(184);
	exports.NaN = __webpack_require__(185);
	exports['null'] = __webpack_require__(186);
	exports.pi = __webpack_require__(187);
	exports.PI = __webpack_require__(187);
	exports.phi = __webpack_require__(188);
	exports.SQRT1_2 = __webpack_require__(189);
	exports.SQRT2 = __webpack_require__(190);
	exports.tau = __webpack_require__(191);
	exports['true'] = __webpack_require__(192);
	exports.version = __webpack_require__(193);

	// functions - arithmetic
	exports.abs = __webpack_require__(197);
	exports.add = __webpack_require__(198);
	exports.ceil = __webpack_require__(199);
	exports.cube = __webpack_require__(200);
	exports.divide = __webpack_require__(201);
	exports.dotDivide = __webpack_require__(202);
	exports.dotMultiply = __webpack_require__(203);
	exports.dotPow = __webpack_require__(204);
	exports.exp = __webpack_require__(205);
	exports.fix = __webpack_require__(206);
	exports.floor = __webpack_require__(207);
	exports.gcd = __webpack_require__(208);
	exports.lcm = __webpack_require__(209);
	exports.log = __webpack_require__(210);
	exports.log10 = __webpack_require__(211);
	exports.mod = __webpack_require__(212);
	exports.multiply = __webpack_require__(213);
	exports.norm = __webpack_require__(214);
	exports.nthRoot = __webpack_require__(215);
	exports.pow = __webpack_require__(216);
	exports.round = __webpack_require__(217);
	exports.sign = __webpack_require__(218);
	exports.sqrt = __webpack_require__(219);
	exports.square = __webpack_require__(220);
	exports.subtract = __webpack_require__(221);
	exports.unaryMinus = __webpack_require__(222);
	exports.unaryPlus = __webpack_require__(223);
	exports.xgcd = __webpack_require__(224);

	// functions - bitwise
	exports.bitAnd = __webpack_require__(225);
	exports.bitNot = __webpack_require__(226);
	exports.bitOr = __webpack_require__(227);
	exports.bitXor = __webpack_require__(228);
	exports.leftShift = __webpack_require__(229);
	exports.rightArithShift = __webpack_require__(230);
	exports.rightLogShift = __webpack_require__(231);

	// functions - complex
	exports.arg = __webpack_require__(232);
	exports.conj = __webpack_require__(233);
	exports.re = __webpack_require__(234);
	exports.im = __webpack_require__(235);

	// functions - construction
	exports.bignumber = __webpack_require__(236);
	exports['boolean'] = __webpack_require__(237);
	exports.complex = __webpack_require__(238);
	exports.index = __webpack_require__(239);
	exports.matrix = __webpack_require__(240);
	exports.number = __webpack_require__(241);
	exports.string = __webpack_require__(242);
	exports.unit = __webpack_require__(243);

	// functions - expression
	exports['eval'] =  __webpack_require__(244);
	exports.help =  __webpack_require__(245);

	// functions - logical
	exports['and'] = __webpack_require__(246);
	exports['not'] = __webpack_require__(247);
	exports['or'] = __webpack_require__(248);
	exports['xor'] = __webpack_require__(249);

	// functions - matrix
	exports['concat'] = __webpack_require__(250);
	exports.cross = __webpack_require__(251);
	exports.det = __webpack_require__(252);
	exports.diag = __webpack_require__(253);
	exports.dot = __webpack_require__(254);
	exports.eye = __webpack_require__(255);
	exports.flatten = __webpack_require__(256);
	exports.inv = __webpack_require__(257);
	exports.ones = __webpack_require__(258);
	exports.range = __webpack_require__(259);
	exports.resize = __webpack_require__(260);
	exports.size = __webpack_require__(261);
	exports.squeeze = __webpack_require__(262);
	exports.subset = __webpack_require__(263);
	exports.transpose = __webpack_require__(264);
	exports.zeros = __webpack_require__(265);

	// functions - probability
	exports.combinations = __webpack_require__(266);
	//exports.distribution = require('./function/probability/distribution');
	exports.factorial = __webpack_require__(267);
	exports.gamma = __webpack_require__(268);
	exports.permutations = __webpack_require__(269);
	exports.pickRandom = __webpack_require__(270);
	exports.random = __webpack_require__(271);
	exports.randomInt = __webpack_require__(272);

	// functions - relational
	exports.compare = __webpack_require__(273);
	exports.deepEqual = __webpack_require__(274);
	exports['equal'] = __webpack_require__(275);
	exports.larger = __webpack_require__(276);
	exports.largerEq = __webpack_require__(277);
	exports.smaller = __webpack_require__(278);
	exports.smallerEq = __webpack_require__(279);
	exports.unequal = __webpack_require__(280);

	// functions - statistics
	exports.max = __webpack_require__(281);
	exports.mean = __webpack_require__(282);
	exports.median = __webpack_require__(283);
	exports.min = __webpack_require__(284);
	exports.prod = __webpack_require__(285);
	exports.std = __webpack_require__(286);
	exports.sum = __webpack_require__(287);
	exports['var'] = __webpack_require__(288);

	// functions - trigonometry
	exports.acos = __webpack_require__(289);
	exports.asin = __webpack_require__(290);
	exports.atan = __webpack_require__(291);
	exports.atan2 = __webpack_require__(292);
	exports.cos = __webpack_require__(293);
	exports.cosh = __webpack_require__(294);
	exports.cot = __webpack_require__(295);
	exports.coth = __webpack_require__(296);
	exports.csc = __webpack_require__(297);
	exports.csch = __webpack_require__(298);
	exports.sec = __webpack_require__(299);
	exports.sech = __webpack_require__(300);
	exports.sin = __webpack_require__(301);
	exports.sinh = __webpack_require__(302);
	exports.tan = __webpack_require__(303);
	exports.tanh = __webpack_require__(304);

	// functions - units
	exports.to = __webpack_require__(305);

	// functions - utils
	exports.clone =  __webpack_require__(306);
	exports.map =  __webpack_require__(307);
	exports.filter =  __webpack_require__(308);
	exports.forEach =  __webpack_require__(309);
	exports.format =  __webpack_require__(310);
	// exports.print =  require('./function/utils/print'); // TODO: add documentation for print as soon as the parser supports objects.
	exports['import'] =  __webpack_require__(311);
	exports.sort =  __webpack_require__(312);
	exports['typeof'] =  __webpack_require__(313);


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var errorTransform = __webpack_require__(174).transform;
	var isNumber = __webpack_require__(4).isNumber;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.range
	 * Adds a property transform containing the transform function.
	 *
	 * This transform changed the last `dim` parameter of function concat
	 * from one-based to zero based
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.concat.transform = function () {
	    // copy arguments into an array
	    var args = argsToArray(arguments);

	    // change last argument from one-based to zero-based
	    var lastIndex = args.length - 1;
	    var last = args[lastIndex];
	    if (isNumber(last)) {
	      args[lastIndex] = last - 1;
	    }
	    else if (last instanceof BigNumber) {
	      args[lastIndex] = last.minus(1);
	    }

	    try {
	      return math.concat.apply(math, args);
	    }
	    catch (err) {
	      throw errorTransform(err);
	    }
	  };
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SymbolNode = __webpack_require__(171);
	var isBoolean = __webpack_require__(175).isBoolean;
	var argsToArray = __webpack_require__(153).argsToArray;
	var ArgumentsError = __webpack_require__(155);

	/**
	 * Attach a transform function to math.filter
	 * Adds a property transform containing the transform function.
	 *
	 * This transform adds support for equations as test function for math.filter,
	 * so you can do something like 'filter([3, -2, 5], x > 0)'.
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  var _filter = math.filter;

	  _filter.transform = function (args, math, scope) {
	    if (args.length !== 2) {
	      throw new ArgumentsError('filter', arguments.length, 2);
	    }

	    var x = args[0].compile(math).eval(scope);
	    var test;
	    if (args[1] instanceof SymbolNode) {
	      // a function pointer, like filter([3, -2, 5], myTestFunction);
	      test = args[1].compile(math).eval(scope);
	    }
	    else {
	      // an equation like filter([3, -2, 5], x > 0)

	      // find an undefined symbol
	      var _scope = scope || {};
	      var symbol = args[1]
	          .filter(function (node) {
	            return (node instanceof SymbolNode) &&
	                !(node.name in math) &&
	                !(node.name in _scope);
	          })[0];

	      // create a test function for this equation
	      var sub = Object.create(_scope);
	      var eq = args[1].compile(math);
	      if (symbol) {
	        var name = symbol.name;
	        test = function (x) {
	          sub[name] = x;
	          return eq.eval(sub);
	        }
	      }
	      else {
	        throw new Error('No undefined variable found in filter equation');
	      }
	    }

	    return _filter(x, test);
	  };

	  math.filter.transform.rawArgs = true;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(9);

	/**
	 * Attach a transform function to math.forEach
	 * Adds a property transform containing the transform function.
	 *
	 * This transform creates a one-based index instead of a zero-based index
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.forEach.transform = function (x, callback) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('forEach', arguments.length, 2);
	    }

	    if (Array.isArray(x)) {
	      _forEachArray(x, callback, x);
	    } else if (x instanceof Matrix) {
	      _forEachArray(x.valueOf(), callback, x);
	    } else {
	      throw new math.error.UnsupportedTypeError('forEach', math['typeof'](x));
	    }
	  };

	  function _forEachArray (array, callback, arrayOrig) {
	    var recurse = function (value, index) {
	      if (Array.isArray(value)) {
	        value.forEach(function (child, i) {
	          // we create a copy of the index array and append the new index value
	          recurse(child, index.concat(i + 1)); // one based index, hence i+1
	        });
	      }
	      else {
	        callback(value, index, arrayOrig);
	      }
	    };
	    recurse(array, []);
	  }

	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var Range = __webpack_require__(7);
	var Index = __webpack_require__(8);
	var Matrix = __webpack_require__(9);
	var isNumber = __webpack_require__(4).isNumber;
	var isArray = Array.isArray;

	/**
	 * Attach a transform function to math.index
	 * Adds a property transform containing the transform function.
	 *
	 * This transform creates a one-based index instead of a zero-based index
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.index.transform = function () {
	    var args = [];
	    for (var i = 0, ii = arguments.length; i < ii; i++) {
	      var arg = arguments[i];

	      // change from one-based to zero based, and convert BigNumber to number
	      if (arg instanceof Range) {
	        arg.start--;
	        arg.end -= (arg.step > 0 ? 0 : 2);
	      }
	      else if (isNumber(arg)) {
	        arg--;
	      }
	      else if (arg instanceof BigNumber) {
	        arg = arg.toNumber() - 1;
	      }
	      else {
	        throw new TypeError('Ranges must be a Number or Range');
	      }

	      args[i] = arg;
	    }

	    var res = new Index();
	    Index.apply(res, args);
	    return res;
	  };
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Matrix = __webpack_require__(9);
	var BigNumber = __webpack_require__(159);
	var Range = __webpack_require__(7);
	var Index = __webpack_require__(8);
	var isNumber = __webpack_require__(4).isNumber;
	var isArray = Array.isArray;

	/**
	 * Attach a transform function to math.map
	 * Adds a property transform containing the transform function.
	 *
	 * This transform creates a one-based index instead of a zero-based index
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.map.transform = function (x, callback) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('map', arguments.length, 2);
	    }

	    if (Array.isArray(x)) {
	      return _mapArray(x, callback, x);
	    } else if (x instanceof Matrix) {
	      return new Matrix(_mapArray(x.valueOf(), callback, x))
	    } else {
	      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
	    }
	  };

	  function _mapArray (arrayIn, callback, arrayOrig) {
	    var recurse = function (value, index) {
	      if (Array.isArray(value)) {
	        return value.map(function (child, i) {
	          // we create a copy of the index array and append the new index value
	          return recurse(child, index.concat(i + 1)); // one based index, hence i + 1
	        });
	      }
	      else {
	        return callback(value, index, arrayOrig);
	      }
	    };

	    return recurse(arrayIn, []);
	  }
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var errorTransform = __webpack_require__(174).transform;
	var isNumber = __webpack_require__(4).isNumber;
	var isCollection = __webpack_require__(13).isCollection;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.max
	 * Adds a property transform containing the transform function.
	 *
	 * This transform changed the last `dim` parameter of function max
	 * from one-based to zero based
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.max.transform = function () {
	    var args = argsToArray(arguments);

	    // change last argument dim from one-based to zero-based
	    if (args.length == 2 && isCollection(args[0])) {
	      var dim = args[1];
	      if (isNumber(dim)) {
	        args[1] = dim - 1;
	      }
	      else if (dim instanceof BigNumber) {
	        args[1] = dim.minus(1);
	      }
	    }

	    try {
	      return math.max.apply(math, args);
	    }
	    catch (err) {
	      throw errorTransform(err);
	    }
	  };
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var errorTransform = __webpack_require__(174).transform;
	var isNumber = __webpack_require__(4).isNumber;
	var isCollection = __webpack_require__(13).isCollection;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.mean
	 * Adds a property transform containing the transform function.
	 *
	 * This transform changed the last `dim` parameter of function mean
	 * from one-based to zero based
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.mean.transform = function () {
	    var args = argsToArray(arguments);

	    // change last argument dim from one-based to zero-based
	    if (args.length == 2 && isCollection(args[0])) {
	      var dim = args[1];
	      if (isNumber(dim)) {
	        args[1] = dim - 1;
	      }
	      else if (dim instanceof BigNumber) {
	        args[1] = dim.minus(1);
	      }
	    }

	    try {
	      return math.mean.apply(math, args);
	    }
	    catch (err) {
	      throw errorTransform(err);
	    }
	  };
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var errorTransform = __webpack_require__(174).transform;
	var isNumber = __webpack_require__(4).isNumber;
	var isCollection = __webpack_require__(13).isCollection;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.min
	 * Adds a property transform containing the transform function.
	 *
	 * This transform changed the last `dim` parameter of function min
	 * from one-based to zero based
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.min.transform = function () {
	    var args = argsToArray(arguments);

	    // change last argument dim from one-based to zero-based
	    if (args.length == 2 && isCollection(args[0])) {
	      var dim = args[1];
	      if (isNumber(dim)) {
	        args[1] = dim - 1;
	      }
	      else if (dim instanceof BigNumber) {
	        args[1] = dim.minus(1);
	      }
	    }

	    try {
	      return math.min.apply(math, args);
	    }
	    catch (err) {
	      throw errorTransform(err);
	    }
	  };
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isBoolean = __webpack_require__(175).isBoolean;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.range
	 * Adds a property transform containing the transform function.
	 *
	 * This transform creates a range which includes the end value
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.range.transform = function () {
	    var args = argsToArray(arguments);

	    var lastIndex = args.length - 1;
	    var last = args[lastIndex];
	    if (!isBoolean(last)) {
	      args.push(true); // append a parameter includeEnd=true
	    }

	    return math.range.apply(math, args);
	  };
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var errorTransform = __webpack_require__(174).transform;
	var isBoolean = __webpack_require__(175).isBoolean;
	var argsToArray = __webpack_require__(153).argsToArray;

	/**
	 * Attach a transform function to math.subset
	 * Adds a property transform containing the transform function.
	 *
	 * This transform creates a range which includes the end value
	 * @param {Object} math
	 */
	module.exports = function (math) {
	  math.subset.transform = function () {
	    try {
	      return math.subset.apply(math, argsToArray(arguments));
	    }
	    catch (err) {
	      throw errorTransform(err);
	    }
	  };
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var string = __webpack_require__(176);

	  /**
	   * @constructor Chain
	   * Wrap any value in a chain, allowing to perform chained operations on
	   * the value.
	   *
	   * All methods available in the math.js library can be called upon the chain,
	   * and then will be evaluated with the value itself as first argument.
	   * The chain can be closed by executing chain.done(), which will return
	   * the final value.
	   *
	   * The Chain has a number of special functions:
	   * - done()             Finalize the chained operation and return the
	   *                      chain's value.
	   * - valueOf()          The same as done()
	   * - toString()         Returns a string representation of the chain's value.
	   *
	   * @param {*} [value]
	   */
	  function Chain (value) {
	    if (!(this instanceof Chain)) {
	      throw new SyntaxError('Constructor must be called with the new operator');
	    }

	    if (value instanceof Chain) {
	      this.value = value.value;
	    }
	    else {
	      this.value = value;
	    }
	  }

	  /**
	   * Close the chain. Returns the final value.
	   * Does the same as method valueOf()
	   * @returns {*} value
	   */
	  Chain.prototype.done = function () {
	    return this.value;
	  };

	  /**
	   * Close the chain. Returns the final value.
	   * Does the same as method done()
	   * @returns {*} value
	   */
	  Chain.prototype.valueOf = function () {
	    return this.value;
	  };

	  /**
	   * Get a string representation of the value in the chain
	   * @returns {String}
	   */
	  Chain.prototype.toString = function () {
	    return string.format(this.value);
	  };

	  /**
	   * Create a proxy method for the chain
	   * @param {String} name
	   * @param {*} value       The value or function to be proxied
	   */
	  function createProxy(name, value) {
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

	  Chain.createProxy = createProxy;

	  /**
	   * initialise the Chain prototype with all functions and constants in math
	   */
	  for (var prop in math) {
	    if (math.hasOwnProperty(prop)) {
	      createProxy(prop, math[prop]);
	    }
	  }

	  return Chain;
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),
	      _parse = __webpack_require__(14),

	      collection = __webpack_require__(13),

	      isString = util.string.isString,
	      isCollection = collection.isCollection;

	  /**
	   * Parse and compile an expression.
	   * Returns a an object with a function `eval([scope])` to evaluate the
	   * compiled expression.
	   *
	   * Syntax:
	   *
	   *     math.compile(expr)                       // returns one node
	   *     math.compile([expr1, expr2, expr3, ...]) // returns an array with nodes
	   *
	   * Examples:
	   *
	   *     var code = math.compile('sqrt(3^2 + 4^2)');
	   *     code.eval(); // 5
	   *
	   *     var scope = {a: 3, b: 4}
	   *     var code = math.compile('a * b'); // 12
	   *     code.eval(scope); // 12
	   *     scope.a = 5;
	   *     code.eval(scope); // 20
	   *
	   *     var nodes = math.compile(['a = 3', 'b = 4', 'a * b']);
	   *     nodes[2].eval(); // 12
	   *
	   * See also:
	   *
	   *    parse, eval
	   *
	   * @param {String | String[] | Matrix} expr
	   *            The expression to be compiled
	   * @return {{eval: Function} | Array.<{eval: Function}>} code
	   *            An object with the compiled expression
	   * @throws {Error}
	   */
	  math.compile = function compile (expr) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('compile', arguments.length, 1);
	    }

	    if (isString(expr)) {
	      // evaluate a single expression
	      return _parse(expr).compile(math);
	    }
	    else if (isCollection(expr)) {
	      // evaluate an array or matrix with expressions
	      return collection.deepMap(expr, function (elem) {
	        return _parse(elem).compile(math);
	      });
	    }
	    else {
	      // oops
	      throw new TypeError('String, array, or matrix expected');
	    }
	  }
	};


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      _parse = __webpack_require__(14),

	      collection = __webpack_require__(13),

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
	   * See also:
	   *
	   *    parse, compile
	   *
	   * @param {String | String[] | Matrix} expr   The expression to be evaluated
	   * @param {Object} [scope]                    Scope to read/write variables
	   * @return {*} The result of the expression
	   * @throws {Error}
	   */
	  math.eval = function _eval (expr, scope) {
	    if (arguments.length != 1 && arguments.length != 2) {
	      throw new math.error.ArgumentsError('eval', arguments.length, 1, 2);
	    }

	    // instantiate a scope
	    scope = scope || {};

	    if (isString(expr)) {
	      // evaluate a single expression
	      return _parse(expr)
	          .compile(math)
	          .eval(scope);
	    }
	    else if (isCollection(expr)) {
	      // evaluate an array or matrix with expressions
	      return collection.deepMap(expr, function (elem) {
	        return _parse(elem)
	            .compile(math).eval(scope);
	      });
	    }
	    else {
	      // oops
	      throw new TypeError('String, array, or matrix expected');
	    }
	  };
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Help = __webpack_require__(11);

	  /**
	   * Retrieve help on a function or data type.
	   * Help files are retrieved from the documentation in math.expression.docs.
	   *
	   * Syntax:
	   *
	   *    math.help(search)
	   *
	   * Examples:
	   *
	   *    console.log(math.help('sin').toString());
	   *    console.log(math.help(math.add).toString());
	   *    console.log(math.help(math.add).toJSON());
	   *
	   * @param {function | string | Object} search   A function or function name
	   *                                              for which to get help
	   * @return {Help} A help object
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
	        if (math.hasOwnProperty(prop) && (search === math[prop])) {
	          text = prop;
	          break;
	        }
	      }

	      /* TODO: implement help for data types
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
	      */
	    }

	    var doc = math.expression.docs[text];
	    if (!text) {
	      throw new Error('Cannot find "' + search + '" in math.js');
	    } else if (!doc) {
	      throw new Error('No documentation found on "' + text + '"');
	    }
	    return new Help(math, doc);
	  };
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var _parse = __webpack_require__(14);

	  /**
	   * Parse an expression. Returns a node tree, which can be evaluated by
	   * invoking node.eval();
	   *
	   * Syntax:
	   *
	   *     parse(expr)
	   *     parse(expr, options)
	   *     parse([expr1, expr2, expr3, ...])
	   *     parse([expr1, expr2, expr3, ...], options)
	   *
	   * Example:
	   *
	   *     var node = parse('sqrt(3^2 + 4^2)');
	   *     node.compile(math).eval(); // 5
	   *
	   *     var scope = {a:3, b:4}
	   *     var node = parse('a * b'); // 12
	   *     var code = node.compile(math);
	   *     code.eval(scope); // 12
	   *     scope.a = 5;
	   *     code.eval(scope); // 20
	   *
	   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
	   *     nodes[2].compile(math).eval(); // 12
	   *
	   * @param {String | String[] | Matrix} expr          Expression to be parsed
	   * @param {{nodes: Object<String, Node>}} [options]  Available options:
	   *                                                   - `nodes` a set of custom nodes
	   * @return {Node | Node[]} node
	   * @throws {Error}
	   */
	  math.parse = function parse (expr, options) {
	    return _parse.apply(_parse, arguments);
	  }

	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the absolute value of a number. For matrices, the function is
	   * evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.abs(x)
	   *
	   * Examples:
	   *
	   *    math.abs(3.5);                // returns Number 3.5
	   *    math.abs(-4.2);               // returns Number 4.2
	   *
	   *    math.abs([3, -5, -1, 0, 2]);  // returns Array [3, 5, 1, 0, 2]
	   *
	   * See also:
	   *
	   *    sign
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            A number or matrix for which to get the absolute value
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            Absolute value of `x`
	   */
	  math.abs = function abs(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('abs', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.abs(x);
	    }

	    if (isComplex(x)) {
	      return Math.sqrt(x.re * x.re + x.im * x.im);
	    }

	    if (x instanceof BigNumber) {
	      return x.abs();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, abs);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.abs(x);
	    }

	    throw new math.error.UnsupportedTypeError('abs', math['typeof'](x));
	  };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isNumber = util.number.isNumber,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Add two values, `x + y`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.add(x, y)
	   *
	   * Examples:
	   *
	   *    math.add(2, 3);               // returns Number 5
	   *
	   *    var a = math.complex(2, 3);
	   *    var b = math.complex(-4, 1);
	   *    math.add(a, b);               // returns Complex -2 + 4i
	   *
	   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
	   *
	   *    var c = math.unit('5 cm');
	   *    var d = math.unit('2.1 mm');
	   *    math.add(c, d);               // returns Unit 52.1 mm
	   *
	   * See also:
	   *
	   *    subtract
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} x First value to add
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} y Second value to add
	   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} Sum of `x` and `y`
	   */
	  math.add = function add(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('add', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
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

	    if (isComplex(x)) {
	      if (isComplex(y)) {
	        // complex + complex
	        return new Complex(
	            x.re + y.re,
	            x.im + y.im
	        );
	      }
	      else if (isNumber(y)) {
	        // complex + number
	        return new Complex(
	            x.re + y,
	            x.im
	        )
	      }
	    }

	    if (isUnit(x)) {
	      if (isUnit(y)) {
	        if (x.value == null) {
	          throw new Error('Parameter x contains a unit with undefined value');
	        }

	        if (y.value == null) {
	          throw new Error('Parameter y contains a unit with undefined value');
	        }

	        if (!x.equalBase(y)) {
	          throw new Error('Units do not match');
	        }

	        var res = x.clone();
	        res.value += y.value;
	        res.fixPrefix = false;
	        return res;
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.plus(y);
	      }

	      // downgrade to Number
	      return add(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.plus(y)
	      }

	      // downgrade to Number
	      return add(x, y.toNumber());
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, add);
	    }

	    if (isString(x) || isString(y)) {
	      return x + y;
	    }

	    if (isBoolean(x) || x === null) {
	      return add(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return add(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('add', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection =collection.isCollection,
	      isComplex = Complex.isComplex;

	  /**
	   * Round a value towards plus infinity
	   * If `x` is complex, both real and imaginary part are rounded towards plus infinity.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.ceil(x)
	   *
	   * Examples:
	   *
	   *    math.ceil(3.2);               // returns Number 4
	   *    math.ceil(3.8);               // returns Number 4
	   *    math.ceil(-4.2);              // returns Number -4
	   *    math.ceil(-4.7);              // returns Number -4
	   *
	   *    var c = math.complex(3.2, -2.7);
	   *    math.ceil(c);                 // returns Complex 4 - 2i
	   *
	   *    math.ceil([3.2, 3.8, -4.7]);  // returns Array [4, 4, -4]
	   *
	   * See also:
	   *
	   *    floor, fix, round
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number to be rounded
	   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
	   */
	  math.ceil = function ceil(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('ceil', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.ceil(x);
	    }

	    if (isComplex(x)) {
	      return new Complex (
	          Math.ceil(x.re),
	          Math.ceil(x.im)
	      );
	    }

	    if (x instanceof BigNumber) {
	      return x.ceil();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, ceil);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.ceil(x);
	    }

	    throw new math.error.UnsupportedTypeError('ceil', math['typeof'](x));
	  };
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Compute the cube of a value, `x * x * x`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.cube(x)
	   *
	   * Examples:
	   *
	   *    math.cube(2);            // returns Number 8
	   *    math.pow(2, 3);          // returns Number 8
	   *    math.cube(4);            // returns Number 64
	   *    4 * 4 * 4;               // returns Number 64
	   *
	   *    math.cube([1, 2, 3, 4]); // returns Array [1, 8, 27, 64]
	   *
	   * See also:
	   *
	   *    multiply, square, pow
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number for which to calculate the cube
	   * @return {Number | BigNumber | Complex | Array | Matrix} Cube of x
	   */
	  math.cube = function cube(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('cube', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return x * x * x;
	    }

	    if (isComplex(x)) {
	      return math.multiply(math.multiply(x, x), x);
	    }

	    if (x instanceof BigNumber) {
	      return x.times(x).times(x);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, cube);
	    }

	    if (isBoolean(x) || x === null) {
	      return cube(+x);
	    }

	    throw new math.error.UnsupportedTypeError('cube', math['typeof'](x));
	  };
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(math) {
	  var util = __webpack_require__(160);

	  var BigNumber = math.type.BigNumber;
	  var Complex = __webpack_require__(6);
	  var Matrix = __webpack_require__(9);
	  var Unit = __webpack_require__(10);

	  var isNumber = util.number.isNumber;
	  var isBoolean = util['boolean'].isBoolean;
	  var isComplex = Complex.isComplex;
	  var isUnit = Unit.isUnit;

	  /**
	   * Divide two scalar values, `x / y`.
	   * This function is meant for internal use: it is used by the public functions
	   * `divide` and `inv`.
	   *
	   * This function does not support collections (Array or Matrix), and does
	   * not validate the number of of inputs.
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | null} x   Numerator
	   * @param  {Number | BigNumber | Boolean | Complex | null} y          Denominator
	   * @return {Number | BigNumber | Complex | Unit}                      Quotient, `x / y`
	   * @private
	   */
	  math._divide = function _divide(x, y) {
	    // TODO: this is a temporary function, to be removed as soon as the library is modularized (i.e. no dependencies on math from the individual functions)
	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        // number / number
	        return x / y;
	      }
	      else if (isComplex(y)) {
	        // number / complex
	        return _divideComplex(new Complex(x, 0), y);
	      }
	    }

	    if (isComplex(x)) {
	      if (isComplex(y)) {
	        // complex / complex
	        return _divideComplex(x, y);
	      }
	      else if (isNumber(y)) {
	        // complex / number
	        return _divideComplex(x, new Complex(y, 0));
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.div(y);
	      }

	      // downgrade to Number
	      return _divide(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.div(y)
	      }

	      // downgrade to Number
	      return _divide(x, y.toNumber());
	    }

	    if (isUnit(x)) {
	      if (isNumber(y)) {
	        var res = x.clone();
	        res.value = ((res.value === null) ? res._normalize(1) : res.value) / y;
	        return res;
	      }
	    }

	    if (isBoolean(x) || x === null) {
	      return _divide(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return _divide(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('divide', math['typeof'](x), math['typeof'](y));
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


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(math) {
	  var collection = __webpack_require__(13);
	  var isCollection = collection.isCollection;

	  /**
	   * Divide two values, `x / y`.
	   * To divide matrices, `x` is multiplied with the inverse of `y`: `x * inv(y)`.
	   *
	   * Syntax:
	   *
	   *    math.divide(x, y)
	   *
	   * Examples:
	   *
	   *    math.divide(2, 3);            // returns Number 0.6666666666666666
	   *
	   *    var a = math.complex(5, 14);
	   *    var b = math.complex(4, 1);
	   *    math.divide(a, b);            // returns Complex 2 + 3i
	   *
	   *    var c = [[7, -6], [13, -4]];
	   *    var d = [[1, 2], [4, 3]];
	   *    math.divide(c, d);            // returns Array [[-9, 4], [-11, 6]]
	   *
	   *    var e = math.unit('18 km');
	   *    math.divide(e, 4.5);          // returns Unit 4 km
	   *
	   * See also:
	   *
	   *    multiply
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x   Numerator
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} y          Denominator
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                      Quotient, `x / y`
	   */
	  math.divide = function(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('divide', arguments.length, 2);
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
	        return collection.deepMap2(x, y, math._divide);
	      }
	    }

	    if (isCollection(y)) {
	      // TODO: implement matrix right division using pseudo inverse
	      return math.multiply(x, math.inv(y));
	    }

	    // divide two scalars
	    return math._divide(x, y);
	  };
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var collection = __webpack_require__(13);

	  /**
	   * Divide two matrices element wise. The function accepts both matrices and
	   * scalar values.
	   *
	   * Syntax:
	   *
	   *    math.dotDivide(x, y)
	   *
	   * Examples:
	   *
	   *    math.dotDivide(2, 4);   // returns 0.5
	   *
	   *    a = [[9, 5], [6, 1]];
	   *    b = [[3, 2], [5, 2]];
	   *
	   *    math.dotDivide(a, b);   // returns [[3, 2.5], [1.2, 0.5]]
	   *    math.divide(a, b);      // returns [[1.75, 0.75], [-1.75, 2.25]]
	   *
	   * See also:
	   *
	   *    divide, multiply, dotMultiply
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Numerator
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Denominator
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Quotient, `x ./ y`
	   */
	  math.dotDivide = function dotDivide(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('dotDivide', arguments.length, 2);
	    }

	    return collection.deepMap2(x, y, math.divide);
	  };

	  // TODO: deprecated since version 0.23.0, clean up some day
	  math.edivide = function () {
	    throw new Error('Function edivide is renamed to dotDivide');
	  }
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      collection = __webpack_require__(13);

	  /**
	   * Multiply two matrices element wise. The function accepts both matrices and
	   * scalar values.
	   *
	   * Syntax:
	   *
	   *    math.dotMultiply(x, y)
	   *
	   * Examples:
	   *
	   *    math.dotMultiply(2, 4); // returns 8
	   *
	   *    a = [[9, 5], [6, 1]];
	   *    b = [[3, 2], [5, 2]];
	   *
	   *    math.dotMultiply(a, b); // returns [[27, 10], [30, 2]]
	   *    math.multiply(a, b);    // returns [[52, 28], [23, 14]]
	   *
	   * See also:
	   *
	   *    multiply, divide, dotDivide
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x Left hand value
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Right hand value
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                    Multiplication of `x` and `y`
	   */
	  math.dotMultiply = function dotMultiply(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('dotMultiply', arguments.length, 2);
	    }

	    return collection.deepMap2(x, y, math.multiply);
	  };

	  // TODO: deprecated since version 0.23.0, clean up some day
	  math.emultiply = function () {
	    throw new Error('Function emultiply is renamed to dotMultiply');
	  }
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      collection = __webpack_require__(13);

	  /**
	   * Calculates the power of x to y element wise.
	   *
	   * Syntax:
	   *
	   *    math.dotPow(x, y)
	   *
	   * Examples:
	   *
	   *    math.dotPow(2, 3);            // returns Number 8
	   *
	   *    var a = [[1, 2], [4, 3]];
	   *    math.dotPow(a, 2);            // returns Array [[1, 4], [16, 9]]
	   *    math.pow(a, 2);               // returns Array [[9, 8], [16, 17]]
	   *
	   * See also:
	   *
	   *    pow, sqrt, multiply
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  The base
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y  The exponent
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}                     The value of `x` to the power `y`
	   */
	  math.dotPow = function dotPow(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('dotPow', arguments.length, 2);
	    }

	    return collection.deepMap2(x, y, math.pow);
	  };

	  // TODO: deprecated since version 0.23.0, clean up some day
	  math.epow = function () {
	    throw new Error('Function epow is renamed to dotPow');
	  }
	};


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the exponent of a value.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.exp(x)
	   *
	   * Examples:
	   *
	   *    math.exp(2);                  // returns Number 7.3890560989306495
	   *    math.pow(math.e, 2);          // returns Number 7.3890560989306495
	   *    math.log(math.exp(2));        // returns Number 2
	   *
	   *    math.exp([1, 2, 3]);
	   *    // returns Array [
	   *    //   2.718281828459045,
	   *    //   7.3890560989306495,
	   *    //   20.085536923187668
	   *    // ]
	   *
	   * See also:
	   *
	   *    log, pow
	   *
	   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  A number or matrix to exponentiate
	   * @return {Number | BigNumber | Complex | Array | Matrix} Exponent of `x`
	   */
	  math.exp = function exp (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('exp', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.exp(x);
	    }

	    if (isComplex(x)) {
	      var r = Math.exp(x.re);
	      return new Complex(
	          r * Math.cos(x.im),
	          r * Math.sin(x.im)
	      );
	    }

	    if (x instanceof BigNumber) {
	      return x.exp();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, exp);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.exp(x);
	    }

	    throw new math.error.UnsupportedTypeError('exp', math['typeof'](x));
	  };
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Round a value towards zero.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.fix(x)
	   *
	   * Examples:
	   *
	   *    math.fix(3.2);                // returns Number 3
	   *    math.fix(3.8);                // returns Number 3
	   *    math.fix(-4.2);               // returns Number -4
	   *    math.fix(-4.7);               // returns Number -4
	   *
	   *    var c = math.complex(3.2, -2.7);
	   *    math.fix(c);                  // returns Complex 3 - 2i
	   *
	   *    math.fix([3.2, 3.8, -4.7]);   // returns Array [3, 3, -4]
	   *
	   * See also:
	   *
	   *    ceil, floor, round
	   *
	   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x Number to be rounded
	   * @return {Number | BigNumber | Complex | Array | Matrix}            Rounded value
	   */
	  math.fix = function fix(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('fix', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return (x > 0) ? Math.floor(x) : Math.ceil(x);
	    }

	    if (isComplex(x)) {
	      return new Complex(
	          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
	          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
	      );
	    }

	    if (x instanceof BigNumber) {
	      return x.isNegative() ? x.ceil() : x.floor();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, fix);
	    }

	    if (isBoolean(x) || x === null) {
	      return fix(+x);
	    }

	    throw new math.error.UnsupportedTypeError('fix', math['typeof'](x));
	  };
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Round a value towards minus infinity.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.floor(x)
	   *
	   * Examples:
	   *
	   *    math.floor(3.2);              // returns Number 3
	   *    math.floor(3.8);              // returns Number 3
	   *    math.floor(-4.2);             // returns Number -5
	   *    math.floor(-4.7);             // returns Number -5
	   *
	   *    var c = math.complex(3.2, -2.7);
	   *    math.floor(c);                // returns Complex 3 - 3i
	   *
	   *    math.floor([3.2, 3.8, -4.7]); // returns Array [3, 3, -5]
	   *
	   * See also:
	   *
	   *    ceil, fix, round
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Number to be rounded
	   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
	   */
	  math.floor = function floor(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('floor', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.floor(x);
	    }

	    if (isComplex(x)) {
	      return new Complex (
	          Math.floor(x.re),
	          Math.floor(x.im)
	      );
	    }

	    if (x instanceof BigNumber) {
	      return x.floor();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, floor);
	    }

	    if (isBoolean(x) || x === null) {
	      return floor(+x);
	    }

	    throw new math.error.UnsupportedTypeError('floor', math['typeof'](x));
	  };
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the greatest common divisor for two or more values or arrays.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.gcd(a, b)
	   *    math.gcd(a, b, c, ...)
	   *
	   * Examples:
	   *
	   *    math.gcd(8, 12);              // returns 4
	   *    math.gcd(-4, 6);              // returns 2
	   *    math.gcd(25, 15, -10);        // returns 5
	   *
	   *    math.gcd([8, -4], [12, 6]);   // returns [4, 2]
	   *
	   * See also:
	   *
	   *    lcm, xgcd
	   *
	   * @param {... Number | BigNumber | Boolean | Array | Matrix | null} args  Two or more integer numbers
	   * @return {Number | BigNumber | Array | Matrix}                           The greatest common divisor
	   */
	  math.gcd = function gcd(args) {
	    var a = arguments[0],
	        b = arguments[1],
	        r; // remainder

	    if (arguments.length == 2) {
	      // two arguments
	      if (isNumber(a) && isNumber(b)) {
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

	      if (a instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(b)) {
	          b = BigNumber.convert(b);
	        }
	        else if (isBoolean(b) || b === null) {
	          b = new BigNumber(b ? 1 : 0);
	        }

	        if (b instanceof BigNumber) {
	          return _bigGcd(a, b);
	        }

	        // downgrade to Number
	        return gcd(a.toNumber(), b);
	      }
	      if (b instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(a)) {
	          a = BigNumber.convert(a);
	        }
	        else if (isBoolean(a) || a === null) {
	          a = new BigNumber(a ? 1 : 0);
	        }

	        if (a instanceof BigNumber) {
	          return _bigGcd(a, b);
	        }

	        // downgrade to Number
	        return gcd(a.toNumber(), b);
	      }

	      if (isBoolean(a) || a === null) {
	        return gcd(+a, b);
	      }
	      if (isBoolean(b) || b === null) {
	        return gcd(a, +b);
	      }

	      throw new math.error.UnsupportedTypeError('gcd', math['typeof'](a), math['typeof'](b));
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

	  /**
	   * Calculate gcd for BigNumbers
	   * @param {BigNumber} a
	   * @param {BigNumber} b
	   * @returns {BigNumber} greatest common denominator of a and b
	   * @private
	   */
	  function _bigGcd(a, b) {
	    if (!a.isInt() || !b.isInt()) {
	      throw new Error('Parameters in function gcd must be integer numbers');
	    }

	    // http://en.wikipedia.org/wiki/Euclidean_algorithm
	    var zero = new BigNumber(0);
	    while (!b.isZero()) {
	      var r = a.mod(b);
	      a = b;
	      b = r;
	    }
	    return a.lt(zero) ? a.neg() : a;
	  }
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the least common multiple for two or more values or arrays.
	   *
	   * lcm is defined as:
	   *
	   *     lcm(a, b) = abs(a * b) / gcd(a, b)
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.lcm(a, b)
	   *    math.lcm(a, b, c, ...)
	   *
	   * Examples:
	   *
	   *    math.lcm(4, 6);               // returns 12
	   *    math.lcm(6, 21);              // returns 42
	   *    math.lcm(6, 21, 5);           // returns 210
	   *
	   *    math.lcm([4, 6], [6, 21]);    // returns [12, 42]
	   *
	   * See also:
	   *
	   *    gcd, xgcd
	   *
	   * @param {... Number | BigNumber | Boolean | Array | Matrix | null} args  Two or more integer numbers
	   * @return {Number | BigNumber | Array | Matrix}                           The least common multiple
	   */
	  math.lcm = function lcm(args) {
	    var a = arguments[0],
	        b = arguments[1],
	        t;

	    if (arguments.length == 2) {
	      // two arguments
	      if (isNumber(a) && isNumber(b)) {
	        if (!isInteger(a) || !isInteger(b)) {
	          throw new Error('Parameters in function lcm must be integer numbers');
	        }

	        if (a == 0 || b == 0) {
	          return 0;
	        }

	        // http://en.wikipedia.org/wiki/Euclidean_algorithm
	        // evaluate lcm here inline to reduce overhead
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

	      if (a instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(b)) {
	          b = BigNumber.convert(b);
	        }
	        else if (isBoolean(b) || b === null) {
	          b = new BigNumber(b ? 1 : 0);
	        }

	        if (b instanceof BigNumber) {
	          return _bigLcm(a, b);
	        }

	        // downgrade to Number
	        return lcm(a.toNumber(), b);
	      }
	      if (b instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(a)) {
	          a = BigNumber.convert(a);
	        }
	        else if (isBoolean(a) || a === null) {
	          a = new BigNumber(a ? 1 : 0);
	        }

	        if (a instanceof BigNumber) {
	          return _bigLcm(a, b);
	        }

	        // downgrade to Number
	        return lcm(a.toNumber(), b);
	      }

	      if (isBoolean(a) || a === null) {
	        return lcm(+a, b);
	      }
	      if (isBoolean(b) || b === null) {
	        return lcm(a, +b);
	      }

	      throw new math.error.UnsupportedTypeError('lcm', math['typeof'](a), math['typeof'](b));
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

	  /**
	   * Calculate lcm for BigNumbers
	   * @param {BigNumber} a
	   * @param {BigNumber} b
	   * @returns {BigNumber} the least common multiple of a and b
	   * @private
	   */
	  function _bigLcm(a, b) {
	    if (!a.isInt() || !b.isInt()) {
	      throw new Error('Parameters in function lcm must be integer numbers');
	    }

	    if (a.isZero() || b.isZero()) {
	      return new BigNumber(0);
	    }

	    // http://en.wikipedia.org/wiki/Euclidean_algorithm
	    // evaluate lcm here inline to reduce overhead
	    var prod = a.times(b);
	    while (!b.isZero()) {
	      var t = b;
	      b = a.mod(t);
	      a = t;
	    }
	    return prod.div(a).abs();
	  }
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the logarithm of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.log(x)
	   *    math.log(x, base)
	   *
	   * Examples:
	   *
	   *    math.log(3.5);                  // returns 1.252762968495368
	   *    math.exp(math.log(2.4));        // returns 2.4
	   *
	   *    math.pow(10, 4);                // returns 10000
	   *    math.log(10000, 10);            // returns 4
	   *    math.log(10000) / math.log(10); // returns 4
	   *
	   *    math.log(1024, 2);              // returns 10
	   *    math.pow(2, 10);                // returns 1024
	   *
	   * See also:
	   *
	   *    exp, log10
	   *
	   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            Value for which to calculate the logarithm.
	   * @param {Number | BigNumber | Boolean | Complex | null} [base=e]
	   *            Optional base for the logarithm. If not provided, the natural
	   *            logarithm of `x` is calculated.
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            Returns the logarithm of `x`
	   */
	  math.log = function log(x, base) {
	    if (arguments.length == 1) {
	      // calculate natural logarithm, log(x)
	      if (isNumber(x)) {
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

	      if (x instanceof BigNumber) {
	        if (x.isNegative()) {
	          // negative value -> downgrade to number to do complex value computation
	          return log(x.toNumber());
	        }
	        else {
	          return x.ln();
	        }
	      }

	      if (isCollection(x)) {
	        return collection.deepMap(x, log);
	      }

	      if (isBoolean(x) || x === null) {
	        return log(+x);
	      }

	      throw new math.error.UnsupportedTypeError('log', math['typeof'](x));
	    }
	    else if (arguments.length == 2) {
	      // calculate logarithm for a specified base, log(x, base)
	      return math.divide(log(x), log(base));
	    }
	    else {
	      throw new math.error.ArgumentsError('log', arguments.length, 1, 2);
	    }
	  };
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the 10-base of a value. This is the same as calculating `log(x, 10)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.log10(x)
	   *
	   * Examples:
	   *
	   *    math.log10(0.00001);            // returns -5
	   *    math.log10(10000);              // returns 4
	   *    math.log(10000) / math.log(10); // returns 4
	   *    math.pow(10, 4);                // returns 10000
	   *
	   * See also:
	   *
	   *    exp, log
	   *
	   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            Value for which to calculate the logarithm.
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            Returns the 10-base logarithm of `x`
	   */
	  math.log10 = function log10(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('log10', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      if (x >= 0) {
	        return Math.log(x) / Math.LN10;
	      }
	      else {
	        // negative value -> complex value computation
	        return log10(new Complex(x, 0));
	      }
	    }

	    if (x instanceof BigNumber) {
	      if (x.isNegative()) {
	        // negative value -> downgrade to number to do complex value computation
	        return log10(x.toNumber());
	      }
	      else {
	        return x.log();
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

	    if (isBoolean(x) || x === null) {
	      return log10(+x);
	    }

	    throw new math.error.UnsupportedTypeError('log10', math['typeof'](x));
	  };
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection = collection.isCollection;

	  /**
	   * Calculates the modulus, the remainder of an integer division.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * The modulus is defined as:
	   *
	   *     x - y * floor(x / y)
	   *
	   * See http://en.wikipedia.org/wiki/Modulo_operation.
	   *
	   * Syntax:
	   *
	   *    math.mod(x, y)
	   *
	   * Examples:
	   *
	   *    math.mod(8, 3);                // returns 2
	   *    math.mod(11, 2);               // returns 1
	   *
	   *    function isOdd(x) {
	   *      return math.mod(x, 2) != 0;
	   *    }
	   *
	   *    isOdd(2);                      // returns false
	   *    isOdd(3);                      // returns true
	   *
	   * See also:
	   *
	   *    divide
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Dividend
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Divisor
	   * @return {Number | BigNumber | Array | Matrix} Returns the remainder of `x` divided by `y`.
	   */
	  math.mod = function mod(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('mod', arguments.length, 2);
	    }

	    // see http://functions.wolfram.com/IntegerFunctions/Mod/

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        // number % number
	        return _mod(x, y);
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return y.isZero() ? x : x.mod(y);
	      }

	      // downgrade x to Number
	      return mod(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return y.isZero() ? x : x.mod(y);
	      }

	      // downgrade y to Number
	      return mod(x, y.toNumber());
	    }

	    // TODO: implement mod for complex values

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, mod);
	    }

	    if (isBoolean(x) || x === null) {
	      return mod(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return mod(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('mod', math['typeof'](x), math['typeof'](y));
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
	      // We don't use JavaScript's % operator here as this doesn't work
	      // correctly for x < 0 and x == 0
	      // see http://en.wikipedia.org/wiki/Modulo_operation
	      return x - y * Math.floor(x / y);
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


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      array = util.array,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isArray = Array.isArray,
	      isUnit = Unit.isUnit;

	  /**
	   * Multiply two values, `x * y`. The result is squeezed.
	   * For matrices, the matrix product is calculated.
	   *
	   * Syntax:
	   *
	   *    math.multiply(x, y)
	   *
	   * Examples:
	   *
	   *    math.multiply(4, 5.2);        // returns Number 20.8
	   *
	   *    var a = math.complex(2, 3);
	   *    var b = math.complex(4, 1);
	   *    math.multiply(a, b);          // returns Complex 5 + 14i
	   *
	   *    var c = [[1, 2], [4, 3]];
	   *    var d = [[1, 2, 3], [3, -4, 7]];
	   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
	   *
	   *    var e = math.unit('2.1 km');
	   *    math.multiply(3, e);          // returns Unit 6.3 km
	   *
	   * See also:
	   *
	   *    divide
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to multiply
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to multiply
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
	   */
	  math.multiply = function multiply(x, y) {
	    var res;

	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('multiply', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        // number * number
	        return x * y;
	      }
	      else if (isComplex(y)) {
	        // number * complex
	        return _multiplyComplex (new Complex(x, 0), y);
	      }
	      else if (isUnit(y)) {
	        res = y.clone();
	        res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
	        return res;
	      }
	    }

	    if (isComplex(x)) {
	      if (isNumber(y)) {
	        // complex * number
	        return _multiplyComplex (x, new Complex(y, 0));
	      }
	      else if (isComplex(y)) {
	        // complex * complex
	        return _multiplyComplex (x, y);
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.times(y);
	      }

	      // downgrade to Number
	      return multiply(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.times(y)
	      }

	      // downgrade to Number
	      return multiply(x, y.toNumber());
	    }

	    if (isUnit(x)) {
	      if (isNumber(y)) {
	        res = x.clone();
	        res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
	        return res;
	      }
	    }

	    if (isArray(x)) {
	      if (isArray(y)) {
	        // array * array
	        var sizeX = array.size(x);
	        var sizeY = array.size(y);

	        if (sizeX.length == 1) {
	          if (sizeY.length == 1) {
	            // vector * vector
	            if (sizeX[0] != sizeY[0]) {
	              throw new RangeError('Dimension mismatch in multiplication. ' +
	                  'Length of A must match length of B ' +
	                  '(A is ' + sizeX[0] +
	                  ', B is ' + sizeY[0] + ', ' +
	                  sizeX[0] + ' != ' + sizeY[0] + ')');
	            }

	            return _multiplyVectorVector(x, y);
	          }
	          else if (sizeY.length == 2) {
	            // vector * matrix
	            if (sizeX[0] != sizeY[0]) {
	              throw new RangeError('Dimension mismatch in multiplication. ' +
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
	              throw new RangeError('Dimension mismatch in multiplication. ' +
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
	              throw new RangeError('Dimension mismatch in multiplication. ' +
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
	        res = multiply(x, y.valueOf());
	        return isArray(res) ? new Matrix(res) : res;
	      }
	      else {
	        // array * scalar
	        return collection.deepMap2(x, y, multiply);
	      }
	    }

	    if (x instanceof Matrix) {
	      if (y instanceof Matrix) {
	        // matrix * matrix
	        res = multiply(x.valueOf(), y.valueOf());
	        return isArray(res) ? new Matrix(res) : res;
	      }
	      else {
	        // matrix * array
	        // matrix * scalar
	        res = multiply(x.valueOf(), y);
	        return isArray(res) ? new Matrix(res) : res;
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

	    if (isBoolean(x) || x === null) {
	      return multiply(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return multiply(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('multiply', math['typeof'](x), math['typeof'](y));
	  };

	  /**
	   * Multiply two 2-dimensional matrices.
	   * The size of the matrices is not validated.
	   * @param {Array} x   A 2d matrix
	   * @param {Array} y   A 2d matrix
	   * @return {Array | Number} result
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

	    var isScalar = rows === 1 && cols === 1;
	    return isScalar ? res[0][0] : res;
	  }

	  /**
	   * Multiply a vector with a 2-dimensional matrix
	   * The size of the matrices is not validated.
	   * @param {Array} x   A vector
	   * @param {Array} y   A 2d matrix
	   * @return {Array | Number} result
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

	    return res.length === 1 ? res[0] : res;
	  }

	  /**
	   * Multiply a 2-dimensional matrix with a vector
	   * The size of the matrices is not validated.
	   * @param {Array} x   A 2d matrix
	   * @param {Array} y   A vector
	   * @return {Array | Number} result
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

	    return res.length === 1 ? res[0] : res;
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
	    var len = x.length;

	    if (!len) {
	      throw new Error('Cannot multiply two empty vectors');
	    }

	    var dot = 0;
	    for (var i = 0; i < len; i++) {
	      dot = math.add(dot, math.multiply(x[i], y[i]));
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
	        return new Complex(x.re * y.re, 0);
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
	        return new Complex(-x.im * y.im, 0);
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


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	    array = __webpack_require__(153),
	          
	    BigNumber = math.type.BigNumber,
	    Complex = __webpack_require__(6),
	    Matrix = __webpack_require__(9),
	    collection = __webpack_require__(13),

	    isNumber = util.number.isNumber,
	    isBoolean = util['boolean'].isBoolean,
	    isComplex = Complex.isComplex,
	    isArray = Array.isArray;

	  /**
	   * Calculate the norm of a number, vector or matrix.
	   *
	   * The second parameter p is optional. If not provided, it defaults to 2.
	   *
	   * Syntax:
	   *
	   *    math.norm(x)
	   *    math.norm(x, p)
	   *
	   * Examples:
	   *
	   *    math.abs(-3.5);                         // returns 3.5
	   *    math.norm(-3.5);                        // returns 3.5
	   *
	   *    math.norm(math.complex(3, -4));         // returns 5
	   *
	   *    math.norm([1, 2, -3], Infinity);        // returns 3
	   *    math.norm([1, 2, -3], -Infinity);       // returns 1
	   *
	   *    math.norm([3, 4], 2);                   // returns 5
	   *
	   *    math.norm([[1, 2], [3, 4]], 1)          // returns 6
	   *    math.norm([[1, 2], [3, 4]], 'inf');     // returns 7
	   *    math.norm([[1, 2], [3, 4]], 'fro');     // returns 5.477225575051661
	   *
	   * See also:
	   *
	   *    abs
	   *
	   * @param  {Number | BigNumber | Complex | Boolean | Array | Matrix | null} x
	   *            Value for which to calculate the norm
	   * @param  {Number | String} [p=2]
	   *            Vector space.
	   *            Supported numbers include Infinity and -Infinity.
	   *            Supported strings are: 'inf', '-inf', and 'fro' (The Frobenius norm)
	   * @return {Number} the p-norm
	   */
	  math.norm = function norm(x, p) {
	    if (arguments.length < 1 || arguments.length > 2) {
	      throw new math.error.ArgumentsError('abs', arguments.length, 1, 2);
	    }

	    if (isNumber(x)) {
	      // norm(x) = abs(x)
	      return Math.abs(x);
	    }

	    if (isComplex(x)) {
	      // ignore p, complex numbers
	      return Math.sqrt(x.re * x.re + x.im * x.im);
	    }

	    if (x instanceof BigNumber) {
	      // norm(x) = abs(x)
	      return x.abs();
	    }

	    if (isBoolean(x) || x === null) {
	      // norm(x) = abs(x)
	      return Math.abs(x);
	    }

	    if (isArray(x)) {
	      // size
	      var sizeX = array.size(x);
	      // missing p
	      if (p == null)
	        p = 2;
	      // check it is a Vector
	      if (sizeX.length == 1) {
	        // check p
	        if (p === Number.POSITIVE_INFINITY || p === 'inf') {
	          // norm(x, Infinity) = max(abs(x))
	          var n;
	          math.forEach(x, function (value) {
	            var v = math.abs(value);
	            if (!n || math.larger(v, n))
	              n = v;
	          });
	          return n;
	        }
	        if (p === Number.NEGATIVE_INFINITY || p === '-inf') {
	          // norm(x, -Infinity) = min(abs(x))
	          var n;
	          math.forEach(x, function (value) {
	            var v = math.abs(value);
	            if (!n || math.smaller(v, n))
	              n = v;
	          });
	          return n;
	        }
	        if (p === 'fro')
	            return norm(x);
	        if (isNumber(p) && !isNaN(p)) {
	          // check p != 0
	          if (!math.equal(p, 0)) {
	            // norm(x, p) = sum(abs(xi) ^ p) ^ 1/p
	            var n = 0;
	            math.forEach(x, function (value) {
	              n = math.add(math.pow(math.abs(value), p), n);
	            });
	            return math.pow(n, 1 / p);
	          }
	          return Number.POSITIVE_INFINITY;
	        }
	        // invalid parameter value
	        throw new Error('Unsupported parameter value');
	      }
	      else if (sizeX.length == 2) {
	        // check p
	        if (p == 1) {
	          // norm(x) = the largest column sum
	          var c = [];
	          // loop rows
	          for (var i = 0; i < x.length; i++) {
	            var r = x[i];
	            // loop columns
	            for (var j = 0; j < r.length; j++) {
	              c[j] = math.add(c[j] || 0, math.abs(r[j]));
	            }
	          }
	          return math.max(c);
	        }
	        if (p == Number.POSITIVE_INFINITY || p === 'inf') {
	          // norm(x) = the largest row sum
	          var n = 0;
	          // loop rows
	          for (var i = 0; i < x.length; i++) {
	            var rs = 0;
	            var r = x[i];
	            // loop columns
	            for (var j = 0; j < r.length; j++) {
	              rs = math.add(rs, math.abs(r[j]));
	            }
	            if (math.larger(rs, n))
	              n = rs;
	          }
	          return n;
	        }
	        if (p === 'fro') {
	          // norm(x) = sqrt(sum(diag(x'x)))
	          var d = math.diag(math.multiply(math.transpose(x), x));
	          var s = 0;
	          math.forEach(d, function (value) {
	            s = math.add(value, s);
	          });
	          return math.sqrt(s);
	        }
	        if (p == 2) {
	          // not implemented
	          throw new Error('Unsupported parameter value, missing implementation of matrix singular value decomposition');
	        }
	        // invalid parameter value
	        throw new Error('Unsupported parameter value');
	      }
	    }

	    if (x instanceof Matrix) {
	      return norm(x.valueOf(), p);
	    }

	    throw new math.error.UnsupportedTypeError('norm', x);
	  };
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160);

	  var BigNumber = math.type.BigNumber;
	  var collection = __webpack_require__(13);

	  var isNumber = util.number.isNumber;
	  var isBoolean = util['boolean'].isBoolean;
	  var isCollection = collection.isCollection;

	  /**
	   * Calculate the nth root of a value.
	   * The principal nth root of a positive real number A, is the positive real
	   * solution of the equation
	   *
	   *     x^root = A
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *     math.nthRoot(a, root)
	   *
	   * Examples:
	   *
	   *     math.nthRoot(9, 2);    // returns 3, as 3^2 == 9
	   *     math.sqrt(9);          // returns 3, as 3^2 == 9
	   *     math.nthRoot(64, 3);   // returns 4, as 4^3 == 64
	   *
	   * See also:
	   *
	   *     sqrt, pow
	   *
	   * @param {Number | BigNumber | Boolean | Array | Matrix | null} a
	   *              Value for which to calculate the nth root
	   * @param {Number | BigNumber | Boolean | null} [root=2]    The root.
	   * @return {Number | Complex | Array | Matrix} Returns the nth root of `a`
	   */
	  math.nthRoot = function nthRoot (a, root) {
	    if (arguments.length != 1 && arguments.length != 2) {
	      throw new math.error.ArgumentsError('nthRoot', arguments.length, 1, 2);
	    }

	    switch(arguments.length) {
	      case 1:
	        if (isNumber(a)) {
	          return _nthRoot(a);
	        }
	        else if (a instanceof BigNumber) {
	          return _nthRootBig(a);
	        }
	        else if (isCollection(a)) {
	          return collection.deepMap(x, nthRoot);
	        }

	        if (isBoolean(a) || a === null) {
	          return nthRoot(+a);
	        }

	        break;

	      case 2:
	        if (isNumber(a)) {
	          if (isNumber(root)) {
	            return _nthRoot(a, root);
	          }
	          else if (root instanceof BigNumber) {
	            // try to convert to bignumber
	            a = BigNumber.convert(a);

	            if (a instanceof BigNumber) {
	              return _nthRootBig(a, root);
	            }
	            else {
	              // downgrade to number
	              return _nthRoot(a, root.toNumber());
	            }
	          }
	        }
	        else if (a instanceof BigNumber) {
	          // try to convert to bignumber
	          if (isNumber(root)) {
	            root = BigNumber.convert(root);
	          }

	          if (root instanceof BigNumber) {
	            return _nthRootBig(a, root);
	          }
	          else {
	            // downgrade to number
	            return _nthRoot(a.toNumber(), root);
	          }
	        }
	        else if (isCollection(a) && !isCollection(root)) {
	          return collection.deepMap2(a, root, nthRoot);
	        }

	        if (isBoolean(a) || a === null) {
	          return nthRoot(+a, root);
	        }
	        if (isBoolean(root) || root === null) {
	          return nthRoot(a, +root);
	        }

	        break;

	      default:
	        throw new math.error.ArgumentsError('nthRoot', arguments.length, 1, 2);
	    }

	    if (isBoolean(x) || x === null) {
	      return arguments.length == 2 ? nthRoot(+x, n) : nthRoot(+x);
	    }


	    throw new math.error.UnsupportedTypeError('nthRoot', math['typeof'](a), math['typeof'](root));
	  };

	  /**
	   * Calculate the nth root of a, solve x^root == a
	   * http://rosettacode.org/wiki/Nth_root#JavaScript
	   * @param {number} a
	   * @param {number} [root=2]
	   * @private
	   */
	  function _nthRoot(a, root) {
	    var _root = (root != undefined) ? root : 2;
	    var inv = _root < 0;
	    if (inv) _root = -_root;

	    if (_root == 0) throw new Error('Root must be non-zero');
	    if (a < 0 && (Math.abs(_root) % 2 != 1)) throw new Error('Root must be odd when a is negative.');

	    // edge cases zero and infinity
	    if (a == 0) return 0;
	    if (!Number.isFinite(a)) {
	      return inv ? 0 : a;
	    }

	    var epsilon = 1e-16;
	    var x = 1; // Initial guess
	    var i = 0;
	    var iMax = 100;
	    do {
	      var delta = (a / Math.pow(x, _root - 1) - x) / _root;
	      x = x + delta;
	      i++;
	    }
	    while (Math.abs(delta) > epsilon && i < iMax);

	    return inv ? 1 / x : x;
	  }

	  /**
	   * Calculate the nth root of a for BigNumbers, solve x^root == a
	   * http://rosettacode.org/wiki/Nth_root#JavaScript
	   * @param {BigNumber} a
	   * @param {BigNumber} [root=2]
	   * @private
	   */
	  function _nthRootBig(a, root) {
	    var _root = (root != undefined) ? root : new BigNumber(2);
	    var zero = new BigNumber(0);
	    var one = new BigNumber(1);
	    var inv = _root.isNegative();
	    if (inv) _root = _root.negated();

	    if (_root.isZero()) throw new Error('Root must be non-zero');
	    if (a.isNegative() && !_root.abs().mod(2).equals(1)) throw new Error('Root must be odd when a is negative.');

	    // edge cases zero and infinity
	    if (a.isZero()) return zero;
	    if (!a.isFinite())
	    {
	      return inv ? zero : a;
	    }

	    var x = one; // Initial guess
	    var i = 0;
	    var iMax = 100;
	    do {
	      var xPrev = x;
	      var delta = a.div(x.pow(_root.minus(1))).minus(x).div(_root);
	      x = x.plus(delta);
	      i++;
	    }
	    while (!x.equals(xPrev) && i < iMax);

	    return inv ? one.div(x) : x;
	  }
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      array = util.array,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isArray = Array.isArray,
	      isInteger = util.number.isInteger,
	      isComplex = Complex.isComplex;

	  /**
	   * Calculates the power of x to y, `x ^ y`.
	   * Matrix exponentiation is supported for square matrices `x`, and positive
	   * integer exponents `y`.
	   *
	   * Syntax:
	   *
	   *    math.pow(x, y)
	   *
	   * Examples:
	   *
	   *    math.pow(2, 3);               // returns Number 8
	   *
	   *    var a = math.complex(2, 3);
	   *    math.pow(a, 2)                // returns Complex -5 + 12i
	   *
	   *    var b = [[1, 2], [4, 3]];
	   *    math.pow(b, 2);               // returns Array [[9, 8], [16, 17]]
	   *
	   * See also:
	   *
	   *    multiply, sqrt
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  The base
	   * @param  {Number | BigNumber | Boolean | Complex | null} y                   The exponent
	   * @return {Number | BigNumber | Complex | Array | Matrix} The value of `x` to the power `y`
	   */
	  math.pow = function pow(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('pow', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
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

	    if (isComplex(x)) {
	      if (isNumber(y)) {
	        return powComplex(x, new Complex(y, 0));
	      }
	      else if (isComplex(y)) {
	        return powComplex(x, y);
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to upgrade y to to bignumber
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        if (y.isInteger() || !x.isNegative()) {
	          return x.pow(y);
	        }
	        else {
	          // downgrade to number to do complex valued computation
	          return pow(x.toNumber(), y.toNumber())
	        }
	      }
	      else {
	        // failed to upgrade y to bignumber, lets downgrade x to number
	        return pow(x.toNumber(), y);
	      }
	    }

	    if (y instanceof BigNumber) {
	      // try to convert x to bignumber
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        if (y.isInteger() && !x.isNegative()) {
	          return x.pow(y);
	        }
	        else {
	          // downgrade to number to do complex valued computation
	          return pow(x.toNumber(), y.toNumber())
	        }
	      }
	      else {
	        // failed to upgrade x to bignumber, lets downgrade y to number
	        return pow(x, y.toNumber());
	      }
	    }

	    if (isArray(x)) {
	      if (!isNumber(y) || !isInteger(y) || y < 0) {
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

	      // compute power of matrix
	      var res = math.eye(s[0]).valueOf();
	      var px = x;
	      while (y >= 1) {
	        if ((y & 1) == 1) {
	          res = math.multiply(px, res);
	        }
	        y >>= 1;
	        px = math.multiply(px, px);
	      }
	      return res;
	    }
	    else if (x instanceof Matrix) {
	      return new Matrix(pow(x.valueOf(), y));
	    }

	    if (isBoolean(x) || x === null) {
	      return pow(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return pow(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('pow', math['typeof'](x), math['typeof'](y));
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


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Round a value towards the nearest integer.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.round(x)
	   *    math.round(x, n)
	   *
	   * Examples:
	   *
	   *    math.round(3.2);              // returns Number 3
	   *    math.round(3.8);              // returns Number 4
	   *    math.round(-4.2);             // returns Number -4
	   *    math.round(-4.7);             // returns Number -5
	   *    math.round(math.pi, 3);       // returns Number 3.142
	   *    math.round(123.45678, 2);     // returns Number 123.46
	   *
	   *    var c = math.complex(3.2, -2.7);
	   *    math.round(c);                // returns Complex 3 - 3i
	   *
	   *    math.round([3.2, 3.8, -4.7]); // returns Array [3, 4, -5]
	   *
	   * See also:
	   *
	   *    ceil, fix, floor
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Number to be rounded
	   * @param  {Number | BigNumber | Boolean | Array | null} [n=0]                 Number of decimals
	   * @return {Number | BigNumber | Complex | Array | Matrix} Rounded value
	   */
	  math.round = function round(x, n) {
	    if (arguments.length != 1 && arguments.length != 2) {
	      throw new math.error.ArgumentsError('round', arguments.length, 1, 2);
	    }

	    if (n == undefined) {
	      // round (x)
	      if (isNumber(x)) {
	        return Math.round(x);
	      }

	      if (isComplex(x)) {
	        return new Complex (
	            Math.round(x.re),
	            Math.round(x.im)
	        );
	      }

	      if (x instanceof BigNumber) {
	        return x.toDecimalPlaces(0);
	      }

	      if (isCollection(x)) {
	        return collection.deepMap(x, round);
	      }

	      if (isBoolean(x) || x === null) {
	        return Math.round(x);
	      }

	      throw new math.error.UnsupportedTypeError('round', math['typeof'](x));
	    }
	    else {
	      // round (x, n)
	      if (!isNumber(n) || !isInteger(n)) {
	        if (n instanceof BigNumber) {
	          n = parseFloat(n.valueOf());
	        }
	        else if (isBoolean(n) || x === null) {
	          return round(x, +n);
	        }
	        else {
	          throw new TypeError('Number of decimals in function round must be an integer');
	        }
	      }
	      if (n < 0 || n > 15) {
	        throw new Error ('Number of decimals in function round must be in te range of 0-15');
	      }

	      if (isNumber(x)) {
	        return roundNumber(x, n);
	      }

	      if (isComplex(x)) {
	        return new Complex (
	            roundNumber(x.re, n),
	            roundNumber(x.im, n)
	        );
	      }

	      if (x instanceof BigNumber) {
	        return x.toDecimalPlaces(n);
	      }

	      if (isCollection(x) || isCollection(n)) {
	        return collection.deepMap2(x, n, round);
	      }

	      if (isBoolean(x) || x === null) {
	        return round(+x, n);
	      }

	      throw new math.error.UnsupportedTypeError('round', math['typeof'](x), math['typeof'](n));
	    }
	  };

	  /**
	   * round a number to the given number of decimals, or to zero if decimals is
	   * not provided
	   * @param {Number} value
	   * @param {Number} decimals       number of decimals, between 0 and 15 (0 by default)
	   * @return {Number} roundedValue
	   */
	  function roundNumber (value, decimals) {
	    var p = Math.pow(10, decimals);
	    return Math.round(value * p) / p;
	  }
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      number = util.number,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Compute the sign of a value. The sign of a value x is:
	   *
	   * -  1 when x > 1
	   * - -1 when x < 0
	   * -  0 when x == 0
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sign(x)
	   *
	   * Examples:
	   *
	   *    math.sign(3.5);               // returns 1
	   *    math.sign(-4.2);              // returns -1
	   *    math.sign(0);                 // returns 0
	   *
	   *    math.sign([3, 5, -2, 0, 2]);  // returns [1, 1, -1, 0, 1]
	   *
	   * See also:
	   *
	   *    abs
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            The number for which to determine the sign
	   * @return {Number | BigNumber | Complex | Array | Matrix}e
	   *            The sign of `x`
	   */
	  math.sign = function sign(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sign', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return number.sign(x);
	    }

	    if (isComplex(x)) {
	      var abs = Math.sqrt(x.re * x.re + x.im * x.im);
	      return new Complex(x.re / abs, x.im / abs);
	    }

	    if (x instanceof BigNumber) {
	      return new BigNumber(x.cmp(0));
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, sign);
	    }

	    if (isBoolean(x) || x === null) {
	      return number.sign(x);
	    }

	    throw new math.error.UnsupportedTypeError('sign', math['typeof'](x));
	  };
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the square root of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sqrt(x)
	   *
	   * Examples:
	   *
	   *    math.sqrt(25);                // returns 5
	   *    math.square(5);               // returns 25
	   *    math.sqrt(-4);                // returns Complex -2i
	   *
	   * See also:
	   *
	   *    square, multiply
	   *
	   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            Value for which to calculate the square root.
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            Returns the square root of `x`
	   */
	  math.sqrt = function sqrt (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sqrt', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      if (x >= 0) {
	        return Math.sqrt(x);
	      }
	      else {
	        return sqrt(new Complex(x, 0));
	      }
	    }

	    if (isComplex(x)) {
	      var r = Math.sqrt(x.re * x.re + x.im * x.im);

	      var re, im;

	      if (x.re >= 0) {
	        re = 0.5 * Math.sqrt(2.0 * (r + x.re));
	      }
	      else {
	        re = Math.abs(x.im) / Math.sqrt(2 * (r - x.re));
	      }

	      if (x.re <= 0) {
	        im = 0.5 * Math.sqrt(2.0 * (r - x.re));
	      }
	      else {
	        im = Math.abs(x.im) / Math.sqrt(2 * (r + x.re));
	      }

	      if (x.im >= 0) {
	        return new Complex(re, im);
	      }
	      else {
	        return new Complex(re, -im);
	      }
	    }

	    if (x instanceof BigNumber) {
	      if (x.isNegative()) {
	        // negative value -> downgrade to number to do complex value computation
	        return sqrt(x.toNumber());
	      }
	      else {
	        return x.sqrt();
	      }
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, sqrt);
	    }

	    if (isBoolean(x) || x === null) {
	      return sqrt(+x);
	    }

	    throw new math.error.UnsupportedTypeError('sqrt', math['typeof'](x));
	  };
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Compute the square of a value, `x * x`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.square(x)
	   *
	   * Examples:
	   *
	   *    math.square(2);           // returns Number 4
	   *    math.square(3);           // returns Number 9
	   *    math.pow(3, 2);           // returns Number 9
	   *    math.multiply(3, 3);      // returns Number 9
	   *
	   *    math.square([1, 2, 3, 4]);  // returns Array [1, 4, 9, 16]
	   *
	   * See also:
	   *
	   *    multiply, cube, sqrt, pow
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
	   *            Number for which to calculate the square
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            Squared value
	   */
	  math.square = function square(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('square', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return x * x;
	    }

	    if (isComplex(x)) {
	      return math.multiply(x, x);
	    }

	    if (x instanceof BigNumber) {
	      return x.times(x);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, square);
	    }

	    if (isBoolean(x) || x === null) {
	      return x * x;
	    }

	    throw new math.error.UnsupportedTypeError('square', math['typeof'](x));
	  };
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isNumber = util.number.isNumber,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Subtract two values, `x - y`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.subtract(x, y)
	   *
	   * Examples:
	   *
	   *    math.subtract(5.3, 2);        // returns Number 3.3
	   *
	   *    var a = math.complex(2, 3);
	   *    var b = math.complex(4, 1);
	   *    math.subtract(a, b);          // returns Complex -2 + 2i
	   *
	   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
	   *
	   *    var c = math.unit('2.1 km');
	   *    var d = math.unit('500m');
	   *    math.subtract(c, d);          // returns Unit 1.6 km
	   *
	   * See also:
	   *
	   *    add
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x
	   *            Initial value
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y
	   *            Value to subtract from `x`
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
	   *            Subtraction of `x` and `y`
	   */
	  math.subtract = function subtract(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('subtract', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
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
	      if (isNumber(y)) {
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

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.minus(y);
	      }

	      // downgrade to Number
	      return subtract(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.minus(y)
	      }

	      // downgrade to Number
	      return subtract(x, y.toNumber());
	    }

	    if (isUnit(x)) {
	      if (isUnit(y)) {
	        if (x.value == null) {
	          throw new Error('Parameter x contains a unit with undefined value');
	        }

	        if (y.value == null) {
	          throw new Error('Parameter y contains a unit with undefined value');
	        }

	        if (!x.equalBase(y)) {
	          throw new Error('Units do not match');
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

	    if (isBoolean(x) || x === null) {
	      return subtract(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return subtract(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('subtract', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Inverse the sign of a value, apply a unary minus operation.
	   *
	   * For matrices, the function is evaluated element wise. Boolean values and
	   * strings will be converted to a number. For complex numbers, both real and
	   * complex value are inverted.
	   *
	   * Syntax:
	   *
	   *    math.unaryMinus(x)
	   *
	   * Examples:
	   *
	   *    math.unaryMinus(3.5);      // returns -3.5
	   *    math.unaryMinus(-4.2);     // returns 4.2
	   *
	   * See also:
	   *
	   *    add, subtract, unaryPlus
	   *
	   * @param  {Number | BigNumber | Boolean | String | Complex | Unit | Array | Matrix | null} x Number to be inverted.
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Returns the value with inverted sign.
	   */
	  math.unaryMinus = function unaryMinus(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('unaryMinus', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return -x;
	    }

	    if (isComplex(x)) {
	      return new Complex(
	          -x.re,
	          -x.im
	      );
	    }

	    if (x instanceof BigNumber) {
	      return x.neg();
	    }

	    if (isUnit(x)) {
	      var res = x.clone();
	      res.value = -x.value;
	      return res;
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, unaryMinus);
	    }

	    if (isBoolean(x) || isString(x) || x === null) {
	      // convert to a number or bignumber
	      return (config.number == 'bignumber') ? new BigNumber(-x): -x;
	    }

	    throw new math.error.UnsupportedTypeError('unaryMinus', math['typeof'](x));
	  };

	  // TODO: function unary is renamed to unaryMinus since version 0.23.0. Cleanup some day
	  math.unary = function unary() {
	    throw new Error('Function unary is deprecated. Use unaryMinus instead.');
	  }
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Unary plus operation.
	   * Boolean values and strings will be converted to a number, numeric values will be returned as is.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.unaryPlus(x)
	   *
	   * Examples:
	   *
	   *    math.unaryPlus(3.5);      // returns 3.5
	   *    math.unaryPlus(1);     // returns 1
	   *
	   * See also:
	   *
	   *    unaryMinus, add, subtract
	   *
	   * @param  {Number | BigNumber | Boolean | String | Complex | Unit | Array | Matrix | null} x
	   *            Input value
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
	   *            Returns the input value when numeric, converts to a number when input is non-numeric.
	   */
	  math.unaryPlus = function unaryPlus(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('unaryPlus', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return x;
	    }

	    if (isComplex(x)) {
	      return x.clone();
	    }

	    if (x instanceof BigNumber) {
	      return x;
	    }

	    if (isUnit(x)) {
	      return x.clone();
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, unaryPlus);
	    }

	    if (isBoolean(x) || isString(x) || x === null) {
	      // convert to a number or bignumber
	      return (config.number == 'bignumber') ? new BigNumber(+x): +x;
	    }

	    throw new math.error.UnsupportedTypeError('unaryPlus', math['typeof'](x));
	  };
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),
	      BigNumber = math.type.BigNumber,

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger;

	  /**
	   * Calculate the extended greatest common divisor for two values.
	   * See http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
	   *
	   * Syntax:
	   *
	   *    math.xgcd(a, b)
	   *
	   * Examples:
	   *
	   *    math.xgcd(8, 12);             // returns [4, -1, 1]
	   *    math.gcd(8, 12);              // returns 4
	   *    math.xgcd(36163, 21199);      // returns [1247, -7, 12]
	   *
	   * See also:
	   *
	   *    gcd, lcm
	   *
	   * @param {Number | BigNumber | Boolean} a  An integer number
	   * @param {Number | BigNumber | Boolean} b  An integer number
	   * @return {Array}              Returns an array containing 3 integers `[div, m, n]`
	   *                              where `div = gcd(a, b)` and `a*m + b*n = div`
	   */
	  math.xgcd = function xgcd(a, b) {
	    if (arguments.length == 2) {
	      // two arguments
	      if (isNumber(a) && isNumber(b)) {
	        if (!isInteger(a) || !isInteger(b)) {
	          throw new Error('Parameters in function xgcd must be integer numbers');
	        }

	        return _xgcd(a, b);
	      }

	      if (a instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(b)) {
	          b = BigNumber.convert(b);
	        }
	        else if (isBoolean(b) || b === null) {
	          b = new BigNumber(b ? 1 : 0);
	        }

	        if (b instanceof BigNumber) {
	          return _bigXgcd(a, b);
	        }

	        // downgrade to Number
	        return xgcd(a.toNumber(), b);
	      }
	      if (b instanceof BigNumber) {
	        // try to convert to big number
	        if (isNumber(a)) {
	          a = BigNumber.convert(a);
	        }
	        else if (isBoolean(a) || a === null) {
	          a = new BigNumber(a ? 1 : 0);
	        }

	        if (a instanceof BigNumber) {
	          return _bigXgcd(a, b);
	        }

	        // downgrade to Number
	        return xgcd(a.toNumber(), b);
	      }

	      if (isBoolean(a) || a === null) {
	        return xgcd(+a, b);
	      }
	      if (isBoolean(b) || b === null) {
	        return xgcd(a, +b);
	      }

	      throw new math.error.UnsupportedTypeError('xgcd', math['typeof'](a), math['typeof'](b));
	    }

	    // zero or one argument
	    throw new SyntaxError('Function xgcd expects two arguments');
	  };

	  /**
	   * Calculate xgcd for two numbers
	   * @param {Number} a
	   * @param {Number} b
	   * @return {Number} result
	   * @private
	   */
	  function _xgcd(a, b) {
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

	    var res;
	    if (a < 0) {
	      res = [-a, -lastx, -lasty];
	    }
	    else {
	      res = [a, a ? lastx : 0, lasty];
	    }
	    return (config.matrix === 'array') ? res : new Matrix(res);
	  }

	  /**
	   * Calculate xgcd for two BigNumbers
	   * @param {BigNumber} a
	   * @param {BigNumber} b
	   * @return {BigNumber[]} result
	   * @private
	   */
	  function _bigXgcd(a, b) {
	    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
	    var t, // used to swap two variables
	        q, // quotient
	        r, // remainder
	        zero = new BigNumber(0),
	        x = new BigNumber(0), lastx = new BigNumber(1),
	        y = new BigNumber(1), lasty = new BigNumber(0);

	    while (!b.isZero()) {
	      q = a.div(b).floor();
	      r = a.mod(b);

	      t = x;
	      x = lastx.minus(q.times(x));
	      lastx = t;

	      t = y;
	      y = lasty.minus(q.times(y));
	      lasty = t;

	      a = b;
	      b = r;
	    }

	    var res;
	    if (a.lt(zero)) {
	      res = [a.neg(), lastx.neg(), lasty.neg()];
	    }
	    else {
	      res = [a, !a.isZero() ? lastx : 0, lasty];
	    }
	    return (config.matrix === 'array') ? res : new Matrix(res);
	  }
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,
	      
	      bigBitAnd = util.bignumber.and;

	  /**
	   * Bitwise AND two values, `x & y`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.bitAnd(x, y)
	   *
	   * Examples:
	   *
	   *    math.bitAnd(53, 131);               // returns Number 1
	   *
	   *    math.bitAnd([1, 12, 31], 42);       // returns Array [0, 8, 10]
	   *
	   * See also:
	   *
	   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to and
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to and
	   * @return {Number | BigNumber | Array | Matrix} AND of `x` and `y`
	   */
	  math.bitAnd = function bitAnd(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('bitAnd', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      if (!isInteger(x) || !isInteger(y)) {
	        throw new Error('Parameters in function bitAnd must be integer numbers');
	      }

	      return x & y;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, bitAnd);
	    }

	    if (isBoolean(x) || x === null) {
	      return bitAnd(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return bitAnd(x, +y);
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }

	      if (y instanceof BigNumber) {
	        return bigBitAnd(x, y);
	      }

	      // downgrade to Number
	      return bitAnd(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }

	      if (x instanceof BigNumber) {
	        return bigBitAnd(x, y);
	      }

	      // downgrade to Number
	      return bitAnd(x, y.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('bitAnd', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,

	      bigBitNot = util.bignumber.not;

	  /**
	   * Bitwise NOT value, `~x`.
	   * For matrices, the function is evaluated element wise.
	   * For units, the function is evaluated on the best prefix base.
	   *
	   * Syntax:
	   *
	   *    math.bitNot(x)
	   *
	   * Examples:
	   *
	   *    math.bitNot(1);               // returns Number -2
	   *
	   *    math.bitNot([2, -3, 4]);      // returns Array [-3, 2, 5]
	   *
	   * See also:
	   *
	   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to not
	   * @return {Number | BigNumber | Array | Matrix} NOT of `x`
	   */
	  math.bitNot = function bitNot(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('bitNot', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      if (!isInteger(x)) {
	        throw new Error('Parameter in function bitNot must be integer numbers');
	      }

	      return ~x;
	    }

	    if (x instanceof BigNumber) {
	      return bigBitNot(x);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, bitNot);
	    }

	    if (isBoolean(x) || x === null) {
	      return bitNot(+x);
	    }

	    throw new math.error.UnsupportedTypeError('bitNot', math['typeof'](x));
	  };
	};


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,

	      bigBitOr = util.bignumber.or;

	  /**
	   * Bitwise OR two values, `x | y`.
	   * For matrices, the function is evaluated element wise.
	   * For units, the function is evaluated on the lowest print base.
	   *
	   * Syntax:
	   *
	   *    math.bitOr(x, y)
	   *
	   * Examples:
	   *
	   *    math.bitOr(1, 2);               // returns Number 3
	   *
	   *    math.bitOr([1, 2, 3], 4);       // returns Array [5, 6, 7]
	   *
	   * See also:
	   *
	   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to or
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to or
	   * @return {Number | BigNumber | Array | Matrix} OR of `x` and `y`
	   */
	  math.bitOr = function bitOr(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('bitOr', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      if (!isInteger(x) || !isInteger(y)) {
	        throw new Error('Parameters in function bitOr must be integer numbers');
	      }

	      return x | y;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, bitOr);
	    }

	    if (isBoolean(x) || x === null) {
	      return bitOr(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return bitOr(x, +y);
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }

	      if (y instanceof BigNumber) {
	        return bigBitOr(x, y);
	      }

	      // downgrade to Number
	      return bitOr(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }

	      if (x instanceof BigNumber) {
	        return bigBitOr(x, y);
	      }

	      // downgrade to Number
	      return bitOr(x, y.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('bitOr', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,

	      bigBitXor = util.bignumber.xor;

	  /**
	   * Bitwise XOR two values, `x ^ y`.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.bitXor(x, y)
	   *
	   * Examples:
	   *
	   *    math.bitXor(1, 2);               // returns Number 3
	   *
	   *    math.bitXor([2, 3, 4], 4);       // returns Array [6, 7, 0]
	   *
	   * See also:
	   *
	   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to xor
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to xor
	   * @return {Number | BigNumber | Array | Matrix} XOR of `x` and `y`
	   */
	  math.bitXor = function bitXor(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('bitXor', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      if (!isInteger(x) || !isInteger(y)) {
	        throw new Error('Parameters in function bitXor must be integer numbers');
	      }

	      return x ^ y;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, bitXor);
	    }

	    if (isBoolean(x) || x === null) {
	      return bitXor(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return bitXor(x, +y);
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }

	      if (y instanceof BigNumber) {
	        return bigBitXor(x, y);
	      }

	      // downgrade to Number
	      return bitXor(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }

	      if (x instanceof BigNumber) {
	        return bigBitXor(x, y);
	      }

	      // downgrade to Number
	      return bitXor(x, y.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('bitXor', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,

	      bigLeftShift = util.bignumber.leftShift;

	  /**
	   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
	   * For matrices, the function is evaluated element wise.
	   * For units, the function is evaluated on the best prefix base.
	   *
	   * Syntax:
	   *
	   *    math.leftShift(x, y)
	   *
	   * Examples:
	   *
	   *    math.leftShift(1, 2);               // returns Number 4
	   *
	   *    math.leftShift([1, 2, 3], 4);       // returns Array [16, 32, 64]
	   *
	   * See also:
	   *
	   *    bitAnd, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
	   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
	   * @return {Number | BigNumber | Array | Matrix} `x` shifted left `y` times
	   */
	  math.leftShift = function leftShift(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('leftShift', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        if (!isInteger(x) || !isInteger(y)) {
	          throw new Error('Parameters in function leftShift must be integer numbers');
	        }

	        return x << y;
	      }

	      if (y instanceof BigNumber) {
	        return bigLeftShift(BigNumber.convert(x), y);
	      }
	    }
	    if (isNumber(y)) {
	      if (isFinite(y) && !isInteger(y)) {
	        throw new Error('Parameters in function leftShift must be integer numbers');
	      }

	      if (x instanceof BigNumber) {
	        if (x.isFinite() && !x.isInteger()) {
	          throw new Error('Parameters in function leftShift must be integer numbers');
	        }

	        if (x.isNaN() || isNaN(y) || y < 0) {
	          return new BigNumber(NaN);
	        }

	        if (y == 0 || x.isZero()) {
	          return x;
	        }
	        if (y == Infinity && !x.isFinite()) {
	          return new BigNumber(NaN);
	        }

	        // Math.pow(2, y) is fully precise for y < 55, and fast
	        if (y < 55) {
	          return x.times(Math.pow(2, y) + '');
	        }

	        y = BigNumber.convert(y);
	        return bigLeftShift(x, y);
	      }
	    }

	    if (isCollection(x) && isNumber(y)) {
	      return collection.deepMap2(x, y, leftShift);
	    }

	    if (isBoolean(x) || x === null) {
	      return leftShift(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return leftShift(x, +y);
	    }

	    if (x instanceof BigNumber) {
	      if (y instanceof BigNumber) {
	        return bigLeftShift(x, y);
	      }

	      // downgrade to Number
	      return leftShift(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // x is probably incompatible with BigNumber
	      return leftShift(x, y.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('leftShift', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection,

	      bigRightShift = util.bignumber.rightShift;

	  /**
	   * Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`.
	   * For matrices, the function is evaluated element wise.
	   * For units, the function is evaluated on the best prefix base.
	   *
	   * Syntax:
	   *
	   *    math.rightArithShift(x, y)
	   *
	   * Examples:
	   *
	   *    math.rightArithShift(4, 2);               // returns Number 1
	   *
	   *    math.rightArithShift([16, -32, 64], 4);   // returns Array [1, -2, 3]
	   *
	   * See also:
	   *
	   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
	   *
	   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
	   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
	   * @return {Number | BigNumber | Array | Matrix} `x` sign-filled shifted right `y` times
	   */
	  math.rightArithShift = function rightArithShift(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('rightArithShift', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        if (!isInteger(x) || !isInteger(y)) {
	          throw new Error('Parameters in function rightArithShift must be integer numbers');
	        }

	        return x >> y;
	      }

	      if (y instanceof BigNumber) {
	        return bigRightShift(BigNumber.convert(x), y);
	      }
	    }
	    if (isNumber(y)) {
	      if (isFinite(y) && !isInteger(y)) {
	        throw new Error('Parameters in function rightArithShift must be integer numbers');
	      }

	      if (x instanceof BigNumber) {
	        if (x.isFinite() && !x.isInteger()) {
	          throw new Error('Parameters in function rightArithShift must be integer numbers');
	        }

	        if (x.isNaN() || isNaN(y) || y < 0) {
	          return new BigNumber(NaN);
	        }
	        if (y == Infinity) {
	          if (x.isNegative()) {
	            return new BigNumber(-1);
	          }
	          if (!x.isFinite()) {
	            return new BigNumber(NaN);
	          }
	          return new BigNumber(0);
	        }

	        // Math.pow(2, y) is fully precise for y < 55, and fast
	        if (y < 55) {
	          return x.div(Math.pow(2, y) + '').floor();
	        }

	        y = BigNumber.convert(y);
	        return bigRightShift(x, y);
	      }
	    }

	    if (isCollection(x) && isNumber(y)) {
	      return collection.deepMap2(x, y, rightArithShift);
	    }

	    if (isBoolean(x) || x === null) {
	      return rightArithShift(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return rightArithShift(x, +y);
	    }

	    if (x instanceof BigNumber) {
	      if (y instanceof BigNumber) {
	        return bigRightShift(x, y);
	      }

	      // downgrade to Number
	      return rightArithShift(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // x is probably incompatible with BigNumber
	      return rightArithShift(x, y.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('rightArithShift', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection;

	  /**
	   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
	   * For matrices, the function is evaluated element wise.
	   * For units, the function is evaluated on the best prefix base.
	   *
	   * Syntax:
	   *
	   *    math.rightLogShift(x, y)
	   *
	   * Examples:
	   *
	   *    math.rightLogShift(4, 2);               // returns Number 1
	   *
	   *    math.rightLogShift([16, -32, 64], 4);   // returns Array [1, 2, 3]
	   *
	   * See also:
	   *
	   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightArithShift
	   *
	   * @param  {Number | Boolean | Array | Matrix | null} x Value to be shifted
	   * @param  {Number | Boolean | null} y Amount of shifts
	   * @return {Number | Array | Matrix} `x` zero-filled shifted right `y` times
	   */
	  math.rightLogShift = function rightLogShift(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('rightLogShift', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      if (!isInteger(x) || !isInteger(y)) {
	        throw new Error('Parameters in function rightLogShift must be integer numbers');
	      }

	      return x >>> y;
	    }

	    if (isCollection(x) && isNumber(y)) {
	      return collection.deepMap2(x, y, rightLogShift);
	    }

	    if (isBoolean(x) || x === null) {
	      return rightLogShift(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return rightLogShift(x, +y);
	    }

	    throw new math.error.UnsupportedTypeError('rightLogShift', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection = collection.isCollection,
	      isComplex = Complex.isComplex;

	  /**
	   * Compute the argument of a complex value.
	   * For a complex number `a + bi`, the argument is computed as `atan2(b, a)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.arg(x)
	   *
	   * Examples:
	   *
	   *    var a = math.complex(2, 2);
	   *    math.arg(a) / math.pi;          // returns Number 0.25
	   *
	   *    var b = math.complex('2 + 3i');
	   *    math.arg(b);                    // returns Number 0.982793723247329
	   *    math.atan2(3, 2);               // returns Number 0.982793723247329
	   *
	   * See also:
	   *
	   *    re, im, conj, abs
	   *
	   * @param {Number | Complex | Array | Matrix | Boolean | null} x
	   *            A complex number or array with complex numbers
	   * @return {Number | Array | Matrix} The argument of x
	   */
	  math.arg = function arg(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('arg', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.atan2(0, x);
	    }

	    if (isComplex(x)) {
	      return Math.atan2(x.im, x.re);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, arg);
	    }

	    if (isBoolean(x) || x === null) {
	      return arg(+x);
	    }

	    if (x instanceof BigNumber) {
	      // downgrade to Number
	      // TODO: implement BigNumber support
	      return arg(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('arg', math['typeof'](x));
	  };
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      object = util.object,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection =collection.isCollection,
	      isComplex = Complex.isComplex;

	  /**
	   * Compute the complex conjugate of a complex value.
	   * If `x = a+bi`, the complex conjugate of `x` is `a - bi`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.conj(x)
	   *
	   * Examples:
	   *
	   *    math.conj(math.complex('2 + 3i'));  // returns Complex 2 - 3i
	   *    math.conj(math.complex('2 - 3i'));  // returns Complex 2 + 3i
	   *    math.conj(math.complex('-5.2i'));  // returns Complex 5.2i
	   *
	   * See also:
	   *
	   *    re, im, arg, abs
	   *
	   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
	   *            A complex number or array with complex numbers
	   * @return {Number | BigNumber | Complex | Array | Matrix}
	   *            The complex conjugate of x
	   */
	  math.conj = function conj(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('conj', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return x;
	    }

	    if (x instanceof BigNumber) {
	      return new BigNumber(x);
	    }

	    if (isComplex(x)) {
	      return new Complex(x.re, -x.im);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, conj);
	    }

	    if (isBoolean(x) || x === null) {
	      return +x;
	    }

	    // return a clone of the value for non-complex values
	    return object.clone(x);
	  };
	};


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      object = util.object,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection = collection.isCollection,
	      isComplex = Complex.isComplex;

	  /**
	   * Get the real part of a complex number.
	   * For a complex number `a + bi`, the function returns `a`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.re(x)
	   *
	   * Examples:
	   *
	   *    var a = math.complex(2, 3);
	   *    math.re(a);                     // returns Number 2
	   *    math.im(a);                     // returns Number 3
	   *
	   *    math.re(math.complex('-5.2i')); // returns Number 0
	   *    math.re(math.complex(2.4));     // returns Number 2.4
	   *
	   * See also:
	   *
	   *    im, conj, abs, arg
	   *
	   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
	   *            A complex number or array with complex numbers
	   * @return {Number | BigNumber | Array | Matrix} The real part of x
	   */
	  math.re = function re(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('re', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return x;
	    }

	    if (x instanceof BigNumber) {
	      return new BigNumber(x);
	    }

	    if (isComplex(x)) {
	      return x.re;
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, re);
	    }

	    if (isBoolean(x) || x === null) {
	      return +x;
	    }

	    // return a clone of the value itself for all non-complex values
	    return object.clone(x);
	  };
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isCollection =collection.isCollection,
	      isComplex = Complex.isComplex;

	  /**
	   * Get the imaginary part of a complex number.
	   * For a complex number `a + bi`, the function returns `b`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.im(x)
	   *
	   * Examples:
	   *
	   *    var a = math.complex(2, 3);
	   *    math.re(a);                     // returns Number 2
	   *    math.im(a);                     // returns Number 3
	   *
	   *    math.re(math.complex('-5.2i')); // returns Number -5.2
	   *    math.re(math.complex(2.4));     // returns Number 0
	   *
	   * See also:
	   *
	   *    re, conj, abs, arg
	   *
	   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
	   *            A complex number or array with complex numbers
	   * @return {Number | BigNumber | Array | Matrix} The imaginary part of x
	   */
	  math.im = function im(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('im', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return 0;
	    }

	    if (x instanceof BigNumber) {
	      return new BigNumber(0);
	    }

	    if (isComplex(x)) {
	      return x.im;
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, im);
	    }

	    if (isBoolean(x) || x === null) {
	      return 0;
	    }

	    // return 0 for all non-complex values
	    return 0;
	  };
	};


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      // take the BigNumber instance the provided math.js instance
	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isNumber = util.number.isNumber,
	      isString = util.string.isString,
	      isBoolean = util['boolean'].isBoolean;

	  /**
	   * Create a BigNumber, which can store numbers with arbitrary precision.
	   * When a matrix is provided, all elements will be converted to BigNumber.
	   *
	   * Syntax:
	   *
	   *    math.bignumber(x)
	   *
	   * Examples:
	   *
	   *    0.1 + 0.2;                                  // returns Number 0.30000000000000004
	   *    math.bignumber(0.1) + math.bignumber(0.2);  // returns BigNumber 0.3
	   *
	   *
	   *    7.2e500;                                    // returns Number Infinity
	   *    math.bignumber('7.2e500');                  // returns BigNumber 7.2e500
	   *
	   * See also:
	   *
	   *    boolean, complex, index, matrix, string, unit
	   *
	   * @param {Number | String | Array | Matrix | Boolean | null} [value]  Value for the big number,
	   *                                                    0 by default.
	   * @returns {BigNumber} The created bignumber
	   */
	  math.bignumber = function bignumber(value) {
	    if (arguments.length > 1) {
	      throw new math.error.ArgumentsError('bignumber', arguments.length, 0, 1);
	    }

	    if ((value instanceof BigNumber) || isNumber(value) || isString(value)) {
	      return new BigNumber(value);
	    }

	    if (isBoolean(value) || value === null) {
	      return new BigNumber(+value);
	    }

	    if (isCollection(value)) {
	      return collection.deepMap(value, bignumber);
	    }

	    if (arguments.length == 0) {
	      return new BigNumber(0);
	    }

	    throw new math.error.UnsupportedTypeError('bignumber', math['typeof'](value));
	  };
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isNumber = util.number.isNumber,
	      isString = util.string.isString;

	  /**
	   * Create a boolean or convert a string or number to a boolean.
	   * In case of a number, `true` is returned for non-zero numbers, and `false` in
	   * case of zero.
	   * Strings can be `'true'` or `'false'`, or can contain a number.
	   * When value is a matrix, all elements will be converted to boolean.
	   *
	   * Syntax:
	   *
	   *    math.boolean(x)
	   *
	   * Examples:
	   *
	   *    math.boolean(0);     // returns false
	   *    math.boolean(1);     // returns true
	   *    math.boolean(-3);     // returns true
	   *    math.boolean('true');     // returns true
	   *    math.boolean('false');     // returns false
	   *    math.boolean([1, 0, 1, 1]);     // returns [true, false, true, true]
	   *
	   * See also:
	   *
	   *    bignumber, complex, index, matrix, string, unit
	   *
	   * @param {String | Number | Boolean | Array | Matrix | null} value  A value of any type
	   * @return {Boolean | Array | Matrix} The boolean value
	   */
	  math['boolean'] = function bool (value) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('boolean', arguments.length, 0, 1);
	    }

	    if (value === 'true' || value === true) {
	      return true;
	    }

	    if (value === 'false' || value === false || value === null) {
	      return false;
	    }

	    if (value instanceof Boolean) {
	      return value == true;
	    }

	    if (isNumber(value)) {
	      return (value !== 0);
	    }

	    if (value instanceof BigNumber) {
	      return !value.isZero();
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


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isNumber = util.number.isNumber,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex;

	  /**
	   * Create a complex value or convert a value to a complex value.
	   *
	   * Syntax:
	   *
	   *     math.complex()                           // creates a complex value with zero
	   *                                              // as real and imaginary part.
	   *     math.complex(re : number, im : string)   // creates a complex value with provided
	   *                                              // values for real and imaginary part.
	   *     math.complex(re : number)                // creates a complex value with provided
	   *                                              // real value and zero imaginary part.
	   *     math.complex(complex : Complex)          // clones the provided complex value.
	   *     math.complex(arg : string)               // parses a string into a complex value.
	   *     math.complex(array : Array)              // converts the elements of the array
	   *                                              // or matrix element wise into a
	   *                                              // complex value.
	   *     math.complex({re: number, im: number})   // creates a complex value with provided
	   *                                              // values for real an imaginary part.
	   *     math.complex({r: number, phi: number})   // creates a complex value with provided
	   *                                              // polar coordinates
	   *
	   * Examples:
	   *
	   *    var a = math.complex(3, -4);     // a = Complex 3 - 4i
	   *    a.re = 5;                        // a = Complex 5 - 4i
	   *    var i = a.im;                    // Number -4;
	   *    var b = math.complex('2 + 6i');  // Complex 2 + 6i
	   *    var c = math.complex();          // Complex 0 + 0i
	   *    var d = math.add(a, b);          // Complex 5 + 2i
	   *
	   * See also:
	   *
	   *    bignumber, boolean, index, matrix, number, string, unit
	   *
	   * @param {* | Array | Matrix} [args]
	   *            Arguments specifying the real and imaginary part of the complex number
	   * @return {Complex | Array | Matrix} Returns a complex value
	   */
	  math.complex = function complex(args) {
	    switch (arguments.length) {
	      case 0:
	        // no parameters. Set re and im zero
	        return new Complex(0, 0);

	      case 1:
	        // parse string into a complex number
	        var arg = arguments[0];

	        if (isNumber(arg)) {
	          return new Complex(arg, 0);
	        }

	        if (arg instanceof BigNumber) {
	          // convert to Number
	          return new Complex(arg.toNumber(), 0);
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

	        if (typeof arg === 'object') {
	          if('re' in arg && 'im' in arg) {
	            return new Complex(arg.re, arg.im);
	          } else if ('r' in arg && 'phi' in arg) {
	            return Complex.fromPolar(arg.r, arg.phi);
	          }
	        } 

	        throw new TypeError('Two numbers, single string or an fitting object expected in function complex');

	      case 2:
	        // re and im provided
	        var re = arguments[0],
	            im = arguments[1];

	        // convert re to number
	        if (re instanceof BigNumber) {
	          re = re.toNumber();
	        }

	        // convert im to number
	        if (im instanceof BigNumber) {
	          im = im.toNumber();
	        }

	        if (isNumber(re) && isNumber(im)) {
	          return new Complex(re, im);
	        }
	        else {
	          throw new TypeError('Two numbers or a single string expected in function complex');
	        }

	      default:
	        throw new math.error.ArgumentsError('complex', arguments.length, 0, 2);
	    }
	  };
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Index = __webpack_require__(8);

	  /**
	   * Create an index. An Index can store ranges having start, step, and end
	   * for multiple dimensions.
	   * Matrix.get, Matrix.set, and math.subset accept an Index as input.
	   *
	   * Syntax:
	   *
	   *     math.index(range1, range2, ...)
	   *
	   * Where:
	   *
	   * Each range can be any of:
	   *
	   * - An array [start, end]
	   * - An array [start, end, step]
	   * - A number
	   * - An instance of `Range`
	   *
	   * The parameters start, end, and step must be integer numbers. Start and end
	   * are zero based. The start of a range is included, the end is excluded.
	   *
	   * Examples:
	   *
	   *    var math = math.js
	   *
	   *    var b = [1, 2, 3, 4, 5];
	   *    math.subset(b, math.index([1, 3]));     // returns [2, 3]
	   *
	   *    var a = math.matrix([[1, 2], [3, 4]]);
	   *    a.subset(math.index(0, 1));             // returns 2
	   *    a.subset(math.index(1, null));          // returns [3, 4]
	   *
	   * See also:
	   *
	   *    bignumber, boolean, complex, matrix, number, string, unit
	   *
	   * @param {...*} ranges   Zero or more ranges or numbers.
	   * @return {Index}        Returns the created index
	   */
	  math.index = function(ranges) {
	    // downgrade BigNumber to Number
	    var args = Array.prototype.slice.apply(arguments).map(function (arg) {
	      if (arg instanceof BigNumber) {
	        return arg.toNumber();
	      }
	      else if (Array.isArray(arg)) {
	        return arg.map(function (elem) {
	          return (elem instanceof BigNumber) ? elem.toNumber() : elem;
	        });
	      }
	      else {
	        return arg;
	      }
	    });

	    var res = new Index();
	    Index.apply(res, args);
	    return res;
	  };
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      Matrix = __webpack_require__(9);

	  /**
	   * Create a Matrix. The function creates a new `math.type.Matrix` object from
	   * an `Array`. A Matrix has utility functions to manipulate the data in the
	   * matrix, like getting the size and getting or setting values in the matrix.
	   *
	   * Syntax:
	   *
	   *    math.matrix()      // creates an empty matrix
	   *    math.matrix(data)  // creates a matrix with initial data.
	   *
	   * Examples:
	   *
	   *    var m = math.matrix([[1, 2], [3, 4]]);
	   *    m.size();                        // Array [2, 2]
	   *    m.resize([3, 2], 5);
	   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
	   *    m.get([1, 0])                    // number 3
	   *
	   * See also:
	   *
	   *    bignumber, boolean, complex, index, number, string, unit
	   *
	   * @param {Array | Matrix} [data]    A multi dimensional array
	   * @return {Matrix} The created matrix
	   */
	  math.matrix = function matrix(data) {
	    if (arguments.length > 1) {
	      throw new math.error.ArgumentsError('matrix', arguments.length, 0, 1);
	    }

	    return new Matrix(data);
	  };
	};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160);

	  var BigNumber = math.type.BigNumber;
	  var Unit = math.type.Unit;
	  var collection = __webpack_require__(13);

	  var isCollection = collection.isCollection;
	  var isNumber = util.number.isNumber;
	  var isBoolean = util['boolean'].isBoolean;
	  var isString = util.string.isString;

	  /**
	   * Create a number or convert a string, boolean, or unit to a number.
	   * When value is a matrix, all elements will be converted to number.
	   *
	   * Syntax:
	   *
	   *    math.number(value)
	   *    math.number(unit, valuelessUnit)
	   *
	   * Examples:
	   *
	   *    math.number(2);                         // returns number 2
	   *    math.number('7.2');                     // returns number 7.2
	   *    math.number(true);                      // returns number 1
	   *    math.number([true, false, true, true]); // returns [1, 0, 1, 1]
	   *    math.number(math.unit('52cm'), 'm');    // returns 0.52
	   *
	   * See also:
	   *
	   *    bignumber, boolean, complex, index, matrix, string, unit
	   *
	   * @param {String | Number | Boolean | Array | Matrix | Unit | null} [value]  Value to be converted
	   * @param {Unit | string} [valuelessUnit] A valueless unit, used to convert a unit to a number
	   * @return {Number | Array | Matrix} The created number
	   */
	  math.number = function number (value, valuelessUnit) {
	    switch (arguments.length) {
	      case 0:
	        return 0;

	      case 1:
	        if (isCollection(value)) {
	          return collection.deepMap(value, number);
	        }

	        if (value instanceof BigNumber) {
	          return value.toNumber();
	        }

	        if (isString(value)) {
	          var num = Number(value);
	          if (isNaN(num)) {
	            num = Number(value.valueOf());
	          }
	          if (isNaN(num)) {
	            throw new SyntaxError(value.toString() + ' is no valid number');
	          }
	          return num;
	        }

	        if (isBoolean(value) || value === null) {
	          return +value;
	        }

	        if (isNumber(value)) {
	          return value;
	        }

	        if (value instanceof Unit) {
	          throw new Error('Second argument with valueless unit expected');
	        }

	        throw new math.error.UnsupportedTypeError('number', math['typeof'](value));

	      case 2:
	        if (value instanceof Unit && isString(valuelessUnit) || valuelessUnit instanceof Unit) {
	          return value.toNumber(valuelessUnit);
	        }

	        throw new math.error.UnsupportedTypeError('number', math['typeof'](value), math['typeof'](valuelessUnit));


	      default:
	        throw new math.error.ArgumentsError('number', arguments.length, 0, 1);
	    }
	  };
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Parser = __webpack_require__(15);

	  /**
	   * Create a parser. The function creates a new `math.expression.Parser` object.
	   *
	   * Syntax:
	   *
	   *    math.parser()
	   *
	   * Examples:
	   *
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
	   *       return 'hello, ' + name + '!';
	   *     });
	   *     parser.eval('hello("user")');           // "hello, user!"
	   *
	   *     // clear defined functions and variables
	   *     parser.clear();
	   *
	   * See also:
	   *
	   *    eval, compile, parse
	   *
	   * @return {Parser} Parser
	   */
	  math.parser = function parser() {
	    return new Parser(math);
	  };
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  /**
	   * Wrap any value in a chain, allowing to perform chained operations on
	   * the value.
	   *
	   * All methods available in the math.js library can be called upon the chain,
	   * and then will be evaluated with the value itself as first argument.
	   * The chain can be closed by executing `chain.done()`, which returns
	   * the final value.
	   *
	   * The chain has a number of special functions:
	   *
	   * - `done()`     Finalize the chain and return the chain's value.
	   * - `valueOf()`  The same as `done()`
	   * - `toString()` Executes `math.format()` onto the chain's value, returning
	   *                a string representation of the value.
	   *
	   * Syntax:
	   *
	   *    math.chain(value)
	   *
	   * Examples:
	   *
	   *     math.chain(3)
	   *         .add(4)
	   *         .subtract(2)
	   *         .done();     // 5
	   *
	   *     math.chain( [[1, 2], [3, 4]] )
	   *         .set([1, 1], 8)
	   *         .multiply(3)
	   *         .done();     // [[24, 6], [9, 12]]
	   *
	   * @param {*} [value]   A value of any type on which to start a chained operation.
	   * @return {math.chaining.Chain} The created chain
	   */
	  math.chain = function(value) {
	    // TODO: check number of arguments
	    return new math.chaining.Chain(value);
	  };

	  // TODO: deprecate math.select in v2.0
	  math.select = function(value) {
	    // give a warning once.
	    if (console && typeof console.log === 'function') {
	      console.log('WARNING: Function "select" is renamed to "chain". It will be deprecated in v2.0.')
	    }

	    // replace warning function with chain function
	    math.select = math.chain;
	    math.chaining.Chain.prototype['select'] = math.select;

	    return math.chain(value);
	  }
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      collection = __webpack_require__(13),

	      number = util.number,
	      isNumber = util.number.isNumber,
	      isCollection = collection.isCollection;

	  /**
	   * Create a string or convert any object into a string.
	   * Elements of Arrays and Matrices are processed element wise.
	   *
	   * Syntax:
	   *
	   *    math.string(value)
	   *
	   * Examples:
	   *
	   *    math.string(4.2);               // returns string '4.2'
	   *    math.string(math.complex(3, 2); // returns string '3 + 2i'
	   *
	   *    var u = math.unit(5, 'km');
	   *    math.string(u.to('m'));         // returns string '5000 m'
	   *
	   *    math.string([true, false]);     // returns ['true', 'false']
	   *
	   * See also:
	   *
	   *    bignumber, boolean, complex, index, matrix, number, unit
	   *
	   * @param {* | Array | Matrix | null} [value]  A value to convert to a string
	   * @return {String | Array | Matrix} The created string
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
	        throw new math.error.ArgumentsError('string', arguments.length, 0, 1);
	    }
	  };
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isString = util.string.isString;

	  /**
	   * Create a unit. Depending on the passed arguments, the function
	   * will create and return a new math.type.Unit object.
	   * When a matrix is provided, all elements will be converted to units.
	   *
	   * Syntax:
	   *
	   *     math.unit(unit : string)
	   *     math.unit(value : number, unit : string)
	   *
	   * Examples:
	   *
	   *    var a = math.unit(5, 'cm');    // returns Unit 50 mm
	   *    var b = math.unit('23 kg');    // returns Unit 23 kg
	   *    a.to('m');                     // returns Unit 0.05 m
	   *
	   * See also:
	   *
	   *    bignumber, boolean, complex, index, matrix, number, string
	   *
	   * @param {* | Array | Matrix} args   A number and unit.
	   * @return {Unit | Array | Matrix}    The created unit
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
	          if (Unit.isValuelessUnit(arg)) {
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

	      case 2:
	        // a number and a unit

	        if (arguments[0] instanceof BigNumber) {
	          // convert value to number
	          return new Unit(arguments[0].toNumber(), arguments[1]);
	        }
	        else {
	          return new Unit(arguments[0], arguments[1]);
	        }

	      default:
	        throw new math.error.ArgumentsError('unit', arguments.length, 1, 2);
	    }
	  };
	};


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.and(x, y)
	   *
	   * Examples:
	   *
	   *    math.and(2, 4);   // returns true
	   *
	   *    a = [2, 0, 0];
	   *    b = [3, 7, 0];
	   *    c = 0;
	   *
	   *    math.and(a, b);   // returns [true, false, false]
	   *    math.and(a, c);   // returns [false, false, false]
	   *
	   * See also:
	   *
	   *    not, or, xor
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
	   * @return {Boolean | Array | Matrix}
	   *            Returns true when both inputs are defined with a nonzero/nonempty value.
	   */
	  math.and = function and(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('and', arguments.length, 2);
	    }

	    if ((isNumber(x) || isBoolean(x) || x === null) &&
	        (isNumber(y) || isBoolean(y) || y === null)) {
	      return !!(x && y);
	    }

	    if (isComplex(x)) {
	      if (x.re == 0 && x.im == 0) {
	        return false;
	      }

	      return and(true, y);
	    }
	    if (isComplex(y)) {
	      if (y.re == 0 && y.im == 0) {
	        return false;
	      }

	      return and(x, true);
	    }

	    if (x instanceof BigNumber) {
	      if (x.isZero() || x.isNaN()) {
	        return false;
	      }

	      return and(true, y);
	    }
	    if (y instanceof BigNumber) {
	      if (y.isZero() || y.isNaN()) {
	        return false;
	      }

	      return and(x, true);
	    }

	    if (isUnit(x)) {
	      if (x.value === null || x.value == 0) {
	        return false;
	      }

	      return and(true, y);
	    }
	    if (isUnit(y)) {
	      if (y.value === null || y.value == 0) {
	        return false;
	      }

	      return and(x, true);
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, and);
	    }

	    throw new math.error.UnsupportedTypeError('and', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Logical `not`. Flips boolean value of a given parameter.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.not(x)
	   *
	   * Examples:
	   *
	   *    math.not(2);      // returns false
	   *    math.not(0);      // returns true
	   *    math.not(true);   // returns false
	   *
	   *    a = [2, -7, 0];
	   *    math.not(a);      // returns [false, false, true]
	   *
	   * See also:
	   *
	   *    and, or, xor
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
	   * @return {Boolean | Array | Matrix}
	   *            Returns true when input is a zero or empty value.
	   */
	  math.not = function not(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('not', arguments.length, 1);
	    }

	    if (isNumber(x) || isBoolean(x) || x === null) {
	      return !x;
	    }

	    if (isComplex(x)) {
	      return x.re == 0 && x.im == 0;
	    }

	    if (x instanceof BigNumber) {
	      return x.isZero() || x.isNaN();
	    }

	    if (isUnit(x)) {
	      return x.value === null || x.value == 0;
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, not);
	    }

	    throw new math.error.UnsupportedTypeError('not', math['typeof'](x));
	  };
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Logical `or`. Test if at least one value is defined with a nonzero/nonempty value.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.or(x, y)
	   *
	   * Examples:
	   *
	   *    math.or(2, 4);   // returns true
	   *
	   *    a = [2, 5, 0];
	   *    b = [0, 22, 0];
	   *    c = 0;
	   *
	   *    math.or(a, b);   // returns [true, true, false]
	   *    math.or(b, c);   // returns [false, true, false]
	   *
	   * See also:
	   *
	   *    and, not, xor
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
	   * @return {Boolean | Array | Matrix}
	   *            Returns true when one of the inputs is defined with a nonzero/nonempty value.
	   */
	  math.or = function or(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('or', arguments.length, 2);
	    }

	    if ((isNumber(x) || isBoolean(x) || x === null) &&
	        (isNumber(y) || isBoolean(y) || y === null)) {
	      return !!(x || y);
	    }

	    if (isComplex(x)) {
	      if (x.re == 0 && x.im == 0) {
	        return or(false, y);
	      }
	      return true;
	    }
	    if (isComplex(y)) {
	      if (y.re == 0 && y.im == 0) {
	        return or(x, false);
	      }
	      return true;
	    }

	    if (x instanceof BigNumber) {
	      if (x.isZero() || x.isNaN()) {
	        return or(false, y);
	      }
	      return true;
	    }
	    if (y instanceof BigNumber) {
	      if (y.isZero() || y.isNaN()) {
	        return or(x, false);
	      }
	      return true;
	    }

	    if (isUnit(x)) {
	      if (x.value === null || x.value == 0) {
	        return or(false, y);
	      }
	      return true;
	    }
	    if (isUnit(y)) {
	      if (y.value === null || y.value == 0) {
	        return or(x, false);
	      }
	      return true;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, or);
	    }

	    throw new math.error.UnsupportedTypeError('or', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.xor(x, y)
	   *
	   * Examples:
	   *
	   *    math.xor(2, 4);   // returns false
	   *
	   *    a = [2, 0, 0];
	   *    b = [2, 7, 0];
	   *    c = 0;
	   *
	   *    math.xor(a, b);   // returns [false, true, false]
	   *    math.xor(a, c);   // returns [true, false, false]
	   *
	   * See also:
	   *
	   *    and, not, or
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
	   * @return {Boolean | Array | Matrix}
	   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
	   */
	  math.xor = function xor(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('xor', arguments.length, 2);
	    }

	    if ((isNumber(x) || isBoolean(x) || x === null) &&
	        (isNumber(y) || isBoolean(y) || y === null)) {
	      return !!(!!x ^ !!y);
	    }

	    if (isComplex(x)) {
	      return xor(!(x.re == 0 && x.im == 0), y);
	    }
	    if (isComplex(y)) {
	      return xor(x, !(y.re == 0 && y.im == 0));
	    }

	    if (x instanceof BigNumber) {
	      return xor(!(x.isZero() || x.isNaN()), y);
	    }
	    if (y instanceof BigNumber) {
	      return xor(x, !(y.isZero() || y.isNaN()));
	    }

	    if (isUnit(x)) {
	      return xor(!(x.value === null || x.value == 0), y);
	    }
	    if (isUnit(y)) {
	      return xor(x, !(y.value === null || y.value == 0));
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, xor);
	    }

	    throw new math.error.UnsupportedTypeError('xor', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = __webpack_require__(159),
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      object = util.object,
	      array = util.array,
	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger,
	      isCollection = collection.isCollection;

	  /**
	   * Concatenate two or more matrices.
	   *
	   * Syntax:
	   *
	   *     math.concat(A, B, C, ...)
	   *     math.concat(A, B, C, ..., dim)
	   *
	   * Where:
	   *
	   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
	   *   By default the last dimension of the matrices.
	   *
	   * Examples:
	   *
	   *    var A = [[1, 2], [5, 6]];
	   *    var B = [[3, 4], [7, 8]];
	   *
	   *    math.concat(A, B);      // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
	   *    math.concat(A, B, 0);   // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
	   *
	   * See also:
	   *
	   *    size, squeeze, subset, transpose
	   *
	   * @param {... Array | Matrix} args     Two or more matrices
	   * @return {Array | Matrix} Concatenated matrix
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

	      if ((i == len - 1) && (isNumber(arg) || arg instanceof BigNumber)) {
	        // last argument contains the dimension on which to concatenate
	        prevDim = dim;
	        dim = arg.valueOf(); // change bignumber to number

	        if (!isInteger(dim)) {
	          throw new TypeError('Integer number expected for dimension');
	        }

	        if (dim < 0) {
	          // TODO: would be more clear when throwing a DimensionError here
	          throw new math.error.IndexError(dim);
	        }
	        if (i > 0 && dim > prevDim) {
	          // TODO: would be more clear when throwing a DimensionError here
	          throw new math.error.IndexError(dim, prevDim + 1);
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
	          throw new math.error.DimensionError(prevDim + 1, dim + 1);
	        }
	      }
	      else {
	        throw new math.error.UnsupportedTypeError('concat', math['typeof'](arg));
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
	        throw new math.error.DimensionError(a.length, b.length);
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


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(math) {
	  var array = __webpack_require__(153);
	  var Matrix = __webpack_require__(9);

	  /**
	   * Calculate the cross product for two vectors in three dimensional space.
	   * The cross product of `A = [a1, a2, a3]` and `B =[b1, b2, b3]` is defined
	   * as:
	   *
	   *    cross(A, B) = [
	   *      a2 * b3 - a3 * b2,
	   *      a3 * b1 - a1 * b3,
	   *      a1 * b2 - a2 * b1
	   *    ]
	   *
	   * Syntax:
	   *
	   *    math.cross(x, y)
	   *
	   * Examples:
	   *
	   *    math.cross([1, 1, 0],  [0, 1, 1]);  // Returns [1, -1, 1]
	   *    math.cross([3, -3, 1], [4, 9, 2]);  // Returns [-15, -2, 39]
	   *    math.cross([2, 3, 4],  [5, 6, 7]);  // Returns [-3, 6, -3]
	   *
	   * See also:
	   *
	   *    dot, multiply
	   *
	   * @param  {Array | Matrix} x   First vector
	   * @param  {Array | Matrix} y   Second vector
	   * @return {Array | Matrix}     Returns the cross product of `x` and `y`
	   */
	  math.cross = function cross(x, y) {
	    if (x instanceof Matrix) {
	      if (y instanceof Matrix) {
	        return new Matrix(_cross(x.toArray(), y.toArray()));
	      }
	      else if (Array.isArray(y)) {
	        return new Matrix(_cross(x.toArray(), y));
	      }
	    }
	    else if (Array.isArray(x)) {
	      if (y instanceof Matrix) {
	        return new Matrix(_cross(x, y.toArray()));
	      }
	      else if (Array.isArray(y)) {
	        return _cross(x, y);
	      }
	    }

	    throw new math.error.UnsupportedTypeError('cross', math['typeof'](x), math['typeof'](y));
	  };

	  /**
	   * Calculate the cross product for two arrays
	   * @param {Array} x  First vector
	   * @param {Array} y  Second vector
	   * @returns {Array} Returns the cross product of x and y
	   * @private
	   */
	  function _cross(x, y) {
	    var xSize= array.size(x);
	    var ySize = array.size(y);

	    if (xSize.length != 1 || ySize.length != 1 || xSize[0] != 3 || ySize[0] != 3) {
	      throw new RangeError('Vectors with length 3 expected ' +
	      '(Size A = [' + xSize.join(', ') + '], B = [' + ySize.join(', ') + '])');
	    }

	    return [
	      math.subtract(math.multiply(x[1], y[2]), math.multiply(x[2], y[1])),
	      math.subtract(math.multiply(x[2], y[0]), math.multiply(x[0], y[2])),
	      math.subtract(math.multiply(x[0], y[1]), math.multiply(x[1], y[0]))
	    ];
	  }
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),

	      object = util.object,
	      string = util.string;

	  /**
	   * Calculate the determinant of a matrix.
	   *
	   * Syntax:
	   *
	   *    math.det(x)
	   *
	   * Examples:
	   *
	   *    math.det([[1, 2], [3, 4]]); // returns -2
	   *
	   *    var A = [
	   *      [-2, 2, 3],
	   *      [-1, 1, 3],
	   *      [2, 0, -1]
	   *    ]
	   *    math.det(A); // returns 6
	   *
	   * See also:
	   *
	   *    inv
	   *
	   * @param {Array | Matrix} x  A matrix
	   * @return {Number} The determinant of `x`
	   */
	  math.det = function det (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('det', arguments.length, 1);
	    }

	    var size;
	    if (x instanceof Matrix) {
	      size = x.size();
	    }
	    else if (x instanceof Array) {
	      x = new Matrix(x);
	      size = x.size();
	    }
	    else {
	      // a scalar
	      size = [];
	    }

	    switch (size.length) {
	      case 0:
	        // scalar
	        return object.clone(x);

	      case 1:
	        // vector
	        if (size[0] == 1) {
	          return object.clone(x.valueOf()[0]);
	        }
	        else {
	          throw new RangeError('Matrix must be square ' +
	              '(size: ' + string.format(size) + ')');
	        }

	      case 2:
	        // two dimensional array
	        var rows = size[0];
	        var cols = size[1];
	        if (rows == cols) {
	          return _det(x.clone().valueOf(), rows, cols);
	        }
	        else {
	          throw new RangeError('Matrix must be square ' +
	              '(size: ' + string.format(size) + ')');
	        }

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
	      return object.clone(matrix[0][0]);
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
	      var compute_mu = function (matrix) {
	        var i, j;

	        // Compute the matrix with zero lower triangle, same upper triangle,
	        // and diagonals given by the negated sum of the below diagonal
	        // elements.
	        var mu = new Array(matrix.length);
	        var sum = 0;
	        for (i = 1; i < matrix.length; i++) {
	          sum = math.add(sum, matrix[i][i]);
	        }

	        for (i = 0; i < matrix.length; i++) {
	          mu[i] = new Array(matrix.length);
	          mu[i][i] = math.unaryMinus(sum);

	          for (j = 0; j < i; j++) {
	            mu[i][j] = 0; // TODO: make bignumber 0 in case of bignumber computation
	          }

	          for (j = i + 1; j < matrix.length; j++) {
	            mu[i][j] = matrix[i][j];
	          }

	          if (i+1 < matrix.length) {
	            sum = math.subtract(sum, matrix[i + 1][i + 1]);
	          }
	        }

	        return mu;
	      };

	      var fa = matrix;
	      for (var i = 0; i < rows - 1; i++) {
	        fa = math.multiply(compute_mu(fa), matrix);
	      }

	      if (rows % 2 == 0) {
	        return math.unaryMinus(fa[0][0]);
	      } else {
	        return fa[0][0];
	      }
	    }
	  }
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),

	      object = util.object,
	      isArray = util.array.isArray,
	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger;

	  /**
	   * Create a diagonal matrix or retrieve the diagonal of a matrix
	   *
	   * When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
	   * When `x` is a two dimensional matrix, the matrixes `k`th diagonal will be returned as vector.
	   * When k is positive, the values are placed on the super diagonal.
	   * When k is negative, the values are placed on the sub diagonal.
	   *
	   * Syntax:
	   *
	   *     math.diag(X)
	   *     math.diag(X, k)
	   *
	   * Examples:
	   *
	   *     // create a diagonal matrix
	   *     math.diag([1, 2, 3]);      // returns [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
	   *     math.diag([1, 2, 3], 1);   // returns [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]
	   *     math.diag([1, 2, 3], -1);  // returns [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3]]
	   *
	   *    // retrieve the diagonal from a matrix
	   *    var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
	   *    math.diag(a);   // returns [1, 5, 9]
	   *
	   * See also:
	   *
	   *     ones, zeros, eye
	   *
	   * @param {Matrix | Array} x          A two dimensional matrix or a vector
	   * @param {Number | BigNumber} [k=0]  The diagonal where the vector will be filled
	   *                                    in or retrieved.
	   * @returns {Matrix | Array} Diagonal matrix from input vector, or diagonal from input matrix.
	   */
	  math.diag = function diag (x, k) {
	    var data, vector, i, iMax;

	    if (arguments.length != 1 && arguments.length != 2) {
	      throw new math.error.ArgumentsError('diag', arguments.length, 1, 2);
	    }

	    if (k) {
	      // convert BigNumber to a number
	      if (k instanceof BigNumber) k = k.toNumber();

	      if (!isNumber(k) || !isInteger(k)) {
	        throw new TypeError ('Second parameter in function diag must be an integer');
	      }
	    }
	    else {
	      k = 0;
	    }
	    var kSuper = k > 0 ? k : 0;
	    var kSub = k < 0 ? -k : 0;

	    // check type of input
	    var asArray;
	    if (x instanceof Matrix) {
	      asArray = false;
	    }
	    else if (isArray(x)) {
	      // convert to matrix
	      x = new Matrix(x);
	      asArray = true;
	    }
	    else {
	      throw new TypeError ('First parameter in function diag must be a Matrix or Array');
	    }

	    var s = x.size();
	    switch (s.length) {
	      case 1:
	        // x is a vector. create diagonal matrix
	        vector = x.valueOf();
	        var matrix = new Matrix();
	        var defaultValue = (vector[0] instanceof BigNumber) ? new BigNumber(0) : 0;
	        matrix.resize([vector.length + kSub, vector.length + kSuper], defaultValue);
	        data = matrix.valueOf();
	        iMax = vector.length;
	        for (i = 0; i < iMax; i++) {
	          data[i + kSub][i + kSuper] = object.clone(vector[i]);
	        }
	        return asArray ? matrix.valueOf() : matrix;

	      case 2:
	        // x is a matrix get diagonal from matrix
	        vector = [];
	        data = x.valueOf();
	        iMax = Math.min(s[0] - kSub, s[1] - kSuper);
	        for (i = 0; i < iMax; i++) {
	          vector[i] = object.clone(data[i + kSub][i + kSuper]);
	        }
	        return asArray ? vector : new Matrix(vector);

	      default:
	        throw new RangeError('Matrix for function diag must be 2 dimensional');
	    }
	  };
	};


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function(math) {
	  var array = __webpack_require__(153);
	  var Matrix = __webpack_require__(9);

	  /**
	   * Calculate the dot product of two vectors. The dot product of
	   * `A = [a1, a2, a3, ..., an]` and `B = [b1, b2, b3, ..., bn]` is defined as:
	   *
	   *    dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn
	   *
	   * Syntax:
	   *
	   *    math.dot(x, y)
	   *
	   * Examples:
	   *
	   *    math.dot([2, 4, 1], [2, 2, 3]);       // returns Number 15
	   *    math.multiply([2, 4, 1], [2, 2, 3]);  // returns Number 15
	   *
	   * See also:
	   *
	   *    multiply, cross
	   *
	   * @param  {Array | Matrix} x     First vector
	   * @param  {Array | Matrix} y     Second vector
	   * @return {Number}               Returns the dot product of `x` and `y`
	   */
	  math.dot = function dot(x, y) {
	    if (x instanceof Matrix) {
	      if (y instanceof Matrix) {
	        return _dot(x.toArray(), y.toArray());
	      }
	      else if (Array.isArray(y)) {
	        return _dot(x.toArray(), y);
	      }
	    }
	    else if (Array.isArray(x)) {
	      if (y instanceof Matrix) {
	        return _dot(x, y.toArray());
	      }
	      else if (Array.isArray(y)) {
	        return _dot(x, y);
	      }
	    }

	    throw new math.error.UnsupportedTypeError('dot', math['typeof'](x), math['typeof'](y));
	  };

	  /**
	   * Calculate the dot product for two arrays
	   * @param {Array} x  First vector
	   * @param {Array} y  Second vector
	   * @returns {Number} Returns the dot product of x and y
	   * @private
	   */
	  // TODO: double code with math.multiply
	  function _dot(x, y) {
	    var xSize= array.size(x);
	    var ySize = array.size(y);
	    var len = xSize[0];

	    if (xSize.length !== 1 || ySize.length !== 1) throw new RangeError('Vector expected'); // TODO: better error message
	    if (xSize[0] != ySize[0]) throw new RangeError('Vectors must have equal length (' + xSize[0] + ' != ' + ySize[0] + ')');
	    if (len == 0) throw new RangeError('Cannot calculate the dot product of empty vectors');

	    var prod = 0;
	    for (var i = 0; i < len; i++) {
	      prod = math.add(prod, math.multiply(x[i], y[i]));
	    }

	    return prod;
	  }
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger,
	      isArray = Array.isArray;

	  /**
	   * Create a 2-dimensional identity matrix with size m x n or n x n.
	   * The matrix has ones on the diagonal and zeros elsewhere.
	   *
	   * Syntax:
	   *
	   *    math.eye(n)
	   *    math.eye(m, n)
	   *    math.eye([m, n])
	   *
	   * Examples:
	   *
	   *    math.eye(3);                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
	   *    math.eye(3, 2);                 // returns [[1, 0], [0, 1], [0, 0]]
	   *
	   *    var A = [[1, 2, 3], [4, 5, 6]];
	   *    math.eye(math.size(b));         // returns [[1, 0, 0], [0, 1, 0]]
	   *
	   * See also:
	   *
	   *    diag, ones, zeros, size, range
	   *
	   * @param {...Number | Matrix | Array} size   The size for the matrix
	   * @return {Matrix | Array | Number} A matrix with ones on the diagonal.
	   */
	  math.eye = function eye (size) {
	    var args = collection.argsToArray(arguments),
	        asMatrix = (size instanceof Matrix) ? true :
	        (isArray(size) ? false : (config.matrix === 'matrix'));


	    if (args.length == 0) {
	      // return an empty array
	      return asMatrix ? new Matrix() : [];
	    }
	    else if (args.length == 1) {
	      // change to a 2-dimensional square
	      args[1] = args[0];
	    }
	    else if (args.length > 2) {
	      // error in case of an n-dimensional size
	      throw new math.error.ArgumentsError('eye', args.length, 0, 2);
	    }

	    var rows = args[0],
	        cols = args[1];

	    if (rows instanceof BigNumber) rows = rows.toNumber();
	    if (cols instanceof BigNumber) cols = cols.toNumber();

	    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
	      throw new Error('Parameters in function eye must be positive integers');
	    }
	    if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
	      throw new Error('Parameters in function eye must be positive integers');
	    }

	    // convert arguments from bignumber to numbers if needed
	    var asBigNumber = false;
	    args = args.map(function (value) {
	      if (value instanceof BigNumber) {
	        asBigNumber = true;
	        return value.toNumber();
	      } else {
	        return value;
	      }
	    });

	    // create the matrix
	    var matrix = new Matrix();
	    var one = asBigNumber ? new BigNumber(1) : 1;
	    var defaultValue = asBigNumber ? new BigNumber(0) : 0;
	    matrix.resize(args, defaultValue);

	    // fill in ones on the diagonal
	    var minimum = math.min(args);
	    var data = matrix.valueOf();
	    for (var d = 0; d < minimum; d++) {
	      data[d][d] = one;
	    }

	    return asMatrix ? matrix : matrix.valueOf();
	  };
	};


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160);

	  var Matrix = __webpack_require__(9);

	  var object = util.object;
	  var array = util.array;
	  var isArray = Array.isArray;

	  /**
	   * Flatten a multi dimensional matrix into a single dimensional matrix.
	   *
	   * Syntax:
	   *
	   *    math.flatten(x)
	   *
	   * Examples:
	   *
	   *    math.flatten([[1,2], [3,4]]);   // returns [1, 2, 3, 4]
	   *
	   * See also:
	   *
	   *    concat, resize, size, squeeze
	   *
	   * @param {Matrix | Array} x   Matrix to be flattened
	   * @return {Matrix | Array} Returns the flattened matrix
	   */
	  math.flatten = function flatten (x) {
	    if (arguments.length !== 1) {
	      throw new math.error.ArgumentsError('flatten', arguments.length, 1);
	    }

	    if (x instanceof Matrix) {
	      var clone = object.clone(x.toArray());
	      var flat = array.flatten(clone);
	      return new Matrix(flat);
	    }

	    if (isArray(x)) {
	      return array.flatten(object.clone(x));
	    }

	    throw new math.error.UnsupportedTypeError('flatten', math['typeof'](x));
	  };
	};


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160);
	  var Matrix = __webpack_require__(9);

	  /**
	   * Calculate the inverse of a square matrix.
	   *
	   * Syntax:
	   *
	   *     math.inv(x)
	   *
	   * Examples:
	   *
	   *     math.inv([[1, 2], [3, 4]]);  // returns [[-2, 1], [1.5, -0.5]]
	   *     math.inv(4);                 // returns 0.25
	   *     1 / 4;                       // returns 0.25
	   *
	   * See also:
	   *
	   *     det, transpose
	   *
	   * @param {Number | Complex | Array | Matrix} x     Matrix to be inversed
	   * @return {Number | Complex | Array | Matrix} The inverse of `x`.
	   */
	  math.inv = function inv (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('inv', arguments.length, 1);
	    }
	    var size = math.size(x).valueOf();
	    switch (size.length) {
	      case 0:
	        // scalar
	        return math._divide(1, x);

	      case 1:
	        // vector
	        if (size[0] == 1) {
	          if (x instanceof Matrix) {
	            return new Matrix([
	              math._divide(1, x.valueOf()[0])
	            ]);
	          }
	          else {
	            return [
	              math._divide(1, x[0])
	            ];
	          }
	        }
	        else {
	          throw new RangeError('Matrix must be square ' +
	              '(size: ' + util.string.format(size) + ')');
	        }

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
	              '(size: ' + util.string.format(size) + ')');
	        }

	      default:
	        // multi dimensional array
	        throw new RangeError('Matrix must be two dimensional ' +
	            '(size: ' + util.string.format(size) + ')');
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
	        math._divide(1, value)
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
	          math._divide(matrix[1][1], d),
	          math._divide(math.unaryMinus(matrix[0][1]), d)
	        ],
	        [
	          math._divide(math.unaryMinus(matrix[1][0]), d),
	          math._divide(matrix[0][0], d)
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
	          // TODO: in case of zero det, just return a matrix wih Infinity values? (like octave)
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
	              f = math._divide(math.unaryMinus(Ar[c]), Ac[c]);

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
	              Ar[s] = math._divide(Ar[s], f);
	            }
	            for (s = 0; s < cols; s++) {
	              Br[s] = math._divide(Br[s], f);
	            }
	          }
	        }
	      }
	      return B;
	    }
	  }
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      array = util.array,

	      isArray = Array.isArray;

	  /**
	   * Create a matrix filled with ones. The created matrix can have one or
	   * multiple dimensions.
	   *
	   * Syntax:
	   *
	   *    math.ones(m)
	   *    math.ones(m, n)
	   *    math.ones([m, n])
	   *    math.ones([m, n, p, ...])
	   *
	   * Examples:
	   *
	   *    math.ones(3);                   // returns [1, 1, 1]
	   *    math.ones(3, 2);                // returns [[1, 1], [1, 1], [1, 1]]
	   *
	   *    var A = [[1, 2, 3], [4, 5, 6]];
	   *    math.zeros(math.size(A));       // returns [[1, 1, 1], [1, 1, 1]]
	   *
	   * See also:
	   *
	   *    zeros, eye, size, range
	   *
	   * @param {...Number | Array} size    The size of each dimension of the matrix
	   * @return {Array | Matrix | Number}  A matrix filled with ones
	   */
	  math.ones = function ones (size) {
	    var args = collection.argsToArray(arguments);
	    var asMatrix = (size instanceof Matrix) ? true :
	        (isArray(size) ? false : (config.matrix === 'matrix'));

	    if (args.length == 0) {
	      // output an empty matrix
	      return asMatrix ? new Matrix() : [];
	    }
	    else {
	      // output an array or matrix

	      // convert arguments from bignumber to numbers if needed
	      var asBigNumber = false;
	      args = args.map(function (value) {
	        if (value instanceof BigNumber) {
	          asBigNumber = true;
	          return value.toNumber();
	        } else {
	          return value;
	        }
	      });

	      // resize the matrix
	      var res = [];
	      var defaultValue = asBigNumber ? new BigNumber(1) : 1;
	      res = array.resize(res, args, defaultValue);

	      return asMatrix ? new Matrix(res) : res;
	    }
	  };
	};


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isNumber = util.number.isNumber;

	  /**
	   * Create an array from a range.
	   * By default, the range end is excluded. This can be customized by providing
	   * an extra parameter `includeEnd`.
	   *
	   * Syntax:
	   *
	   *     math.range(str [, includeEnd])               // Create a range from a string,
	   *                                                  // where the string contains the
	   *                                                  // start, optional step, and end,
	   *                                                  // separated by a colon.
	   *     math.range(start, end [, includeEnd])        // Create a range with start and
	   *                                                  // end and a step size of 1.
	   *     math.range(start, end, step [, includeEnd])  // Create a range with start, step,
	   *                                                  // and end.
	   *
	   * Where:
	   *
	   * - `str: String`
	   *   A string 'start:end' or 'start:step:end'
	   * - `start: {Number | BigNumber}`
	   *   Start of the range
	   * - `end: Number | BigNumber`
	   *   End of the range, excluded by default, included when parameter includeEnd=true
	   * - `step: Number | BigNumber`
	   *   Step size. Default value is 1.
	   * - `includeEnd: boolean`
	   *   Option to specify whether to include the end or not. False by default.
	   *
	   * Examples:
	   *
	   *     math.range(2, 6);        // [2, 3, 4, 5]
	   *     math.range(2, -3, -1);   // [2, 1, 0, -1, -2]
	   *     math.range('2:1:6');     // [2, 3, 4, 5]
	   *     math.range(2, 6, true);  // [2, 3, 4, 5, 6]
	   *
	   * See also:
	   *
	   *     ones, zeros, size, subset
	   *
	   * @param {*} args   Parameters describing the ranges `start`, `end`, and optional `step`.
	   * @return {Array | Matrix} range
	   */
	  math.range = function range(args) {
	    var params = Array.prototype.slice.call(arguments),
	        start,
	        end,
	        step,
	        includeEnd = false;

	    // read the includeEnd parameter
	    if (isBoolean(params[params.length - 1])) {
	      includeEnd = params.pop() ? true : false;
	    }

	    switch (params.length) {
	      case 1:
	        // range(str)
	        // parse string into a range
	        if (isString(params[0])) {
	          var r = _parse(params[0]);
	          if (!r){
	            throw new SyntaxError('String "' + params[0] + '" is no valid range');
	          }

	          start = r.start;
	          end = r.end;
	          step = r.step;
	        }
	        else {
	          throw new TypeError('Two or three numbers or a single string expected in function range');
	        }
	        break;

	      case 2:
	        // range(str, end)
	        // range(start, end)
	        start = params[0];
	        end = params[1];
	        step = 1;
	        break;

	      case 3:
	        // range(start, end, step)
	        start = params[0];
	        end = params[1];
	        step = params[2];
	        break;

	      case 4:
	        throw new TypeError('Parameter includeEnd must be a boolean');

	      default:
	        throw new math.error.ArgumentsError('range', arguments.length, 2, 4);
	    }

	    // verify type of parameters
	    if (!isNumber(start) && !(start instanceof BigNumber)) {
	      throw new TypeError('Parameter start must be a number');
	    }
	    if (!isNumber(end) && !(end instanceof BigNumber)) {
	      throw new TypeError('Parameter end must be a number');
	    }
	    if (!isNumber(step) && !(step instanceof BigNumber)) {
	      throw new TypeError('Parameter step must be a number');
	    }

	    // go big
	    if (start instanceof BigNumber || end instanceof BigNumber || step instanceof BigNumber) {
	      // create a range with big numbers
	      var asBigNumber = true;

	      // convert start, end, step to BigNumber
	      if (!(start instanceof BigNumber)) start = BigNumber.convert(start);
	      if (!(end instanceof BigNumber))   end   = BigNumber.convert(end);
	      if (!(step instanceof BigNumber))  step  = BigNumber.convert(step);

	      if (!(start instanceof BigNumber) || !(end instanceof BigNumber) || !(step instanceof BigNumber)) {
	        // not all values can be converted to big number :(
	        // fall back to numbers
	        asBigNumber = false;
	        if (start instanceof BigNumber) start = start.toNumber();
	        if (end instanceof BigNumber)   end   = end.toNumber();
	        if (step instanceof BigNumber)  step  = step.toNumber();
	      }
	    }

	    // generate the range
	    var fn = asBigNumber ?
	        (includeEnd ? _bigRangeInc : _bigRange) :
	        (includeEnd ? _rangeInc    : _range);
	    var array = fn(start, end, step);

	    // return as array or matrix
	    return (config.matrix === 'array') ? array : new Matrix(array);
	  };

	  /**
	   * Create a range with numbers. End is excluded
	   * @param {Number} start
	   * @param {Number} end
	   * @param {Number} step
	   * @returns {Array} range
	   * @private
	   */
	  function _range (start, end, step) {
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

	    return array;
	  }

	  /**
	   * Create a range with numbers. End is included
	   * @param {Number} start
	   * @param {Number} end
	   * @param {Number} step
	   * @returns {Array} range
	   * @private
	   */
	  function _rangeInc (start, end, step) {
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
	  }

	  /**
	   * Create a range with big numbers. End is excluded
	   * @param {BigNumber} start
	   * @param {BigNumber} end
	   * @param {BigNumber} step
	   * @returns {Array} range
	   * @private
	   */
	  function _bigRange (start, end, step) {
	    var array = [],
	        x = start.clone(),
	        zero = new BigNumber(0);
	    if (step.gt(zero)) {
	      while (x.lt(end)) {
	        array.push(x);
	        x = x.plus(step);
	      }
	    }
	    else if (step.lt(zero)) {
	      while (x.gt(end)) {
	        array.push(x);
	        x = x.plus(step);
	      }
	    }

	    return array;
	  }

	  /**
	   * Create a range with big numbers. End is included
	   * @param {BigNumber} start
	   * @param {BigNumber} end
	   * @param {BigNumber} step
	   * @returns {Array} range
	   * @private
	   */
	  function _bigRangeInc (start, end, step) {
	    var array = [],
	        x = start.clone(),
	        zero = new BigNumber(0);
	    if (step.gt(zero)) {
	      while (x.lte(end)) {
	        array.push(x);
	        x = x.plus(step);
	      }
	    }
	    else if (step.lt(zero)) {
	      while (x.gte(end)) {
	        array.push(x);
	        x = x.plus(step);
	      }
	    }

	    return array;
	  }

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
	    var args = str.split(':'),
	        nums = null;

	    if (config.number === 'bignumber') {
	      // bignumber
	      try {
	        nums = args.map(function (arg) {
	          return new BigNumber(arg);
	        });
	      }
	      catch (err) {
	        return null;
	      }
	    }
	    else {
	      // number
	      nums = args.map(function (arg) {
	        // use Number and not parseFloat as Number returns NaN on invalid garbage in the string
	        return Number(arg);
	      });

	      var invalid = nums.some(function (num) {
	        return isNaN(num);
	      });
	      if(invalid) {
	        return null;
	      }
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


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),

	      array = util.array,
	      clone = util.object.clone,
	      string = util.string,
	      isString = util.string.isString,
	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger,
	      isArray = array.isArray;

	  /**
	   * Resize a matrix
	   *
	   * Syntax:
	   *
	   *     math.resize(x, size)
	   *     math.resize(x, size, defaultValue)
	   *
	   * Examples:
	   *
	   *     math.resize([1, 2, 3, 4, 5], [3]); // returns Array  [1, 2, 3]
	   *     math.resize([1, 2, 3], [5], 0);    // returns Array  [1, 2, 3, 0, 0]
	   *     math.resize(2, [2, 3], 0);         // returns Matrix [[2, 0, 0], [0, 0, 0]]
	   *     math.resize("hello", [8], "!");    // returns String 'hello!!!'
	   *
	   * See also:
	   *
	   *     size, squeeze, subset
	   *
	   * @param {* | Array | Matrix} x             Matrix to be resized
	   * @param {Array | Matrix} size              One dimensional array with numbers
	   * @param {Number | String} [defaultValue=0] Zero by default, except in
	   *                                           case of a string, in that case
	   *                                           defaultValue = ' '
	   * @return {* | Array | Matrix} A resized clone of matrix `x`
	   */
	  math.resize = function resize (x, size, defaultValue) {
	    if (arguments.length != 2 && arguments.length != 3) {
	      throw new math.error.ArgumentsError('resize', arguments.length, 2, 3);
	    }

	    var asMatrix = (x instanceof Matrix) ? true : isArray(x) ? false : (config.matrix !== 'array');

	    if (x instanceof Matrix) {
	      x = x.valueOf(); // get Array
	    }
	    if (size instanceof Matrix) {
	      size = size.valueOf(); // get Array
	    }

	    if (size.length && size[0] instanceof BigNumber) {
	      // convert bignumbers to numbers
	      size = size.map(function (value) {
	        return (value instanceof BigNumber) ? value.toNumber() : value;
	      });
	    }

	    if (isString(x)) {
	      return _resizeString(x, size, defaultValue);
	    }
	    else {
	      if (size.length == 0) {
	        // output a scalar
	        while (isArray(x)) {
	          x = x[0];
	        }

	        return clone(x);
	      }
	      else {
	        // output an array/matrix
	        if (!isArray(x)) {
	          x = [x];
	        }
	        x = clone(x);

	        var res = array.resize(x, size, defaultValue);
	        return asMatrix ? new Matrix(res) : res;
	      }
	    }
	  };

	  /**
	   * Resize a string
	   * @param {String} str
	   * @param {Number[]} size
	   * @param {string} [defaultChar=' ']
	   * @private
	   */
	  function _resizeString(str, size, defaultChar) {
	    if (defaultChar !== undefined) {
	      if (!isString(defaultChar) || defaultChar.length !== 1) {
	        throw new TypeError('Single character expected as defaultValue');
	      }
	    }
	    else {
	      defaultChar = ' ';
	    }

	    if (size.length !== 1) {
	      throw new math.error.DimensionError(size.length, 1);
	    }
	    var len = size[0];
	    if (!isNumber(len) || !isInteger(len)) {
	      throw new TypeError('Invalid size, must contain positive integers ' +
	          '(size: ' + string.format(size) + ')');
	    }

	    if (str.length > len) {
	      return str.substring(0, len);
	    }
	    else if (str.length < len) {
	      var res = str;
	      for (var i = 0, ii = len - str.length; i < ii; i++) {
	        res += defaultChar;
	      }
	      return res;
	    }
	    else {
	      return str;
	    }
	  }
	};


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      Matrix = __webpack_require__(9),

	      array = util.array,
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit;

	  /**
	   * Calculate the size of a matrix or scalar.
	   *
	   * Syntax:
	   *
	   *     math.size(x)
	   *
	   * Examples:
	   *
	   *     math.size(2.3);                  // returns []
	   *     math.size('hello world');        // returns [11]
	   *
	   *     var A = [[1, 2, 3], [4, 5, 6]];
	   *     math.size(A);                    // returns [2, 3]
	   *     math.size(math.range(1,6));      // returns [5]
	   *
	   * See also:
	   *
	   *     resize, squeeze, subset
	   *
	   * @param {Boolean | Number | Complex | Unit | String | Array | Matrix} x  A matrix
	   * @return {Array | Matrix} A vector with size of `x`.
	   */
	  math.size = function size (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('size', arguments.length, 1);
	    }

	    var asArray = (config.matrix === 'array');

	    if (isNumber(x) || isComplex(x) || isUnit(x) || isBoolean(x) ||
	        x == null || x instanceof BigNumber) {
	      return asArray ? [] : new Matrix([]);
	    }

	    if (isString(x)) {
	      return asArray ? [x.length] : new Matrix([x.length]);
	    }

	    if (Array.isArray(x)) {
	      return array.size(x);
	    }

	    if (x instanceof Matrix) {
	      return new Matrix(x.size());
	    }

	    throw new math.error.UnsupportedTypeError('size', math['typeof'](x));
	  };
	};


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),

	      object = util.object,
	      array = util.array,
	      isArray = Array.isArray;

	  /**
	   * Squeeze a matrix, remove inner and outer singleton dimensions from a matrix.
	   *
	   * Syntax:
	   *
	   *     math.squeeze(x)
	   *
	   * Examples:
	   *
	   *     math.squeeze([3]);           // returns 3
	   *     math.squeeze([[3]]);         // returns 3
	   *
	   *     var A = math.zeros(3, 1);    // returns [[0], [0], [0]] (size 3x1)
	   *     math.squeeze(A);             // returns [0, 0, 0] (size 3)
	   *
	   *     var B = math.zeros(1, 3);    // returns [[0, 0, 0]] (size 1x3)
	   *     math.squeeze(B);             // returns [0, 0, 0] (size 3)
	   *
	   *     // only inner and outer dimensions are removed
	   *     var C = math.zeros(2, 1, 3); // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
	   *     math.squeeze(C);             // returns [[[0, 0, 0]], [[0, 0, 0]]] (size 2x1x3)
	   *
	   * See also:
	   *
	   *     subset
	   *
	   * @param {Matrix | Array} x      Matrix to be squeezed
	   * @return {Matrix | Array} Squeezed matrix
	   */
	  math.squeeze = function squeeze (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('squeeze', arguments.length, 1);
	    }

	    if (isArray(x)) {
	      return array.squeeze(object.clone(x));
	    }
	    else if (x instanceof Matrix) {
	      var res = array.squeeze(x.toArray());
	      return isArray(res) ? new Matrix(res) : res;
	    }
	    else {
	      // scalar
	      return object.clone(x);
	    }
	  };
	};


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),
	      Index = __webpack_require__(8),

	      array = util.array,
	      isString = util.string.isString,
	      isArray = Array.isArray;

	  /**
	   * Get or set a subset of a matrix or string.
	   *
	   * Syntax:
	   *     math.subset(value, index)                                // retrieve a subset
	   *     math.subset(value, index, replacement [, defaultValue])  // replace a subset
	   *
	   * Examples:
	   *
	   *     // get a subset
	   *     var d = [[1, 2], [3, 4]];
	   *     math.subset(d, math.index(1, 0));        // returns 3
	   *     math.subset(d, math.index([0, 2], 1));   // returns [[2], [4]]
	   *
	   *     // replace a subset
	   *     var e = [];
	   *     var f = math.subset(e, math.index(0, [0, 2]), [5, 6]);  // f = [[5, 6]]
	   *     var g = math.subset(f, math.index(1, 1), 7, 0);         // g = [[5, 6], [0, 7]]
	   *
	   * See also:
	   *
	   *     size, resize, squeeze, index
	   *
	   * @param {Array | Matrix | String} matrix  An array, matrix, or string
	   * @param {Index} index                     An index containing ranges for each
	   *                                          dimension
	   * @param {*} [replacement]                 An array, matrix, or scalar.
	   *                                          If provided, the subset is replaced with replacement.
	   *                                          If not provided, the subset is returned
	   * @param {*} [defaultValue=undefined]      Default value, filled in on new entries when
	   *                                          the matrix is resized. If not provided,
	   *                                          new matrix elements will be left undefined.
	   * @return {Array | Matrix | String} Either the retrieved subset or the updated matrix.
	   */
	  math.subset = function subset (matrix, index, replacement, defaultValue) {
	    switch (arguments.length) {
	      case 2: // get subset
	        return _getSubset(arguments[0], arguments[1]);

	      // intentional fall through
	      case 3: // set subset
	      case 4: // set subset with default value
	        return _setSubset(arguments[0], arguments[1], arguments[2], arguments[3]);

	      default: // wrong number of arguments
	        throw new math.error.ArgumentsError('subset', arguments.length, 2, 4);
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
	      subset = m.subset(index);           // returns a Matrix
	      return subset && subset.valueOf();  // return an Array (like the input)
	    }
	    else if (value instanceof Matrix) {
	      return value.subset(index);
	    }
	    else if (isString(value)) {
	      return _getSubstring(value, index);
	    }
	    else {
	      throw new math.error.UnsupportedTypeError('subset', math['typeof'](value));
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
	      throw new math.error.DimensionError(index.size().length, 1);
	    }

	    // validate whether the range is out of range
	    var strLen = str.length;
	    array.validateIndex(index.min()[0], strLen);
	    array.validateIndex(index.max()[0], strLen);

	    var range = index.range(0);

	    var substr = '';
	    range.forEach(function (v) {
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
	   * @param {*} [defaultValue=0]      Default value, filled in on new entries when
	   *                                  the matrix is resized. If not provided,
	   *                                  new matrix elements will be filled with zeros.
	   * @returns {*} result
	   * @private
	   */
	  function _setSubset(value, index, replacement, defaultValue) {
	    var m;

	    if (isArray(value)) {
	      m = new Matrix(math.clone(value));
	      m.subset(index, replacement, defaultValue);
	      return m.valueOf();
	    }
	    else if (value instanceof Matrix) {
	      return value.clone().subset(index, replacement, defaultValue);
	    }
	    else if (isString(value)) {
	      return _setSubstring(value, index, replacement, defaultValue);
	    }
	    else {
	      throw new math.error.UnsupportedTypeError('subset', math['typeof'](value));
	    }
	  }

	  /**
	   * Replace a substring in a string
	   * @param {String} str            String to be replaced
	   * @param {Index} index           An index containing ranges for each dimension
	   * @param {String} replacement    Replacement string
	   * @param {String} [defaultValue] Default value to be uses when resizing
	   *                                the string. is ' ' by default
	   * @returns {string} result
	   * @private
	   */
	  function _setSubstring(str, index, replacement, defaultValue) {
	    if (!(index instanceof Index)) {
	      // TODO: better error message
	      throw new TypeError('Index expected');
	    }
	    if (index.size().length != 1) {
	      throw new math.error.DimensionError(index.size().length, 1);
	    }
	    if (defaultValue !== undefined) {
	      if (!isString(defaultValue) || defaultValue.length !== 1) {
	        throw new TypeError('Single character expected as defaultValue');
	      }
	    }
	    else {
	      defaultValue = ' ';
	    }

	    var range = index.range(0);
	    var len = range.size()[0];

	    if (len != replacement.length) {
	      throw new math.error.DimensionError(range.size()[0], replacement.length);
	    }

	    // validate whether the range is out of range
	    var strLen = str.length;
	    array.validateIndex(index.min()[0]);
	    array.validateIndex(index.max()[0]);

	    // copy the string into an array with characters
	    var chars = [];
	    for (var i = 0; i < strLen; i++) {
	      chars[i] = str.charAt(i);
	    }

	    range.forEach(function (v, i) {
	      chars[v] = replacement.charAt(i);
	    });

	    // initialize undefined characters with a space
	    if (chars.length > strLen) {
	      for (i = strLen - 1, len = chars.length; i < len; i++) {
	        if (!chars[i]) {
	          chars[i] = defaultValue;
	        }
	      }
	    }

	    return chars.join('');
	  }
	};


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Matrix = __webpack_require__(9),

	      object = util.object,
	      string = util.string;

	  /**
	   * Transpose a matrix. All values of the matrix are reflected over its
	   * main diagonal. Only two dimensional matrices are supported.
	   *
	   * Syntax:
	   *
	   *     math.transpose(x)
	   *
	   * Examples:
	   *
	   *     var A = [[1, 2, 3], [4, 5, 6]];
	   *     math.transpose(A);               // returns [[1, 4], [2, 5], [3, 6]]
	   *
	   * See also:
	   *
	   *     diag, inv, subset, squeeze
	   *
	   * @param {Array | Matrix} x  Matrix to be transposed
	   * @return {Array | Matrix}   The transposed matrix
	   */
	  math.transpose = function transpose (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('transpose', arguments.length, 1);
	    }

	    var size = math.size(x).valueOf();
	    switch (size.length) {
	      case 0:
	        // scalar
	        return object.clone(x);

	      case 1:
	        // vector
	        return object.clone(x);

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

	        return asMatrix ? new Matrix(transposed) : transposed;

	      default:
	        // multi dimensional array
	        throw new RangeError('Matrix must be two dimensional ' +
	            '(size: ' + string.format(size) + ')');
	    }
	  };
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      array = util.array,
	      isArray = Array.isArray;

	  /**
	   * Create a matrix filled with zeros. The created matrix can have one or
	   * multiple dimensions.
	   *
	   * Syntax:
	   *
	   *    math.zeros(m)
	   *    math.zeros(m, n)
	   *    math.zeros([m, n])
	   *    math.zeros([m, n, p, ...])
	   *
	   * Examples:
	   *
	   *    math.zeros(3);                  // returns [0, 0, 0]
	   *    math.zeros(3, 2);               // returns [[0, 0], [0, 0], [0, 0]]
	   *
	   *    var A = [[1, 2, 3], [4, 5, 6]];
	   *    math.zeros(math.size(A));       // returns [[0, 0, 0], [0, 0, 0]]
	   *
	   * See also:
	   *
	   *    ones, eye, size, range
	   *
	   * @param {...Number | Array} size    The size of each dimension of the matrix
	   * @return {Array | Matrix | Number}  A matrix filled with zeros
	   */
	  math.zeros = function zeros (size) {
	    var args = collection.argsToArray(arguments);
	    var asMatrix = (size instanceof Matrix) ? true :
	        (isArray(size) ? false : (config.matrix === 'matrix'));

	    if (args.length == 0) {
	      // output an empty matrix
	      return asMatrix ? new Matrix() : [];
	    }
	    else {
	      // output an array or matrix

	      // convert arguments from bignumber to numbers if needed
	      var asBigNumber = false;
	      args = args.map(function (value) {
	        if (value instanceof BigNumber) {
	          asBigNumber = true;
	          return value.toNumber();
	        } else {
	          return value;
	        }
	      });

	      // resize the matrix
	      var res = [];
	      var defaultValue = asBigNumber ? new BigNumber(0) : 0;
	      res = array.resize(res, args, defaultValue);

	      return asMatrix ? new Matrix(res) : res;
	    }
	  };
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isInteger = util.number.isInteger,
	      isCollection = collection.isCollection;

	  /**
	   * Compute the factorial of a value
	   *
	   * Factorial only supports an integer value as argument.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.factorial(n)
	   *
	   * Examples:
	   *
	   *    math.factorial(5);    // returns 120
	   *    math.factorial(3);    // returns 6
	   *
	   * See also:
	   *
	   *    combinations, gamma, permutations
	   *
	   * @param {Number | BigNumber | Array | Matrix | Boolean | null} n   An integer number
	   * @return {Number | BigNumber | Array | Matrix}    The factorial of `n`
	   */
	  math.factorial = function factorial (n) {
	    var value, res;

	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('factorial', arguments.length, 1);
	    }

	    if (isNumber(n)) {
	      return math.gamma(n + 1);
	    }

	    if (n instanceof BigNumber) {
	      if (!(isPositiveInteger(n)) && n.isFinite()) {
	        return math.gamma(n.plus(1));
	      }

	      if (!n.isFinite()) {
	        return new BigNumber(n);
	      }

	      n = n.toNumber();
	      if (n < fac.length) {
	        return (n < 21)
	          ? new BigNumber(fac[n])
	          : fac[n];
	      }

	      var one = new BigNumber(1);
	      value = new BigNumber(fac.length);
	      res = fac[fac.length - 1];
	      for (var i = fac.length; i < n; ++i) {
	        res = res.times(value);
	        value = value.plus(one);
	        fac[i] = res;
	      }

	      return fac[n] = res.times(value);
	    }

	    if (isBoolean(n) || n === null) {
	      return 1;           // factorial(1) = 1, factorial(0) = 1
	    }

	    if (isCollection(n)) {
	      return collection.deepMap(n, factorial);
	    }

	    throw new math.error.UnsupportedTypeError('factorial', math['typeof'](n));
	  };

	  /**
	   * Test whether BigNumber n is a positive integer
	   * @param {BigNumber} n
	   * @returns {boolean} isPositiveInteger
	   */
	  var isPositiveInteger = function(n) {
	    return n.isInteger() && (!n.isNegative() || n.isZero());
	  };

	  // 0-21! values
	  var fac = [
	    1,
	    1,
	    2,
	    6,
	    24,
	    120,
	    720,
	    5040,
	    40320,
	    362880,
	    3628800,
	    39916800,
	    479001600,
	    6227020800,
	    87178291200,
	    1307674368000,
	    20922789888000,
	    355687428096000,
	    6402373705728000,
	    121645100408832000,
	    2432902008176640000,
	    new BigNumber('51090942171709440000')
	  ]
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger,
	      isCollection = collection.isCollection;

	  /**
	   * Compute the gamma function of a value using Lanczos approximation for
	   * small values, and an extended Stirling approximation for large values.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.gamma(n)
	   *
	   * Examples:
	   *
	   *    math.gamma(5);       // returns 24
	   *    math.gamma(-0.5);    // returns -3.5449077018110335
	   *    math.gamma(math.i);  // returns -0.15494982830180973 - 0.49801566811835596i
	   *
	   * See also:
	   *
	   *    combinations, factorial, permutations
	   *
	   * @param {Number | Array | Matrix | Boolean | null} n   An integer number
	   * @return {Number | Array | Matrix}    The gamma of `n`
	   */
	  math.gamma = function gamma (n) {
	    var t, x;
	    var g = 4.7421875;

	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('gamma', arguments.length, 1);
	    }

	    if (isNumber(n)) {
	      if (isInteger(n)) {
	        if (n <= 0) {
	          return isFinite(n)
	            ? Infinity
	            : NaN;
	        }

	        if (n > 171) {
	          return Infinity;                  // Will overflow
	        }

	        var value = n - 2;
	        var res = n - 1;
	        while (value > 1) {
	          res *= value;
	          value--;
	        }

	        if (res == 0) {
	          res = 1;                          // 0! is per definition 1
	        }

	        return res;
	      }

	      if (n < 0.5) {
	        return Math.PI / (Math.sin(Math.PI*n) * gamma(1-n));
	      }

	      if (n >= 171.35) {
	        return Infinity;                    // will overflow
	      }

	      if (n > 85.0) {                       // Extended Stirling Approx
	        var twoN = n*n;
	        var threeN = twoN*n;
	        var fourN = threeN*n;
	        var fiveN = fourN*n;
	        return Math.sqrt(2*Math.PI/n) * Math.pow((n/Math.E), n) *
	          (1 + 1/(12*n) + 1/(288*twoN) - 139/(51840*threeN) -
	           571/(2488320*fourN) + 163879/(209018880*fiveN) +
	           5246819/(75246796800*fiveN*n));
	      }

	      --n;
	      x = p[0];
	      for (var i = 1; i < p.length; ++i) {
	        x += p[i] / (n+i);
	      }

	      t = n + g + 0.5;
	      return Math.sqrt(2*Math.PI) * Math.pow(t, n+0.5) * Math.exp(-t) * x;
	    }

	    if (isComplex(n)) {
	      if (n.im == 0) {
	        return gamma(n.re);
	      }

	      n = new Complex(n.re - 1, n.im);
	      x = new Complex(p[0], 0);
	      for (var i = 1; i < p.length; ++i) {
	        var real = n.re + i;                // x += p[i]/(n+i)
	        var den = real*real + n.im*n.im;
	        if (den != 0) {
	          x.re += p[i] * real / den;
	          x.im += -(p[i] * n.im) / den;
	        } else {
	          x.re = p[i] < 0
	            ? -Infinity
	            :  Infinity;
	        }
	      }

	      t = new Complex(n.re + g + 0.5, n.im);
	      var twoPiSqrt = Math.sqrt(2*Math.PI);

	      n.re += 0.5;
	      var result = math.pow(t, n);
	      if (result.im == 0) {                 // sqrt(2*PI)*result
	        result.re *= twoPiSqrt;
	      } else if (result.re == 0) {
	        result.im *= twoPiSqrt;
	      } else {
	        result.re *= twoPiSqrt;
	        result.im *= twoPiSqrt;
	      }

	      var r = Math.exp(-t.re);              // exp(-t)
	      t.re = r * Math.cos(-t.im);
	      t.im = r * Math.sin(-t.im);

	      return math.multiply(math.multiply(result, t), x);
	    }

	    if (n instanceof BigNumber) {
	      if (n.isInteger()) {
	        return n.isNegative() || n.isZero()
	          ? new BigNumber(Infinity)
	          : math.factorial(n.minus(1));
	      }

	      if (!n.isFinite()) {
	        return new BigNumber(n.isNegative()
	          ? NaN
	          : Infinity);
	      }
	    }

	    if (isBoolean(n) || n === null) {
	      return n
	        ? 1
	        : Infinity;
	    }

	    if (isCollection(n)) {
	      return collection.deepMap(n, gamma);
	    }

	    throw new math.error.UnsupportedTypeError('gamma', math['typeof'](n));
	  };

	  var p = [
	     0.99999999999999709182,
	     57.156235665862923517,
	    -59.597960355475491248,
	     14.136097974741747174,
	    -0.49191381609762019978,
	     0.33994649984811888699e-4,
	     0.46523628927048575665e-4,
	    -0.98374475304879564677e-4,
	     0.15808870322491248884e-3,
	    -0.21026444172410488319e-3,
	     0.21743961811521264320e-3,
	    -0.16431810653676389022e-3,
	     0.84418223983852743293e-4,
	    -0.26190838401581408670e-4,
	     0.36899182659531622704e-5
	  ];

	};


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var distribution = __webpack_require__(194)(math);

	  /**
	   * Return a random number larger or equal to `min` and smaller than `max`
	   * using a uniform distribution.
	   *
	   * Syntax:
	   *
	   *     math.random()                // generate a random number between 0 and 1
	   *     math.random(max)             // generate a random number between 0 and max
	   *     math.random(min, max)        // generate a random number between min and max
	   *     math.random(size)            // generate a matrix with random numbers between 0 and 1
	   *     math.random(size, max)       // generate a matrix with random numbers between 0 and max
	   *     math.random(size, min, max)  // generate a matrix with random numbers between min and max
	   *
	   * Examples:
	   *
	   *     math.random();       // returns a random number between 0 and 1
	   *     math.random(100);    // returns a random number between 0 and 100
	   *     math.random(30, 40); // returns a random number between 30 and 40
	   *     math.random([2, 3]); // returns a 2x3 matrix with random numbers between 0 and 1
	   *
	   * See also:
	   *
	   *     randomInt, pickRandom
	   *
	   * @param {Array | Matrix} [size] If provided, an array or matrix with given
	   *                                size and filled with random values is returned
	   * @param {Number} [min]  Minimum boundary for the random value, included
	   * @param {Number} [max]  Maximum boundary for the random value, excluded
	   * @return {Number | Array | Matrix} A random number
	   */
	  math.random = distribution('uniform').random;
	};


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var distribution = __webpack_require__(194)(math);

	  /**
	   * Return a random integer number larger or equal to `min` and smaller than `max`
	   * using a uniform distribution.
	   *
	   * Syntax:
	   *
	   *     math.randomInt()                // generate a random integer between 0 and 1
	   *     math.randomInt(max)             // generate a random integer between 0 and max
	   *     math.randomInt(min, max)        // generate a random integer between min and max
	   *     math.randomInt(size)            // generate a matrix with random integer between 0 and 1
	   *     math.randomInt(size, max)       // generate a matrix with random integer between 0 and max
	   *     math.randomInt(size, min, max)  // generate a matrix with random integer between min and max
	   *
	   * Examples:
	   *
	   *     math.randomInt();       // returns a random integer between 0 and 1
	   *     math.randomInt(100);    // returns a random integer between 0 and 100
	   *     math.randomInt(30, 40); // returns a random integer between 30 and 40
	   *     math.randomInt([2, 3]); // returns a 2x3 matrix with random integers between 0 and 1
	   *
	   * See also:
	   *
	   *     random, pickRandom
	   *
	   * @param {Array | Matrix} [size] If provided, an array or matrix with given
	   *                                size and filled with random values is returned
	   * @param {Number} [min]  Minimum boundary for the random value, included
	   * @param {Number} [max]  Maximum boundary for the random value, excluded
	   * @return {Number | Array | Matrix} A random integer value
	   */
	  math.randomInt = distribution('uniform').randomInt;
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var distribution = __webpack_require__(194)(math);

	  /**
	   * Random pick a value from a one dimensional array.
	   * Array element is picked using a random function with uniform distribution.
	   *
	   * Syntax:
	   *
	   *     math.pickRandom(array)
	   *
	   * Examples:
	   *
	   *     math.pickRandom([3, 6, 12, 2]);       // returns one of the values in the array
	   *
	   * See also:
	   *
	   *     random, randomInt
	   *
	   * @param {Array} array     A one dimensional array
	   * @return {Number} One of the elements of the provided input array
	   */
	  math.pickRandom = distribution('uniform').pickRandom;
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,

	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger;

	  /**
	   * Compute the number of ways of obtaining an ordered subset of `k` elements
	   * from a set of `n` elements.
	   *
	   * Permutations only takes integer arguments.
	   * The following condition must be enforced: k <= n.
	   *
	   * Syntax:
	   *
	   *     math.permutations(n)
	   *     math.permutations(n, k)
	   *
	   * Examples:
	   *
	   *    math.permutations(5);     // 120
	   *    math.permutations(5, 3);  // 60
	   *
	   * See also:
	   *
	   *    combinations, factorial
	   *
	   * @param {Number | BigNumber} n  The number of objects in total
	   * @param {Number | BigNumber} k  The number of objects in the subset
	   * @return {Number | BigNumber}   The number of permutations
	   */
	  math.permutations = function permutations (n, k) {
	    var result, i;

	    var arity = arguments.length;
	    if (arity > 2) {
	      throw new math.error.ArgumentsError('permutations', arguments.length, 2);
	    }

	    if (isNumber(n)) {
	      if (!isInteger(n) || n < 0) {
	        throw new TypeError('Positive integer value expected in function permutations');
	      }
	      
	      // Permute n objects
	      if (arity == 1) {
	        return math.factorial(n);
	      }
	      
	      // Permute n objects, k at a time
	      if (arity == 2) {
	        if (isNumber(k)) {
	          if (!isInteger(k) || k < 0) {
	            throw new TypeError('Positive integer value expected in function permutations');
	          }
	          if (k > n) {
	            throw new TypeError('second argument k must be less than or equal to first argument n');
	          }

	          result = 1;
	          for (i = n - k + 1; i <= n; i++) {
	            result = result * i;
	          }
	          return result;
	        }
	      }
	    }

	    if (n instanceof BigNumber) {
	      if (k === undefined && isPositiveInteger(n)) {
	        return math.factorial(n);
	      }

	      // make sure k is a BigNumber as well
	      // not all numbers can be converted to BigNumber
	      k = BigNumber.convert(k);

	      if (!(k instanceof BigNumber) || !isPositiveInteger(n) || !isPositiveInteger(k)) {
	        throw new TypeError('Positive integer value expected in function permutations');
	      }
	      if (k.gt(n)) {
	        throw new TypeError('second argument k must be less than or equal to first argument n');
	      }

	      result = new BigNumber(1);
	      for (i = n.minus(k).plus(1); i.lte(n); i = i.plus(1)) {
	        result = result.times(i);
	      }
	      return result;
	    }

	    throw new math.error.UnsupportedTypeError('permutations', math['typeof'](n));
	  };

	  /**
	   * Test whether BigNumber n is a positive integer
	   * @param {BigNumber} n
	   * @returns {boolean} isPositiveInteger
	   */
	  var isPositiveInteger = function(n) {
	    return n.isInteger() && n.gte(0);
	  };
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isInteger = util.number.isInteger;

	  /**
	   * Compute the number of ways of picking `k` unordered outcomes from `n`
	   * possibilities.
	   *
	   * Combinations only takes integer arguments.
	   * The following condition must be enforced: k <= n.
	   *
	   * Syntax:
	   *
	   *     math.combinations(n, k)
	   *
	   * Examples:
	   *
	   *    math.combinations(7, 5); // returns 21
	   *
	   * See also:
	   *
	   *    permutations, factorial
	   *
	   * @param {Number | BigNumber} n    Total number of objects in the set
	   * @param {Number | BigNumber} k    Number of objects in the subset
	   * @return {Number | BigNumber}     Number of possible combinations.
	   */
	  math.combinations = function combinations (n, k) {
	    var max, result, i,ii;

	    var arity = arguments.length;
	    if (arity != 2) {
	      throw new math.error.ArgumentsError('combinations', arguments.length, 2);
	    }

	    if (isNumber(n)) {
	      if (!isInteger(n) || n < 0) {
	        throw new TypeError('Positive integer value enpected in function combinations');
	      }
	      if (k > n) {
	        throw new TypeError('k must be less than or equal to n');
	      }

	      max = Math.max(k, n - k);
	      result = 1;
	      for (i = 1; i <= n - max; i++) {
	        result = result * (max + i) / i;
	      }
	      return result;
	    }

	    if (n instanceof BigNumber) {
	      // make sure k is a BigNumber as well
	      // not all numbers can be converted to BigNumber
	      k = BigNumber.convert(k);

	      if (!(k instanceof BigNumber) || !isPositiveInteger(n) || !isPositiveInteger(k)) {
	        throw new TypeError('Positive integer value expected in function combinations');
	      }
	      if (k.gt(n)) {
	        throw new TypeError('k must be less than n in function combinations');
	      }

	      max = n.minus(k);
	      if (k.lt(max)) max = k;
	      result = new BigNumber(1);
	      for (i = new BigNumber(1), ii = n.minus(max); i.lte(ii); i = i.plus(1)) {
	        result = result.times(max.plus(i)).dividedBy(i);
	      }
	      return result;
	    }

	    throw new math.error.UnsupportedTypeError('combinations', math['typeof'](n));
	  };

	  /**
	   * Test whether BigNumber n is a positive integer
	   * @param {BigNumber} n
	   * @returns {boolean} isPositiveInteger
	   */
	  var isPositiveInteger = function(n) {
	    return n.isInteger() && n.gte(0);
	  };
	};


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
	   *
	   * x and y are considered equal when the relative difference between x and y
	   * is smaller than the configured epsilon. The function cannot be used to
	   * compare values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.compare(x, y)
	   *
	   * Examples:
	   *
	   *    math.compare(6, 1);           // returns 1
	   *    math.compare(2, 3);           // returns -1
	   *    math.compare(7, 7);           // returns 0
	   *
	   *    var a = math.unit('5 cm');
	   *    var b = math.unit('40 mm');
	   *    math.compare(a, b);           // returns 1
	   *
	   *    math.compare(2, [1, 2, 3]);   // returns [1, 0, -1]
	   *
	   * See also:
	   *
	   *    equal, unequal, smaller, smallerEq, larger, largerEq
	   *
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
	   * @return {Number | BigNumber | Array | Matrix} Returns the result of the comparison: 1, 0 or -1.
	   */
	  math.compare = function compare(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('compare', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      return nearlyEqual(x, y, config.epsilon) ? 0 : (x > y ? 1 : -1);
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return new BigNumber(x.cmp(y));
	      }

	      // downgrade to Number
	      return compare(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return new BigNumber(x.cmp(y));
	      }

	      // downgrade to Number
	      return compare(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return (x.value > y.value) ? 1 : ((x.value < y.value) ? -1 : 0);
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, compare);
	    }

	    // Note: test strings after testing collections,
	    // else we can't compare a string with a matrix
	    if (isString(x) || isString(y)) {
	      return (x > y) ? 1 : ((x < y) ? -1 : 0);
	    }

	    if (isBoolean(x) || x === null) {
	      return compare(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return compare(x, +y);
	    }

	    if (isComplex(x) || isComplex(y)) {
	      throw new TypeError('No ordering relation is defined for complex numbers');
	    }

	    throw new math.error.UnsupportedTypeError('compare', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isArray = Array.isArray;

	  /**
	   * Test element wise whether two matrices are equal.
	   * The function accepts both matrices and scalar values.
	   *
	   * Syntax:
	   *
	   *    math.deepEqual(x, y)
	   *
	   * Examples:
	   *
	   *    math.deepEqual(2, 4);   // returns false
	   *
	   *    a = [2, 5, 1];
	   *    b = [2, 7, 1];
	   *
	   *    math.deepEqual(a, b);   // returns false
	   *    math.equal(a, b);       // returns [true, false, true]
	   *
	   * See also:
	   *
	   *    equal, unequal
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First matrix to compare
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second matrix to compare
	   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
	   *            Returns true when the input matrices have the same size and each of their elements is equal.
	   */
	  math.deepEqual = function deepEqual(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('deepEqual', arguments.length, 2);
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return _deepEqual(x.valueOf(), y.valueOf());
	    }

	    return math.equal(x, y);
	  };

	  /**
	   * Test whether two arrays have the same size and all elements are equal
	   * @param {Array | *} x
	   * @param {Array | *} y
	   * @return {boolean} Returns true if both arrays are deep equal
	   */
	  function _deepEqual(x, y) {
	    if (isArray(x)) {
	      if (isArray(y)) {
	        var len = x.length;
	        if (len !== y.length) return false;

	        for (var i = 0; i < len; i++) {
	          if (!_deepEqual(x[i], y[i])) return false;
	        }

	        return true;
	      }
	      else {
	        return false;
	      }
	    }
	    else {
	      if (isArray(y)) {
	        return false;
	      }
	      else {
	        return math.equal(x, y);
	      }
	    }
	  }
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether two values are equal.
	   *
	   * The function tests whether the relative difference between x and y is
	   * smaller than the configured epsilon. The function cannot be used to
	   * compare values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
	   *
	   * Values `null` and `undefined` are compared strictly, thus `null` is only
	   * equal to `null` and nothing else, and `undefined` is only equal to
	   * `undefined` and nothing else.
	   *
	   * Syntax:
	   *
	   *    math.equal(x, y)
	   *
	   * Examples:
	   *
	   *    math.equal(2 + 2, 3);         // returns false
	   *    math.equal(2 + 2, 4);         // returns true
	   *
	   *    var a = math.unit('50 cm');
	   *    var b = math.unit('5 m');
	   *    math.equal(a, b);             // returns true
	   *
	   *    var c = [2, 5, 1];
	   *    var d = [2, 7, 1];
	   *
	   *    math.equal(c, d);             // returns [true, false, true]
	   *    math.deepEqual(c, d);         // returns false
	   *
	   *    math.equal(0, null);          // returns false
	   *
	   * See also:
	   *
	   *    unequal, smaller, smallerEq, larger, largerEq, compare, deepEqual
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
	   */
	  math.equal = function equal(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('equal', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        return nearlyEqual(x, y, config.epsilon);
	      }
	      else if (isComplex(y)) {
	        return nearlyEqual(x, y.re, config.epsilon) && nearlyEqual(y.im, 0, config.epsilon);
	      }
	    }

	    if (isComplex(x)) {
	      if (isNumber(y)) {
	        return nearlyEqual(x.re, y, config.epsilon) && nearlyEqual(x.im, 0, config.epsilon);
	      }
	      else if (isComplex(y)) {
	        return nearlyEqual(x.re, y.re, config.epsilon) && nearlyEqual(x.im, y.im, config.epsilon);
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y)) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.eq(y);
	      }

	      // downgrade to Number
	      return equal(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x)) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.eq(y);
	      }

	      // downgrade to Number
	      return equal(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value == y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, equal);
	    }

	    // Note: test strings after testing collections,
	    // else we can accidentally compare a stringified array with a string
	    if (isString(x) || isString(y)) {
	      return x == y;
	    }

	    if (isBoolean(x)) {
	      return equal(+x, y);
	    }
	    if (isBoolean(y)) {
	      return equal(x, +y);
	    }

	    if (x === null) {
	      return y === null;
	    }
	    if (y === null) {
	      return x === null;
	    }

	    if (x === undefined) {
	      return y === undefined;
	    }
	    if (y === undefined) {
	      return x === undefined;
	    }

	    throw new math.error.UnsupportedTypeError('equal', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether value x is larger than y.
	   *
	   * The function returns true when x is larger than y and the relative
	   * difference between x and y is larger than the configured epsilon. The
	   * function cannot be used to compare values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.larger(x, y)
	   *
	   * Examples:
	   *
	   *    math.larger(2, 3);             // returns false
	   *    math.larger(5, 2 + 2);         // returns true
	   *
	   *    var a = math.unit('5 cm');
	   *    var b = math.unit('2 inch');
	   *    math.larger(a, b);             // returns false
	   *
	   * See also:
	   *
	   *    equal, unequal, smaller, smallerEq, largerEq, compare
	   *
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
	   */
	  math.larger = function larger(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('larger', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      return !nearlyEqual(x, y, config.epsilon) && x > y;
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.gt(y);
	      }

	      // downgrade to Number
	      return larger(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.gt(y)
	      }

	      // downgrade to Number
	      return larger(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value > y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, larger);
	    }

	    // Note: test strings after testing collections,
	    // else we can't compare a string with a matrix
	    if (isString(x) || isString(y)) {
	      return x > y;
	    }

	    if (isBoolean(x) || x === null) {
	      return larger(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return larger(x, +y);
	    }

	    if (isComplex(x) || isComplex(y)) {
	      throw new TypeError('No ordering relation is defined for complex numbers');
	    }

	    throw new math.error.UnsupportedTypeError('larger', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether value x is larger or equal to y.
	   *
	   * The function returns true when x is larger than y or the relative
	   * difference between x and y is smaller than the configured epsilon. The
	   * function cannot be used to compare values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.largerEq(x, y)
	   *
	   * Examples:
	   *
	   *    math.larger(2, 1 + 1);         // returns false
	   *    math.largerEq(2, 1 + 1);       // returns true
	   *
	   * See also:
	   *
	   *    equal, unequal, smaller, smallerEq, larger, compare
	   *
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the x is larger or equal to y, else returns false
	   */
	  math.largerEq = function largerEq(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('largerEq', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      return nearlyEqual(x, y, config.epsilon) || x > y;
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.gte(y);
	      }

	      // downgrade to Number
	      return largerEq(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.gte(y)
	      }

	      // downgrade to Number
	      return largerEq(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value >= y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, largerEq);
	    }

	    // Note: test strings after testing collections,
	    // else we can't compare a string with a matrix
	    if (isString(x) || isString(y)) {
	      return x >= y;
	    }

	    if (isBoolean(x) || x === null) {
	      return largerEq(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return largerEq(x, +y);
	    }

	    if (isComplex(x) || isComplex(y)) {
	      throw new TypeError('No ordering relation is defined for complex numbers');
	    }

	    throw new math.error.UnsupportedTypeError('largerEq', math['typeof'](x), math['typeof'](y));
	  };

	  // TODO: deprecated since version 0.23.0, cleanup some day
	  math.largereq = function () {
	    throw new Error('Function largereq is renamed to largerEq');
	  }
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether value x is smaller than y.
	   *
	   * The function returns true when x is smaller than y and the relative
	   * difference between x and y is larger than the configured epsilon. The
	   * function cannot be used to compare values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.smaller(x, y)
	   *
	   * Examples:
	   *
	   *    math.smaller(2, 3);            // returns true
	   *    math.smaller(5, 2 * 2);        // returns false
	   *
	   *    var a = math.unit('5 cm');
	   *    var b = math.unit('2 inch');
	   *    math.smaller(a, b);            // returns true
	   *
	   * See also:
	   *
	   *    equal, unequal, smallerEq, larger, largerEq, compare
	   *
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
	   */
	  math.smaller = function smaller(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('smaller', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      return !nearlyEqual(x, y, config.epsilon) && x < y;
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.lt(y);
	      }

	      // downgrade to Number
	      return smaller(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.lt(y)
	      }

	      // downgrade to Number
	      return smaller(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value < y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, smaller);
	    }

	    // Note: test strings after testing collections,
	    // else we can't compare a string with a matrix
	    if (isString(x) || isString(y)) {
	      return x < y;
	    }

	    if (isBoolean(x) || x === null) {
	      return smaller(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return smaller(x, +y);
	    }

	    if (isComplex(x) || isComplex(y)) {
	      throw new TypeError('No ordering relation is defined for complex numbers');
	    }

	    throw new math.error.UnsupportedTypeError('smaller', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether value x is smaller or equal to y.
	   *
	   * The function returns true when x is smaller than y or the relative
	   * difference between x and y is smaller than the configured epsilon. The
	   * function cannot be used to compare values smaller than approximately 2.22e-16.
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.smallerEq(x, y)
	   *
	   * Examples:
	   *
	   *    math.smaller(1 + 2, 3);        // returns false
	   *    math.smallerEq(1 + 2, 3);      // returns true
	   *
	   * See also:
	   *
	   *    equal, unequal, smaller, larger, largerEq, compare
	   *
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
	   */
	  math.smallerEq = function smallerEq(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('smallerEq', arguments.length, 2);
	    }

	    if (isNumber(x) && isNumber(y)) {
	      return nearlyEqual(x, y, config.epsilon) || x < y;
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y) || y === null) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return x.lte(y);
	      }

	      // downgrade to Number
	      return smallerEq(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x) || x === null) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return x.lte(y)
	      }

	      // downgrade to Number
	      return smallerEq(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value <= y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, smallerEq);
	    }

	    // Note: test strings after testing collections,
	    // else we can't compare a string with a matrix
	    if (isString(x) || isString(y)) {
	      return x <= y;
	    }

	    if (isBoolean(x) || x === null) {
	      return smallerEq(+x, y);
	    }
	    if (isBoolean(y) || y === null) {
	      return smallerEq(x, +y);
	    }

	    if (isComplex(x) || isComplex(y)) {
	      throw new TypeError('No ordering relation is defined for complex numbers');
	    }

	    throw new math.error.UnsupportedTypeError('smallerEq', math['typeof'](x), math['typeof'](y));
	  };

	  // TODO: deprecated since version 0.23.0, cleanup some day
	  math.smallereq = function () {
	    throw new Error('Function smallereq is renamed to smallerEq');
	  }
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math, config) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      nearlyEqual = util.number.nearlyEqual,
	      isBoolean = util['boolean'].isBoolean,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Test whether two values are unequal.
	   *
	   * The function tests whether the relative difference between x and y is
	   * larger than the configured epsilon. The function cannot be used to compare
	   * values smaller than approximately 2.22e-16.
	   *
	   * For matrices, the function is evaluated element wise.
	   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
	   *
	   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
	   * with everything except `null`, and `undefined` is unequal with everying
	   * except. `undefined`.
	   *
	   * Syntax:
	   *
	   *    math.unequal(x, y)
	   *
	   * Examples:
	   *
	   *    math.unequal(2 + 2, 3);       // returns true
	   *    math.unequal(2 + 2, 4);       // returns false
	   *
	   *    var a = math.unit('50 cm');
	   *    var b = math.unit('5 m');
	   *    math.unequal(a, b);           // returns false
	   *
	   *    var c = [2, 5, 1];
	   *    var d = [2, 7, 1];
	   *
	   *    math.unequal(c, d);           // returns [false, true, false]
	   *    math.deepEqual(c, d);         // returns false
	   *
	   *    math.unequal(0, null);        // returns true
	   * See also:
	   *
	   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
	   *
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to compare
	   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to compare
	   * @return {Boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
	   */
	  math.unequal = function unequal(x, y) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('unequal', arguments.length, 2);
	    }

	    if (isNumber(x)) {
	      if (isNumber(y)) {
	        return !nearlyEqual(x, y, config.epsilon);
	      }
	      else if (isComplex(y)) {
	        return !nearlyEqual(x, y.re, config.epsilon) || !nearlyEqual(y.im, 0, config.epsilon);
	      }
	    }

	    if (isComplex(x)) {
	      if (isNumber(y)) {
	        return !nearlyEqual(x.re, y, config.epsilon) || !nearlyEqual(x.im, 0, config.epsilon);
	      }
	      else if (isComplex(y)) {
	        return !nearlyEqual(x.re, y.re, config.epsilon) || !nearlyEqual(x.im, y.im, config.epsilon);
	      }
	    }

	    if (x instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(y)) {
	        y = BigNumber.convert(y);
	      }
	      else if (isBoolean(y)) {
	        y = new BigNumber(y ? 1 : 0);
	      }

	      if (y instanceof BigNumber) {
	        return !x.eq(y);
	      }

	      // downgrade to Number
	      return unequal(x.toNumber(), y);
	    }
	    if (y instanceof BigNumber) {
	      // try to convert to big number
	      if (isNumber(x)) {
	        x = BigNumber.convert(x);
	      }
	      else if (isBoolean(x)) {
	        x = new BigNumber(x ? 1 : 0);
	      }

	      if (x instanceof BigNumber) {
	        return !x.eq(y)
	      }

	      // downgrade to Number
	      return unequal(x, y.toNumber());
	    }

	    if ((isUnit(x)) && (isUnit(y))) {
	      if (!x.equalBase(y)) {
	        throw new Error('Cannot compare units with different base');
	      }
	      return x.value != y.value;
	    }

	    if (isCollection(x) || isCollection(y)) {
	      return collection.deepMap2(x, y, unequal);
	    }

	    // Note: test strings after testing collections,
	    // else we can accidentally compare a stringified array with a string
	    if (isString(x) || isString(y)) {
	      return x != y;
	    }

	    if (isBoolean(x)) {
	      return unequal(+x, y);
	    }
	    if (isBoolean(y)) {
	      return unequal(x, +y);
	    }

	    if (x === null) {
	      return y !== null;
	    }
	    if (y === null) {
	      return x !== null;
	    }

	    if (x === undefined) {
	      return y !== undefined;
	    }
	    if (y === undefined) {
	      return x !== undefined;
	    }

	    throw new math.error.UnsupportedTypeError('unequal', math['typeof'](x), math['typeof'](y));
	  };
	};


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection;

	  /**
	   * Compute the maximum value of a matrix or a  list of values.
	   * In case of a multi dimensional array, the maximum of the flattened array
	   * will be calculated. When `dim` is provided, the maximum over the selected
	   * dimension will be calculated. Parameter `dim` is zero-based.
	   *
	   * Syntax:
	   *
	   *     math.min(a, b, c, ...)
	   *     math.min(A)
	   *     math.min(A, dim)
	   *
	   * Examples:
	   *
	   *     math.min(2, 1, 4, 3);                  // returns 1
	   *     math.min([2, 1, 4, 3]);                // returns 1
	   *
	   *     // maximum over a specified dimension (zero-based)
	   *     math.min([[2, 5], [4, 3], [1, 7]], 0); // returns [1, 3]
	   *     math.min([[2, 5], [4, 3], [1, 7]], 1); // returns [2, 3, 1]
	   *
	   *     math.max(2.7, 7.1, -4.5, 2.0, 4.1);    // returns 7.1
	   *     math.min(2.7, 7.1, -4.5, 2.0, 4.1);    // returns -4.5
	   *
	   * See also:
	   *
	   *    mean, median, max, prod, std, sum, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The minimum value
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
	        return collection.reduce(arguments[0], arguments[1], _getSmaller);
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

	  function _getSmaller(x, y){
		  return math.smaller(x, y)  ? x : y;
	  }

	  /**
	   * Recursively calculate the minimum value in an n-dimensional array
	   * @param {Array} array
	   * @return {Number} min
	   * @private
	   */
	  function _min(array) {
	    var min = undefined;

	    collection.deepForEach(array, function (value) {
	      if (min === undefined || math.smaller(value, min)) {
	        min = value;
	      }
	    });

	    if (min === undefined) {
	      throw new Error('Cannot calculate min of an empty array');
	    }

	    return min;
	  }
	};


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection;

	  /**
	   * Compute the maximum value of a matrix or a  list with values.
	   * In case of a multi dimensional array, the maximum of the flattened array
	   * will be calculated. When `dim` is provided, the maximum over the selected
	   * dimension will be calculated. Parameter `dim` is zero-based.
	   *
	   * Syntax:
	   *
	   *     math.max(a, b, c, ...)
	   *     math.max(A)
	   *     math.max(A, dim)
	   *
	   * Examples:
	   *
	   *     math.max(2, 1, 4, 3);                  // returns 4
	   *     math.max([2, 1, 4, 3]);                // returns 4
	   *
	   *     // maximum over a specified dimension (zero-based)
	   *     math.max([[2, 5], [4, 3], [1, 7]], 0); // returns [4, 7]
	   *     math.max([[2, 5], [4, 3]], [1, 7], 1); // returns [5, 4, 7]
	   *
	   *     math.max(2.7, 7.1, -4.5, 2.0, 4.1);    // returns 7.1
	   *     math.min(2.7, 7.1, -4.5, 2.0, 4.1);    // returns -4.5
	   *
	   * See also:
	   *
	   *    mean, median, min, prod, std, sum, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The maximum value
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
	        return collection.reduce(arguments[0], arguments[1], _getLarger);
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

	  function _getLarger(x, y){
		  return math.larger(x, y) ? x : y;
	  }

	  /**
	   * Recursively calculate the maximum value in an n-dimensional array
	   * @param {Array} array
	   * @return {Number} max
	   * @private
	   */
	  function _max(array) {
	    var max = undefined;

	    collection.deepForEach(array, function (value) {
	      if (max === undefined || math.larger(value, max)) {
	        max = value;
	      }
	    });

	    if (max === undefined) {
	      throw new Error('Cannot calculate max of an empty array');
	    }

	    return max;
	  }
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,

	      size = __webpack_require__(153).size,
	      isArray = Array.isArray;

	  /**
	   * Compute the mean value of matrix or a list with values.
	   * In case of a multi dimensional array, the mean of the flattened array
	   * will be calculated. When `dim` is provided, the maximum over the selected
	   * dimension will be calculated. Parameter `dim` is zero-based.
	   *
	   * Syntax:
	   *
	   *     mean.mean(a, b, c, ...)
	   *     mean.mean(A)
	   *     mean.mean(A, dim)
	   *
	   * Examples:
	   *
	   *     math.mean(2, 1, 4, 3);                     // returns 2.5
	   *     math.mean([1, 2.7, 3.2, 4]);               // returns 2.725
	   *
	   *     math.mean([[2, 5], [6, 3], [1, 7]], 0);    // returns [3, 5]
	   *     math.mean([[2, 5], [6, 3], [1, 7]], 1);    // returns [3.5, 4.5, 4]
	   *
	   * See also:
	   *
	   *     median, min, max, sum, prod, std, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The mean of all values
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
		  var sum = collection.reduce(array, dim, math.add);
	    var s = isArray(array) ? size(array) : array.size();
	    return math.divide(sum, s[dim]);
	  }

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


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isNumber = __webpack_require__(4).isNumber,
	      isCollection = collection.isCollection,

	      flatten = __webpack_require__(153).flatten;

	  /**
	   * Compute the median of a matrix or a list with values. The values are
	   * sorted and the middle value is returned. In case of an even number of
	   * values, the average of the two middle values is returned.
	   * Supported types of values are: Number, BigNumber, Unit
	   *
	   * In case of a (multi dimensional) array or matrix, the median of all
	   * elements will be calculated.
	   *
	   * Syntax:
	   *
	   *     mean.median(a, b, c, ...)
	   *     mean.median(A)
	   *
	   * Examples:
	   *
	   *     math.median(5, 2, 7);        // returns 5
	   *     math.median([3, -1, 5, 7]);  // returns 4
	   *
	   * See also:
	   *
	   *     mean, min, max, sum, prod, std, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The median
	   */
	  math.median = function median(args) {
	    if (arguments.length == 0) {
	      throw new SyntaxError('Function median requires one or more parameters (0 provided)');
	    }

	    if (isCollection(args)) {
	      if (arguments.length == 1) {
	        // median([a, b, c, d, ...])
	        return _median(args.valueOf());
	      }
	      else if (arguments.length == 2) {
	        // median([a, b, c, d, ...], dim)
	        // TODO: implement median(A, dim)
	        throw new Error('median(A, dim) is not yet supported');
	        //return collection.reduce(arguments[0], arguments[1], ...);
	      }
	      else {
	        throw new SyntaxError('Wrong number of parameters');
	      }
	    }
	    else {
	      // median(a, b, c, d, ...)
	      return _median(Array.prototype.slice.call(arguments));
	    }
	  };

	  /**
	   * Recursively calculate the median of an n-dimensional array
	   * @param {Array} array
	   * @return {Number} median
	   * @private
	   */
	  function _median(array) {
	    var flat = flatten(array);

	    flat.sort(math.compare);

	    var num = flat.length;

	    if (num == 0) {
	      throw new Error('Cannot calculate median of an empty array');
	    }

	    if (num % 2 == 0) {
	      // even: return the average of the two middle values
	      var left = flat[num / 2 - 1];
	      var right = flat[num / 2];

	      if (!isNumber(left) && !(left instanceof BigNumber) && !(left instanceof Unit)) {
	        throw new math.error.UnsupportedTypeError('median', math['typeof'](left));
	      }
	      if (!isNumber(right) && !(right instanceof BigNumber) && !(right instanceof Unit)) {
	        throw new math.error.UnsupportedTypeError('median', math['typeof'](right));
	      }

	      return math.divide(math.add(left, right), 2);
	    }
	    else {
	      // odd: return the middle value
	      var middle = flat[(num - 1) / 2];

	      if (!isNumber(middle) && !(middle instanceof BigNumber) && !(middle instanceof Unit)) {
	        throw new math.error.UnsupportedTypeError('median', math['typeof'](middle));
	      }

	      return middle;
	    }
	  }
	};


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection;

	  /**
	   * Compute the product of a matrix or a list with values.
	   * In case of a (multi dimensional) array or matrix, the sum of all
	   * elements will be calculated.
	   *
	   * Syntax:
	   *
	   *     math.prod(a, b, c, ...)
	   *     math.prod(A)
	   *
	   * Examples:
	   *
	   *     math.multiply(2, 3);           // returns 6
	   *     math.prod(2, 3);               // returns 6
	   *     math.prod(2, 3, 4);            // returns 24
	   *     math.prod([2, 3, 4]);          // returns 24
	   *     math.prod([[2, 5], [4, 3]]);   // returns 120
	   *
	   * See also:
	   *
	   *    mean, median, min, max, sum, std, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The product of all values
	   */
	  math.prod = function prod(args) {
	    if (arguments.length == 0) {
	      throw new SyntaxError('Function prod requires one or more parameters (0 provided)');
	    }

	    if (isCollection(args)) {
	      if (arguments.length == 1) {
	        // prod([a, b, c, d, ...])
	        return _prod(args);
	      }
	      else if (arguments.length == 2) {
	        // prod([a, b, c, d, ...], dim)
	        // TODO: implement prod(A, dim)
	        throw new Error('prod(A, dim) is not yet supported');
	        //return collection.reduce(arguments[0], arguments[1], math.prod);
	      }
	      else {
	        throw new SyntaxError('Wrong number of parameters');
	      }
	    }
	    else {
	      // prod(a, b, c, d, ...)
	      return _prod(arguments);
	    }
	  };

	  /**
	   * Recursively calculate the product of an n-dimensional array
	   * @param {Array} array
	   * @return {Number} prod
	   * @private
	   */
	  function _prod(array) {
	    var prod = undefined;

	    collection.deepForEach(array, function (value) {
	      prod = (prod === undefined) ? value : math.multiply(prod, value);
	    });

	    if (prod === undefined) {
	      throw new Error('Cannot calculate prod of an empty array');
	    }

	    return prod;
	  }
	};


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {


	  /**
	   * Compute the standard deviation of a matrix or a  list with values.
	   * The standard deviations is defined as the square root of the variance:
	   * `std(A) = sqrt(var(A))`.
	   * In case of a (multi dimensional) array or matrix, the standard deviation
	   * over all elements will be calculated.
	   *
	   * Optionally, the type of normalization can be specified as second
	   * parameter. The parameter `normalization` can be one of the following values:
	   *
	   * - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
	   * - 'uncorrected'        The sum of squared errors is divided by n
	   * - 'biased'             The sum of squared errors is divided by (n + 1)
	   *
	   * Syntax:
	   *
	   *     math.std(a, b, c, ...)
	   *     math.std(A)
	   *     math.std(A, normalization)
	   *
	   * Examples:
	   *
	   *     math.std(2, 4, 6);                     // returns 2
	   *     math.std([2, 4, 6, 8]);                // returns 2.581988897471611
	   *     math.std([2, 4, 6, 8], 'uncorrected'); // returns 2.23606797749979
	   *     math.std([2, 4, 6, 8], 'biased');      // returns 2
	   *
	   *     math.std([[1, 2, 3], [4, 5, 6]]);      // returns 1.8708286933869707
	   *
	   * See also:
	   *
	   *    mean, median, max, min, prod, sum, var
	   *
	   * @param {Array | Matrix} array
	   *                        A single matrix or or multiple scalar values
	   * @param {String} [normalization='unbiased']
	   *                        Determines how to normalize the variance.
	   *                        Choose 'unbiased' (default), 'uncorrected', or 'biased'.
	   * @return {*} The standard deviation
	   */
	  math.std = function std(array, normalization) {
	    if (arguments.length == 0) {
	      throw new SyntaxError('Function std requires one or more parameters (0 provided)');
	    }

	    var variance = math['var'].apply(null, arguments);
	    return math.sqrt(variance);
	  };
	};


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection;

	  /**
	   * Compute the sum of a matrix or a list with values.
	   * In case of a (multi dimensional) array or matrix, the sum of all
	   * elements will be calculated.
	   *
	   * Syntax:
	   *
	   *     math.sum(a, b, c, ...)
	   *     math.sum(A)
	   *
	   * Examples:
	   *
	   *     math.sum(2, 1, 4, 3);               // returns 10
	   *     math.sum([2, 1, 4, 3]);             // returns 10
	   *     math.sum([[2, 5], [4, 3], [1, 7]]); // returns 22
	   *
	   * See also:
	   *
	   *    mean, median, min, max, prod, std, var
	   *
	   * @param {... *} args  A single matrix or or multiple scalar values
	   * @return {*} The sum of all values
	   */
	  math.sum = function sum(args) {
	    if (arguments.length == 0) {
	      throw new SyntaxError('Function sum requires one or more parameters (0 provided)');
	    }

	    if (isCollection(args)) {
	      if (arguments.length == 1) {
	        // sum([a, b, c, d, ...])
	        return _sum(args);
	      }
	      else if (arguments.length == 2) {
	        // sum([a, b, c, d, ...], dim)
	        // TODO: implement sum(A, dim)
	        throw new Error('sum(A, dim) is not yet supported');
	        //return collection.reduce(arguments[0], arguments[1], math.add);
	      }
	      else {
	        throw new SyntaxError('Wrong number of parameters');
	      }
	    }
	    else {
	      // sum(a, b, c, d, ...)
	      return _sum(arguments);
	    }
	  };

	  /**
	   * Recursively calculate the sum of an n-dimensional array
	   * @param {Array} array
	   * @return {Number} sum
	   * @private
	   */
	  function _sum(array) {
	    var sum = undefined;

	    collection.deepForEach(array, function (value) {
	      sum = (sum === undefined) ? value : math.add(sum, value);
	    });

	    if (sum === undefined) {
	      throw new Error('Cannot calculate sum of an empty array');
	    }

	    return sum;
	  }
	};


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9),
	      BigNumber = math.type.BigNumber,
	      collection = __webpack_require__(13),

	      isCollection = collection.isCollection,
	      isString = __webpack_require__(176).isString,

	      DEFAULT_NORMALIZATION = 'unbiased';

	  /**
	   * Compute the variance of a matrix or a  list with values.
	   * In case of a (multi dimensional) array or matrix, the variance over all
	   * elements will be calculated.
	   *
	   * Optionally, the type of normalization can be specified as second
	   * parameter. The parameter `normalization` can be one of the following values:
	   *
	   * - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
	   * - 'uncorrected'        The sum of squared errors is divided by n
	   * - 'biased'             The sum of squared errors is divided by (n + 1)

	   * Note that older browser may not like the variable name `var`. In that
	   * case, the function can be called as `math['var'](...)` instead of
	   * `math.var(...)`.
	   *
	   * Syntax:
	   *
	   *     math.var(a, b, c, ...)
	   *     math.var(A)
	   *     math.var(A, normalization)
	   *
	   * Examples:
	   *
	   *     math.var(2, 4, 6);                     // returns 4
	   *     math.var([2, 4, 6, 8]);                // returns 6.666666666666667
	   *     math.var([2, 4, 6, 8], 'uncorrected'); // returns 5
	   *     math.var([2, 4, 6, 8], 'biased');      // returns 4
	   *
	   *     math.var([[1, 2, 3], [4, 5, 6]]);      // returns 3.5
	   *
	   * See also:
	   *
	   *    mean, median, max, min, prod, std, sum
	   *
	   * @param {Array | Matrix} array
	   *                        A single matrix or or multiple scalar values
	   * @param {String} [normalization='unbiased']
	   *                        Determines how to normalize the variance.
	   *                        Choose 'unbiased' (default), 'uncorrected', or 'biased'.
	   * @return {*} The variance
	   */
	  math['var'] = function variance(array, normalization) {
	    if (arguments.length == 0) {
	      throw new SyntaxError('Function var requires one or more parameters (0 provided)');
	    }

	    if (isCollection(array)) {
	      if (arguments.length == 1) {
	        // var([a, b, c, d, ...])
	        return _var(array, DEFAULT_NORMALIZATION);
	      }
	      else if (arguments.length == 2) {
	        // var([a, b, c, d, ...], normalization)

	        if (!isString(normalization)) {
	          throw new Error('String expected for parameter normalization');
	        }

	        return _var(array, normalization);
	      }
	      /* TODO: implement var(A [, normalization], dim)
	      else if (arguments.length == 3) {
	        // var([a, b, c, d, ...], dim)
	        // var([a, b, c, d, ...], normalization, dim)
	        //return collection.reduce(arguments[0], arguments[1], ...);
	      }
	      */
	      else {
	        throw new SyntaxError('Wrong number of parameters');
	      }
	    }
	    else {
	      // var(a, b, c, d, ...)
	      return _var(arguments, DEFAULT_NORMALIZATION);
	    }
	  };

	  /**
	   * Recursively calculate the variance of an n-dimensional array
	   * @param {Array} array
	   * @param {String} normalization
	   *                        Determines how to normalize the variance:
	   *                        - 'unbiased'    The sum of squared errors is divided by (n - 1)
	   *                        - 'uncorrected' The sum of squared errors is divided by n
	   *                        - 'biased'      The sum of squared errors is divided by (n + 1)
	   * @return {Number | BigNumber} variance
	   * @private
	   */
	  function _var(array, normalization) {
	    var sum = 0;
	    var num = 0;

	    // calculate the mean and number of elements
	    collection.deepForEach(array, function (value) {
	      sum = math.add(sum, value);
	      num++;
	    });
	    if (num === 0) throw new Error('Cannot calculate var of an empty array');

	    var mean = math.divide(sum, num);

	    // calculate the variance
	    sum = 0;
	    collection.deepForEach(array, function (value) {
	      var diff = math.subtract(value, mean);
	      sum = math.add(sum, math.multiply(diff, diff));
	    });

	    switch (normalization) {
	      case 'uncorrected':
	        return math.divide(sum, num);

	      case 'biased':
	        return math.divide(sum, num + 1);

	      case 'unbiased':
	        var zero = (sum instanceof BigNumber) ? new BigNumber(0) : 0;
	        return (num == 1) ? zero : math.divide(sum, num - 1);

	      default:
	        throw new Error('Unknown normalization "' + normalization + '". ' +
	            'Choose "unbiased" (default), "uncorrected", or "biased".');
	    }
	  }
	};


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the inverse cosine of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.acos(x)
	   *
	   * Examples:
	   *
	   *    math.acos(0.5);           // returns Number 1.0471975511965979
	   *    math.acos(math.cos(1.5)); // returns Number 1.5
	   *
	   *    math.acos(2);             // returns Complex 0 + 1.3169578969248166 i
	   *
	   * See also:
	   *
	   *    cos, atan, asin
	   *
	   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} The arc cosine of x
	   */
	  math.acos = function acos(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('acos', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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
	      var temp3 = new Complex(
	          temp2.re - x.im,
	          temp2.im + x.re
	      );
	      var temp4 = math.log(temp3);

	      // 0.5*pi = 1.5707963267948966192313216916398
	      return new Complex(
	          1.57079632679489661923 - temp4.im,
	          temp4.re
	      );
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, acos);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.acos(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return acos(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('acos', math['typeof'](x));
	  };
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the inverse sine of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.asin(x)
	   *
	   * Examples:
	   *
	   *    math.asin(0.5);           // returns Number 0.5235987755982989
	   *    math.asin(math.sin(1.5)); // returns Number ~1.5
	   *
	   *    math.asin(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
	   *
	   * See also:
	   *
	   *    sin, atan, acos
	   *
	   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
	   * @return {Number | Complex | Array | Matrix} The arc sine of x
	   */
	  math.asin = function asin(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('asin', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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
	      var temp3 = new Complex(
	          temp2.re - im,
	          temp2.im + re
	      );
	      var temp4 = math.log(temp3);

	      return new Complex(temp4.im, -temp4.re);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, asin);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.asin(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return asin(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('asin', math['typeof'](x));
	  };
	};


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the inverse tangent of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.atan(x)
	   *
	   * Examples:
	   *
	   *    math.atan(0.5);           // returns Number 0.4636476090008061
	   *    math.atan(math.tan(1.5)); // returns Number 1.5
	   *
	   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
	   *
	   * See also:
	   *
	   *    tan, asin, acos
	   *
	   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
	   * @return {Number | Complex | Array | Matrix} The arc tangent of x
	   */
	  math.atan = function atan(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('atan', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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

	      return new Complex(
	          -0.5 * temp2.im,
	          0.5 * temp2.re
	      );
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, atan);
	    }

	    if (isBoolean(x) || x === null) {
	      return Math.atan(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return atan(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('atan', math['typeof'](x));
	  };
	};


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the inverse tangent function with two arguments, y/x.
	   * By providing two arguments, the right quadrant of the computed angle can be
	   * determined.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.atan2(y, x)
	   *
	   * Examples:
	   *
	   *    math.atan2(2, 2) / math.pi;       // returns number 0.25
	   *
	   *    var angle = math.unit(60, 'deg'); // returns Unit 60 deg
	   *    var x = math.cos(angle);
	   *    var y = math.sin(angle);
	   *
	   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
	   *
	   * See also:
	   *
	   *    tan, atan, sin, cos
	   *
	   * @param {Number | Boolean | Complex | Array | Matrix | null} y  Second dimension
	   * @param {Number | Boolean | Complex | Array | Matrix | null} x  First dimension
	   * @return {Number | Complex | Array | Matrix} Four-quadrant inverse tangent
	   */
	  math.atan2 = function atan2(y, x) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('atan2', arguments.length, 2);
	    }

	    if (isNumber(y)) {
	      if (isNumber(x)) {
	        return Math.atan2(y, x);
	      }
	    }

	    // TODO: support for complex computation of atan2

	    if (isCollection(y) || isCollection(x)) {
	      return collection.deepMap2(y, x, atan2);
	    }

	    if (isBoolean(y) || y === null) {
	      return atan2(+y, x);
	    }
	    if (isBoolean(x) || x === null) {
	      return atan2(y, +x);
	    }

	    // TODO: implement bignumber support
	    if (y instanceof BigNumber) {
	      return atan2(y.toNumber(), x);
	    }
	    if (x instanceof BigNumber) {
	      return atan2(y, x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('atan2', math['typeof'](y), math['typeof'](x));
	  };
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the cosine of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.cos(x)
	   *
	   * Examples:
	   *
	   *    math.cos(2);                      // returns Number -0.4161468365471422
	   *    math.cos(math.pi / 4);            // returns Number  0.7071067811865475
	   *    math.cos(math.unit(180, 'deg'));  // returns Number -1
	   *    math.cos(math.unit(60, 'deg'));   // returns Number  0.5
	   *
	   *    var angle = 0.2;
	   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns Number ~1
	   *
	   * See also:
	   *
	   *    cos, tan
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Cosine of x
	   */
	  math.cos = function cos(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('cos', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.cos(x);
	    }

	    if (isComplex(x)) {
	      // cos(z) = (exp(iz) + exp(-iz)) / 2
	      return new Complex(
	          Math.cos(x.re) * math.cosh(-x.im),
	          Math.sin(x.re) * math.sinh(-x.im)
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

	    if (isBoolean(x) || x === null) {
	      return Math.cos(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return cos(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('cos', math['typeof'](x));
	  };
	};


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic cosine of a value,
	   * defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.cosh(x)
	   *
	   * Examples:
	   *
	   *    math.cosh(0.5);       // returns Number 1.1276259652063807
	   *
	   * See also:
	   *
	   *    sinh, tanh
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic cosine of x
	   */
	  math.cosh = function cosh(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('cosh', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return (Math.exp(x) + Math.exp(-x)) / 2;
	    }

	    if (isComplex(x)) {
	      var ep = Math.exp(x.re);
	      var en = Math.exp(-x.re);
	      return new Complex(Math.cos(x.im) * (ep + en) / 2, Math.sin(x.im) * (ep - en) / 2);
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function cosh is no angle');
	      }
	      return cosh(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, cosh);
	    }

	    if (isBoolean(x) || x === null) {
	      return cosh(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return cosh(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('cosh', math['typeof'](x));
	  };
	};


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the cotangent of a value. `cot(x)` is defined as `1 / tan(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.cot(x)
	   *
	   * Examples:
	   *
	   *    math.cot(2);      // returns Number -0.45765755436028577
	   *    1 / math.tan(2);  // returns Number -0.45765755436028577
	   *
	   * See also:
	   *
	   *    tan, sec, csc
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Cotangent of x
	   */
	  math.cot = function cot(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('cot', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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

	    if (isBoolean(x) || x === null) {
	      return cot(+x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return cot(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('cot', math['typeof'](x));
	  };
	};


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic cotangent of a value,
	   * defined as `coth(x) = 1 / tanh(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.coth(x)
	   *
	   * Examples:
	   *
	   *    // coth(x) = 1 / tanh(x)
	   *    math.coth(2);         // returns 1.0373147207275482
	   *    1 / math.tanh(2);     // returns 1.0373147207275482
	   *
	   * See also:
	   *
	   *    sinh, tanh, cosh
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic cotangent of x
	   */
	  math.coth = function coth(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('coth', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      var e = Math.exp(2 * x);
	      return (e + 1) / (e - 1);
	    }

	    if (isComplex(x)) {
	      var r = Math.exp(2 * x.re);
	      var re = r * Math.cos(2 * x.im);
	      var im = r * Math.sin(2 * x.im);
	      var den = (re - 1) * (re - 1) + im * im;
	      return new Complex(
	        ((re + 1) * (re - 1) + im * im) / den,
	        -2 * im / den
	      );
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function coth is no angle');
	      }
	      return coth(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, coth);
	    }

	    if (isBoolean(x) || x === null) {
	      return coth(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return coth(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('coth', math['typeof'](x));
	  };
	};


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.csc(x)
	   *
	   * Examples:
	   *
	   *    math.csc(2);      // returns Number 1.099750170294617
	   *    1 / math.sin(2);  // returns Number 1.099750170294617
	   *
	   * See also:
	   *
	   *    sin, sec, cot
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Cosecant of x
	   */
	  math.csc = function csc(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('csc', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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

	    if (isBoolean(x) || x === null) {
	      return csc(+x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return csc(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('csc', math['typeof'](x));
	  };
	};


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),
	      number = util.number,
	      
	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic cosecant of a value,
	   * defined as `csch(x) = 1 / sinh(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.csch(x)
	   *
	   * Examples:
	   *
	   *    // csch(x) = 1/ sinh(x)
	   *    math.csch(0.5);       // returns 1.9190347513349437
	   *    1 / math.sinh(0.5);   // returns 1.9190347513349437
	   *
	   * See also:
	   *
	   *    sinh, sech, coth
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic cosecant of x
	   */
	  math.csch = function csch(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('csch', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      // x == 0
	      if (x == 0) return Number.NaN;
	      // consider values close to zero (+/-)
	      return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * number.sign(x);
	    }

	    if (isComplex(x)) {
	      var ep = Math.exp(x.re);
	      var en = Math.exp(-x.re);
	      var re = Math.cos(x.im) * (ep - en);
	      var im = Math.sin(x.im) * (ep + en);
	      var den = re * re + im * im;
	      return new Complex(2 * re / den, -2 * im /den);
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function csch is no angle');
	      }
	      return csch(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, csch);
	    }

	    if (isBoolean(x) || x === null) {
	      return csch(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return csch(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('csch', math['typeof'](x));
	  };
	};


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sec(x)
	   *
	   * Examples:
	   *
	   *    math.sec(2);      // returns Number -2.4029979617223822
	   *    1 / math.cos(2);  // returns Number -2.4029979617223822
	   *
	   * See also:
	   *
	   *    cos, csc, cot
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Secant of x
	   */
	  math.sec = function sec(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sec', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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

	    if (isBoolean(x) || x === null) {
	      return sec(+x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return sec(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('sec', math['typeof'](x));
	  };
	};


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic secant of a value,
	   * defined as `sech(x) = 1 / cosh(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sech(x)
	   *
	   * Examples:
	   *
	   *    // sech(x) = 1/ cosh(x)
	   *    math.sech(0.5);       // returns 0.886818883970074
	   *    1 / math.cosh(0.5);   // returns 1.9190347513349437
	   *
	   * See also:
	   *
	   *    cosh, csch, coth
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic secant of x
	   */
	  math.sech = function sech(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sech', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return 2 / (Math.exp(x) + Math.exp(-x));
	    }

	    if (isComplex(x)) {
	      var ep = Math.exp(x.re);
	      var en = Math.exp(-x.re);
	      var re = Math.cos(x.im) * (ep + en);
	      var im = Math.sin(x.im) * (ep - en);
	      var den = re * re + im * im;
	      return new Complex(2 * re / den, -2 * im / den);
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function sech is no angle');
	      }
	      return sech(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, sech);
	    }

	    if (isBoolean(x) || x === null) {
	      return sech(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return sech(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('sech', math['typeof'](x));
	  };
	};


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the sine of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sin(x)
	   *
	   * Examples:
	   *
	   *    math.sin(2);                      // returns Number 0.9092974268256813
	   *    math.sin(math.pi / 4);            // returns Number 0.7071067811865475
	   *    math.sin(math.unit(90, 'deg'));   // returns Number 1
	   *    math.sin(math.unit(30, 'deg'));   // returns Number 0.5
	   *
	   *    var angle = 0.2;
	   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns Number ~1
	   *
	   * See also:
	   *
	   *    cos, tan
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Sine of x
	   */
	  math.sin = function sin(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sin', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      return Math.sin(x);
	    }

	    if (isComplex(x)) {
	      return new Complex(
	          Math.sin(x.re) * math.cosh(-x.im),
	          Math.cos(x.re) * math.sinh(x.im)
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

	    if (isBoolean(x) || x === null) {
	      return Math.sin(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return sin(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('sin', math['typeof'](x));
	  };
	};


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic sine of a value,
	   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.sinh(x)
	   *
	   * Examples:
	   *
	   *    math.sinh(0.5);       // returns Number 0.5210953054937474
	   *
	   * See also:
	   *
	   *    cosh, tanh
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic sine of x
	   */
	  math.sinh = function sinh(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('sinh', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      if (Math.abs(x) < 1) {
	        return x + (x * x * x) / 6 + (x * x * x * x * x) / 120;
	      } else {
	        return (Math.exp(x) - Math.exp(-x)) / 2;
	      }
	    }

	    if (isComplex(x)) {
	      var cim = Math.cos(x.im);
	      var sim = Math.sin(x.im);
	      var ep = Math.exp(x.re);
	      var en = Math.exp(-x.re);
	      return new Complex(cim * (ep - en) / 2, sim * (ep + en) / 2);
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function sinh is no angle');
	      }
	      return sinh(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, sinh);
	    }

	    if (isBoolean(x) || x === null) {
	      return sinh(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return sinh(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('sinh', math['typeof'](x));
	  };
	};


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the tangent of a value. `tan(x)` is equal to `sin(x) / cos(x)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.tan(x)
	   *
	   * Examples:
	   *
	   *    math.tan(0.5);                    // returns Number 0.5463024898437905
	   *    math.sin(0.5) / math.cos(0.5);    // returns Number 0.5463024898437905
	   *    math.tan(math.pi / 4);            // returns Number 1
	   *    math.tan(math.unit(45, 'deg'));   // returns Number 1
	   *
	   * See also:
	   *
	   *    atan, sin, cos
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Tangent of x
	   */
	  math.tan = function tan(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('tan', arguments.length, 1);
	    }

	    if (isNumber(x)) {
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

	    if (isBoolean(x) || x === null) {
	      return Math.tan(x);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return tan(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('tan', math['typeof'](x));
	  };
	};


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      BigNumber = math.type.BigNumber,
	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isNumber = util.number.isNumber,
	      isBoolean = util['boolean'].isBoolean,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Calculate the hyperbolic tangent of a value,
	   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.tanh(x)
	   *
	   * Examples:
	   *
	   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
	   *    math.tanh(0.5);                   // returns 0.46211715726000974
	   *    math.sinh(0.5) / math.cosh(0.5);  // returns 0.46211715726000974
	   *    1 / math.coth(0.5);               // returns 0.46211715726000974
	   *
	   * See also:
	   *
	   *    sinh, cosh, coth
	   *
	   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
	   * @return {Number | Complex | Array | Matrix} Hyperbolic tangent of x
	   */
	  math.tanh = function tanh(x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('tanh', arguments.length, 1);
	    }

	    if (isNumber(x)) {
	      var e = Math.exp(2 * x);
	      return (e - 1) / (e + 1);
	    }

	    if (isComplex(x)) {
	      var r = Math.exp(2 * x.re);
	      var re = r * Math.cos(2 * x.im);
	      var im = r * Math.sin(2 * x.im);
	      var den = (re + 1) * (re + 1) + im * im;
	      return new Complex(
	        ((re - 1) * (re + 1) + im * im) / den,
	        im * 2 / den
	      );
	    }

	    if (isUnit(x)) {
	      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
	        throw new TypeError ('Unit in function tanh is no angle');
	      }
	      return tanh(x.value);
	    }

	    if (isCollection(x)) {
	      return collection.deepMap(x, tanh);
	    }

	    if (isBoolean(x) || x === null) {
	      return tanh(x ? 1 : 0);
	    }

	    if (x instanceof BigNumber) {
	      // TODO: implement BigNumber support
	      // downgrade to Number
	      return tanh(x.toNumber());
	    }

	    throw new math.error.UnsupportedTypeError('tanh', math['typeof'](x));
	  };
	};


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Unit = __webpack_require__(10),
	      collection = __webpack_require__(13),

	      isString = util.string.isString,
	      isUnit = Unit.isUnit,
	      isCollection = collection.isCollection;

	  /**
	   * Change the unit of a value.
	   *
	   * For matrices, the function is evaluated element wise.
	   *
	   * Syntax:
	   *
	   *    math.to(x, unit)
	   *
	   * Examples:
	   *
	   *    math.to(math.unit('2 inch'), 'cm');                   // returns Unit 5.08 cm
	   *    math.to(math.unit('2 inch'), math.unit(null, 'cm'));  // returns Unit 5.08 cm
	   *    math.to(math.unit(16, 'bytes'), 'bits');              // returns Unit 128 bits
	   *
	   * See also:
	   *
	   *    unit
	   *
	   * @param {Unit | Array | Matrix} x     The unit to be converted.
	   * @param {Unit | Array | Matrix} unit  New unit. Can be a string like "cm"
	   *                                      or a unit without value.
	   * @return {Unit | Array | Matrix} value with changed, fixed unit.
	   */
	  math.to = function to(x, unit) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('to', arguments.length, 2);
	    }

	    if (isUnit(x)) {
	      if (isUnit(unit) || isString(unit)) {
	        return x.to(unit);
	      }
	    }

	    // TODO: add support for string, in that case, convert to unit

	    if (isCollection(x) || isCollection(unit)) {
	      return collection.deepMap2(x, unit, to);
	    }

	    throw new math.error.UnsupportedTypeError('to', math['typeof'](x), math['typeof'](unit));
	  };
	};


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      object = util.object;

	  /**
	   * Clone an object.
	   *
	   * Syntax:
	   *
	   *     math.clone(x)
	   *
	   * Examples:
	   *
	   *    math.clone(3.5);              // returns number 3.5
	   *    math.clone(2 - 4i);           // returns Complex 2 - 4i
	   *    math.clone(45 deg);           // returns Unit 45 deg
	   *    math.clone([[1, 2], [3, 4]]); // returns Array [[1, 2], [3, 4]]
	   *    math.clone("hello world");    // returns string "hello world"
	   *
	   * @param {*} x   Object to be cloned
	   * @return {*} A clone of object x
	   */
	  math.clone = function clone (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('clone', arguments.length, 1);
	    }

	    return object.clone(x);
	  };
	};


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9);

	  /**
	   * Sort the items in a matrix.
	   *
	   * Syntax:
	   *
	   *    math.filter(x, test)
	   *
	   * Examples:
	   *
	   *    function isPositive (x) {
	   *      return x > 0;
	   *    }
	   *    math.filter([6, -2, -1, 4, 3], isPositive); // returns [6, 4, 3]
	   *
	   *    math.filter(["23", "foo", "100", "55", "bar"], /[0-9]+/); // returns ["23", "100", "55"]
	   *
	   * See also:
	   *
	   *    forEach, map, sort
	   *
	   * @param {Matrix | Array} x    A one dimensional matrix or array to filter
	   * @param {Function | RegExp} test
	   *        A function or regular expression to test items.
	   *        When `test` is a function, it must return a boolean.
	   *        All entries for which `test` returns true are returned.
	   * @return {Matrix | Array} Returns the filtered matrix.
	   */
	  math.filter = function (x, test) {
	    if (arguments.length !== 2) {
	      throw new math.error.ArgumentsError('filter', arguments.length, 2);
	    }

	    if (x instanceof Matrix) {
	      var size = x.size();
	      if (size.length > 1) {
	        throw new Error('Only one dimensional matrices supported');
	      }
	      return new Matrix(_filter(x.toArray(), test));
	    }
	    else if (Array.isArray(x)) {
	      return _filter(x, test);
	    }
	    else {
	      throw new math.error.UnsupportedTypeError('filter', math['typeof'](x), math['typeof'](compare));
	    }
	  };

	  /**
	   *
	   * @param {Array} x
	   * @param {function | RegExp} test
	   * @return {Array} Returns the filtered array
	   * @private
	   */
	  function _filter(x, test) {
	    if (typeof test === 'function') {
	      return x.filter(function (entry) {
	        return test(entry);
	      });
	    }
	    else if (test instanceof RegExp) {
	      return x.filter(function (entry) {
	        return test.test(entry);
	      });
	    }
	    else {
	      throw new TypeError('Function or RegExp expected');
	    }
	  }
	};

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),
	      string = util.string;

	  /**
	   * Format a value of any type into a string.
	   *
	   * Syntax:
	   *
	   *    math.format(value)
	   *    math.format(value, options)
	   *    math.format(value, precision)
	   *    math.format(value, fn)
	   *
	   * Where:
	   *
	   *  - `value: *`
	   *    The value to be formatted
	   *  - `options: Object`
	   *    An object with formatting options. Available options:
	   *    - `notation: String`
	   *      Number notation. Choose from:
	   *      - 'fixed'
	   *        Always use regular number notation.
	   *        For example '123.40' and '14000000'
	   *      - 'exponential'
	   *        Always use exponential notation.
	   *        For example '1.234e+2' and '1.4e+7'
	   *      - 'auto' (default)
	   *        Regular number notation for numbers having an absolute value between
	   *        `lower` and `upper` bounds, and uses exponential notation elsewhere.
	   *        Lower bound is included, upper bound is excluded.
	   *        For example '123.4' and '1.4e7'.
	   *    - `precision: Number`
	   *      A number between 0 and 16 to round the digits of the number. In case
	   *      of notations 'exponential' and 'auto', `precision` defines the total
	   *      number of significant digits returned and is undefined by default.
	   *      In case of notation 'fixed', `precision` defines the number of
	   *      significant digits after the decimal point, and is 0 by default.
	   *    - `exponential: Object`
	   *      An object containing two parameters, {Number} lower and {Number} upper,
	   *      used by notation 'auto' to determine when to return exponential
	   *      notation. Default values are `lower=1e-3` and `upper=1e5`. Only
	   *      applicable for notation `auto`.
	   * - `fn: Function`
	   *   A custom formatting function. Can be used to override the built-in notations.
	   *   Function `fn` is called with `value` as parameter and must return a string.
	   *   Is useful for example to format all values inside a matrix in a particular way.
	   *
	   * Examples:
	   *
	   *    math.format(6.4);                                        // returns '6.4'
	   *    math.format(1240000);                                    // returns '1.24e6'
	   *    math.format(1/3);                                        // returns '0.3333333333333333'
	   *    math.format(1/3, 3);                                     // returns '0.333'
	   *    math.format(21385, 2);                                   // returns '21000'
	   *    math.format(12.071, {notation: 'fixed'});                // returns '12'
	   *    math.format(2.3,    {notation: 'fixed', precision: 2});  // returns '2.30'
	   *    math.format(52.8,   {notation: 'exponential'});          // returns '5.28e+1'
	   *
	   * See also:
	   *
	   *    print
	   *
	   * @param {*} value                               Value to be stringified
	   * @param {Object | Function | Number} [options]  Formatting options
	   * @return {String} The formatted value
	   */
	  math.format = function format (value, options) {
	    var num = arguments.length;
	    if (num !== 1 && num !== 2) {
	      throw new math.error.ArgumentsError('format', num, 1, 2);
	    }

	    return string.format(value, options);
	  };
	};


/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      Complex = __webpack_require__(6),
	      Unit = __webpack_require__(10),

	      isNumber = util.number.isNumber,
	      isString = util.string.isString,
	      isComplex = Complex.isComplex,
	      isUnit = Unit.isUnit;

	  /**
	   * Import functions from an object or a module
	   *
	   * Syntax:
	   *
	   *    math.import(object)
	   *    math.import(object, options)
	   *
	   * Where:
	   *
	   * - `object: Object`
	   *   An object with functions to be imported.
	   * - `options: Object` An object with import options. Available options:
	   *   - `override: boolean`
	   *     If true, existing functions will be overwritten. False by default.
	   *   - `wrap: boolean`
	   *     If true, the functions will be wrapped in a wrapper function
	   *     which converts data types like Matrix to primitive data types like Array.
	   *     The wrapper is needed when extending math.js with libraries which do not
	   *     support these data types. False by default.
	   *
	   * Examples:
	   *
	   *    // define new functions and variables
	   *    math.import({
	   *      myvalue: 42,
	   *      hello: function (name) {
	   *        return 'hello, ' + name + '!';
	   *      }
	   *    });
	   *
	   *    // use the imported function and variable
	   *    math.myvalue * 2;               // 84
	   *    math.hello('user');             // 'hello, user!'
	   *
	   *    // import the npm module numbers
	   *    // (must be installed first with `npm install numbers`)
	   *    math.import('numbers', {wrap: true});
	   *
	   *    math.fibonacci(7); // returns 13
	   *
	   * @param {String | Object} object  Object with functions to be imported.
	   * @param {Object} [options]        Import options.
	   */
	  // TODO: return status information
	  math['import'] = function math_import(object, options) {
	    var num = arguments.length;
	    if (num != 1 && num != 2) {
	      throw new math.error.ArgumentsError('import', num, 1, 2);
	    }

	    var name;
	    var opts = {
	      override: options && options.override || false,
	      wrap:     options && options.wrap || false
	    };

	    if (isString(object)) {
	      // a string with a filename

	      // istanbul ignore else (we cannot unit test the else case in a node.js environment)
	      if (true) {
	        // load the file using require
	        var _module = __webpack_require__(195)(object);
	        math_import(_module, options);
	      }
	      else {
	        throw new Error('Cannot load module: require not available.');
	      }
	    }
	    else if (typeof object === 'object') {
	      // a map with functions
	      for (name in object) {
	        if (object.hasOwnProperty(name)) {
	          var value = object[name];
	          if (isSupportedType(value)) {
	            _import(name, value, opts);
	          }
	          else {
	            math_import(value, options);
	          }
	        }
	      }
	    }
	    else {
	      throw new TypeError('Object or module name expected');
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
	            var arg = arguments[i];
	            args[i] = arg && arg.valueOf();
	          }
	          return value.apply(math, args);
	        };
	      }
	      else {
	        // just create a link to the function or value
	        math[name] = value;
	      }

	      // create a proxy for the chain
	      math.chaining.Chain.createProxy(name, value);
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


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9);


	  /**
	   * Create a new matrix or array with the results of the callback function executed on
	   * each entry of the matrix/array.
	   *
	   * Syntax:
	   *
	   *    math.map(x, callback)
	   *
	   * Examples:
	   *
	   *    math.map([1, 2, 3], function(value) {
	   *      return value * value;
	   *    });  // returns [1, 4, 9]
	   *
	   * See also:
	   *
	   *    filter, forEach, sort
	   *
	   * @param {Matrix | Array} x    The matrix to iterate on.
	   * @param {Function} callback   The callback method is invoked with three
	   *                              parameters: the value of the element, the index
	   *                              of the element, and the matrix being traversed.
	   * @return {Matrix | array}     Transformed map of x
	   */
	  math.map = function (x, callback) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('map', arguments.length, 2);
	    }

	    if (Array.isArray(x)) {
	      return _mapArray(x, callback);
	    } else if (x instanceof Matrix) {
	      return x.map(callback);
	    } else {
	      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
	    }
	  };

	  function _mapArray (arrayIn, callback) {
	    var recurse = function (value, index) {
	      if (Array.isArray(value)) {
	        return value.map(function (child, i) {
	          // we create a copy of the index array and append the new index value
	          return recurse(child, index.concat(i));
	        });
	      }
	      else {
	        return callback(value, index, arrayIn);
	      }
	    };

	    return recurse(arrayIn, []);
	  }
	};


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var util = __webpack_require__(160),

	      isString = util.string.isString;

	  /**
	   * Interpolate values into a string template.
	   *
	   * Syntax:
	   *
	   *     math.print(template, values)
	   *     math.print(template, values, precision)
	   *
	   * Example usage:
	   *
	   *     // the following outputs: 'Lucy is 5 years old'
	   *     math.print('Lucy is $age years old', {age: 5});
	   *
	   *     // the following outputs: 'The value of pi is 3.141592654'
	   *     math.print('The value of pi is $pi', {pi: math.pi}, 10);
	   *
	   *     // the following outputs: 'hello Mary! The date is 2013-03-23'
	   *     math.print('Hello $user.name! The date is $date', {
	   *       user: {
	   *         name: 'Mary',
	   *       },
	   *       date: new Date(2013, 2, 23).toISOString().substring(0, 10)
	   *     });
	   *
	   * See also:
	   *
	   *     format
	   *
	   * @param {String} template     A string containing variable placeholders.
	   * @param {Object} values       An object containing variables which will
	   *                              be filled in in the template.
	   * @param {Number} [precision]  Number of digits to format numbers.
	   *                              If not provided, the value will not be rounded.
	   * @return {String} Interpolated string
	   */
	  math.print = function print (template, values, precision) {
	    var num = arguments.length;
	    if (num != 2 && num != 3) {
	      throw new math.error.ArgumentsError('print', num, 2, 3);
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


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9);

	  /**
	   * Sort the items in a matrix.
	   *
	   * Syntax:
	   *
	   *    math.sort(x)
	   *    math.sort(x, compare)
	   *
	   * Examples:
	   *
	   *    math.sort([5, 10, 1]); // returns [1, 5, 10]
	   *    math.sort(['C', 'B', 'A', 'D']); // returns ['A', 'B', 'C', 'D']
	   *
	   *    function sortByLength (a, b) {
	   *      return a.length - b.length;
	   *    }
	   *    math.sort(['Langdon', 'Tom', 'Sara'], sortByLength); // returns ['Tom', 'Sara', 'Langdon']
	   *
	   * See also:
	   *
	   *    filter, forEach, map
	   *
	   * @param {Matrix | Array} x    A one dimensional matrix or array to sort
	   * @param {Function | 'asc' | 'desc'} [compare='asc']
	   *        An optional comparator function. The function is called as
	   *        `compare(a, b)`, and must return 1 when a > b, -1 when a < b,
	   *        and 0 when a == b.
	   * @return {Matrix | Array} Returns the sorted matrix.
	   */
	  math.sort = function (x, compare) {
	    var _compare = null;

	    if (arguments.length === 1) {
	      _compare = math.compare;
	    }
	    else if (arguments.length === 2) {
	      if (typeof compare === 'function') {
	        _compare = compare;
	      }
	      else if (compare === 'asc') {
	        _compare = math.compare;
	      }
	      else if (compare === 'desc') {
	        _compare = function (a, b) {
	          return -math.compare(a, b);
	        }
	      }
	      else {
	        throw new math.error.UnsupportedTypeError('sort', math['typeof'](x), math['typeof'](compare));
	      }
	    }
	    else {
	      throw new math.error.ArgumentsError('sort', arguments.length, 1, 2);
	    }

	    if (x instanceof Matrix) {
	      var size = x.size();
	      if (size.length > 1) {
	        throw new Error('Only one dimensional matrices supported');
	      }
	      return new Matrix(x.toArray().sort(_compare));
	    }
	    else if (Array.isArray(x)) {
	      return x.sort(_compare);
	    }
	    else {
	      throw new math.error.UnsupportedTypeError('sort', math['typeof'](x), math['typeof'](compare));
	    }
	  };
	};

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var types = __webpack_require__(196),

	      Complex = __webpack_require__(6),
	      Matrix = __webpack_require__(9),
	      Unit = __webpack_require__(10),
	      Index = __webpack_require__(8),
	      Range = __webpack_require__(7),
	      Help = __webpack_require__(11);

	  /**
	   * Determine the type of a variable.
	   *
	   * Function `typeof` recognizes the following types of objects:
	   *
	   * Object                 | Returns       | Example
	   * ---------------------- | ------------- | ------------------------------------------
	   * Array                  | `'array'`     | `math.typeof ([1, 2, 3])`
	   * boolean                | `'boolean'`   | `math.typeof (true)`
	   * Date                   | `'date'`      | `math.typeof (new Date())`
	   * null                   | `'null'`      | `math.typeof(null)`
	   * number                 | `'number'`    | `math.typeof(3.5)`
	   * Object                 | `'object'`    | `math.typeof ({a: 2, b: 3})`
	   * RegExp                 | `'regexp'`    | `math.typeof (/a regexp/)`
	   * string                 | `'string'`    | `math.typeof ('hello world')`
	   * undefined              | `'undefined'` | `math.typeof(undefined)`
	   * math.chaining.Chain    | `'chain'`     | `math.typeof (math.chain(2))`
	   * math.type.BigNumber    | `'bignumber'` | `math.typeof (math.bignumber('2.3e500'))`
	   * math.type.Complex      | `'complex'`   | `math.typeof (math.complex(2, 3))`
	   * math.type.Help         | `'help'`      | `math.typeof (math.help('sqrt'))`
	   * math.type.Index        | `'index'`     | `math.typeof (math.index(1, 3))`
	   * math.type.Matrix       | `'matrix'`    | `math.typeof (math.matrix([[1,2], [3, 4]]))`
	   * math.type.Range        | `'range'`     | `math.typeof (math.range(0, 10))`
	   * math.type.Unit         | `'unit'`      | `math.typeof (math.unit('45 deg'))`
	   *
	   * Syntax:
	   *
	   *    math.typeof(x)
	   *
	   * Examples:
	   *
	   *    math.typeof(3.5);                     // returns 'number'
	   *    math.typeof(math.complex('2 - 4i'));  // returns 'complex'
	   *    math.typeof(math.unit('45 deg'));     // returns 'unit'
	   *    math.typeof('hello world');           // returns 'string'
	   *
	   * @param {*} x  The variable for which to test the type.
	   * @return {String} Lower case type, for example 'number', 'string', 'array'.
	   */
	  math['typeof'] = function _typeof (x) {
	    if (arguments.length != 1) {
	      throw new math.error.ArgumentsError('typeof', arguments.length, 1);
	    }

	    // JavaScript types
	    var type = types.type(x);

	    // math.js types
	    if (type === 'object') {
	      if (x instanceof Complex) return 'complex';
	      if (x instanceof Matrix) return 'matrix';
	      if (x instanceof Unit) return 'unit';
	      if (x instanceof Index) return 'index';
	      if (x instanceof Range) return 'range';
	      if (x instanceof Help) return 'help';

	      // the following types are different instances per math.js instance
	      if (x instanceof math.type.BigNumber) return 'bignumber';
	      if (x instanceof math.chaining.Chain) return 'chain';
	    }

	    return type;
	  };
	};


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9);

	  /**
	   * Iterate over all elements of a matrix/array, and executes the given callback function.
	   *
	   * Syntax:
	   *
	   *    math.forEach(x, callback)
	   *
	   * Examples:
	   *
	   *    math.forEach([1, 2, 3], function(value) {
	   *      console.log(value);
	   *    });
	   *    // outputs 1, 2, 3
	   *
	   * See also:
	   *
	   *    filter, map, sort
	   *
	   * @param {Matrix | Array} x    The matrix to iterate on.
	   * @param {Function} callback   The callback function is invoked with three
	   *                              parameters: the value of the element, the index
	   *                              of the element, and the Matrix/array being traversed.
	   */
	  math.forEach = function (x, callback) {
	    if (arguments.length != 2) {
	      throw new math.error.ArgumentsError('forEach', arguments.length, 2);
	    }

	    if (Array.isArray(x)) {
	      return _forEachArray(x, callback);
	    } else if (x instanceof Matrix) {
	      return x.forEach(callback);
	    } else {
	      throw new math.error.UnsupportedTypeError('forEach', math['typeof'](x));
	    }
	  };

	  function _forEachArray (array, callback) {
	    var recurse = function (value, index) {
	      if (Array.isArray(value)) {
	        value.forEach(function (child, i) {
	          // we create a copy of the index array and append the new index value
	          recurse(child, index.concat(i));
	        });
	      }
	      else {
	        callback(value, index, array);
	      }
	    };
	    recurse(array, []);
	  }
	};

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var BigNumber = __webpack_require__(159);
	var isNumber = __webpack_require__(4).isNumber;
	var digits = __webpack_require__(4).digits;

	/**
	 * Test whether value is a BigNumber
	 * @param {*} value
	 * @return {Boolean} isBigNumber
	 */
	exports.isBigNumber = function (value) {
	  return (value instanceof BigNumber);
	};


	/* BigNumber constants. */


	/**
	 * Calculate BigNumber e
	 * @param {Number} precision
	 * @returns {BigNumber} Returns e
	 */
	exports.e = function (precision) {
	  var Big = BigNumber.constructor({precision: precision});

	  return new Big(1).exp();
	};

	/**
	 * Calculate BigNumber golden ratio, phi = (1+sqrt(5))/2
	 * @param {Number} precision
	 * @returns {BigNumber} Returns phi
	 */
	exports.phi = function (precision) {
	  var Big = BigNumber.constructor({precision: precision});

	  return new Big(1).plus(new Big(5).sqrt()).div(2);
	};

	/**
	 * Calculate the arc tangent of x
	 *
	 * arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + x^9/9 - ...
	 *           = x - x^2*x^1/3 + x^2*x^3/5 - x^2*x^5/7 + x^2*x^7/9 - ...
	 *
	 * @param {BigNumber} x
	 * @returns {BigNumber} arc tangent of x
	 */
	exports.arctan = function (x) {
	  var y = x;
	  var yPrev = NaN;
	  var x2 = x.times(x);
	  var num = x;
	  var sign = -1;

	  for (var k = 3; !y.equals(yPrev); k += 2) {
	    num = num.times(x2);

	    yPrev = y;
	    y = (sign > 0) ? y.plus(num.div(k)) : y.minus(num.div(k));
	    sign = -sign;
	  }

	  return y;
	};

	/**
	 * Calculate BigNumber pi.
	 *
	 * Uses Machin's formula: pi / 4 = 4 * arctan(1 / 5) - arctan(1 / 239)
	 * http://milan.milanovic.org/math/english/pi/machin.html
	 * @param {Number} precision
	 * @returns {BigNumber} Returns pi
	 */
	exports.pi = function (precision) {
	  // we calculate pi with a few decimal places extra to prevent round off issues
	  var Big = BigNumber.constructor({precision: precision + 4});
	  var pi4th = new Big(4).times(exports.arctan(new Big(1).div(5)))
	      .minus(exports.arctan(new Big(1).div(239)));

	  Big.config({precision: precision});

	  // the final pi has the requested number of decimals
	  return new Big(4).times(pi4th);
	};

	/**
	 * Calculate BigNumber tau, tau = 2 * pi
	 * @param {Number} precision
	 * @returns {BigNumber} Returns tau
	 */
	exports.tau = function (precision) {
	  // we calculate pi at a slightly higher precision than configured to prevent round off errors
	  // when multiplying by two in the end

	  var pi = exports.pi(precision + 2);

	  var Big = BigNumber.constructor({precision: precision});

	  return new Big(2).times(pi);
	};


	/* BigNumber functions. */


	/*
	 * Special Cases:
	 *   N &  n =  N
	 *   n &  0 =  0
	 *   n & -1 =  n
	 *   n &  n =  n
	 *   I &  I =  I
	 *  -I & -I = -I
	 *   I & -I =  0
	 *   I &  n =  n
	 *   I & -n =  I
	 *  -I &  n =  0
	 *  -I & -n = -I
	 *
	 * @param {BigNumber} value
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of `x` & `y`, is fully precise
	 *
	 */
	exports.and = function(x, y) {
	  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
	    throw new Error('Parameters in function bitAnd must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  if (x.isNaN() || y.isNaN()) {
	    return new BigNumber(NaN);
	  }

	  if (x.isZero() || y.eq(-1) || x.eq(y)) {
	    return x;
	  }
	  if (y.isZero() || x.eq(-1)) {
	    return y;
	  }

	  if (!x.isFinite() || !y.isFinite()) {
	    if (!x.isFinite() && !y.isFinite()) {
	      if (x.isNegative() == y.isNegtive()) {
	        return x;
	      }
	      return new BigNumber(0);
	    }
	    if (!x.isFinite()) {
	      if (y.isNegative()) {
	        return x;
	      }
	      if (x.isNegative()) {
	        return new BigNumber(0);
	      }
	      return y;
	    }
	    if (!y.isFinite()) {
	      if (x.isNegative()) {
	        return y;
	      }
	      if (y.isNegative()) {
	        return new BigNumber(0);
	      }
	      return x;
	    }
	  }
	  return bitwise(x, y, function (a, b) { return a & b });
	};

	/*
	 * Special Cases:
	 *  n << -n = N
	 *  n <<  N = N
	 *  N <<  n = N
	 *  n <<  0 = n
	 *  0 <<  n = 0
	 *  I <<  I = N
	 *  I <<  n = I
	 *  n <<  I = I
	 *
	 * @param {BigNumber} value
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of `x` << `y`
	 *
	 */
	exports.leftShift = function (x, y) {
	  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
	    throw new Error('Parameters in function leftShift must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
	    return new BigNumber(NaN);
	  }
	  if (x.isZero() || y.isZero()) {
	    return x;
	  }
	  if (!x.isFinite() && !y.isFinite()) {
	    return new BigNumber(NaN);
	  }

	  // Math.pow(2, y) is fully precise for y < 55, and fast
	  if (y.lt(55)) {
	    return x.times(Math.pow(2, y.toNumber()) + '');
	  }
	  return x.times(new BigNumber(2).pow(y));
	};

	/*
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of ~`x`, fully precise
	 *
	 */
	exports.not = function (x) {
	  if (x.isFinite() && !x.isInteger()) {
	    throw new Error('Parameter in function bitNot must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  var prevPrec = BigNumber['precision'];
	  BigNumber['precision'] = 1E9;

	  var x = x.plus(BigNumber['ONE']);
	  x['s'] = -x['s'] || null;

	  BigNumber['precision'] = prevPrec;
	  return x;
	};

	/*
	 * Special Cases:
	 *   N |  n =  N
	 *   n |  0 =  n
	 *   n | -1 = -1
	 *   n |  n =  n
	 *   I |  I =  I
	 *  -I | -I = -I
	 *   I | -n = -1
	 *   I | -I = -1
	 *   I |  n =  I
	 *  -I |  n = -I
	 *  -I | -n = -n
	 *
	 * @param {BigNumber} value
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of `x` | `y`, fully precise
	 *
	 */
	exports.or = function (x, y) {
	  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
	    throw new Error('Parameters in function bitOr must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  if (x.isNaN() || y.isNaN()) {
	    return new BigNumber(NaN);
	  }

	  var negOne = new BigNumber(-1);
	  if (x.isZero() || y.eq(negOne) || x.eq(y)) {
	    return y;
	  }
	  if (y.isZero() || x.eq(negOne)) {
	    return x;
	  }

	  if (!x.isFinite() || !y.isFinite()) {
	    if ((!x.isFinite() && !x.isNegative() && y.isNegative()) ||
	           (x.isNegative() && !y.isNegative() && !y.isFinite())) {
	        return negOne;
	    }
	    if (x.isNegative() && y.isNegative()) {
	        return x.isFinite() ? x : y;
	    }
	    return x.isFinite() ? y : x;
	  }
	  return bitwise(x, y, function (a, b) { return a | b });
	};

	/*
	 * Special Cases:
	 *   n >> -n =  N
	 *   n >>  N =  N
	 *   N >>  n =  N
	 *   I >>  I =  N
	 *   n >>  0 =  n
	 *   I >>  n =  I
	 *  -I >>  n = -I
	 *  -I >>  I = -I
	 *   n >>  I =  I
	 *  -n >>  I = -1
	 *   0 >>  n =  0
	 *
	 * @param {BigNumber} value
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of `x` >> `y`
	 *
	 */
	exports.rightShift = function (x, y) {
	  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
	    throw new Error('Parameters in function rightArithShift must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  if (x.isNaN() || y.isNaN() || (y.isNegative() && !y.isZero())) {
	    return new BigNumber(NaN);
	  }
	  if (x.isZero() || y.isZero()) {
	    return x;
	  }
	  if (!y.isFinite()) {
	    if (x.isNegative()) {
	      return new BigNumber(-1);
	    }
	    if (!x.isFinite()) {
	      return new BigNumber(NaN);
	    }
	    return new BigNumber(0);
	  }

	  // Math.pow(2, y) is fully precise for y < 55, and fast
	  if (y.lt(55)) {
	    return x.div(Math.pow(2, y.toNumber()) + '').floor();
	  }
	  return x.div(new BigNumber(2).pow(y)).floor();
	};

	/*
	 * Special Cases:
	 *   N ^  n =  N
	 *   n ^  0 =  n
	 *   n ^  n =  0
	 *   n ^ -1 = ~n
	 *   I ^  n =  I
	 *   I ^ -n = -I
	 *   I ^ -I = -1
	 *  -I ^  n = -I
	 *  -I ^ -n =  I
	 *
	 * @param {BigNumber} value
	 * @param {BigNumber} value
	 * @return {BigNumber} Result of `x` ^ `y`, fully precise
	 *
	 */
	exports.xor = function (x, y) {
	  if ((x.isFinite() && !x.isInteger()) || (y.isFinite() && !y.isInteger())) {
	    throw new Error('Parameters in function bitXor must be integer numbers');
	  }

	  var BigNumber = x['constructor'];
	  if (x.isNaN() || y.isNaN()) {
	    return new BigNumber(NaN);
	  }
	  if (x.isZero()) {
	    return y;
	  }
	  if (y.isZero()) {
	    return x;
	  }

	  if (x.eq(y)) {
	    return new BigNumber(0);
	  }

	  var negOne = new BigNumber(-1);
	  if (x.eq(negOne)) {
	    return exports.not(y);
	  }
	  if (y.eq(negOne)) {
	    return exports.not(x);
	  }

	  if (!x.isFinite() || !y.isFinite()) {
	    if (!x.isFinite() && !y.isFinite()) {
	      return negOne;
	    }
	    return new BigNumber(x.isNegative() == y.isNegative()
	      ?  Infinity
	      : -Infinity);
	  }
	  return bitwise(x, y, function (a, b) { return a ^ b });
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
	 *                         'exponential'    Always use exponential notation.
	 *                                          For example '1.234e+2' and '1.4e+7'
	 *                         'auto' (default) Regular number notation for numbers
	 *                                          having an absolute value between
	 *                                          `lower` and `upper` bounds, and uses
	 *                                          exponential notation elsewhere.
	 *                                          Lower bound is included, upper bound
	 *                                          is excluded.
	 *                                          For example '123.4' and '1.4e7'.
	 *                     {Number} precision   A number between 0 and 16 to round
	 *                                          the digits of the number.
	 *                                          In case of notations 'exponential' and
	 *                                          'auto', `precision` defines the total
	 *                                          number of significant digits returned
	 *                                          and is undefined by default.
	 *                                          In case of notation 'fixed',
	 *                                          `precision` defines the number of
	 *                                          significant digits after the decimal
	 *                                          point, and is 0 by default.
	 *                     {Object} exponential An object containing two parameters,
	 *                                          {Number} lower and {Number} upper,
	 *                                          used by notation 'auto' to determine
	 *                                          when to return exponential notation.
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
	 *    format(52.8,   {notation: 'exponential'});          // '5.28e+1'
	 *
	 * @param {BigNumber} value
	 * @param {Object | Function | Number} [options]
	 * @return {String} str The formatted value
	 */
	exports.format = function(value, options) {
	  if (typeof options === 'function') {
	    // handle format(value, fn)
	    return options(value);
	  }

	  // handle special cases
	  if (!value.isFinite()) {
	    return value.isNaN() ? 'NaN' : (value.gt(0) ? 'Infinity' : '-Infinity');
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
	    if (isNumber(options)) {
	      precision = options;
	    }
	    else if (options.precision) {
	      precision = options.precision;
	    }
	  }

	  // handle the various notations
	  switch (notation) {
	    case 'fixed':
	      return exports.toFixed(value, precision);

	    case 'exponential':
	      return exports.toExponential(value, precision);

	    case 'auto':
	      // determine lower and upper bound for exponential notation.
	        // TODO: implement support for upper and lower to be BigNumbers themselves
	      var lower = 1e-3;
	      var upper = 1e5;
	      if (options && options.exponential) {
	        if (options.exponential.lower !== undefined) {
	          lower = options.exponential.lower;
	        }
	        if (options.exponential.upper !== undefined) {
	          upper = options.exponential.upper;
	        }
	      }

	      // adjust the configuration of the BigNumber constructor (yeah, this is quite tricky...)
	      var oldConfig = {
	        toExpNeg: value.constructor.toExpNeg,
	        toExpPos: value.constructor.toExpPos
	      };

	      value.constructor.config({
	        toExpNeg: Math.round(Math.log(lower) / Math.LN10),
	        toExpPos: Math.round(Math.log(upper) / Math.LN10)
	      });

	      // handle special case zero
	      if (value.isZero()) return '0';

	      // determine whether or not to output exponential notation
	      var str;
	      var abs = value.abs();
	      if (abs.gte(lower) && abs.lt(upper)) {
	        // normal number notation
	        str = value.toSignificantDigits(precision).toFixed();
	      }
	      else {
	        // exponential notation
	        str = exports.toExponential(value, precision);
	      }

	      // remove trailing zeros after the decimal point
	      return str.replace(/((\.\d*?)(0+))($|e)/, function () {
	        var digits = arguments[2];
	        var e = arguments[4];
	        return (digits !== '.') ? digits + e : e;
	      });

	    default:
	      throw new Error('Unknown notation "' + notation + '". ' +
	          'Choose "auto", "exponential", or "fixed".');
	  }
	};

	/**
	 * Format a number in exponential notation. Like '1.23e+5', '2.3e+0', '3.500e-3'
	 * @param {BigNumber} value
	 * @param {Number} [precision]  Number of digits in formatted output.
	 *                              If not provided, the maximum available digits
	 *                              is used.
	 * @returns {string} str
	 */
	exports.toExponential = function(value, precision) {
	  if (precision !== undefined) {
	    return value.toExponential(precision - 1); // Note the offset of one
	  }
	  else {
	    return value.toExponential();
	  }
	};

	/**
	 * Format a number with fixed notation.
	 * @param {BigNumber} value
	 * @param {Number} [precision=0]        Optional number of decimals after the
	 *                                      decimal point. Zero by default.
	 */
	exports.toFixed = function(value, precision) {
	  return value.toFixed(precision || 0);
	  // Note: the (precision || 0) is needed as the toFixed of BigNumber has an
	  // undefined default precision instead of 0.
	};


	/* Private functions. */


	function bitwise(x, y, func) {
	  var BigNumber = x['constructor'];

	  var xBits, yBits;
	  var xSign = +(x['s'] < 0);
	  var ySign = +(y['s'] < 0);
	  if (xSign) {
	    xBits = decToBinary(coefficientToString(exports.not(x)));
	    for (var i = 0; i < xBits.length; ++i) {
	      xBits[i] ^= 1;
	    }
	  } else {
	    xBits = decToBinary(coefficientToString(x));
	  }
	  if (ySign) {
	    yBits = decToBinary(coefficientToString(exports.not(y)));
	    for (var i = 0; i < yBits.length; ++i) {
	      yBits[i] ^= 1;
	    }
	  } else {
	    yBits = decToBinary(coefficientToString(y));
	  }

	  var minBits, maxBits, minSign;
	  if (xBits.length <= yBits.length) {
	    minBits = xBits;
	    maxBits = yBits;
	    minSign = xSign;
	  } else {
	    minBits = yBits;
	    maxBits = xBits;
	    minSign = ySign;
	  }

	  var shortLen = minBits.length;
	  var longLen = maxBits.length;
	  var expFuncVal = func(xSign, ySign) ^ 1;
	  var outVal = new BigNumber(expFuncVal ^ 1);
	  var twoPower = BigNumber['ONE'];
	  var two = new BigNumber(2);

	  var prevPrec = BigNumber['precision'];
	  BigNumber['precision'] = 1E9;

	  while (shortLen > 0) {
	    if (func(minBits[--shortLen], maxBits[--longLen]) == expFuncVal) {
	      outVal = outVal.plus(twoPower);
	    }
	    twoPower = twoPower.times(two);
	  }
	  while (longLen > 0) {
	    if (func(minSign, maxBits[--longLen]) == expFuncVal) {
	      outVal = outVal.plus(twoPower);
	    }
	    twoPower = twoPower.times(two);
	  }

	  BigNumber['precision'] = prevPrec;

	  if (expFuncVal == 0) {
	    outVal['s'] = -outVal['s'];
	  }
	  return outVal;
	}


	/* Private functions extracted from decimal.js, and edited to specialize. */


	function coefficientToString(x) {
	  var a = x['c'];
	  var r = a[0] + '';

	  for (var i = 1; i < a.length; ++i) {
	    var s = a[i] + '';
	    for (var z = 7 - s.length; z--; ) {
	      s = '0' + s;
	    }

	    r += s;
	  }

	  var j;
	  for (j = r.length - 1; r.charAt(j) == '0'; --j);

	  var xe = x['e'];
	  var str = r.slice(0, j + 1 || 1);
	  var strL = str.length;
	  if (xe > 0) {
	    if (++xe > strL) {
	      // Append zeros.
	      for (xe -= strL; xe--; str += '0');
	    } else if (xe < strL) {
	      str = str.slice(0, xe) + '.' + str.slice(xe);
	    }
	  }
	  return str;
	}

	function decToBinary(str) {
	  var arr = [0];
	  for (var i = 0; i < str.length; ) {
	    for (var arrL = arr.length; arrL--; arr[arrL] *= 10);

	    arr[0] += str.charAt(i++) << 0;  // convert to int
	    for (var j = 0; j < arr.length; ++j) {
	      if (arr[j] > 1) {
	        if (arr[j + 1] == null) {
	          arr[j + 1] = 0;
	        }

	        arr[j + 1] += arr[j] >> 1;
	        arr[j] &= 1;
	      }
	    }
	  }

	  return arr.reverse();
	}


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var number = __webpack_require__(4),
	    string = __webpack_require__(176),
	    object = __webpack_require__(3),
	    types = __webpack_require__(196),

	    DimensionError = __webpack_require__(156),
	    IndexError = __webpack_require__(157),

	    isArray = Array.isArray;

	/**
	 * Calculate the size of a multi dimensional array.
	 * @param {Array} x
	 * @Return {Number[]} size
	 * @private
	 */
	function _size(x) {
	  var size = [];

	  while (isArray(x)) {
	    size.push(x.length);
	    x = x[0];
	  }

	  return size;
	}

	/**
	 * Calculate the size of a multi dimensional array.
	 * All elements in the array are checked for matching dimensions using the
	 * method validate
	 * @param {Array} x
	 * @Return {Number[]} size
	 * @throws RangeError
	 */
	exports.size = function(x) {
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
	 * @throws DimensionError
	 * @private
	 */
	function _validate(array, size, dim) {
	  var i;
	  var len = array.length;

	  if (len != size[dim]) {
	    throw new DimensionError(len, size[dim]);
	  }

	  if (dim < size.length - 1) {
	    // recursively validate each child array
	    var dimNext = dim + 1;
	    for (i = 0; i < len; i++) {
	      var child = array[i];
	      if (!isArray(child)) {
	        throw new DimensionError(size.length - 1, size.length, '<');
	      }
	      _validate(array[i], size, dimNext);
	    }
	  }
	  else {
	    // last dimension. none of the childs may be an array
	    for (i = 0; i < len; i++) {
	      if (isArray(array[i])) {
	        throw new DimensionError(size.length + 1, size.length, '>');
	      }
	    }
	  }
	}

	/**
	 * Validate whether each element in a multi dimensional array has
	 * a size corresponding to the provided size array.
	 * @param {Array} array    Array to be validated
	 * @param {Number[]} size  Array with the size of each dimension
	 * @throws DimensionError
	 */
	exports.validate = function(array, size) {
	  var isScalar = (size.length == 0);
	  if (isScalar) {
	    // scalar
	    if (isArray(array)) {
	      throw new DimensionError(array.length, 0);
	    }
	  }
	  else {
	    // array
	    _validate(array, size, 0);
	  }
	};

	/**
	 * Test whether index is an integer number with index >= 0 and index < length
	 * @param {Number} index    Zero-based index
	 * @param {Number} [length] Length of the array
	 */
	exports.validateIndex = function(index, length) {
	  if (!number.isNumber(index) || !number.isInteger(index)) {
	    throw new TypeError('Index must be an integer (value: ' + index + ')');
	  }
	  if (index < 0) {
	    throw new IndexError(index);
	  }
	  if (length !== undefined && index >= length) {
	    throw new IndexError(index, length);
	  }
	};

	// a constant used to specify an undefined defaultValue
	exports.UNINITIALIZED = {};

	/**
	 * Resize a multi dimensional array. The resized array is returned.
	 * @param {Array} array         Array to be resized
	 * @param {Array.<Number>} size Array with the size of each dimension
	 * @param {*} [defaultValue=0]  Value to be filled in in new entries,
	 *                              zero by default. To leave new entries undefined,
	 *                              specify array.UNINITIALIZED as defaultValue
	 * @return {Array} array         The resized array
	 */
	exports.resize = function(array, size, defaultValue) {
	  // TODO: add support for scalars, having size=[] ?

	  // check the type of the arguments
	  if (!isArray(array) || !isArray(size)) {
	    throw new TypeError('Array expected');
	  }
	  if (size.length === 0) {
	    throw new Error('Resizing to scalar is not supported');
	  }

	  // check whether size contains positive integers
	  size.forEach(function (value) {
	    if (!number.isNumber(value) || !number.isInteger(value) || value < 0) {
	      throw new TypeError('Invalid size, must contain positive integers ' +
	          '(size: ' + string.format(size) + ')');
	    }
	  });

	  // recursively resize the array
	  var _defaultValue = (defaultValue !== undefined) ? defaultValue : 0;
	  _resize(array, size, 0, _defaultValue);

	  return array;
	};

	/**
	 * Recursively resize a multi dimensional array
	 * @param {Array} array         Array to be resized
	 * @param {Number[]} size       Array with the size of each dimension
	 * @param {Number} dim          Current dimension
	 * @param {*} [defaultValue]    Value to be filled in in new entries,
	 *                              undefined by default.
	 * @private
	 */
	function _resize (array, size, dim, defaultValue) {
	  var i;
	  var elem;
	  var oldLen = array.length;
	  var newLen = size[dim];
	  var minLen = Math.min(oldLen, newLen);

	  // apply new length
	  array.length = newLen;

	  if (dim < size.length - 1) {
	    // non-last dimension
	    var dimNext = dim + 1;

	    // resize existing child arrays
	    for (i = 0; i < minLen; i++) {
	      // resize child array
	      elem = array[i];
	      if (!isArray(elem)) {
	        elem = [elem]; // add a dimension
	        array[i] = elem;
	      }
	      _resize(elem, size, dimNext, defaultValue);
	    }

	    // create new child arrays
	    for (i = minLen; i < newLen; i++) {
	      // get child array
	      elem = [];
	      array[i] = elem;

	      // resize new child array
	      _resize(elem, size, dimNext, defaultValue);
	    }
	  }
	  else {
	    // last dimension

	    // remove dimensions of existing values
	    for (i = 0; i < minLen; i++) {
	      while (isArray(array[i])) {
	        array[i] = array[i][0];
	      }
	    }

	    if(defaultValue !== exports.UNINITIALIZED) {
	      // fill new elements with the default value
	      for (i = minLen; i < newLen; i++) {
	        array[i] = object.clone(defaultValue);
	      }
	    }
	  }
	}

	/**
	 * Squeeze a multi dimensional array
	 * @param {Array} array
	 * @param {Array} [size]
	 * @returns {Array} returns the array itself
	 * @private
	 */
	exports.squeeze = function(array, size) {
	  var s = size || exports.size(array);

	  // squeeze outer dimensions
	  while (isArray(array) && array.length === 1) {
	    array = array[0];
	    s.shift();
	  }

	  // find the first dimension to be squeezed
	  var dims = s.length;
	  while (s[dims - 1] === 1) {
	    dims--;
	  }

	  // squeeze inner dimensions
	  if (dims < s.length) {
	    array = _squeeze(array, dims, 0);
	    s.length = dims;
	  }

	  return array;
	};

	/**
	 * Recursively squeeze a multi dimensional array
	 * @param {Array} array
	 * @param {number} dims Required number of dimensions
	 * @param {number} dim  Current dimension
	 * @returns {Array | *} Returns the squeezed array
	 * @private
	 */
	function _squeeze (array, dims, dim) {
	  var i, ii;

	  if (dim < dims) {
	    var next = dim + 1;
	    for (i = 0, ii = array.length; i < ii; i++) {
	      array[i] = _squeeze(array[i], dims, next);
	    }
	  }
	  else {
	    while (isArray(array)) {
	      array = array[0];
	    }
	  }

	  return array;
	}

	/**
	 * Unsqueeze a multi dimensional array: add dimensions when missing
	 * @param {Array} array
	 * @param {Number} dims     Desired number of dimensions of the array
	 * @param {Number} [outer]  Number of outer dimensions to be added
	 * @param {Array} [size]    Current size of array
	 * @returns {Array} returns the array itself
	 * @private
	 */
	exports.unsqueeze = function(array, dims, outer, size) {
	  var s = size || exports.size(array);

	  // unsqueeze outer dimensions
	  if (outer) {
	    for (var i = 0; i < outer; i++) {
	      array = [array];
	      s.unshift(1);
	    }
	  }

	  // unsqueeze inner dimensions
	  array = _unsqueeze(array, dims, 0);
	  while (s.length < dims) {
	    s.push(1);
	  }

	  return array;
	};

	/**
	 * Recursively unsqueeze a multi dimensional array
	 * @param {Array} array
	 * @param {number} dims Required number of dimensions
	 * @param {number} dim  Current dimension
	 * @returns {Array | *} Returns the squeezed array
	 * @private
	 */
	function _unsqueeze (array, dims, dim) {
	  var i, ii;

	  if (isArray(array)) {
	    var next = dim + 1;
	    for (i = 0, ii = array.length; i < ii; i++) {
	      array[i] = _unsqueeze(array[i], dims, next);
	    }
	  }
	  else {
	    for (var d = dim; d < dims; d++) {
	      array = [array];
	    }
	  }

	  return array;
	}
	/**
	 * Flatten a multi dimensional array, put all elements in a one dimensional
	 * array
	 * @param {Array} array   A multi dimensional array
	 * @return {Array}        The flattened array (1 dimensional)
	 * @private
	 */
	exports.flatten = function(array) {
	  var flat = array,
	      isArray = Array.isArray;

	  while (isArray(flat[0])) {
	    var next = [];
	    for (var i = 0, ii = flat.length; i < ii; i++) {
	      next = next.concat.apply(next, flat[i]);
	    }
	    flat = next;
	  }

	  return flat;
	};

	/**
	 * Convert function arguments to an array.
	 * @param {Arguments} args
	 * @returns {Array} array
	 */
	exports.argsToArray = function(args) {
	  var array = [];
	  for (var i = 0, len = args.length; i < len; i++) {
	    array[i] = args[i];
	  }
	  return array;
	};

	/**
	 * Test whether an object is an array
	 * @param {*} value
	 * @return {Boolean} isArray
	 */
	exports.isArray = isArray;

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = '1.2.0';
	// Note: This file is automatically generated when building math.js.
	// Changes made in this file will be overwritten.


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Create a syntax error with the message:
	 *     'Wrong number of arguments in function <fn> (<count> provided, <min>-<max> expected)'
	 * @param {String} fn     Function name
	 * @param {Number} count  Actual argument count
	 * @param {Number} min    Minimum required argument count
	 * @param {Number} [max]  Maximum required argument count
	 * @extends Error
	 */
	function ArgumentsError(fn, count, min, max) {
	  if (!(this instanceof ArgumentsError)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.fn = fn;
	  this.count = count;
	  this.min = min;
	  this.max = max;

	  this.message = 'Wrong number of arguments in function ' + fn +
	      ' (' + count + ' provided, ' +
	      min + ((max != undefined) ? ('-' + max) : '') + ' expected)';

	  this.stack = (new Error()).stack;
	}

	ArgumentsError.prototype = new Error();
	ArgumentsError.prototype.constructor = Error;
	ArgumentsError.prototype.name = 'ArgumentsError';

	module.exports = ArgumentsError;


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Create a range error with the message:
	 *     'Dimension mismatch (<actual size> != <expected size>)'
	 * @param {number | number[]} actual        The actual size
	 * @param {number | number[]} expected      The expected size
	 * @param {string} [relation='!=']          Optional relation between actual
	 *                                          and expected size: '!=', '<', etc.
	 * @extends RangeError
	 */
	function DimensionError(actual, expected, relation) {
	  if (!(this instanceof DimensionError)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.actual   = actual;
	  this.expected = expected;
	  this.relation = relation;

	  this.message = 'Dimension mismatch (' +
	      (Array.isArray(actual) ? ('[' + actual.join(', ') + ']') : actual) +
	      ' ' + (this.relation || '!=') + ' ' +
	      (Array.isArray(expected) ? ('[' + expected.join(', ') + ']') : expected) +
	      ')';

	  this.stack = (new Error()).stack;
	}

	DimensionError.prototype = new RangeError();
	DimensionError.prototype.constructor = RangeError;
	DimensionError.prototype.name = 'DimensionError';

	module.exports = DimensionError;


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Create a range error with the message:
	 *     'Index out of range (index < min)'
	 *     'Index out of range (index < max)'
	 *
	 * @param {number} index     The actual index
	 * @param {number} [min=0]   Minimum index (included)
	 * @param {number} [max]     Maximum index (excluded)
	 * @extends RangeError
	 */
	function IndexError(index, min, max) {
	  if (!(this instanceof IndexError)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.index = index;
	  if (arguments.length < 3) {
	    this.min = 0;
	    this.max = min;
	  }
	  else {
	    this.min = min;
	    this.max = max;
	  }

	  if (this.min !== undefined && this.index < this.min) {
	    this.message = 'Index out of range (' + this.index + ' < ' + this.min + ')';
	  }
	  else if (this.max !== undefined && this.index >= this.max) {
	    this.message = 'Index out of range (' + this.index + ' > ' + (this.max - 1) + ')';
	  }
	  else {
	    this.message = 'Index out of range (' + this.index + ')';
	  }

	  this.stack = (new Error()).stack;
	}

	IndexError.prototype = new RangeError();
	IndexError.prototype.constructor = RangeError;
	IndexError.prototype.name = 'IndexError';

	module.exports = IndexError;


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Create a TypeError with message:
	 *      'Function <fn> does not support a parameter of type <type>';
	 * @param {String} fn     Function name
	 * @param {*...} [types]  The types of the function arguments
	 * @extends TypeError
	 */
	function UnsupportedTypeError(fn, types) {
	  if (!(this instanceof UnsupportedTypeError)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.fn = fn;
	  this.types = Array.prototype.splice.call(arguments, 1);

	  if (!fn) {
	    this.message = 'Unsupported type of argument';
	  }
	  else {
	    if (this.types.length == 0) {
	      this.message = 'Unsupported type of argument in function ' + fn;
	    }
	    else {
	      this.message = 'Function ' + fn + '(' + this.types.join(', ') + ') not supported';
	    }
	  }

	  this.stack = (new Error()).stack;
	}

	UnsupportedTypeError.prototype = new TypeError();
	UnsupportedTypeError.prototype.constructor = TypeError;
	UnsupportedTypeError.prototype.name = 'UnsupportedTypeError';

	module.exports = UnsupportedTypeError;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*! decimal.js v4.0.1 https://github.com/MikeMcl/decimal.js/LICENCE */
	;(function (global) {
	    'use strict';


	    /*
	     *  decimal.js v4.0.1
	     *  An arbitrary-precision Decimal type for JavaScript.
	     *  https://github.com/MikeMcl/decimal.js
	     *  Copyright (c) 2014 Michael Mclaughlin <M8ch88l@gmail.com>
	     *  MIT Expat Licence
	     */


	    var convertBase, decimal, noConflict,
	        crypto = global['crypto'],
	        external = true,
	        id = 0,
	        mathfloor = Math.floor,
	        mathpow = Math.pow,
	        outOfRange,
	        toString = Object.prototype.toString,
	        BASE = 1e7,
	        LOGBASE = 7,
	        NUMERALS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',
	        P = {},

	        /*
	         The maximum exponent magnitude.
	         The limit on the value of toExpNeg, toExpPos, minE and maxE.
	         */
	        EXP_LIMIT = 9e15,                      // 0 to 9e15

	        /*
	         The limit on the value of precision, and on the argument to toDecimalPlaces,
	         toExponential, toFixed, toFormat, toPrecision and toSignificantDigits.
	         */
	        MAX_DIGITS = 1E9,                      // 0 to 1e+9

	        /*
	         To decide whether or not to calculate x.pow(integer y) using the 'exponentiation by
	         squaring' algorithm or by exp(y*ln(x)), the number of significant digits of x is multiplied
	         by y. If this number is less than INT_POW_LIMIT then the former algorithm is used.
	         */
	        INT_POW_LIMIT = 3000,                  // 0 to 5000

	        // The natural logarithm of 10 (1025 digits).
	        LN10 = '2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058';


	    // Decimal prototype methods


	    /*
	     * Return a new Decimal whose value is the absolute value of this Decimal.
	     *
	     */
	    P['absoluteValue'] = P['abs'] = function () {
	        var x = new this['constructor'](this);

	        if ( x['s'] < 0 ) {
	            x['s'] = 1;
	        }

	        return rnd(x);
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in
	     * the direction of positive Infinity.
	     *
	     */
	    P['ceil'] = function () {

	        return rnd( new this['constructor'](this), this['e'] + 1, 2 );
	    };


	    /*
	     * Return
	     *   1    if the value of this Decimal is greater than the value of Decimal(y, b),
	     *  -1    if the value of this Decimal is less than the value of Decimal(y, b),
	     *   0    if they have the same value,
	     *  null  if the value of either Decimal is NaN.
	     *
	     */
	    P['comparedTo'] = P['cmp'] = function ( y, b ) {
	        var a,
	            x = this,
	            xc = x['c'],
	            yc = ( id = -id, y = new x['constructor']( y, b ), y['c'] ),
	            i = x['s'],
	            j = y['s'],
	            k = x['e'],
	            l = y['e'];

	        // Either NaN?
	        if ( !i || !j ) {
	            return null;
	        }

	        a = xc && !xc[0];
	        b = yc && !yc[0];

	        // Either zero?
	        if ( a || b ) {
	            return a ? b ? 0 : -j : i;
	        }

	        // Signs differ?
	        if ( i != j ) {
	            return i;
	        }

	        a = i < 0;

	        // Either Infinity?
	        if ( !xc || !yc ) {
	            return k == l ? 0 : !xc ^ a ? 1 : -1;
	        }

	        // Compare exponents.
	        if ( k != l ) {
	            return k > l ^ a ? 1 : -1;
	        }

	        // Compare digit by digit.
	        for ( i = -1,
	              j = ( k = xc.length ) < ( l = yc.length ) ? k : l;
	              ++i < j; ) {

	            if ( xc[i] != yc[i] ) {
	                return xc[i] > yc[i] ^ a ? 1 : -1;
	            }
	        }

	        // Compare lengths.
	        return k == l ? 0 : k > l ^ a ? 1 : -1;
	    };


	    /*
	     * Return the number of decimal places of the value of this Decimal.
	     *
	     */
	     P['decimalPlaces'] = P['dp'] = function () {
	        var c, v,
	            n = null;

	        if ( c = this['c'] ) {
	            n = ( ( v = c.length - 1 ) - mathfloor( this['e'] / LOGBASE ) ) * LOGBASE;

	            if ( v = c[v] ) {

	                // Subtract the number of trailing zeros of the last number.
	                for ( ; v % 10 == 0; v /= 10, n-- );
	            }

	            if ( n < 0 ) {
	                n = 0;
	            }
	        }

	        return n;
	    };


	    /*
	     *  n / 0 = I
	     *  n / N = N
	     *  n / I = 0
	     *  0 / n = 0
	     *  0 / 0 = N
	     *  0 / N = N
	     *  0 / I = 0
	     *  N / n = N
	     *  N / 0 = N
	     *  N / N = N
	     *  N / I = N
	     *  I / n = I
	     *  I / 0 = I
	     *  I / N = N
	     *  I / I = N
	     *
	     * Return a new Decimal whose value is the value of this Decimal divided by Decimal(y, b),
	     * rounded to precision significant digits using rounding mode rounding.
	     *
	     */
	    P['dividedBy'] = P['div'] = function ( y, b ) {
	        id = 2;

	        return div( this, new this['constructor']( y, b ) );
	    };


	    /*
	     * Return a new Decimal whose value is the integer part of dividing the value of this Decimal by
	     * the value of Decimal(y, b), rounded to precision significant digits using rounding mode
	     * rounding.
	     *
	     */
	    P['dividedToIntegerBy'] = P['divToInt'] = function ( y, b ) {
	        var x = this,
	            Decimal = x['constructor'];
	        id = 18;

	        return rnd(
	          div( x, new Decimal( y, b ), 0, 1, 1 ), Decimal['precision'], Decimal['rounding']
	        );
	    };


	    /*
	     * Return true if the value of this Decimal is equal to the value of Decimal(n, b), otherwise
	     * return false.
	     *
	     */
	    P['equals'] = P['eq'] = function ( n, b ) {
	        id = 3;

	        return this['cmp']( n, b ) === 0;
	    };


	    /*
	     * Return a new Decimal whose value is the exponential of the value of this Decimal, i.e. the
	     * base e raised to the power the value of this Decimal, rounded to precision significant digits
	     * using rounding mode rounding.
	     *
	     */
	    P['exponential'] = P['exp'] = function () {

	        return exp(this);
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal rounded to a whole number in
	     * the direction of negative Infinity.
	     *
	     */
	    P['floor'] = function () {

	        return rnd( new this['constructor'](this), this['e'] + 1, 3 );
	    };


	    /*
	     * Return true if the value of this Decimal is greater than the value of Decimal(n, b), otherwise
	     * return false.
	     *
	     */
	    P['greaterThan'] = P['gt'] = function ( n, b ) {
	        id = 4;

	        return this['cmp']( n, b ) > 0;
	    };


	    /*
	     * Return true if the value of this Decimal is greater than or equal to the value of
	     * Decimal(n, b), otherwise return false.
	     *
	     */
	    P['greaterThanOrEqualTo'] = P['gte'] = function ( n, b ) {
	        id = 5;
	        b = this['cmp']( n, b );

	        return b == 1 || b === 0;
	    };


	    /*
	     * Return true if the value of this Decimal is a finite number, otherwise return false.
	     *
	     */
	    P['isFinite'] = function () {

	        return !!this['c'];
	    };


	    /*
	     * Return true if the value of this Decimal is an integer, otherwise return false.
	     *
	     */
	    P['isInteger'] = P['isInt'] = function () {

	        return !!this['c'] && mathfloor( this['e'] / LOGBASE ) > this['c'].length - 2;
	    };


	    /*
	     * Return true if the value of this Decimal is NaN, otherwise return false.
	     *
	     */
	    P['isNaN'] = function () {

	        return !this['s'];
	    };


	    /*
	     * Return true if the value of this Decimal is negative, otherwise return false.
	     *
	     */
	    P['isNegative'] = P['isNeg'] = function () {

	        return this['s'] < 0;
	    };


	    /*
	     * Return true if the value of this Decimal is 0 or -0, otherwise return false.
	     *
	     */
	    P['isZero'] = function () {

	        return !!this['c'] && this['c'][0] == 0;
	    };


	    /*
	     * Return true if the value of this Decimal is less than Decimal(n, b), otherwise return false.
	     *
	     */
	    P['lessThan'] = P['lt'] = function ( n, b ) {
	        id = 6;

	        return this['cmp']( n, b ) < 0;
	    };


	    /*
	     * Return true if the value of this Decimal is less than or equal to Decimal(n, b), otherwise
	     * return false.
	     *
	     */
	    P['lessThanOrEqualTo'] = P['lte'] = function ( n, b ) {
	        id = 7;
	        b = this['cmp']( n, b );

	        return b == -1 || b === 0;
	    };


	    /*
	     * Return the logarithm of the value of this Decimal to the specified base, rounded
	     * to precision significant digits using rounding mode rounding.
	     *
	     * If no base is specified, return log[10](arg).
	     *
	     * log[base](arg) = ln(arg) / ln(base)
	     *
	     * The result will always be correctly rounded if the base of the log is 2 or 10, and
	     * 'almost always' if not:
	     *
	     * Depending on the rounding mode, the result may be incorrectly rounded if the first fifteen
	     * rounding digits are [49]99999999999999 or [50]00000000000000. In that case, the maximum error
	     * between the result and the correctly rounded result will be one ulp (unit in the last place).
	     *
	     * log[-b](a)       = NaN
	     * log[0](a)        = NaN
	     * log[1](a)        = NaN
	     * log[NaN](a)      = NaN
	     * log[Infinity](a) = NaN
	     * log[b](0)        = -Infinity
	     * log[b](-0)       = -Infinity
	     * log[b](-a)       = NaN
	     * log[b](1)        = 0
	     * log[b](Infinity) = Infinity
	     * log[b](NaN)      = NaN
	     *
	     * [base] {number|string|Decimal} The base of the logarithm.
	     * [b] {number} The base of base.
	     *
	     */
	    P['logarithm'] = P['log'] = function ( base, b ) {
	        var base10, c, denom, i, inf, num, sd, sd10, r,
	            arg = this,
	            Decimal = arg['constructor'],
	            pr = Decimal['precision'],
	            rm = Decimal['rounding'],
	            guard = 5;

	        // Default base is 10.
	        if ( base == null ) {
	            base = new Decimal(10);
	            base10 = true;
	        } else {
	            id = 15;
	            base = new Decimal( base, b );
	            c = base['c'];

	            // If base < 0 or +-Infinity/NaN or 0 or 1.
	            if ( base['s'] < 0 || !c || !c[0] || !base['e'] && c[0] == 1 && c.length == 1 ) {

	                return new Decimal(NaN);
	            }
	            base10 = base['eq'](10);
	        }
	        c = arg['c'];

	        // If arg < 0 or +-Infinity/NaN or 0 or 1.
	        if ( arg['s'] < 0 || !c || !c[0] || !arg['e'] && c[0] == 1 && c.length == 1 ) {

	            return new Decimal( c && !c[0] ? -1 / 0 : arg['s'] != 1 ? NaN : c ? 0 : 1 / 0 );
	        }

	        /*
	          The result will have an infinite decimal expansion if base is 10 and arg is not an
	          integer power of 10...
	         */
	        inf = base10 && ( i = c[0], c.length > 1 || i != 1 && i != 10 &&
	          i != 1e2 && i != 1e3 && i != 1e4 && i != 1e5 && i != 1e6 );
	            /*
	            // or if base last digit's evenness is not the same as arg last digit's evenness...
	            // (FAILS when e.g. base.c[0] = 10 and c[0] = 1)
	            || ( base['c'][ base['c'].length - 1 ] & 1 ) != ( c[ c.length - 1 ] & 1 )
	              // or if base is 2 and there is more than one 1 in arg in base 2.
	              // (SLOWS the method down significantly)
	              || base['eq'](2) && arg.toString(2).replace( /[^1]+/g, '' ) != '1';
	             */

	        external = false;
	        sd = pr + guard;
	        sd10 = sd + 10;

	        num = ln( arg, sd );

	        if (base10) {

	            if ( sd10 > LN10.length ) {
	                ifExceptionsThrow( Decimal, 1, sd10, 'log' );
	            }
	            denom = new Decimal( LN10.slice( 0, sd10 ) );
	        } else {
	            denom = ln( base, sd );
	        }

	        // The result will have 5 rounding digits.
	        r = div( num, denom, sd, 1 );

	        /*
	         If at a rounding boundary, i.e. the result's rounding digits are [49]9999 or [50]0000,
	         calculate 10 further digits.

	         If the result is known to have an infinite decimal expansion, repeat this until it is
	         clear that the result is above or below the boundary. Otherwise, if after calculating
	         the 10 further digits, the last 14 are nines, round up and assume the result is exact.
	         Also assume the result is exact if the last 14 are zero.

	         Example of a result that will be incorrectly rounded:
	         log[1048576](4503599627370502) = 2.60000000000000009610279511444746...
	         The above result correctly rounded using ROUND_CEIL to 1 decimal place should be 2.7,
	         but it will be given as 2.6 as there are 15 zeros immediately after the requested
	         decimal place, so the exact result would be assumed to be 2.6, which rounded using
	         ROUND_CEIL to 1 decimal place is still 2.6.
	         */
	        if ( checkRoundingDigits( r['c'], i = pr, rm ) ) {

	            do {
	                sd += 10;
	                num = ln( arg, sd );

	                if (base10) {
	                    sd10 = sd + 10;

	                    if ( sd10 > LN10.length ) {
	                        ifExceptionsThrow( Decimal, 1, sd10, 'log' );
	                    }
	                    denom = new Decimal( LN10.slice( 0, sd10 ) );
	                } else {
	                    denom = ln( base, sd );
	                }

	                r = div( num, denom, sd, 1 );

	                if ( !inf ) {

	                    // Check for 14 nines from the 2nd rounding digit, as the first may be 4.
	                    if ( +coefficientToString( r['c'] ).slice( i + 1, i + 15 ) + 1 == 1e14 ) {
	                        r = rnd( r, pr + 1, 0 );
	                    }

	                    break;
	                }
	            } while ( checkRoundingDigits( r['c'], i += 10, rm ) );
	        }
	        external = true;

	        return rnd( r, pr, rm );
	    };


	    /*
	     *  n - 0 = n
	     *  n - N = N
	     *  n - I = -I
	     *  0 - n = -n
	     *  0 - 0 = 0
	     *  0 - N = N
	     *  0 - I = -I
	     *  N - n = N
	     *  N - 0 = N
	     *  N - N = N
	     *  N - I = N
	     *  I - n = I
	     *  I - 0 = I
	     *  I - N = N
	     *  I - I = N
	     *
	     * Return a new Decimal whose value is the value of this Decimal minus Decimal(y, b), rounded
	     * to precision significant digits using rounding mode rounding.
	     *
	     */
	    P['minus'] = function ( y, b ) {
	        var t, i, j, xLTy,
	            x = this,
	            Decimal = x['constructor'],
	            a = x['s'];

	        id = 8;
	        y = new Decimal( y, b );
	        b = y['s'];

	        // Either NaN?
	        if ( !a || !b ) {

	            return new Decimal(NaN);
	        }

	        // Signs differ?
	        if ( a != b ) {
	            y['s'] = -b;

	            return x['plus'](y);
	        }

	        var xc = x['c'],
	            yc = y['c'],
	            e = mathfloor( y['e'] / LOGBASE ),
	            k = mathfloor( x['e'] / LOGBASE ),
	            pr = Decimal['precision'],
	            rm = Decimal['rounding'];

	        if ( !k || !e ) {

	            // Either Infinity?
	            if ( !xc || !yc ) {

	                return xc ? ( y['s'] = -b, y ) : new Decimal( yc ? x : NaN );
	            }

	            // Either zero?
	            if ( !xc[0] || !yc[0] ) {

	                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
	                x = yc[0] ? ( y['s'] = -b, y ) : new Decimal( xc[0] ? x :

	                  // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
	                  rm == 3 ? -0 : 0 );

	                return external ? rnd( x, pr, rm ) : x;
	            }
	        }

	        xc = xc.slice();
	        i = xc.length;

	        // Determine which is the bigger number. Prepend zeros to equalise exponents.
	        if ( a = k - e ) {

	            if ( xLTy = a < 0 ) {
	                a = -a;
	                t = xc;
	                i = yc.length;
	            } else {
	                e = k;
	                t = yc;
	            }

	            if ( ( k = Math.ceil( pr / LOGBASE ) ) > i ) {
	                i = k;
	            }

	            /*
	             Numbers with massively different exponents would result in a massive number of
	             zeros needing to be prepended, but this can be avoided while still ensuring correct
	             rounding by limiting the number of zeros to max( pr, i ) + 2, where pr is precision and
	             i is the length of the coefficient of whichever is greater, x or y.
	             */
	            if ( a > ( i += 2 ) ) {
	                a = i;
	                t.length = 1;
	            }

	            t.reverse();
	            for ( b = a; b--; t.push(0) );
	            t.reverse();
	        } else {
	            // Exponents equal. Check digits.

	            if ( xLTy = i < ( j = yc.length ) ) {
	                j = i;
	            }

	            for ( a = b = 0; b < j; b++ ) {

	                if ( xc[b] != yc[b] ) {
	                    xLTy = xc[b] < yc[b];

	                    break;
	                }
	            }
	        }

	        // x < y? Point xc to the array of the bigger number.
	        if ( xLTy ) {
	            t = xc, xc = yc, yc = t;
	            y['s'] = -y['s'];
	        }

	        /*
	         Append zeros to xc if shorter. No need to add zeros to yc if shorter as subtraction only
	         needs to start at yc length.
	         */
	        if ( ( b = -( ( j = xc.length ) - yc.length ) ) > 0 ) {

	            for ( ; b--; xc[j++] = 0 );
	        }

	        // Subtract yc from xc.
	        for ( k = BASE - 1, b = yc.length; b > a; ) {

	            if ( xc[--b] < yc[b] ) {

	                for ( i = b; i && !xc[--i]; xc[i] = k );
	                --xc[i];
	                xc[b] += BASE;
	            }
	            xc[b] -= yc[b];
	        }

	        // Remove trailing zeros.
	        for ( ; xc[--j] == 0; xc.pop() );

	        // Remove leading zeros and adjust exponent accordingly.
	        for ( ; xc[0] == 0; xc.shift(), --e );

	        if ( !xc[0] ) {

	            // Zero.
	            xc = [ e = 0 ];

	            // Following IEEE 754 (2008) 6.3, n - n = -0 when rounding towards -Infinity.
	            y['s'] = rm == 3 ? -1 : 1;
	        }

	        y['c'] = xc;

	        // Get the number of digits of xc[0].
	        for ( a = 1, b = xc[0]; b >= 10; b /= 10, a++ );
	        y['e'] = a + e * LOGBASE - 1;

	        return external ? rnd( y, pr, rm ) : y;
	    };


	    /*
	     *   n % 0 =  N
	     *   n % N =  N
	     *   n % I =  n
	     *   0 % n =  0
	     *  -0 % n = -0
	     *   0 % 0 =  N
	     *   0 % N =  N
	     *   0 % I =  0
	     *   N % n =  N
	     *   N % 0 =  N
	     *   N % N =  N
	     *   N % I =  N
	     *   I % n =  N
	     *   I % 0 =  N
	     *   I % N =  N
	     *   I % I =  N
	     *
	     * Return a new Decimal whose value is the value of this Decimal modulo Decimal(y, b), rounded
	     * to precision significant digits using rounding mode rounding.
	     *
	     * The result depends on the modulo mode.
	     *
	     */
	    P['modulo'] = P['mod'] = function ( y, b ) {
	        var n, q,
	            x = this,
	            Decimal = x['constructor'],
	            m = Decimal['modulo'];

	        id = 9;
	        y = new Decimal( y, b );
	        b = y['s'];
	        n = !x['c'] || !b || y['c'] && !y['c'][0];

	        /*
	         Return NaN if x is Infinity or NaN, or y is NaN or zero, else return x if y is Infinity
	         or x is zero.
	         */
	        if ( n || !y['c'] || x['c'] && !x['c'][0] ) {

	            return n
	              ? new Decimal(NaN)
	              : rnd( new Decimal(x), Decimal['precision'], Decimal['rounding'] );
	        }

	        external = false;

	        if ( m == 9 ) {

	            // Euclidian division: q = sign(y) * floor(x / abs(y))
	            // r = x - qy    where  0 <= r < abs(y)
	            y['s'] = 1;
	            q = div( x, y, 0, 3, 1 );
	            y['s'] = b;
	            q['s'] *= b;
	        } else {
	            q = div( x, y, 0, m, 1 );
	        }

	        q = q['times'](y);
	        external = true;

	        return x['minus'](q);
	    };


	    /*
	     * Return a new Decimal whose value is the natural logarithm of the value of this Decimal,
	     * rounded to precision significant digits using rounding mode rounding.
	     *
	     */
	    P['naturalLogarithm'] = P['ln'] = function () {

	        return ln(this);
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal negated, i.e. as if
	     * multiplied by -1.
	     *
	     */
	    P['negated'] = P['neg'] = function () {
	        var x = new this['constructor'](this);
	        x['s'] = -x['s'] || null;

	        return rnd(x);
	    };


	    /*
	     *  n + 0 = n
	     *  n + N = N
	     *  n + I = I
	     *  0 + n = n
	     *  0 + 0 = 0
	     *  0 + N = N
	     *  0 + I = I
	     *  N + n = N
	     *  N + 0 = N
	     *  N + N = N
	     *  N + I = N
	     *  I + n = I
	     *  I + 0 = I
	     *  I + N = N
	     *  I + I = I
	     *
	     * Return a new Decimal whose value is the value of this Decimal plus Decimal(y, b), rounded
	     * to precision significant digits using rounding mode rounding.
	     *
	     */
	    P['plus'] = function ( y, b ) {
	        var t,
	            x = this,
	            Decimal = x['constructor'],
	            a = x['s'];

	        id = 10;
	        y = new Decimal( y, b );
	        b = y['s'];

	        // Either NaN?
	        if ( !a || !b ) {

	            return new Decimal(NaN);
	        }

	        // Signs differ?
	        if ( a != b ) {
	            y['s'] = -b;

	            return x['minus'](y);
	        }

	        var xc = x['c'],
	            yc = y['c'],
	            e = mathfloor( y['e'] / LOGBASE ),
	            k = mathfloor( x['e'] / LOGBASE ),
	            pr = Decimal['precision'],
	            rm = Decimal['rounding'];

	        if ( !k || !e ) {

	            // Either Infinity?
	            if ( !xc || !yc ) {

	                // Return +-Infinity.
	                return new Decimal( a / 0 );
	            }

	            // Either zero?
	            if ( !xc[0] || !yc[0] ) {

	                // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
	                x = yc[0] ? y : new Decimal( xc[0] ? x : a * 0 );

	                return external ? rnd( x, pr, rm ) : x;
	            }
	        }

	        xc = xc.slice();

	        // Prepend zeros to equalise exponents. Note: Faster to use reverse then do unshifts.
	        if ( a = k - e ) {

	            if ( a < 0 ) {
	                a = -a;
	                t = xc;
	                b = yc.length;
	            } else {
	                e = k;
	                t = yc;
	                b = xc.length;
	            }

	            if ( ( k = Math.ceil( pr / LOGBASE ) ) > b ) {
	                b = k;
	            }

	            // Limit number of zeros prepended to max( pr, b ) + 1.
	            if ( a > ++b ) {
	                a = b;
	                t.length = 1;
	            }

	            for ( t.reverse(); a--; t.push(0) );
	            t.reverse();
	        }

	        // Point xc to the longer array.
	        if ( xc.length - yc.length < 0 ) {
	            t = yc, yc = xc, xc = t;
	        }

	        // Only start adding at yc.length - 1 as the further digits of xc can be left as they are.
	        for ( a = yc.length, b = 0, k = BASE; a; xc[a] %= k ) {
	            b = ( xc[--a] = xc[a] + yc[a] + b ) / k | 0;
	        }

	        if (b) {
	            xc.unshift(b);
	            ++e;
	        }

	        // Remove trailing zeros.
	        for ( a = xc.length; xc[--a] == 0; xc.pop() );

	        // No need to check for zero, as +x + +y != 0 && -x + -y != 0

	        y['c'] = xc;

	        // Get the number of digits of xc[0].
	        for ( a = 1, b = xc[0]; b >= 10; b /= 10, a++ );
	        y['e'] = a + e * LOGBASE - 1;

	        return external ? rnd( y, pr, rm ) : y;
	    };


	    /*
	     * Return the number of significant digits of this Decimal.
	     *
	     * z {boolean|number} Whether to count integer-part trailing zeros: true, false, 1 or 0.
	     *
	     */
	    P['precision'] = P['sd'] = function (z) {
	        var n = null,
	            x = this;

	        if ( z != n ) {

	            if ( z !== !!z && z !== 1 && z !== 0 ) {

	                // 'precision() argument not a boolean or binary digit: {z}'
	                ifExceptionsThrow( x['constructor'], 'argument', z, 'precision', 1 );
	            }
	        }

	        if ( x['c'] ) {
	            n = getCoeffLength( x['c'] );

	            if ( z && x['e'] + 1 > n ) {
	                n = x['e'] + 1;
	            }
	        }

	        return n;
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal rounded to a whole number using
	     * rounding mode rounding.
	     *
	     */
	    P['round'] = function () {
	        var x = this,
	            Decimal = x['constructor'];

	        return rnd( new Decimal(x), x['e'] + 1, Decimal['rounding'] );
	    };


	    /*
	     *  sqrt(-n) =  N
	     *  sqrt( N) =  N
	     *  sqrt(-I) =  N
	     *  sqrt( I) =  I
	     *  sqrt( 0) =  0
	     *  sqrt(-0) = -0
	     *
	     * Return a new Decimal whose value is the square root of this Decimal, rounded to precision
	     * significant digits using rounding mode rounding.
	     *
	     */
	    P['squareRoot'] = P['sqrt'] = function () {
	        var m, n, sd, r, rep, t,
	            x = this,
	            c = x['c'],
	            s = x['s'],
	            e = x['e'],
	            Decimal = x['constructor'],
	            half = new Decimal(0.5);

	        // Negative/NaN/Infinity/zero?
	        if ( s !== 1 || !c || !c[0] ) {

	            return new Decimal( !s || s < 0 && ( !c || c[0] ) ? NaN : c ? x : 1 / 0 );
	        }

	        external = false;

	        // Initial estimate.
	        s = Math.sqrt( +x );

	        /*
	         Math.sqrt underflow/overflow?
	         Pass x to Math.sqrt as integer, then adjust the exponent of the result.
	         */
	        if ( s == 0 || s == 1 / 0 ) {
	            n = coefficientToString(c);

	            if ( ( n.length + e ) % 2 == 0 ) {
	                n += '0';
	            }

	            s = Math.sqrt(n);
	            e = mathfloor( ( e + 1 ) / 2 ) - ( e < 0 || e % 2 );

	            if ( s == 1 / 0 ) {
	                n = '1e' + e;
	            } else {
	                n = s.toExponential();
	                n = n.slice( 0, n.indexOf('e') + 1 ) + e;
	            }

	            r = new Decimal(n);
	        } else {
	            r = new Decimal( s.toString() );
	        }

	        sd = ( e = Decimal['precision'] ) + 3;

	        // Newton-Raphson iteration.
	        for ( ; ; ) {
	            t = r;
	            r = half['times']( t['plus']( div( x, t, sd + 2, 1 ) ) );

	            if ( coefficientToString( t['c'] ).slice( 0, sd ) ===
	                ( n = coefficientToString( r['c'] ) ).slice( 0, sd ) ) {
	                n = n.slice( sd - 3, sd + 1 );

	                /*
	                 The 4th rounding digit may be in error by -1 so if the 4 rounding digits are
	                 9999 or 4999 (i.e. approaching a rounding boundary) continue the iteration.
	                 */
	                if ( n == '9999' || !rep && n == '4999' ) {

	                    /*
	                     On the first iteration only, check to see if rounding up gives the exact result
	                     as the nines may infinitely repeat.
	                     */
	                    if ( !rep ) {
	                        rnd( t, e + 1, 0 );

	                        if ( t['times'](t)['eq'](x) ) {
	                            r = t;

	                            break;
	                        }
	                    }
	                    sd += 4;
	                    rep = 1;
	                } else {

	                    /*
	                     If the rounding digits are null, 0{0,4} or 50{0,3}, check for an exact result.
	                     If not, then there are further digits and m will be truthy.
	                     */
	                    if ( !+n || !+n.slice(1) && n.charAt(0) == '5' ) {

	                        // Truncate to the first rounding digit.
	                        rnd( r, e + 1, 1 );
	                        m = !r['times'](r)['eq'](x);
	                    }

	                    break;
	                }
	            }
	        }
	        external = true;

	        return rnd( r, e, Decimal['rounding'], m );
	    };


	    /*
	     *  n * 0 = 0
	     *  n * N = N
	     *  n * I = I
	     *  0 * n = 0
	     *  0 * 0 = 0
	     *  0 * N = N
	     *  0 * I = N
	     *  N * n = N
	     *  N * 0 = N
	     *  N * N = N
	     *  N * I = N
	     *  I * n = I
	     *  I * 0 = N
	     *  I * N = N
	     *  I * I = I
	     *
	     * Return a new Decimal whose value is this Decimal times Decimal(y), rounded to precision
	     * significant digits using rounding mode rounding.
	     *
	     */
	    P['times'] = function ( y, b ) {
	        var c, e,
	            x = this,
	            Decimal = x['constructor'],
	            xc = x['c'],
	            yc = ( id = 11, y = new Decimal( y, b ), y['c'] ),
	            i = mathfloor( x['e'] / LOGBASE ),
	            j = mathfloor( y['e'] / LOGBASE ),
	            a = x['s'];

	        b = y['s'];

	        y['s'] = a == b ? 1 : -1;

	        // Either NaN/Infinity/0?
	        if ( !i && ( !xc || !xc[0] ) || !j && ( !yc || !yc[0] ) ) {

	            // Either NaN?
	            return new Decimal( !a || !b ||

	              // x is 0 and y is Infinity  or y is 0 and x is Infinity?
	              xc && !xc[0] && !yc || yc && !yc[0] && !xc

	                // Return NaN.
	                ? NaN

	                // Either Infinity?
	                : !xc || !yc

	                  // Return +-Infinity.
	                  ? y['s'] / 0

	                  // x or y is 0. Return +-0.
	                  : y['s'] * 0 );
	        }

	        e = i + j;
	        a = xc.length;
	        b = yc.length;

	        if ( a < b ) {

	            // Swap.
	            c = xc, xc = yc, yc = c;
	            j = a, a = b, b = j;
	        }

	        for ( j = a + b, c = []; j--; c.push(0) );

	        // Multiply!
	        for ( i = b - 1; i > -1; i-- ) {
	            b = 0;

	            for ( j = a + i; j > i; ) {
	                  b = c[j] + yc[i] * xc[j - i - 1] + b;
	                  c[j--] = b % BASE | 0;
	                  b = b / BASE | 0;
	            }
	            c[j] = ( c[j] + b ) % BASE | 0;
	        }

	        if (b) {
	            ++e;
	        } else if ( !c[0] ) {

	            // Remove leading zero.
	            c.shift();
	        }

	        // Remove trailing zeros.
	        for ( j = c.length; !c[--j]; c.pop() );
	        y['c'] = c;

	        // Get the number of digits of c[0].
	        for ( a = 1, b = c[0]; b >= 10; b /= 10, a++ );
	        y['e'] = a + e * LOGBASE - 1;

	        return external ? rnd( y, Decimal['precision'], Decimal['rounding'] ) : y;
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal rounded to a maximum of dp
	     * decimal places using rounding mode rm or rounding if rm is omitted.
	     *
	     * If dp is omitted, return a new Decimal whose value is the value of this Decimal.
	     *
	     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * 'toDP() dp out of range: {dp}'
	     * 'toDP() dp not an integer: {dp}'
	     * 'toDP() rounding mode not an integer: {rm}'
	     * 'toDP() rounding mode out of range: {rm}'
	     *
	     */
	    P['toDecimalPlaces'] = P['toDP'] = function ( dp, rm ) {
	        var x = this;
	        x = new x['constructor'](x);

	        return dp == null || !checkArg( x, dp, 'toDP' )
	          ? x
	          : rnd( x, ( dp | 0 ) + x['e'] + 1, checkRM( x, rm, 'toDP' ) );
	    };


	    /*
	     * Return a string representing the value of this Decimal in exponential notation rounded to dp
	     * fixed decimal places using rounding mode rounding.
	     *
	     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * errors true: Throw if dp and rm are not undefined, null or integers in range.
	     * errors false: Ignore dp and rm if not numbers or not in range, and truncate non-integers.
	     *
	     * 'toExponential() dp not an integer: {dp}'
	     * 'toExponential() dp out of range: {dp}'
	     * 'toExponential() rounding mode not an integer: {rm}'
	     * 'toExponential() rounding mode out of range: {rm}'
	     *
	     */
	    P['toExponential'] = function ( dp, rm ) {
	        var x = this;

	        return x['c']
	          ? format( x, dp != null && checkArg( x, dp, 'toExponential' ) ? dp | 0 : null,
	            dp != null && checkRM( x, rm, 'toExponential' ), 1 )
	          : x.toString();
	    };


	    /*
	     * Return a string representing the value of this Decimal in normal (fixed-point) notation to
	     * dp fixed decimal places and rounded using rounding mode rm or rounding if rm is omitted.
	     *
	     * Note: as with JS numbers, (-0).toFixed(0) is '0', but e.g. (-0.00001).toFixed(0) is '-0'.
	     *
	     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * errors true: Throw if dp and rm are not undefined, null or integers in range.
	     * errors false: Ignore dp and rm if not numbers or not in range, and truncate non-integers.
	     *
	     * 'toFixed() dp not an integer: {dp}'
	     * 'toFixed() dp out of range: {dp}'
	     * 'toFixed() rounding mode not an integer: {rm}'
	     * 'toFixed() rounding mode out of range: {rm}'
	     *
	     */
	    P['toFixed'] = function ( dp, rm ) {
	        var str,
	            x = this,
	            Decimal = x['constructor'],
	            neg = Decimal['toExpNeg'],
	            pos = Decimal['toExpPos'];

	        if ( dp != null ) {
	            dp = checkArg( x, dp, str = 'toFixed' ) ? x['e'] + ( dp | 0 ) : null;
	            rm = checkRM( x, rm, str );
	        }

	        // Prevent toString returning exponential notation;
	        Decimal['toExpNeg'] = -( Decimal['toExpPos'] = 1 / 0 );

	        if ( dp == null || !x['c'] ) {
	            str = x.toString();
	        } else {
	            str = format( x, dp, rm );

	            // (-0).toFixed() is '0', but (-0.1).toFixed() is '-0'.
	            // (-0).toFixed(1) is '0.0', but (-0.01).toFixed(1) is '-0.0'.
	            if ( x['s'] < 0 && x['c'] ) {

	                // As e.g. (-0).toFixed(3), will wrongly be returned as -0.000 from toString.
	                if ( !x['c'][0] ) {
	                    str = str.replace( '-', '' );

	                // As e.g. -0.5 if rounded to -0 will cause toString to omit the minus sign.
	                } else if ( str.indexOf('-') < 0 ) {
	                    str = '-' + str;
	                }
	            }
	        }
	        Decimal['toExpNeg'] = neg;
	        Decimal['toExpPos'] = pos;

	        return str;
	    };


	    /*
	     * Return a string representing the value of this Decimal in fixed-point notation to dp decimal
	     * places, rounded using rounding mode rm or Decimal.rounding if rm is omitted, and formatted
	     * according to the following properties of the Decimal.format object.
	     *
	     *  Decimal.format = {
	     *      decimalSeparator : '.',
	     *      groupSeparator : ',',
	     *      groupSize : 3,
	     *      secondaryGroupSize : 0,
	     *      fractionGroupSeparator : '\xA0',    // non-breaking space
	     *      fractionGroupSize : 0
	     *  };
	     *
	     * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive
	     *
	     * (If dp or rm are invalid the error message will give the offending method call as toFixed.)
	     *
	     */
	    P['toFormat'] = function( dp, rm ) {
	        var x = this;

	        if ( !x['c'] ) {
	            return x.toString();
	        }

	        var i,
	            isNeg = x['s'] < 0,
	            f = x['constructor']['format'],
	            groupSeparator = f['groupSeparator'],
	            g1 = +f['groupSize'],
	            g2 = +f['secondaryGroupSize'],
	            arr = x.toFixed( dp, rm ).split('.'),
	            intPart = arr[0],
	            fractionPart = arr[1],
	            intDigits = isNeg ? intPart.slice(1) : intPart,
	            len = intDigits.length;

	        if (g2) {
	            len -= ( i = g1, g1 = g2, g2 = i );
	        }

	        if ( g1 > 0 && len > 0 ) {
	            i = len % g1 || g1;
	            intPart = intDigits.substr( 0, i );

	            for ( ; i < len; i += g1 ) {
	                intPart += groupSeparator + intDigits.substr( i, g1 );
	            }

	            if ( g2 > 0 ) {
	                intPart += groupSeparator + intDigits.slice(i);
	            }

	            if (isNeg) {
	                intPart = '-' + intPart;
	            }
	        }

	        return fractionPart
	          ? intPart + f['decimalSeparator'] + ( ( g2 = +f['fractionGroupSize'] )
	            ? fractionPart.replace( new RegExp( '\\d{' + g2 + '}\\B', 'g' ),
	              '$&' + f['fractionGroupSeparator'] )
	            : fractionPart )
	          : intPart;
	    };


	    /*
	     * Return a string array representing the value of this Decimal as a simple fraction with an
	     * integer numerator and an integer denominator.
	     *
	     * The denominator will be a positive non-zero value less than or equal to the specified
	     * maximum denominator. If a maximum denominator is not specified, the denominator will be
	     * the lowest value necessary to represent the number exactly.
	     *
	     * [maxD] {number|string|Decimal} Maximum denominator. Integer >= 1 and < Infinity.
	     *
	     */
	    P['toFraction'] = function (maxD) {
	        var d0, d2, e, frac, n, n0, p, q,
	            x = this,
	            Decimal = x['constructor'],
	            n1 = d0 = new Decimal( Decimal['ONE'] ),
	            d1 = n0 = new Decimal(0),
	            xc = x['c'],
	            d = new Decimal(d1);

	        // NaN, Infinity.
	        if ( !xc ) {

	            return x.toString();
	        }

	        e = d['e'] = getCoeffLength(xc) - x['e'] - 1;
	        d['c'][0] = mathpow( 10, ( p = e % LOGBASE ) < 0 ? LOGBASE + p : p );

	        // If maxD is undefined or null...
	        if ( maxD == null ||

	             // or NaN...
	             ( !( id = 12, n = new Decimal(maxD) )['s'] ||

	               // or less than 1, or Infinity...
	               ( outOfRange = n['cmp'](n1) < 0 || !n['c'] ) ||

	                 // or not an integer...
	                 ( Decimal['errors'] && mathfloor( n['e'] / LOGBASE ) < n['c'].length - 1 ) ) &&

	                   // 'toFraction() max denominator not an integer: {maxD}'
	                   // 'toFraction() max denominator out of range: {maxD}'
	                   !ifExceptionsThrow( Decimal, 'max denominator', maxD, 'toFraction', 0 ) ||

	                     // or greater than the maximum denominator needed to specify the value exactly.
	                     ( maxD = n )['cmp'](d) > 0 ) {

	            // d is 10**e, n1 is 1.
	            maxD = e > 0 ? d : n1;
	        }

	        external = false;
	        n = new Decimal( coefficientToString(xc) );
	        p = Decimal['precision'];
	        Decimal['precision'] = e = xc.length * LOGBASE * 2;

	        for ( ; ; )  {
	            q = div( n, d, 0, 1, 1 );
	            d2 = d0['plus']( q['times'](d1) );

	            if ( d2['cmp'](maxD) == 1 ) {

	                break;
	            }
	            d0 = d1;
	            d1 = d2;

	            n1 = n0['plus']( q['times']( d2 = n1 ) );
	            n0 = d2;

	            d = n['minus']( q['times']( d2 = d ) );
	            n = d2;
	        }

	        d2 = div( maxD['minus'](d0), d1, 0, 1, 1 );
	        n0 = n0['plus']( d2['times'](n1) );
	        d0 = d0['plus']( d2['times'](d1) );
	        n0['s'] = n1['s'] = x['s'];

	        // Determine which fraction is closer to x, n0/d0 or n1/d1?
	        frac = div( n1, d1, e, 1 )['minus'](x)['abs']()['cmp'](
	               div( n0, d0, e, 1 )['minus'](x)['abs']() ) < 1
	          ? [ n1 + '', d1 + '' ]
	          : [ n0 + '', d0 + '' ];

	        external = true;
	        Decimal['precision'] = p;

	        return frac;
	    };


	    /*
	     * Returns a new Decimal whose value is the nearest multiple of the magnitude of n to the value
	     * of this Decimal.
	     *
	     * If the value of this Decimal is equidistant from two multiples of n, the rounding mode rm,
	     * or rounding if rm is omitted or is null or undefined, determines the direction of the
	     * nearest multiple.
	     *
	     * In the context of this method, rounding mode 4 (ROUND_HALF_UP) is the same as rounding mode 0
	     * (ROUND_UP), and so on.
	     *
	     * The return value will always have the same sign as this Decimal, unless either this Decimal
	     * or n is NaN, in which case the return value will be also be NaN.
	     *
	     * The return value is not rounded to precision significant digits.
	     *
	     * n {number|string|Decimal} The magnitude to round to a multiple of.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * 'toNearest() rounding mode not an integer: {rm}'
	     * 'toNearest() rounding mode out of range: {rm}'
	     *
	     */
	    P['toNearest'] = function ( n, rm ) {
	        var x = this,
	            Decimal = x['constructor'];

	        x = new Decimal(x);

	        if ( n == null ) {
	            n = new Decimal( Decimal['ONE'] );
	            rm = Decimal['rounding'];
	        } else {
	            id = 17;
	            n = new Decimal(n);
	            rm = checkRM( x, rm, 'toNearest' );
	        }

	        // If n is finite...
	        if ( n['c'] ) {

	           // If x is finite...
	            if ( x['c'] ) {

	                if ( n['c'][0] ) {
	                    external = false;
	                    x = div( x, n, 0, rm < 4 ? [4, 5, 7, 8][rm] : rm, 1 )['times'](n);
	                    external = true;
	                    rnd(x);
	                } else {
	                    x['c'] = [ x['e'] = 0 ];
	                }
	            }

	        // n is NaN or +-Infinity. If x is not NaN...
	        } else if ( x['s'] ) {

	            // If n is +-Infinity...
	            if ( n['s'] ) {
	                n['s'] = x['s'];
	            }
	            x = n;
	        }

	        return x;
	    };


	    /*
	     * Return the value of this Decimal converted to a number primitive.
	     *
	     */
	    P['toNumber'] = function () {
	        var x = this;

	        // Ensure zero has correct sign.
	        return +x || ( x['s'] ? 0 * x['s'] : NaN );
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal raised to the power
	     * Decimal(y, b), rounded to precision significant digits using rounding mode rounding.
	     *
	     * ECMAScript compliant.
	     *
	     *   x is any value, including NaN.
	     *   n is any number, including �Infinity unless stated.
	     *
	     *   pow( x, NaN )                           = NaN
	     *   pow( x, �0 )                            = 1

	     *   pow( NaN, nonzero )                     = NaN
	     *   pow( abs(n) > 1, +Infinity )            = +Infinity
	     *   pow( abs(n) > 1, -Infinity )            = +0
	     *   pow( abs(n) == 1, �Infinity )           = NaN
	     *   pow( abs(n) < 1, +Infinity )            = +0
	     *   pow( abs(n) < 1, -Infinity )            = +Infinity
	     *   pow( +Infinity, n > 0 )                 = +Infinity
	     *   pow( +Infinity, n < 0 )                 = +0
	     *   pow( -Infinity, odd integer > 0 )       = -Infinity
	     *   pow( -Infinity, even integer > 0 )      = +Infinity
	     *   pow( -Infinity, odd integer < 0 )       = -0
	     *   pow( -Infinity, even integer < 0 )      = +0
	     *   pow( +0, n > 0 )                        = +0
	     *   pow( +0, n < 0 )                        = +Infinity
	     *   pow( -0, odd integer > 0 )              = -0
	     *   pow( -0, even integer > 0 )             = +0
	     *   pow( -0, odd integer < 0 )              = -Infinity
	     *   pow( -0, even integer < 0 )             = +Infinity
	     *   pow( finite n < 0, finite non-integer ) = NaN
	     *
	     * For non-integer and larger exponents pow(x, y) is calculated using
	     *
	     *   x^y = exp(y*ln(x))
	     *
	     * Assuming the first 15 rounding digits are each equally likely to be any digit 0-9, the
	     * probability of an incorrectly rounded result
	     * P( [49]9{14} | [50]0{14} ) = 2 * 0.2 * 10^-14 = 4e-15 = 1/2.5e+14
	     * i.e. 1 in 250,000,000,000,000
	     *
	     * If a result is incorrectly rounded the maximum error will be 1 ulp (unit in last place).
	     *
	     * y {number|string|Decimal} The power to which to raise this Decimal.
	     * [b] {number} The base of y.
	     *
	     */
	    P['toPower'] = P['pow'] = function ( y, b ) {
	        var a, e, n, r,
	            x = this,
	            Decimal = x['constructor'],
	            s = x['s'],
	            yN = +( id = 13, y = new Decimal( y, b ) ),
	            i = yN < 0 ? -yN : yN,
	            pr = Decimal['precision'],
	            rm = Decimal['rounding'];

	        // Handle +-Infinity, NaN and +-0.
	        if ( !x['c'] || !y['c'] || ( n = !x['c'][0] ) || !y['c'][0] ) {

	            // valueOf -0 is 0, so check for 0 then multiply it by the sign.
	            return new Decimal( mathpow( n ? s * 0 : +x, yN ) );
	        }

	        x = new Decimal(x);
	        a = x['c'].length;

	        // if x == 1
	        if ( !x['e'] && x['c'][0] == x['s'] && a == 1 ) {

	            return x;
	        }

	        b = y['c'].length - 1;

	        // if y == 1
	        if ( !y['e'] && y['c'][0] == y['s'] && !b ) {
	            r = rnd( x, pr, rm );
	        } else {
	            e = mathfloor( y['e'] / LOGBASE );
	            n = e >= b;

	            // If y is not an integer and x is negative, return NaN.
	            if ( !n && s < 0 ) {
	                r = new Decimal(NaN);
	            } else {

	                /*
	                 If the approximate number of significant digits of x multiplied by abs(y) is less
	                 than INT_POW_LIMIT use the 'exponentiation by squaring' algorithm.
	                 */
	                if ( n && a * LOGBASE * i < INT_POW_LIMIT ) {
	                    r = intPow( Decimal, x, i );

	                    if ( y['s'] < 0 ) {

	                        return Decimal['ONE']['div'](r);
	                    }
	                } else {

	                    // Result is negative if x is negative and the last digit of integer y is odd.
	                    s = s < 0 && y['c'][ Math.max( e, b ) ] & 1 ? -1 : 1;

	                    b = mathpow( +x, yN );

	                    /*
	                     Estimate result exponent.
	                     x^y = 10^e,  where e = y * log10(x)
	                     log10(x) = log10(x_significand) + x_exponent
	                     log10(x_significand) = ln(x_significand) / ln(10)
	                     */
	                    e = b == 0 || !isFinite(b)
	                      ? mathfloor( yN * ( Math.log( '0.' + coefficientToString( x['c'] ) ) /
	                        Math.LN10 + x['e'] + 1 ) )
	                      : new Decimal( b + '' )['e'];

	                    // Estimate may be incorrect e.g. x: 0.999999999999999999, y: 2.29, e: 0, r.e:-1

	                    // Overflow/underflow?
	                    if ( e > Decimal['maxE'] + 1 || e < Decimal['minE'] - 1 ) {

	                        return new Decimal( e > 0 ? s / 0 : 0 );
	                    }

	                    external = false;
	                    Decimal['rounding'] = x['s'] = 1;

	                    /*
	                     Estimate extra digits needed from ln(x) to ensure five correct rounding digits
	                     in result (i was unnecessary before max exponent was extended?).
	                     Example of failure before i was introduced: (precision: 10),
	                     new Decimal(2.32456).pow('2087987436534566.46411')
	                     should be 1.162377823e+764914905173815, but is 1.162355823e+764914905173815
	                     */
	                    i = Math.min( 12, ( e + '' ).length );

	                    // r = x^y = exp(y*ln(x))
	                    r = exp( y['times']( ln( x, pr + i ) ), pr );

	                    // Truncate to the required precision plus five rounding digits.
	                    r = rnd( r, pr + 5, 1 );

	                    /*
	                     If the rounding digits are [49]9999 or [50]0000 increase the precision by 10
	                     and recalculate the result.
	                     */
	                    if ( checkRoundingDigits( r['c'], pr, rm ) ) {
	                        e = pr + 10;

	                        // Truncate to the increased precision plus five rounding digits.
	                        r = rnd( exp( y['times']( ln( x, e + i ) ), e ), e + 5, 1 );

	                        /*
	                          Check for 14 nines from the 2nd rounding digit (the first rounding digit
	                          may be 4 or 9).
	                         */
	                        if ( +coefficientToString( r['c'] ).slice( pr + 1, pr + 15 ) + 1 == 1e14 ) {
	                            r = rnd( r, pr + 1, 0 );
	                        }
	                    }

	                    r['s'] = s;
	                    external = true;
	                    Decimal['rounding'] = rm;
	                }

	                r = rnd( r, pr, rm );
	            }
	        }

	        return r;
	    };


	    /*
	     * Return a string representing the value of this Decimal rounded to sd significant digits
	     * using rounding mode rounding.
	     *
	     * Return exponential notation if sd is less than the number of digits necessary to represent
	     * the integer part of the value in normal notation.
	     *
	     * sd {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * errors true: Throw if sd and rm are not undefined, null or integers in range.
	     * errors false: Ignore sd and rm if not numbers or not in range, and truncate non-integers.
	     *
	     * 'toPrecision() sd not an integer: {sd}'
	     * 'toPrecision() sd out of range: {sd}'
	     * 'toPrecision() rounding mode not an integer: {rm}'
	     * 'toPrecision() rounding mode out of range: {rm}'
	     *
	     */
	    P['toPrecision'] = function ( sd, rm ) {
	        var x = this;

	        return sd != null && checkArg( x, sd, 'toPrecision', 1 ) && x['c']
	          ? format( x, --sd | 0, checkRM( x, rm, 'toPrecision' ), 2 )
	          : x.toString();
	    };


	    /*
	     * Return a new Decimal whose value is this Decimal rounded to a maximum of d significant
	     * digits using rounding mode rm, or to precision and rounding respectively if omitted.
	     *
	     * [d] {number} Significant digits. Integer, 1 to MAX_DIGITS inclusive.
	     * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
	     *
	     * 'toSD() digits out of range: {d}'
	     * 'toSD() digits not an integer: {d}'
	     * 'toSD() rounding mode not an integer: {rm}'
	     * 'toSD() rounding mode out of range: {rm}'
	     *
	     */
	    P['toSignificantDigits'] = P['toSD'] = function ( d, rm ) {
	        var x = this,
	            Decimal = x['constructor'];

	        x = new Decimal(x);

	        return d == null || !checkArg( x, d, 'toSD', 1 )
	          ? rnd( x, Decimal['precision'], Decimal['rounding'] )
	          : rnd( x, d | 0, checkRM( x, rm, 'toSD' ) );
	    };


	    /*
	     * Return a string representing the value of this Decimal in base b, or base 10 if b is
	     * omitted. If a base is specified, including base 10, round to precision significant digits
	     * using rounding mode rounding.
	     *
	     * Return exponential notation if a base is not specified, and this Decimal has a positive
	     * exponent equal to or greater than toExpPos, or a negative exponent equal to or less than
	     * toExpNeg.
	     *
	     * [b] {number} Base. Integer, 2 to 64 inclusive.
	     *
	     */
	     P['toString'] = function (b) {
	        var u, str, strL,
	            x = this,
	            Decimal = x['constructor'],
	            xe = x['e'];

	        // Infinity or NaN?
	        if ( xe === null ) {
	            str = x['s'] ? 'Infinity' : 'NaN';

	        // Exponential format?
	        } else if ( b === u && ( xe <= Decimal['toExpNeg'] || xe >= Decimal['toExpPos'] ) ) {

	            return format( x, null, Decimal['rounding'], 1 );
	        } else {
	            str = coefficientToString( x['c'] );

	            // Negative exponent?
	            if ( xe < 0 ) {

	                // Prepend zeros.
	                for ( ; ++xe; str = '0' + str );
	                str = '0.' + str;

	            // Positive exponent?
	            } else if ( strL = str.length, xe > 0 ) {

	                if ( ++xe > strL ) {

	                    // Append zeros.
	                    for ( xe -= strL; xe-- ; str += '0' );

	                } else if ( xe < strL ) {
	                    str = str.slice( 0, xe ) + '.' + str.slice(xe);
	                }

	            // Exponent zero.
	            } else {
	                u = str.charAt(0);

	                if ( strL > 1 ) {
	                    str = u + '.' + str.slice(1);

	                // Avoid '-0'
	                } else if ( u == '0' ) {

	                    return u;
	                }
	            }

	            if ( b != null ) {

	                if ( !( outOfRange = !( b >= 2 && b < 65 ) ) &&
	                  ( b == (b | 0) || !Decimal['errors'] ) ) {
	                    str = convertBase( Decimal, str, b | 0, 10, x['s'] );

	                    // Avoid '-0'
	                    if ( str == '0' ) {

	                        return str;
	                    }
	                } else {

	                    // 'toString() base not an integer: {b}'
	                    // 'toString() base out of range: {b}'
	                    ifExceptionsThrow( Decimal, 'base', b, 'toString', 0 );
	                }
	            }
	        }

	        return x['s'] < 0 ? '-' + str : str;
	    };


	    /*
	     * Return a new Decimal whose value is the value of this Decimal truncated to a whole number.
	     *
	     */
	    P['truncated'] = P['trunc'] = function () {

	        return rnd( new this['constructor'](this), this['e'] + 1, 1 );
	    };


	    /*
	     * Return as toString, but do not accept a base argument.
	     *
	     * Ensures that JSON.stringify() uses toString for serialization.
	     *
	     */
	    P['valueOf'] = P['toJSON'] = function () {

	        return this.toString();
	    };


	    /*
	    // Add aliases to match BigDecimal method names.
	    P['add'] = P['plus'];
	    P['subtract'] = P['minus'];
	    P['multiply'] = P['times'];
	    P['divide'] = P['div'];
	    P['remainder'] = P['mod'];
	    P['compareTo'] = P['cmp'];
	    P['negate'] = P['neg'];
	     */


	    // Private functions for Decimal.prototype methods.


	    /*
	     *  coefficientToString
	     *  checkRoundingDigits
	     *  checkRM
	     *  checkArg
	     *  convertBase
	     *  div
	     *  exp
	     *  format
	     *  getCoeffLength
	     *  ifExceptionsThrow
	     *  intPow
	     *  ln
	     *  rnd
	     */


	    function coefficientToString(a) {
	        var s, z,
	            i = 1,
	            j = a.length,
	            r = a[0] + '';

	        for ( ; i < j; i++ ) {
	            s = a[i] + '';

	            for ( z = LOGBASE - s.length; z--; ) {
	                s = '0' + s;
	            }

	            r += s;
	        }

	        // '0'
	        for ( j = r.length; r.charCodeAt(--j) === 48; );

	        return r.slice( 0, j + 1 || 1 );
	    }


	    /*
	     * Check 5 rounding digits if repeating is null, 4 otherwise.
	     * repeating == null if caller is log or pow,
	     * repeating != null if caller is ln or exp.
	     *
	     *
	     // Previous, much simpler implementation when coefficient was base 10.
	     function checkRoundingDigits( c, i, rm, repeating ) {
	         return ( !repeating && rm > 3 && c[i] == 4 ||
	           ( repeating || rm < 4 ) && c[i] == 9 ) && c[i + 1] == 9 && c[i + 2] == 9 &&
	             c[i + 3] == 9 && ( repeating != null || c[i + 4] == 9 ) ||
	               repeating == null && ( c[i] == 5 || !c[i] ) && !c[i + 1] && !c[i + 2] &&
	                 !c[i + 3] && !c[i + 4];
	     }
	     */
	    function checkRoundingDigits( c, i, rm, repeating ) {
	        var ci, k, n, r, rd;

	        // Get the length of the first element of the array c.
	        for ( k = 1, n = c[0]; n >= 10; n /= 10, k++ );

	        n = i - k;

	        // Is the rounding digit in the first element of c?
	        if ( n < 0 ) {
	            n += LOGBASE;
	            ci = 0;
	        } else {
	            ci = Math.ceil( ( n + 1 ) / LOGBASE );
	            n %= LOGBASE;
	        }

	        k = mathpow( 10, LOGBASE - n );
	        rd = c[ci] % k | 0;

	        if ( repeating == null ) {

	            if ( n < 3 ) {

	                if ( n == 0 ) {
	                    rd = rd / 100 | 0;
	                } else if ( n == 1 ) {
	                    rd = rd / 10 | 0;
	                }

	                r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 50000 || rd == 0;
	            } else {
	                r = ( rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2 ) &&
	                    ( c[ci + 1] / k / 100 | 0 ) == mathpow( 10, n - 2 ) - 1 ||
	                        ( rd == k / 2 || rd == 0 ) && ( c[ci + 1] / k / 100 | 0 ) == 0;
	            }
	        } else {

	            if ( n < 4 ) {

	                if ( n == 0 ) {
	                    rd = rd / 1000 | 0;
	                } else if ( n == 1 ) {
	                    rd = rd / 100 | 0;
	                } else if ( n == 2 ) {
	                    rd = rd / 10 | 0;
	                }

	                r = ( repeating || rm < 4 ) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
	            } else {
	                r = ( ( repeating || rm < 4 ) && rd + 1 == k ||
	                ( !repeating && rm > 3 ) && rd + 1 == k / 2 ) &&
	                    ( c[ci + 1] / k / 1000 | 0 ) == mathpow( 10, n - 3 ) - 1;
	            }
	        }

	        return r;
	    }


	    /*
	     * Check and return rounding mode. If rm is invalid, return rounding mode rounding.
	     */
	    function checkRM( x, rm, method ) {
	        var Decimal = x['constructor'];

	        return rm == null || ( ( outOfRange = rm < 0 || rm > 8 ) ||
	          rm !== 0 && ( Decimal['errors'] ? parseInt : parseFloat )(rm) != rm ) &&
	            !ifExceptionsThrow( Decimal, 'rounding mode', rm, method, 0 )
	              ? Decimal['rounding'] : rm | 0;
	    }


	    /*
	     * Check that argument n is in range, return true or false.
	     */
	    function checkArg( x, n, method, min ) {
	        var Decimal = x['constructor'];

	        return !( outOfRange = n < ( min || 0 ) || n >= MAX_DIGITS + 1 ) &&

	          /*
	           * Include 'n === 0' because Opera has 'parseFloat(-0) == -0' as false
	           * despite having 'parseFloat(-0) === -0 && parseFloat('-0') === -0 && 0 == -0' as true.
	           */
	          ( n === 0 || ( Decimal['errors'] ? parseInt : parseFloat )(n) == n ) ||
	            ifExceptionsThrow( Decimal, 'argument', n, method, 0 );
	    }


	    /*
	     * Convert a numeric string of baseIn to a numeric string of baseOut.
	     */
	    convertBase = (function () {

	        /*
	         * Convert string of baseIn to an array of numbers of baseOut.
	         * Eg. convertBase('255', 10, 16) returns [15, 15].
	         * Eg. convertBase('ff', 16, 10) returns [2, 5, 5].
	         */
	        function toBaseOut( str, baseIn, baseOut ) {
	            var j,
	                arr = [0],
	                arrL,
	                i = 0,
	                strL = str.length;

	            for ( ; i < strL; ) {
	                for ( arrL = arr.length; arrL--; arr[arrL] *= baseIn );
	                arr[ j = 0 ] += NUMERALS.indexOf( str.charAt( i++ ) );

	                for ( ; j < arr.length; j++ ) {

	                    if ( arr[j] > baseOut - 1 ) {

	                        if ( arr[j + 1] == null ) {
	                            arr[j + 1] = 0;
	                        }
	                        arr[j + 1] += arr[j] / baseOut | 0;
	                        arr[j] %= baseOut;
	                    }
	                }
	            }

	            return arr.reverse();
	        }

	        return function ( Decimal, str, baseOut, baseIn, sign ) {
	            var e, j, r, x, xc, y,
	                i = str.indexOf( '.' ),
	                pr = Decimal['precision'],
	                rm = Decimal['rounding'];

	            if ( baseIn < 37 ) {
	                str = str.toLowerCase();
	            }

	            // Non-integer.
	            if ( i >= 0 ) {
	                str = str.replace( '.', '' );
	                y = new Decimal(baseIn);
	                x = intPow( Decimal, y, str.length - i );

	                /*
	                 Convert str as if an integer, then divide the result by its base raised to a power
	                 such that the fraction part will be restored.
	                 Use toFixed to avoid possible exponential notation.
	                 */
	                y['c'] = toBaseOut( x.toFixed(), 10, baseOut );
	                y['e'] = y['c'].length;
	            }

	            // Convert the number as integer.
	            xc = toBaseOut( str, baseIn, baseOut );
	            e = j = xc.length;

	            // Remove trailing zeros.
	            for ( ; xc[--j] == 0; xc.pop() );

	            if ( !xc[0] ) {

	                return '0';
	            }

	            if ( i < 0 ) {
	                e--;
	            } else {
	                x['c'] = xc;
	                x['e'] = e;

	                // sign is needed for correct rounding.
	                x['s'] = sign;
	                x = div( x, y, pr, rm, 0, baseOut );
	                xc = x['c'];
	                r = x['r'];
	                e = x['e'];
	            }

	            // The rounding digit, i.e. the digit after the digit that may be rounded up.
	            i = xc[pr];
	            j = baseOut / 2;
	            r = r || xc[pr + 1] != null;

	            if ( rm < 4
	              ? ( i != null || r ) && ( rm == 0 || rm == ( x['s'] < 0 ? 3 : 2 ) )
	              : i > j || i == j && ( rm == 4 || r || rm == 6 && xc[pr - 1] & 1 ||
	                rm == ( x['s'] < 0 ? 8 : 7 ) ) ) {

	                xc.length = pr;

	                // Rounding up may mean the previous digit has to be rounded up and so on.
	                for ( --baseOut; ++xc[--pr] > baseOut; ) {
	                    xc[pr] = 0;

	                    if ( !pr ) {
	                        ++e;
	                        xc.unshift(1);
	                    }
	                }
	            } else {
	                xc.length = pr;
	            }

	            // Determine trailing zeros.
	            for ( j = xc.length; !xc[--j]; );

	            // E.g. [4, 11, 15] becomes 4bf.
	            for ( i = 0, str = ''; i <= j; str += NUMERALS.charAt( xc[i++] ) );

	            // Negative exponent?
	            if ( e < 0 ) {

	                // Prepend zeros.
	                for ( ; ++e; str = '0' + str );

	                str = '0.' + str;

	            // Positive exponent?
	            } else {
	                i = str.length;

	                if ( ++e > i ) {

	                    // Append zeros.
	                    for ( e -= i; e-- ; str += '0' );

	                } else if ( e < i ) {
	                    str = str.slice( 0, e ) + '.' + str.slice(e);
	                }
	            }

	            // No negative numbers: the caller will add the sign.
	            return str;
	        };
	    })();


	    /*
	     * Perform division in the specified base. Called by div and convertBase.
	     */
	    var div = ( function () {

	        // Assumes non-zero x and k, and hence non-zero result.
	        function multiplyInteger( x, k, base ) {
	            var temp,
	                carry = 0,
	                i = x.length;

	            for ( x = x.slice(); i--; ) {
	                temp = x[i] * k + carry;
	                x[i] = temp % base | 0;
	                carry = temp / base | 0;
	            }

	            if (carry) {
	                x.unshift(carry);
	            }

	            return x;
	        }

	        function compare( a, b, aL, bL ) {
	            var i, cmp;

	            if ( aL != bL ) {
	                cmp = aL > bL ? 1 : -1;
	            } else {

	                for ( i = cmp = 0; i < aL; i++ ) {

	                    if ( a[i] != b[i] ) {
	                        cmp = a[i] > b[i] ? 1 : -1;

	                        break;
	                    }
	                }
	            }

	            return cmp;
	        }

	        function subtract( a, b, aL, base ) {
	            var i = 0;

	            // Subtract b from a.
	            for ( ; aL--; ) {
	                a[aL] -= i;
	                i = a[aL] < b[aL] ? 1 : 0;
	                a[aL] = i * base + a[aL] - b[aL];
	            }

	            // Remove leading zeros.
	            for ( ; !a[0] && a.length > 1; a.shift() );
	        }

	        // x: dividend, y: divisor.
	        return function ( x, y, pr, rm, dp, base ) {
	            var cmp, e, i, logbase, more, n, prod, prodL, q, qc, rem, remL, rem0, t, xi, xL, yc0,
	                yL, yz,
	                Decimal = x['constructor'],
	                s = x['s'] == y['s'] ? 1 : -1,
	                xc = x['c'],
	                yc = y['c'];

	            // Either NaN, Infinity or 0?
	            if ( !xc || !xc[0] || !yc || !yc[0] ) {

	                return new Decimal(

	                  // Return NaN if either NaN, or both Infinity or 0.
	                  !x['s'] || !y['s'] || ( xc ? yc && xc[0] == yc[0] : !yc ) ? NaN :

	                    // Return +-0 if x is 0 or y is +-Infinity, or return +-Infinity as y is 0.
	                    xc && xc[0] == 0 || !yc ? s * 0 : s / 0
	                );
	            }

	            if (base) {
	                logbase = 1;
	                e = x['e'] - y['e'];
	            } else {
	                base = BASE;
	                logbase = LOGBASE;
	                e = mathfloor( x['e'] / logbase ) - mathfloor( y['e'] / logbase );
	            }

	            yL = yc.length;
	            xL = xc.length;
	            q = new Decimal(s);
	            qc = q['c'] = [];

	            // Result exponent may be one less then the current value of e.
	            // The coefficients of the Decimals from convertBase may have trailing zeros.
	            for ( i = 0; yc[i] == ( xc[i] || 0 ); i++ );

	            if ( yc[i] > ( xc[i] || 0 ) ) {
	                e--;
	            }

	            if ( pr == null ) {
	                s = pr = Decimal['precision'];
	                rm = Decimal['rounding'];
	            } else if (dp) {
	                s = pr + ( x['e'] - y['e'] ) + 1;
	            } else {
	                s = pr;
	            }

	            if ( s < 0 ) {
	                qc.push(1);
	                more = true;
	            } else {

	                // Convert base 10 decimal places to base 1e7 decimal places.
	                s = s / logbase + 2 | 0;
	                i = 0;

	                // divisor < 1e7
	                if ( yL == 1 ) {
	                    n = 0;
	                    yc = yc[0];
	                    s++;

	                    // 'n' is the carry.
	                    for ( ; ( i < xL || n ) && s--; i++ ) {
	                        t = n * base + ( xc[i] || 0 );
	                        qc[i] = t / yc | 0;
	                        n = t % yc | 0;
	                    }

	                    more = n || i < xL;

	                // divisor >= 1e7
	                } else {

	                    // Normalise xc and yc so highest order digit of yc is >= base/2
	                    n = base / ( yc[0] + 1 ) | 0;

	                    if ( n > 1 ) {
	                        yc = multiplyInteger( yc, n, base );
	                        xc = multiplyInteger( xc, n, base );
	                        yL = yc.length;
	                        xL = xc.length;
	                    }

	                    xi = yL;
	                    rem = xc.slice( 0, yL );
	                    remL = rem.length;

	                    // Add zeros to make remainder as long as divisor.
	                    for ( ; remL < yL; rem[remL++] = 0 );

	                    yz = yc.slice();
	                    yz.unshift(0);
	                    yc0 = yc[0];

	                    if ( yc[1] >= base / 2 ) {
	                        yc0++;
	                    }

	                    do {
	                        n = 0;

	                        // Compare divisor and remainder.
	                        cmp = compare( yc, rem, yL, remL );

	                        // If divisor < remainder.
	                        if ( cmp < 0 ) {

	                            // Calculate trial digit, n.
	                            rem0 = rem[0];

	                            if ( yL != remL ) {
	                                rem0 = rem0 * base + ( rem[1] || 0 );
	                            }

	                            // n will be how many times the divisor goes into the current remainder.
	                            n = rem0 / yc0 | 0;

	                            /*
	                              Algorithm:
	                              1. product = divisor * trial digit (n)
	                              2. if product > remainder: product -= divisor, n--
	                              3. remainder -= product
	                              4. if product was < remainder at 2:
	                                5. compare new remainder and divisor
	                                6. If remainder > divisor: remainder -= divisor, n++
	                            */

	                            if ( n > 1 ) {

	                                if ( n >= base ) {
	                                    n = base - 1;
	                                }

	                                // product = divisor * trial digit.
	                                prod = multiplyInteger( yc, n, base );
	                                prodL = prod.length;
	                                remL = rem.length;

	                                // Compare product and remainder.
	                                cmp = compare( prod, rem, prodL, remL );

	                                // product > remainder.
	                                if ( cmp == 1 ) {
	                                    n--;

	                                    // Subtract divisor from product.
	                                    subtract( prod, yL < prodL ? yz : yc, prodL, base );
	                                }
	                            } else {

	                                // cmp is -1.
	                                // If n is 0, there is no need to compare yc and rem again below, so change cmp to 1 to avoid it.
	                                // If n is 1 there IS a need to compare yc and rem again below.
	                                if ( n == 0 ) {
	                                    cmp = n = 1;
	                                }
	                                prod = yc.slice();
	                            }
	                            prodL = prod.length;

	                            if ( prodL < remL ) {
	                                prod.unshift(0);
	                            }

	                            // Subtract product from remainder.
	                            subtract( rem, prod, remL, base );

	                            // If product was < previous remainder.
	                            if ( cmp == -1 ) {
	                                remL = rem.length;

	                                // Compare divisor and new remainder.
	                                cmp = compare( yc, rem, yL, remL );

	                                // If divisor < new remainder, subtract divisor from remainder.
	                                if ( cmp < 1 ) {
	                                    n++;

	                                    // Subtract divisor from remainder.
	                                    subtract( rem, yL < remL ? yz : yc, remL, base );
	                                }
	                            }

	                            remL = rem.length;

	                        } else if ( cmp === 0 ) {
	                            n++;
	                            rem = [0];
	                        }    // if cmp === 1, n will be 0

	                        // Add the next digit, n, to the result array.
	                        qc[i++] = n;

	                        // Update the remainder.
	                        if ( cmp && rem[0] ) {
	                            rem[remL++] = xc[xi] || 0;
	                        } else {
	                            rem = [ xc[xi] ];
	                            remL = 1;
	                        }

	                    } while ( ( xi++ < xL || rem[0] != null ) && s-- );

	                    more = rem[0] != null;
	                }

	                // Leading zero?
	                if ( !qc[0] ) {
	                    qc.shift();
	                }
	            }

	            // If div is being used for base conversion.
	            if ( logbase == 1 ) {
	                q['e'] = e;
	                q['r'] = +more;
	            } else {

	                // To calculate q.e, first get the number of digits of qc[0].
	                for ( i = 1, s = qc[0]; s >= 10; s /= 10, i++ );
	                q['e'] = i + e * logbase - 1;

	                rnd( q, dp ? pr + q['e'] + 1 : pr, rm, more );
	            }

	            return q;
	        };
	    })();


	    /*
	     * Taylor/Maclaurin series.
	     *
	     * exp(x) = x^0/0! + x^1/1! + x^2/2! + x^3/3! + ...
	     *
	     * Argument reduction:
	     *   Repeat x = x / 32, k += 5, until |x| < 0.1
	     *   exp(x) = exp(x / 2^k)^(2^k)
	     *
	     * Previously, the argument was initially reduced by
	     * exp(x) = exp(r) * 10^k  where r = x - k * ln10, k = floor(x / ln10)
	     * to first put r in the range [0, ln10], before dividing by 32 until |x| < 0.1, but this was
	     * found to be slower than just dividing repeatedly by 32 as above.
	     *
	     * Max integer argument: exp('20723265836946413') = 6.3e+9000000000000000
	     * Min integer argument: exp('-20723265836946411') = 1.2e-9000000000000000
	     * ( Math object integer min/max: Math.exp(709) = 8.2e+307, Math.exp(-745) = 5e-324 )
	     *
	     *  exp(Infinity)  = Infinity
	     *  exp(-Infinity) = 0
	     *  exp(NaN)       = NaN
	     *  exp(+-0)       = 1
	     *
	     *  exp(x) is non-terminating for any finite, non-zero x.
	     *
	     *  The result will always be correctly rounded.
	     *
	     */
	    function exp( x, pr ) {
	        var denom, guard, j, pow, sd, sum, t,
	            rep = 0,
	            i = 0,
	            k = 0,
	            Decimal = x['constructor'],
	            one = Decimal['ONE'],
	            rm = Decimal['rounding'],
	            precision = Decimal['precision'];

	        // 0/NaN/Infinity?
	        if ( !x['c'] || !x['c'][0] || x['e'] > 17 ) {

	            return new Decimal( x['c']
	              ? !x['c'][0] ? one : x['s'] < 0 ? 0 : 1 / 0
	              : x['s'] ? x['s'] < 0 ? 0 : x : NaN );
	        }

	        if ( pr == null ) {

	            /*
	             Estimate result exponent.
	             e^x = 10^j, where j = x * log10(e) and
	             log10(e) = ln(e) / ln(10) = 1 / ln(10),
	             so j = x / ln(10)
	            j = mathfloor( x / Math.LN10 );

	            // Overflow/underflow? Estimate may be +-1 of true value.
	            if ( j > Decimal['maxE'] + 1 || j < Decimal['minE'] - 1 ) {

	                return new Decimal( j > 0 ? 1 / 0 : 0 );
	            }
	             */

	            external = false;
	            sd = precision;
	        } else {
	            sd = pr;
	        }

	        t = new Decimal(0.03125);

	        // while abs(x) >= 0.1
	        while ( x['e'] > -2 ) {

	            // x = x / 2^5
	            x = x['times'](t);
	            k += 5;
	        }

	        /*
	         Use 2 * log10(2^k) + 5 to estimate the increase in precision necessary to ensure the first
	         4 rounding digits are correct.
	         */
	        guard = Math.log( mathpow( 2, k ) ) / Math.LN10 * 2 + 5 | 0;
	        sd += guard;

	        denom = pow = sum = new Decimal(one);
	        Decimal['precision'] = sd;

	        for ( ; ; ) {
	            pow = rnd( pow['times'](x), sd, 1 );
	            denom = denom['times'](++i);
	            t = sum['plus']( div( pow, denom, sd, 1 ) );

	            if ( coefficientToString( t['c'] ).slice( 0, sd ) ===
	                 coefficientToString( sum['c'] ).slice( 0, sd ) ) {
	                j = k;

	                while ( j-- ) {
	                    sum = rnd( sum['times'](sum), sd, 1 );
	                }

	                /*
	                 Check to see if the first 4 rounding digits are [49]999.
	                 If so, repeat the summation with a higher precision, otherwise
	                 E.g. with precision: 18, rounding: 1
	                 exp(18.404272462595034083567793919843761) = 98372560.1229999999
	                                           when it should be 98372560.123

	                 sd - guard is the index of first rounding digit.
	                 */
	                if ( pr == null ) {

	                    if ( rep < 3 && checkRoundingDigits( sum['c'], sd - guard, rm, rep ) ) {
	                        Decimal['precision'] = sd += 10;
	                        denom = pow = t = new Decimal(one);
	                        i = 0;
	                        rep++;
	                    } else {

	                        return rnd( sum, Decimal['precision'] = precision, rm, external = true );
	                    }
	                } else {
	                    Decimal['precision'] = precision;

	                    return sum;
	                }
	            }
	            sum = t;
	        }
	    }


	    /*
	     * Return a string representing the value of Decimal n in normal or exponential notation
	     * rounded to the specified decimal places or significant digits.
	     * Called by toString, toExponential (k is 1), toFixed, and toPrecision (k is 2).
	     * i is the index (with the value in normal notation) of the digit that may be rounded up.
	     * j is the rounding mode, then the number of digits required including fraction-part trailing
	     * zeros.
	     */
	    function format( n, i, j, k ) {
	        var s, z,
	            Decimal = n['constructor'],
	            e = ( n = new Decimal(n) )['e'];

	        // i == null when toExponential(no arg), or toString() when x >= toExpPos etc.
	        if ( i == null ) {
	            j = 0;
	        } else {
	            rnd( n, ++i, j );

	            // If toFixed, n['e'] may have changed if the value was rounded up.
	            j = k ? i : i + n['e'] - e;
	        }

	        e = n['e'];
	        s = coefficientToString( n['c'] );

	        /*
	         toPrecision returns exponential notation if the number of significant digits specified
	         is less than the number of digits necessary to represent the integer part of the value
	         in normal notation.
	         */

	        // Exponential notation.
	        if ( k == 1 || k == 2 && ( i <= e || e <= Decimal['toExpNeg'] ) ) {

	            // Append zeros?
	            for ( ; s.length < j; s += '0' );

	            if ( s.length > 1 ) {
	                s = s.charAt(0) + '.' + s.slice(1);
	            }

	            s += ( e < 0 ? 'e' : 'e+' ) + e;

	        // Normal notation.
	        } else {
	            k = s.length;

	            // Negative exponent?
	            if ( e < 0 ) {
	                z = j - k;

	                // Prepend zeros.
	                for ( ; ++e; s = '0' + s );
	                s = '0.' + s;

	            // Positive exponent?
	            } else {

	                if ( ++e > k ) {
	                    z = j - e;

	                    // Append zeros.
	                    for ( e -= k; e-- ; s += '0' );

	                    if ( z > 0 ) {
	                        s += '.';
	                    }

	                } else {
	                    z = j - k;

	                    if ( e < k ) {
	                        s = s.slice( 0, e ) + '.' + s.slice(e);
	                    } else if ( z > 0 ) {
	                        s += '.';
	                    }
	                }
	            }

	            // Append more zeros?
	            if ( z > 0 ) {

	                for ( ; z--; s += '0' );
	            }
	        }

	        return n['s'] < 0 && n['c'][0] ? '-' + s : s;
	    }


	    function getCoeffLength(c) {
	        var v = c.length - 1,
	            n = v * LOGBASE + 1;

	        if ( v = c[v] ) {

	            // Subtract the number of trailing zeros of the last number.
	            for ( ; v % 10 == 0; v /= 10, n-- );

	            // Add the number of digits of the first number.
	            for ( v = c[0]; v >= 10; v /= 10, n++ );
	        }

	        return n;
	    }


	    /*
	     * Assemble error messages. Throw Decimal Errors.
	     */
	    function ifExceptionsThrow( Decimal, message, arg, method, more ) {

	        if ( Decimal['errors'] ) {
	            var error = new Error( ( method || [
	              'new Decimal', 'cmp', 'div', 'eq', 'gt', 'gte', 'lt', 'lte', 'minus', 'mod',
	              'plus', 'times', 'toFraction', 'pow', 'random', 'log', 'sqrt', 'toNearest', 'divToInt'
	              ][ id ? id < 0 ? -id : id : 1 / id < 0 ? 1 : 0 ] ) + '() ' + ( [
	              'number type has more than 15 significant digits', 'LN10 out of digits' ][message]
	              || message + ( [ outOfRange ? ' out of range' : ' not an integer',
	              ' not a boolean or binary digit' ][more] || '' ) ) + ': ' + arg
	            );
	            error['name'] = 'Decimal Error';
	            outOfRange = id = 0;

	            throw error;
	        }
	    }


	    /*
	     * Use 'exponentiation by squaring' for small integers. Called by convertBase and pow.
	     */
	    function intPow( Decimal, x, i ) {
	        var r = new Decimal( Decimal['ONE'] );

	        for ( external = false; ; ) {

	            if ( i & 1 ) {
	                r = r['times'](x);
	            }
	            i >>= 1;

	            if ( !i ) {

	                break;
	            }
	            x = x['times'](x);
	        }
	        external = true;

	        return r;
	    }


	    /*
	     *  ln(-n)        = NaN
	     *  ln(0)         = -Infinity
	     *  ln(-0)        = -Infinity
	     *  ln(1)         = 0
	     *  ln(Infinity)  = Infinity
	     *  ln(-Infinity) = NaN
	     *  ln(NaN)       = NaN
	     *
	     *  ln(n) (n != 1) is non-terminating.
	     *
	     */
	    function ln( y, pr ) {
	        var c, c0, denom, e, num, rep, sd, sum, t, x1, x2,
	            n = 1,
	            guard = 10,
	            x = y,
	            xc = x['c'],
	            Decimal = x['constructor'],
	            one = Decimal['ONE'],
	            rm = Decimal['rounding'],
	            precision = Decimal['precision'];

	        // x < 0 or +-Infinity/NaN or 0 or 1.
	        if ( x['s'] < 0 || !xc || !xc[0] || !x['e'] && xc[0] == 1 && xc.length == 1 ) {

	            return new Decimal( xc && !xc[0] ? -1 / 0 : x['s'] != 1 ? NaN : xc ? 0 : x );
	        }

	        if ( pr == null ) {
	            external = false;
	            sd = precision;
	        } else {
	            sd = pr;
	        }

	        Decimal['precision'] = sd += guard;

	        c = coefficientToString(xc);
	        c0 = c.charAt(0);

	        if ( Math.abs( e = x['e'] ) < 1.5e15 ) {

	            /*
	             Argument reduction.
	             The series converges faster the closer the argument is to 1, so using
	             ln(a^b) = b * ln(a),   ln(a) = ln(a^b) / b
	             multiply the argument by itself until the leading digits of the significand are 7, 8,
	             9, 10, 11, 12 or 13, recording the number of multiplications so the sum of the series
	             can later be divided by this number, then separate out the power of 10 using
	             ln(a*10^b) = ln(a) + b*ln(10).
	             */

	            // max n is 21 ( gives 0.9, 1.0 or 1.1 ) ( 9e15 / 21 = 4.2e14 ).
	            //while ( c0 < 9 && c0 != 1 || c0 == 1 && c.charAt(1) > 1 ) {
	            // max n is 6 ( gives 0.7 - 1.3 )
	            while ( c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3 ) {
	                x = x['times'](y);
	                c = coefficientToString( x['c'] );
	                c0 = c.charAt(0);
	                n++;
	            }

	            e = x['e'];

	            if ( c0 > 1 ) {
	                x = new Decimal( '0.' + c );
	                e++;
	            } else {
	                x = new Decimal( c0 + '.' + c.slice(1) );
	            }
	        } else {

	            /*
	             The argument reduction method above may result in overflow if the argument y is a
	             massive number with exponent >= 1500000000000000 ( 9e15 / 6 = 1.5e15 ), so instead
	             recall this function using ln(x*10^e) = ln(x) + e*ln(10).
	             */
	            x = new Decimal( c0 + '.' + c.slice(1) );

	            if ( sd + 2 > LN10.length ) {
	                ifExceptionsThrow( Decimal, 1, sd + 2, 'ln' );
	            }

	            x = ln( x, sd - guard )['plus'](
	                new Decimal( LN10.slice( 0, sd + 2 ) )['times']( e + '' )
	            );

	            Decimal['precision'] = precision;

	            return pr == null ? rnd( x, precision, rm, external = true ) : x;
	        }

	        // x1 is x reduced to a value near 1.
	        x1 = x;

	        /*
	         Taylor series.
	         ln(y) = ln( (1 + x)/(1 - x) ) = 2( x + x^3/3 + x^5/5 + x^7/7 + ... )
	         where
	         x = (y - 1)/(y + 1)              ( |x| < 1 )
	         */
	        sum = num = x = div( x['minus'](one), x['plus'](one), sd, 1 );
	        x2 = rnd( x['times'](x), sd, 1 );
	        denom = 3;

	        for ( ; ; ) {
	            num = rnd( num['times'](x2), sd, 1 );
	            t = sum['plus']( div( num, new Decimal(denom), sd, 1 ) );

	            if ( coefficientToString( t['c'] ).slice( 0, sd ) ===
	                 coefficientToString( sum['c'] ).slice( 0, sd ) ) {
	                sum = sum['times'](2);

	                /*
	                 Reverse the argument reduction. Check that e is not 0 because, as well as
	                 preventing an unnecessary calculation, -0 + 0 = +0 and to ensure correct
	                 rounding later -0 needs to stay -0.
	                 */
	                if ( e !== 0 ) {

	                    if ( sd + 2 > LN10.length ) {
	                        ifExceptionsThrow( Decimal, 1, sd + 2, 'ln' );
	                    }

	                    sum = sum['plus'](
	                        new Decimal( LN10.slice( 0, sd + 2 ) )['times']( e + '' )
	                    );
	                }

	                sum = div( sum, new Decimal(n), sd, 1 );

	                /*
	                 Is rm > 3 and the first 4 rounding digits 4999, or rm < 4 (or the summation has
	                 been repeated previously) and the first 4 rounding digits 9999?

	                 If so, restart the summation with a higher precision, otherwise
	                 e.g. with precision: 12, rounding: 1
	                 ln(135520028.6126091714265381533) = 18.7246299999 when it should be 18.72463.

	                 sd - guard is the index of first rounding digit.
	                 */
	                if ( pr == null ) {

	                    if ( checkRoundingDigits( sum['c'], sd - guard, rm, rep ) ) {
	                        Decimal['precision'] = sd += guard;
	                        t = num = x = div( x1['minus'](one), x1['plus'](one), sd, 1 );
	                        x2 = rnd( x['times'](x), sd, 1 );
	                        denom = rep = 1;
	                    } else {

	                        return rnd( sum, Decimal['precision'] = precision, rm, external = true );
	                    }
	                } else {
	                    Decimal['precision'] = precision;

	                    return sum;
	                }
	            }

	            sum = t;
	            denom += 2;
	        }
	    }


	    /*
	     * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
	     */
	     function rnd( x, sd, rm, r ) {
	        var digits, i, j, k, n, rd, xc, xci,
	            Decimal = x['constructor'];

	        // Don't round if sd is null or undefined.
	        out: if ( sd != null ) {

	            // Infinity/NaN.
	            if ( !( xc = x['c'] ) ) {

	                return x;
	            }

	            /*
	             rd, the rounding digit, i.e. the digit after the digit that may be rounded up,
	             n, a base 1e7 number, the element of xc containing rd,
	             xci, the index of n within xc,
	             digits, the number of digits of n,
	             i, what would be the index of rd within n if all the numbers were 7 digits long (i.e. they had leading zeros)
	             j, if > 0, the actual index of rd within n (if < 0, rd is a leading zero),
	             nLeadingZeros, the number of leading zeros n would have if it were 7 digits long.
	             */

	            // Get the length of the first element of the coefficient array xc.
	            for ( digits = 1, k = xc[0]; k >= 10; k /= 10, digits++ );

	            i = sd - digits;

	            // Is the rounding digit in the first element of xc?
	            if ( i < 0 ) {
	                i += LOGBASE;
	                j = sd;
	                n = xc[ xci = 0 ];

	                // Get the rounding digit at index j of n.
	                rd = n / mathpow( 10, digits - j - 1 ) % 10 | 0;
	            } else {
	                xci = Math.ceil( ( i + 1 ) / LOGBASE );

	                if ( xci >= xc.length ) {

	                    if (r) {

	                        // Needed by exp, ln and sqrt.
	                        for ( ; xc.length <= xci; xc.push(0) );

	                        n = rd = 0;
	                        digits = 1;
	                        i %= LOGBASE;
	                        j = i - LOGBASE + 1;
	                    } else {

	                      break out;
	                    }
	                } else {
	                    n = k = xc[xci];

	                    // Get the number of digits of n.
	                    for ( digits = 1; k >= 10; k /= 10, digits++ );

	                    // Get the index of rd within n.
	                    i %= LOGBASE;

	                    // Get the index of rd within n, adjusted for leading zeros.
	                    // The number of leading zeros of n is given by LOGBASE - digits.
	                    j = i - LOGBASE + digits;

	                    // Get the rounding digit at index j of n.
	                    // Floor using Math.floor instead of | 0 as rd may be outside int range.
	                    rd = j < 0 ? 0 : mathfloor( n / mathpow( 10, digits - j - 1 ) % 10 );
	                }
	            }

	            r = r || sd < 0 ||
	              // Are there any non-zero digits after the rounding digit?
	              xc[xci + 1] != null || ( j < 0 ? n : n % mathpow( 10, digits - j - 1 ) );

	            /*
	             The expression  n % mathpow( 10, digits - j - 1 )  returns all the digits of n to the
	             right of the digit at (left-to-right) index j,
	             e.g. if n is 908714 and j is 2, the expression will give 714.
	             */

	            r = rm < 4
	              ? ( rd || r ) && ( rm == 0 || rm == ( x['s'] < 0 ? 3 : 2 ) )
	              : rd > 5 || rd == 5 && ( rm == 4 || r ||
	                // Check whether the digit to the left of the rounding digit is odd.
	                rm == 6 && ( ( i > 0 ? j > 0 ? n / mathpow( 10, digits - j ) : 0 : xc[xci - 1] ) % 10 ) & 1 ||
	                  rm == ( x['s'] < 0 ? 8 : 7 ) );

	            if ( sd < 1 || !xc[0] ) {
	                xc.length = 0;

	                if (r) {

	                    // Convert sd to decimal places.
	                    sd -= x['e'] + 1;

	                    // 1, 0.1, 0.01, 0.001, 0.0001 etc.
	                    xc[0] = mathpow( 10, sd % LOGBASE );
	                    x['e'] = -sd || 0;
	                } else {

	                    // Zero.
	                    xc[0] = x['e'] = 0;
	                }

	                return x;
	            }

	            // Remove excess digits.

	            if ( i == 0 ) {
	                xc.length = xci;
	                k = 1;
	                xci--;
	            } else {
	                xc.length = xci + 1;
	                k = mathpow( 10, LOGBASE - i );

	                // E.g. 56700 becomes 56000 if 7 is the rounding digit.
	                // j > 0 means i > number of leading zeros of n.
	                xc[xci] = j > 0 ? ( n / mathpow( 10, digits - j ) % mathpow( 10, j ) | 0 ) * k : 0;
	            }

	            // Round up?
	            if (r) {

	                for ( ; ; ) {

	                    // Is the digit to be rounded up in the first element of xc?
	                    if ( xci == 0 ) {

	                        // i will be the length of xc[0] before k is added.
	                        for ( i = 1, j = xc[0]; j >= 10; j /= 10, i++ );

	                        j = xc[0] += k;

	                        for ( k = 1; j >= 10; j /= 10, k++ );

	                        // if i != k the length has increased.
	                        if ( i != k ) {
	                            x['e']++;

	                            if ( xc[0] == BASE ) {
	                                xc[0] = 1;
	                            }
	                        }

	                        break;
	                    } else {
	                        xc[xci] += k;

	                        if ( xc[xci] != BASE ) {

	                            break;
	                        }

	                        xc[xci--] = 0;
	                        k = 1;
	                    }
	                }
	            }

	            // Remove trailing zeros.
	            for ( i = xc.length; xc[--i] === 0; xc.pop() );
	        }

	        if (external) {

	            // Overflow?
	            if ( x['e'] > Decimal['maxE'] ) {

	                // Infinity.
	                x['c'] = x['e'] = null;

	            // Underflow?
	            } else if ( x['e'] < Decimal['minE'] ) {

	                // Zero.
	                x['c'] = [ x['e'] = 0 ];
	            }
	        }

	        return x;
	    }


	    decimal = (function () {


	        // Private functions used by static Decimal methods.


	        /*
	         *  The following emulations or wrappers of Math object functions are currently
	         *  commented-out and not in the public API.
	         *
	         *  abs
	         *  acos
	         *  asin
	         *  atan
	         *  atan2
	         *  ceil
	         *  cos
	         *  floor
	         *  round
	         *  sin
	         *  tan
	         *  trunc
	         */


	        /*
	         * Return a new Decimal whose value is the absolute value of n.
	         *
	         * n {number|string|Decimal}
	         *
	        function abs(n) { return new this(n)['abs']() }
	         */


	        /*
	         * Return a new Decimal whose value is the arccosine in radians of n.
	         *
	         * n {number|string|Decimal}
	         *
	        function acos(n) { return new this( Math.acos(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is the arcsine in radians of n.
	         *
	         * n {number|string|Decimal}
	         *
	        function asin(n) { return new this( Math.asin(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is the arctangent in radians of n.
	         *
	         * n {number|string|Decimal}
	         *
	        function atan(n) { return new this( Math.atan(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is the arctangent in radians of y/x in the range
	         * -PI to PI (inclusive).
	         *
	         * y {number|string|Decimal} The y-coordinate.
	         * x {number|string|Decimal} The x-coordinate.
	         *
	        function atan2( y, x ) { return new this( Math.atan2( y, x ) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is n round to an integer using ROUND_CEIL.
	         *
	         * n {number|string|Decimal}
	         *
	        function ceil(n) { return new this(n)['ceil']() }
	         */


	        /*
	         * Configure global settings for a Decimal constructor.
	         *
	         * obj is an object with any of the following properties,
	         *
	         *   precision  {number}
	         *   rounding   {number}
	         *   toExpNeg   {number}
	         *   toExpPos   {number}
	         *   minE       {number}
	         *   maxE       {number}
	         *   errors     {boolean|number}
	         *   crypto     {boolean|number}
	         *   modulo     {number}
	         *
	         *   format     {object}     See Decimal.prototype.toFormat
	         *      decimalSeparator       {string}
	         *      groupSeparator         {string}
	         *      groupSize              {number}
	         *      secondaryGroupSize     {number}
	         *      fractionGroupSeparator {string}
	         *      fractionGroupSize      {number}
	         *
	         *   A format object will replace the existing Decimal.format object without any property
	         *   checking.
	         *
	         * E.g.
	         *   Decimal.config({ precision: 20, rounding: 4 })
	         *
	         */
	        function config(obj) {
	            var p, u, v,
	                Decimal = this,
	                c = 'config',
	                parse = Decimal['errors'] ? parseInt : parseFloat;

	            if ( obj == u || typeof obj != 'object' &&
	              // 'config() object expected: {obj}'
	              !ifExceptionsThrow( Decimal, 'object expected', obj, c ) ) {

	                return Decimal;
	            }

	            // precision {number} Integer, 1 to MAX_DIGITS inclusive.
	            if ( ( v = obj[ p = 'precision' ] ) != u ) {

	                if ( !( outOfRange = v < 1 || v > MAX_DIGITS ) && parse(v) == v ) {
	                    Decimal[p] = v | 0;
	                } else {

	                    // 'config() precision not an integer: {v}'
	                    // 'config() precision out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // rounding {number} Integer, 0 to 8 inclusive.
	            if ( ( v = obj[ p = 'rounding' ] ) != u ) {

	                if ( !( outOfRange = v < 0 || v > 8 ) && parse(v) == v ) {
	                    Decimal[p] = v | 0;
	                } else {

	                    // 'config() rounding not an integer: {v}'
	                    // 'config() rounding out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // toExpNeg {number} Integer, -EXP_LIMIT to 0 inclusive.
	            if ( ( v = obj[ p = 'toExpNeg' ] ) != u ) {

	                if ( !( outOfRange = v < -EXP_LIMIT || v > 0 ) && parse(v) == v ) {
	                    Decimal[p] = mathfloor(v);
	                } else {

	                    // 'config() toExpNeg not an integer: {v}'
	                    // 'config() toExpNeg out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // toExpPos {number} Integer, 0 to EXP_LIMIT inclusive.
	            if ( ( v = obj[ p = 'toExpPos' ] ) != u ) {

	                if ( !( outOfRange = v < 0 || v > EXP_LIMIT ) && parse(v) == v ) {
	                    Decimal[p] = mathfloor(v);
	                } else {

	                    // 'config() toExpPos not an integer: {v}'
	                    // 'config() toExpPos out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	             // minE {number} Integer, -EXP_LIMIT to 0 inclusive.
	            if ( ( v = obj[ p = 'minE' ] ) != u ) {

	                if ( !( outOfRange = v < -EXP_LIMIT || v > 0 ) && parse(v) == v ) {
	                    Decimal[p] = mathfloor(v);
	                } else {

	                    // 'config() minE not an integer: {v}'
	                    // 'config() minE out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // maxE {number} Integer, 0 to EXP_LIMIT inclusive.
	            if ( ( v = obj[ p = 'maxE' ] ) != u ) {

	                if ( !( outOfRange = v < 0 || v > EXP_LIMIT ) && parse(v) == v ) {
	                    Decimal[p] = mathfloor(v);
	                } else {

	                    // 'config() maxE not an integer: {v}'
	                    // 'config() maxE out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // errors {boolean|number} true, false, 1 or 0.
	            if ( ( v = obj[ p = 'errors' ] ) != u ) {

	                if ( v === !!v || v === 1 || v === 0 ) {
	                    outOfRange = id = 0;
	                    Decimal[p] = !!v;
	                } else {

	                    // 'config() errors not a boolean or binary digit: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 1 );
	                }
	            }

	            // crypto {boolean|number} true, false, 1 or 0.
	            if ( ( v = obj[ p = 'crypto' ] ) != u ) {

	                if ( v === !!v || v === 1 || v === 0 ) {
	                    Decimal[p] = !!( v && crypto && typeof crypto == 'object' );
	                } else {

	                    // 'config() crypto not a boolean or binary digit: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 1 );
	                }
	            }

	            // modulo {number} Integer, 0 to 9 inclusive.
	            if ( ( v = obj[ p = 'modulo' ] ) != u ) {

	                if ( !( outOfRange = v < 0 || v > 9 ) && parse(v) == v ) {
	                    Decimal[p] = v | 0;
	                } else {

	                    // 'config() modulo not an integer: {v}'
	                    // 'config() modulo out of range: {v}'
	                    ifExceptionsThrow( Decimal, p, v, c, 0 );
	                }
	            }

	            // format {object}
	            if ( ( obj = obj[ p = 'format' ] ) != u ) {

	                if ( typeof obj == 'object' ) {
	                    Decimal[p] = obj;
	                } else {

	                    // 'config() format object expected: {obj}'
	                    ifExceptionsThrow( Decimal, 'format object expected', obj, c );
	                }
	            }

	            return Decimal;
	        }


	        /*
	         * Return a new Decimal whose value is the cosine of n.
	         *
	         * n {number|string|Decimal} A number given in radians.
	         *
	        function cos(n) { return new this( Math.cos(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is the exponential of n,
	         *
	         * n {number|string|Decimal} The power to which to raise the base of the natural log.
	         *
	         */
	        function exp(n) { return new this(n)['exp'](); }


	        /*
	         * Return a new Decimal whose value is n round to an integer using ROUND_FLOOR.
	         *
	         * n {number|string|Decimal}
	         *
	        function floor(n) { return new this(n)['floor']() }
	         */


	        /*
	         * Return a new Decimal whose value is the natural logarithm of n.
	         *
	         * n {number|string|Decimal}
	         *
	         */
	        function ln(n) { return new this(n)['ln'](); }


	        /*
	         * Return a new Decimal whose value is the log of x to the base y, or to base 10 if no
	         * base is specified.
	         *
	         * log[y](x)
	         *
	         * x {number|string|Decimal} The argument of the logarithm.
	         * y {number|string|Decimal} The base of the logarithm.
	         *
	         */
	        function log( x, y ) { return new this(x)['log'](y); }


	        /*
	         * Handle max and min. ltgt is 'lt' or 'gt'.
	         */
	        function maxOrMin( Decimal, args, ltgt ) {
	            var m, n,
	                i = 0;

	            if ( toString.call( args[0] ) == '[object Array]' ) {
	                args = args[0];
	            }

	            m = new Decimal( args[0] );

	            for ( ; ++i < args.length; ) {
	                n = new Decimal( args[i] );

	                if ( !n['s'] ) {
	                    m = n;

	                    break;
	                } else if ( m[ltgt](n) ) {
	                    m = n;
	                }
	            }

	            return m;
	        }


	        /*
	         * Return a new Decimal whose value is the maximum of the arguments.
	         *
	         * arguments {number|string|Decimal}
	         *
	         */
	        function max() { return maxOrMin( this, arguments, 'lt' ); }


	        /*
	         * Return a new Decimal whose value is the minimum of the arguments.
	         *
	         * arguments {number|string|Decimal}
	         *
	         */
	        function min() { return maxOrMin( this, arguments, 'gt' ); }


	        /*
	         * Parse the value of a new Decimal from a number or string.
	         */
	        var parseDecimal = (function () {
	            var isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
	                trim = String.prototype.trim ||
	                  function () { return this.replace(/^\s+|\s+$/g, ''); };

	            return function ( Decimal, x, n, b ) {
	                var d, e, i, isNum, orig, valid;

	                if ( typeof n != 'string' ) {

	                    // If n is a number, check if minus zero.
	                    n = ( isNum = typeof n == 'number' || toString.call(n) == '[object Number]' ) &&
	                        n === 0 && 1 / n < 0 ? '-0' : n + '';
	                }
	                orig = n;

	                if ( b == null && isValid.test(n) ) {

	                    // Determine sign.
	                    x['s'] = n.charCodeAt(0) === 45 ? ( n = n.slice(1), -1 ) : 1;

	                // Either n is not a valid Decimal or a base has been specified.
	                } else {

	                    /*
	                     Enable exponential notation to be used with base 10 argument.
	                     Ensure return value is rounded to precision as with other bases.
	                     */
	                    if ( b == 10 ) {

	                        return rnd( new Decimal(n), Decimal['precision'], Decimal['rounding'] );
	                    }

	                    n = trim.call(n).replace( /^\+(?!-)/, '' );

	                    x['s'] = n.charCodeAt(0) === 45 ? ( n = n.replace( /^-(?!-)/, '' ), -1 ) : 1;

	                    if ( b != null ) {

	                        if ( ( b == (b | 0) || !Decimal['errors'] ) &&
	                          !( outOfRange = !( b >= 2 && b < 65 ) ) ) {
	                            d = '[' + NUMERALS.slice( 0, b = b | 0 ) + ']+';

	                           // Remove the `.` from e.g. '1.', and replace e.g. '.1' with '0.1'.
	                            n = n.replace( /\.$/, '' ).replace( /^\./, '0.' );

	                            // Any number in exponential form will fail due to the e+/-.
	                            if ( valid = new RegExp(
	                              '^' + d + '(?:\\.' + d + ')?$', b < 37 ? 'i' : '' ).test(n) ) {

	                                if (isNum) {

	                                    if ( n.replace( /^0\.0*|\./, '' ).length > 15 ) {

	                                        // '{method} number type has more than 15 significant digits: {n}'
	                                        ifExceptionsThrow( Decimal, 0, orig );
	                                    }

	                                    // Prevent later check for length on converted number.
	                                    isNum = !isNum;
	                                }
	                                n = convertBase( Decimal, n, 10, b, x['s'] );

	                            } else if ( n != 'Infinity' && n != 'NaN' ) {

	                                // '{method} not a base {b} number: {n}'
	                                ifExceptionsThrow( Decimal, 'not a base ' + b + ' number', orig );
	                                n = 'NaN';
	                            }
	                        } else {

	                            // '{method} base not an integer: {b}'
	                            // '{method} base out of range: {b}'
	                            ifExceptionsThrow( Decimal, 'base', b, 0, 0 );

	                            // Ignore base.
	                            valid = isValid.test(n);
	                        }
	                    } else {
	                        valid = isValid.test(n);
	                    }

	                    if ( !valid ) {

	                        // Infinity/NaN
	                        x['c'] = x['e'] = null;

	                        // NaN
	                        if ( n != 'Infinity' ) {

	                            // No exception on NaN.
	                            if ( n != 'NaN' ) {

	                                // '{method} not a number: {n}'
	                                ifExceptionsThrow( Decimal, 'not a number', orig );
	                            }
	                            x['s'] = null;
	                        }
	                        id = 0;

	                        return x;
	                    }
	                }

	                // Decimal point?
	                if ( ( e = n.indexOf('.') ) > -1 ) {
	                    n = n.replace( '.', '' );
	                }

	                // Exponential form?
	                if ( ( i = n.search(/e/i) ) > 0 ) {

	                    // Determine exponent.
	                    if ( e < 0 ) {
	                        e = i;
	                    }
	                    e += +n.slice( i + 1 );
	                    n = n.substring( 0, i );

	                } else if ( e < 0 ) {

	                    // Integer.
	                    e = n.length;
	                }

	                // Determine leading zeros.
	                for ( i = 0; n.charCodeAt(i) === 48; i++ );

	                // Determine trailing zeros.
	                for ( b = n.length; n.charCodeAt(--b) === 48; );

	                n = n.slice( i, b + 1 );

	                if (n) {
	                    b = n.length;

	                    // Disallow numbers with over 15 significant digits if number type.
	                    if ( isNum && b > 15 ) {

	                        // '{method} number type has more than 15 significant digits: {n}'
	                        ifExceptionsThrow( Decimal, 0, orig );
	                    }

	                    x['e'] = e = e - i - 1;
	                    x['c'] = [];

	                    // Transform base

	                    // e is the base 10 exponent.
	                    // i is where to slice n to get the first element of the coefficient array.
	                    i = ( e + 1 ) % LOGBASE;

	                    if ( e < 0 ) {
	                        i += LOGBASE;
	                    }

	                    // b is n.length.
	                    if ( i < b ) {

	                        if (i) {
	                            x['c'].push( +n.slice( 0, i ) );
	                        }

	                        for ( b -= LOGBASE; i < b; ) {
	                            x['c'].push( +n.slice( i, i += LOGBASE ) );
	                        }

	                        n = n.slice(i);
	                        i = LOGBASE - n.length;
	                    } else {
	                        i -= b;
	                    }

	                    for ( ; i--; n += '0' );

	                    x['c'].push( +n );

	                    if (external) {

	                        // Overflow?
	                        if ( x['e'] > Decimal['maxE'] ) {

	                            // Infinity.
	                            x['c'] = x['e'] = null;

	                        // Underflow?
	                        } else if ( x['e'] < Decimal['minE'] ) {

	                            // Zero.
	                            x['c'] = [ x['e'] = 0 ];
	                        }
	                    }
	                } else {

	                    // Zero.
	                    x['c'] = [ x['e'] = 0 ];
	                }
	                id = 0;

	                return x;
	            };
	        })();


	        /*
	         * Return a new Decimal whose value is x raised to the power y.
	         *
	         * x {number|string|Decimal} The base.
	         * y {number|string|Decimal} The exponent.
	         *
	         */
	        function pow( x, y ) { return new this(x)['pow'](y); }


	        /*
	         * Returns a new Decimal with a random value equal to or greater than 0 and less than 1, and
	         * with dp, or Decimal.precision if dp is omitted, decimal places (or less if trailing
	         * zeros are produced).
	         *
	         * [dp] {number} Decimal places. Integer, 0 to MAX_DIGITS inclusive.
	         *
	         */
	        function random(dp) {
	            var a, n, v,
	                i = 0,
	                r = [],
	                Decimal = this,
	                rand = new Decimal( Decimal['ONE'] );

	            if ( dp == null || !checkArg( rand, dp, 'random' ) ) {
	                dp = Decimal['precision'];
	            } else {
	                dp |= 0;
	            }

	            n = Math.ceil( dp / LOGBASE );

	            if ( Decimal['crypto'] ) {

	                // Browsers supporting crypto.getRandomValues.
	                if ( crypto && crypto['getRandomValues'] ) {

	                    a = crypto['getRandomValues']( new Uint32Array(n) );

	                    for ( ; i < n; ) {
	                        v = a[i];

	                        // 0 >= v < 4294967296
	                        // Probability that v >= 4.29e9, is 4967296 / 4294967296 = 0.00116 (1 in 865).
	                        if ( v >= 4.29e9 ) {

	                            a[i] = crypto['getRandomValues']( new Uint32Array(1) )[0];
	                        } else {

	                            // 0 <= v <= 4289999999
	                            // 0 <= ( v % 1e7 ) <= 9999999
	                            r[i++] = v % 1e7;
	                        }
	                    }

	                // Node.js supporting crypto.randomBytes.
	                } else if ( crypto && crypto['randomBytes'] ) {

	                    // buffer
	                    a = crypto['randomBytes']( n *= 4 );

	                    for ( ; i < n; ) {

	                        // 0 <= v < 2147483648
	                        v = a[i] + ( a[i + 1] << 8 ) + ( a[i + 2] << 16 ) +
	                            ( ( a[i + 3] & 0x7f ) << 24 );

	                        // Probability that v >= 2.14e9, is 7483648 / 2147483648 = 0.0035 (1 in 286).
	                        if ( v >= 2.14e9 ) {
	                            crypto['randomBytes'](4).copy( a, i );
	                        } else {

	                            // 0 <= v <= 4289999999
	                            // 0 <= ( v % 1e7 ) <= 9999999
	                            r.push( v % 1e7 );
	                            i += 4;
	                        }
	                    }
	                    i = n / 4;

	                } else {
	                    ifExceptionsThrow( Decimal, 'crypto unavailable', crypto, 'random' );
	                }
	            }

	            // Use Math.random: either Decimal.crypto is false or crypto is unavailable and errors is false.
	            if (!i) {

	                for ( ; i < n; ) {
	                    r[i++] = Math.random() * 1e7 | 0;
	                }
	            }

	            n = r[--i];
	            dp %= LOGBASE;

	            // Convert trailing digits to zeros according to dp.
	            if ( n && dp ) {
	                v = mathpow( 10, LOGBASE - dp );
	                r[i] = ( n / v | 0 ) * v;
	            }

	            // Remove trailing elements which are zero.
	            for ( ; r[i] === 0; i-- ) {
	                r.pop();
	            }

	            // Zero?
	            if ( i < 0 ) {
	                r = [ n = 0 ];
	            } else {
	                n = -1;

	                // Remove leading elements which are zero and adjust exponent accordingly.
	                for ( ; r[0] === 0; ) {
	                    r.shift();
	                    n -= LOGBASE;
	                }

	                // Count the digits of the first element of r to determine leading zeros.
	                for ( i = 1, v = r[0]; v >= 10; ) {
	                    v /= 10;
	                    i++;
	                }

	                // Adjust the exponent for leading zeros of the first element of r.
	                if ( i < LOGBASE ) {
	                    n -= LOGBASE - i;
	                }
	            }

	            rand['e'] = n;
	            rand['c'] = r;

	            return rand;
	        }


	        /*
	         * Return a new Decimal whose value is n round to an integer using rounding mode rounding.
	         *
	         * To emulate Math.round, set rounding to 7 (ROUND_HALF_CEIL).
	         *
	         * n {number|string|Decimal}
	         *
	        function round(n) {
	            var x = new this(n);

	            return rnd( x, x['e'] + 1, this['rounding'] );
	        }
	         */


	        /*
	         * Return a new Decimal whose value is the sine of n.
	         *
	         * n {number|string|Decimal} A number given in radians.
	         *
	        function sin(n) { return new this( Math.sin(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is the square root of n.
	         *
	         * n {number|string|Decimal}
	         *
	         */
	        function sqrt(n) { return new this(n)['sqrt'](); }


	        /*
	         * Return a new Decimal whose value is the tangent of n.
	         *
	         * n {number|string|Decimal} A number given in radians.
	         *
	        function tan(n) { return new this( Math.tan(n) + '' ) }
	         */


	        /*
	         * Return a new Decimal whose value is n truncated to an integer.
	         *
	         * n {number|string|Decimal}
	         *
	        function trunc(n) { return new this(n)['trunc']() }
	         */


	        /*
	         * Create and return a Decimal constructor.
	         *
	         */
	        function decimalFactory(obj) {

	            /*
	             * The Decimal constructor and exported function.
	             * Create and return a new instance of a Decimal object.
	             *
	             * n {number|string|Decimal} A numeric value.
	             * [b] {number} The base of n. Integer, 2 to 64 inclusive.
	             *
	             */
	            function Decimal( n, b ) {
	                var x = this;

	                // Constructor called without new.
	                if ( !( x instanceof Decimal ) ) {
	                    ifExceptionsThrow( Decimal, 'Decimal called without new', n );

	                    return new Decimal( n, b );
	                }

	                // Retain a reference to this Decimal constructor, and shadow
	                // Decimal.prototype.constructor which points to Object.
	                x['constructor'] = Decimal;

	                // Duplicate.
	                if ( n instanceof Decimal ) {

	                    if ( b == null ) {
	                        id = 0;
	                        x['s'] = n['s'];
	                        x['e'] = n['e'];
	                        x['c'] = ( n = n['c'] ) ? n.slice() : n;

	                        return x;
	                    } else if ( b == 10 ) {

	                        return rnd( new Decimal(n), Decimal['precision'], Decimal['rounding'] );
	                    } else {
	                        n += '';
	                    }
	                }

	                return parseDecimal( Decimal, x, n, b );
	            }


	            /* ************************ CONSTRUCTOR DEFAULT PROPERTIES ************************** */

	            /*
	             These default values must be integers within the stated ranges (inclusive).
	             Most of these values can be changed during run-time using Decimal.config.
	             */

	            /*
	             The maximum number of significant digits of the result of a calculation or base
	             conversion.
	             E.g.  Decimal.config({ precision: 20 })
	             */
	            Decimal['precision'] = 20;                        // 1 to MAX_DIGITS

	            /*
	             The rounding mode used when rounding to precision.

	             ROUND_UP         0 Away from zero.
	             ROUND_DOWN       1 Towards zero.
	             ROUND_CEIL       2 Towards +Infinity.
	             ROUND_FLOOR      3 Towards -Infinity.
	             ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
	             ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
	             ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
	             ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
	             ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.

	             E.g.
	             Decimal.rounding = 4;
	             Decimal.rounding = Decimal.ROUND_HALF_UP;
	             */
	            Decimal['rounding'] = 4;                          // 0 to 8

	            /*
	             The modulo mode used when calculating the modulus: a mod n.
	             The quotient (q = a / n) is calculated according to the corresponding rounding mode.
	             The remainder (r) is calculated as: r = a - n * q.

	             UP         0 The remainder is positive if the dividend is negative, else is negative.
	             DOWN       1 The remainder has the same sign as the dividend.
	                          This modulo mode is commonly known as "truncated division" and matches
	                          as closely as possible, the behaviour of JS remainder operator (a % n).
	             FLOOR      3 The remainder has the same sign as the divisor (Python %).
	             HALF_EVEN  6 This modulo mode implements the IEEE 754 remainder function.
	             EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)).
	                          The remainder is always positive.

	             The above modes - truncated division, floored division, Euclidian division and IEEE 754
	             remainder - are commonly used for the modulus operation. Although any other of the
	             rounding modes can be used, they may not give useful results.
	             */
	            Decimal['modulo'] = 1;                            // 0 to 9

	            // The exponent value at and beneath which toString returns exponential notation.
	            // Number type: -7
	            Decimal['toExpNeg'] = -7;                         // 0 to -EXP_LIMIT

	            // The exponent value at and above which toString returns exponential notation.
	            // Number type: 21
	            Decimal['toExpPos'] = 21;                         // 0 to EXP_LIMIT

	            // The minimum exponent value, beneath which underflow to zero occurs.
	            // Number type: -324  (5e-324)
	            Decimal['minE'] = -EXP_LIMIT;                     // -1 to -EXP_LIMIT

	            // The maximum exponent value, above which overflow to Infinity occurs.
	            // Number type:  308  (1.7976931348623157e+308)
	            Decimal['maxE'] = EXP_LIMIT;                      // 1 to EXP_LIMIT

	            // Whether Decimal Errors are ever thrown.
	            Decimal['errors'] = true;                         // true/false

	            // Whether to use cryptographically-secure random number generation, if available.
	            Decimal['crypto'] = false;                        // true/false

	            // Format specification for the Decimal.prototype.toFormat method
	            Decimal.format = {
	                decimalSeparator: '.',
	                groupSeparator: ',',
	                groupSize: 3,
	                secondaryGroupSize: 0,
	                fractionGroupSeparator: '\xA0',              // non-breaking space
	                fractionGroupSize: 0
	            };


	            /* ********************** END OF CONSTRUCTOR DEFAULT PROPERTIES ********************* */


	            Decimal.prototype = P;

	            Decimal['ONE'] = new Decimal(1);

	            /*
	            // Pi to 80 s.d.
	            Decimal['PI'] = new Decimal(
	                '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089'
	            );
	             */

	            Decimal['ROUND_UP'] = 0;
	            Decimal['ROUND_DOWN'] = 1;
	            Decimal['ROUND_CEIL'] = 2;
	            Decimal['ROUND_FLOOR'] = 3;
	            Decimal['ROUND_HALF_UP'] = 4;
	            Decimal['ROUND_HALF_DOWN'] = 5;
	            Decimal['ROUND_HALF_EVEN'] = 6;
	            Decimal['ROUND_HALF_CEIL'] = 7;
	            Decimal['ROUND_HALF_FLOOR'] = 8;

	            // modulo mode
	            Decimal['EUCLID'] = 9;

	            //Decimal['abs'] = abs;
	            //Decimal['acos'] = acos;
	            //Decimal['asin'] = asin;
	            //Decimal['atan'] = atan;
	            //Decimal['atan2'] = atan2;
	            //Decimal['ceil'] = ceil;
	            //Decimal['cos'] = cos;
	            //Decimal['floor'] = floor;
	            //Decimal['round'] = round;
	            //Decimal['sin'] = sin;
	            //Decimal['tan'] = tan;
	            //Decimal['trunc'] = trunc;

	            Decimal['config'] = config;
	            Decimal['constructor'] = decimalFactory;
	            Decimal['exp'] = exp;
	            Decimal['ln'] = ln;
	            Decimal['log'] = log;
	            Decimal['max'] = max;
	            Decimal['min'] = min;
	            Decimal['pow'] = pow;
	            Decimal['sqrt'] = sqrt;
	            Decimal['random'] = random;

	            if ( obj != null ) {
	                Decimal['config'](obj);
	            }

	            return Decimal;
	        }

	        return decimalFactory();
	    })();


	    // Export.


	    // AMD.
	    if ( true ) {

	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return decimal;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	    // Node and other environments that support module.exports.
	    } else if ( typeof module != 'undefined' && module.exports ) {
	        module.exports = decimal;

	        if ( !crypto ) {

	            try {
	                crypto = require('crypto');
	            } catch (e) {}
	        }

	    // Browser.
	    } else {
	        noConflict = global['Decimal'];

	        decimal['noConflict'] = function () {
	            global['Decimal'] = noConflict;

	            return decimal;
	        };

	        global['Decimal'] = decimal;
	    }
	})(this);


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.array = __webpack_require__(153);
	exports['boolean'] = __webpack_require__(175);
	exports.number = __webpack_require__(4);
	exports.bignumber = __webpack_require__(152);
	exports.object = __webpack_require__(3);
	exports.string = __webpack_require__(176);
	exports.types = __webpack_require__(196);


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    object = __webpack_require__(3),
	    string = __webpack_require__(176),
	    collection = __webpack_require__(13),
	    util = __webpack_require__(160),

	    isArray = Array.isArray,
	    isNode = Node.isNode;

	/**
	 * @constructor ArrayNode
	 * @extends {Node}
	 * Holds an 1-dimensional array with nodes
	 * @param {Node[]} [nodes]   1 dimensional array with nodes
	 */
	function ArrayNode(nodes) {
	  if (!(this instanceof ArrayNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  this.nodes = nodes || [];

	  // validate input
	  if (!isArray(this.nodes) || !this.nodes.every(isNode)) {
	    throw new TypeError('Array containing Nodes expected')
	  }
	}

	ArrayNode.prototype = new Node();

	ArrayNode.prototype.type = 'ArrayNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @private
	 */
	ArrayNode.prototype._compile = function (defs) {
	  var asMatrix = (defs.math.config().matrix !== 'array');

	  var nodes = this.nodes.map(function (node) {
	    return node._compile(defs);
	  });

	  return (asMatrix ? 'math.matrix([' : '[') +
	      nodes.join(',') +
	      (asMatrix ? '])' : ']');
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	ArrayNode.prototype.forEach = function (callback) {
	  for (var i = 0; i < this.nodes.length; i++) {
	    var node = this.nodes[i];
	    callback(node, 'nodes[' + i + ']', this);
	  }
	};

	/**
	 * Create a new ArrayNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {ArrayNode} Returns a transformed copy of the node
	 */
	ArrayNode.prototype.map = function (callback) {
	  var nodes = [];
	  for (var i = 0; i < this.nodes.length; i++) {
	    nodes[i] = this._ifNode(callback(this.nodes[i], 'nodes[' + i + ']', this));
	  }
	  return new ArrayNode(nodes);
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {ArrayNode}
	 */
	ArrayNode.prototype.clone = function() {
	  return new ArrayNode(this.nodes.slice(0))
	};

	/**
	 * Get string representation
	 * @return {String} str
	 * @override
	 */
	ArrayNode.prototype.toString = function() {
	  return string.format(this.nodes);
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	ArrayNode.prototype.toTex = function(type) {
	  type = type || 'bmatrix';
	  var s = '\\begin{' + type + '}';

	  this.nodes.forEach(function(node) {
	    if (node.nodes) {
	      s += node.nodes.map(function(childNode) {
	        return childNode.toTex();
	      }).join('&');
	    }
	    else {
	      s += node.toTex();
	    }

	    // new line
	    s += '\\\\';
	  });
	  s += '\\end{' + type + '}';
	  return s;
	};

	module.exports = ArrayNode;


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    ArrayNode = __webpack_require__(161),

	    keywords = __webpack_require__(314),

	    latex = __webpack_require__(315),
	    isString = __webpack_require__(176).isString;

	/**
	 * @constructor AssignmentNode
	 * @extends {Node}
	 * Define a symbol, like "a = 3.2"
	 *
	 * @param {String} name       Symbol name
	 * @param {Node} expr         The expression defining the symbol
	 */
	function AssignmentNode(name, expr) {
	  if (!(this instanceof AssignmentNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input
	  if (!isString(name))          throw new TypeError('String expected for parameter "name"');
	  if (!(expr instanceof Node))  throw new TypeError('Node expected for parameter "expr"');
	  if (name in keywords)         throw new Error('Illegal symbol name, "'  + name +  '" is a reserved keyword');

	  this.name = name;
	  this.expr = expr;
	}

	AssignmentNode.prototype = new Node();

	AssignmentNode.prototype.type = 'AssignmentNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @private
	 */
	AssignmentNode.prototype._compile = function (defs) {
	  return 'scope["' + this.name + '"] = ' + this.expr._compile(defs) + '';
	};


	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	AssignmentNode.prototype.forEach = function (callback) {
	  callback(this.expr, 'expr', this);
	};

	/**
	 * Create a new AssignmentNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {AssignmentNode} Returns a transformed copy of the node
	 */
	AssignmentNode.prototype.map = function (callback) {
	  return new AssignmentNode(this.name, this._ifNode(callback(this.expr, 'expr', this)));
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {AssignmentNode}
	 */
	AssignmentNode.prototype.clone = function() {
	  return new AssignmentNode(this.name, this.expr);
	};

	/**
	 * Get string representation
	 * @return {String}
	 */
	AssignmentNode.prototype.toString = function() {
	  return this.name + ' = ' + this.expr.toString();
	};

	/**
	 * Get LaTeX representation
	 * @return {String}
	 */
	AssignmentNode.prototype.toTex = function() {
	  var brace;
	  if (this.expr instanceof ArrayNode) {
	    brace = ['\\mathbf{', '}'];
	  }
	  return latex.addBraces(latex.toSymbol(this.name), brace) + '=' +
	      latex.addBraces(this.expr.toTex());
	};

	module.exports = AssignmentNode;

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);
	var ResultSet = __webpack_require__(12);
	var isBoolean = __webpack_require__(175).isBoolean;

	/**
	 * @constructor BlockNode
	 * @extends {Node}
	 * Holds a set with blocks
	 * @param {Array.<{node: Node} | {node: Node, visible: boolean}>} blocks
	 *            An array with blocks, where a block is constructed as an Object
	 *            with properties block, which is a Node, and visible, which is
	 *            a boolean. The property visible is optional and is true by default
	 */
	function BlockNode(blocks) {
	  if (!(this instanceof BlockNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input, copy blocks
	  if (!Array.isArray(blocks)) throw new Error('Array expected');
	  this.blocks = blocks.map(function (block) {
	    var node    = block && block.node;
	    var visible = block && block.visible !== undefined ? block.visible : true;

	    if (!(node instanceof Node))  throw new TypeError('Property "node" must be a Node');
	    if (!isBoolean(visible))      throw new TypeError('Property "visible" must be a boolean');

	    return {
	      node: node,
	      visible: visible
	    }
	  });
	}

	BlockNode.prototype = new Node();

	BlockNode.prototype.type = 'BlockNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	BlockNode.prototype._compile = function (defs) {
	  defs.ResultSet = ResultSet;
	  var blocks = this.blocks.map(function (param) {
	    var js = param.node._compile(defs);
	    if (param.visible) {
	      return 'results.push(' + js + ');';
	    }
	    else {
	      return js + ';';
	    }
	  });

	  return '(function () {' +
	      'var results = [];' +
	      blocks.join('') +
	      'return new ResultSet(results);' +
	      '})()';
	};

	/**
	 * Execute a callback for each of the child blocks of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	BlockNode.prototype.forEach = function (callback) {
	  for (var i = 0; i < this.blocks.length; i++) {
	    callback(this.blocks[i].node, 'blocks[' + i + '].node', this);
	  }
	};

	/**
	 * Create a new BlockNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {BlockNode} Returns a transformed copy of the node
	 */
	BlockNode.prototype.map = function (callback) {
	  var blocks = [];
	  for (var i = 0; i < this.blocks.length; i++) {
	    var block = this.blocks[i];
	    var node = this._ifNode(callback(block.node, 'blocks[' + i + '].node', this));
	    blocks[i] = {
	      node: node,
	      visible: block.visible
	    };
	  }
	  return new BlockNode(blocks);
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {BlockNode}
	 */
	BlockNode.prototype.clone = function() {
	  var blocks = this.blocks.map(function(block) {
	    return {
	      node: block.node,
	      visible: block.visible
	    };
	  });

	  return new BlockNode(blocks);
	};

	/**
	 * Get string representation
	 * @return {String} str
	 * @override
	 */
	BlockNode.prototype.toString = function() {
	  return this.blocks.map(function (param) {
	    return param.node.toString() + (param.visible ? '' : ';');
	  }).join('\n');
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	BlockNode.prototype.toTex = function() {
	  return this.blocks.map(function (param) {
	    return param.node.toTex() + (param.visible ? '' : ';');
	  }).join('\n');
	};

	module.exports = BlockNode;


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);
	var latex = __webpack_require__(315);
	var BigNumber = __webpack_require__(159);
	var Complex = __webpack_require__(6);
	var Unit = __webpack_require__(10);
	var util = __webpack_require__(160);
	var isString = util.string.isString;
	var isNumber = util.number.isNumber;
	var isBoolean = util['boolean'].isBoolean;

	/**
	 * A lazy evaluating conditional operator: 'condition ? trueExpr : falseExpr'
	 *
	 * @param {Node} condition   Condition, must result in a boolean
	 * @param {Node} trueExpr    Expression evaluated when condition is true
	 * @param {Node} falseExpr   Expression evaluated when condition is true
	 *
	 * @constructor ConditionalNode
	 * @extends {Node}
	 */
	function ConditionalNode (condition, trueExpr, falseExpr) {
	  if (!(this instanceof ConditionalNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }
	  if (!(condition instanceof Node)) throw new TypeError('Parameter condition must be a Node');
	  if (!(trueExpr instanceof Node))  throw new TypeError('Parameter trueExpr must be a Node');
	  if (!(falseExpr instanceof Node)) throw new TypeError('Parameter falseExpr must be a Node');

	  this.condition = condition;
	  this.trueExpr = trueExpr;
	  this.falseExpr = falseExpr;
	}

	ConditionalNode.prototype = new Node();

	ConditionalNode.prototype.type = 'ConditionalNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	ConditionalNode.prototype._compile = function(defs) {
	  /**
	   * Test whether a condition is met
	   * @param {*} condition
	   * @returns {boolean} true if condition is true or non-zero, else false
	   */
	  defs.testCondition = function (condition) {
	    if (isNumber(condition) || isBoolean(condition) || isString(condition)) {
	      return condition ? true : false;
	    }

	    if (condition instanceof BigNumber) {
	      return condition.isZero() ? false : true;
	    }

	    if (condition instanceof Complex) {
	      return (condition.re || condition.im) ? true : false;
	    }

	    if (condition instanceof Unit) {
	      return condition.value ? true : false;
	    }

	    if (condition === null || condition === undefined) {
	      return false;
	    }

	    throw new TypeError('Unsupported type of condition "' + defs.math['typeof'](condition) + '"');
	  };

	  return (
	      'testCondition(' + this.condition._compile(defs) + ') ? ' +
	      '( ' + this.trueExpr._compile(defs) + ') : ' +
	      '( ' + this.falseExpr._compile(defs) + ')'
	      );
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	ConditionalNode.prototype.forEach = function (callback) {
	  callback(this.condition, 'condition', this);
	  callback(this.trueExpr, 'trueExpr', this);
	  callback(this.falseExpr, 'falseExpr', this);
	};

	/**
	 * Create a new ConditionalNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {ConditionalNode} Returns a transformed copy of the node
	 */
	ConditionalNode.prototype.map = function (callback) {
	  return new ConditionalNode(
	      this._ifNode(callback(this.condition, 'condition', this)),
	      this._ifNode(callback(this.trueExpr, 'trueExpr', this)),
	      this._ifNode(callback(this.falseExpr, 'falseExpr', this))
	  );
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {ConditionalNode}
	 */
	ConditionalNode.prototype.clone = function() {
	  return new ConditionalNode(this.condition, this.trueExpr, this.falseExpr);
	};

	/**
	 * Get string representation
	 * @return {String} str
	 */
	ConditionalNode.prototype.toString = function() {
	  // TODO: not nice adding parenthesis al the time
	  return '(' + this.condition.toString() + ') ? (' +
	      this.trueExpr.toString() + ') : (' +
	      this.falseExpr.toString() + ')';
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	ConditionalNode.prototype.toTex = function() {
	  var s = (
	      latex.addBraces(this.trueExpr.toTex()) +
	      ', &\\quad' +
	      latex.addBraces('\\text{if}\\;' + this.condition.toTex())
	      ) + '\\\\' + (
	      latex.addBraces(this.falseExpr.toTex()) +
	      ', &\\quad' +
	      latex.addBraces('\\text{otherwise}')
	      );

	  return latex.addBraces(s, [
	    '\\left\\{\\begin{array}{l l}',
	    '\\end{array}\\right.'
	  ]);
	};

	module.exports = ConditionalNode;


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    BigNumber = __webpack_require__(159),
	    type = __webpack_require__(196).type,
	    isString = __webpack_require__(176).isString;

	/**
	 * A ConstantNode holds a constant value like a number or string. A ConstantNode
	 * stores a stringified version of the value and uses this to compile to
	 * JavaScript.
	 *
	 * In case of a stringified number as input, this may be compiled to a BigNumber
	 * when the math instance is configured for BigNumbers.
	 *
	 * Usage:
	 *
	 *     // stringified values with type
	 *     new ConstantNode('2.3', 'number');
	 *     new ConstantNode('true', 'boolean');
	 *     new ConstantNode('hello', 'string');
	 *
	 *     // non-stringified values, type will be automatically detected
	 *     new ConstantNode(2.3);
	 *     new ConstantNode('hello');
	 *
	 * @param {String | Number | Boolean | null | undefined} value
	 *                            When valueType is provided, value must contain
	 *                            an uninterpreted string representing the value.
	 *                            When valueType is undefined, value can be a
	 *                            number, string, boolean, null, or undefined, and
	 *                            the type will be determined automatically.
	 * @param {String} [valueType]  The type of value. Choose from 'number', 'string',
	 *                              'boolean', 'undefined', 'null'
	 * @constructor ConstantNode
	 * @extends {Node}
	 */
	function ConstantNode(value, valueType) {
	  if (!(this instanceof ConstantNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  if (valueType) {
	    if (!isString(valueType)) {
	      throw new TypeError('String expected for parameter "valueType"');
	    }
	    if (!isString(value)){
	      throw new TypeError('String expected for parameter "value"');
	    }

	    this.value = value;
	    this.valueType = valueType;
	  }
	  else {
	    // stringify the value and determine the type
	    this.value = value + '';
	    this.valueType = type(value);
	  }

	  if (!SUPPORTED_TYPES[this.valueType]) {
	    throw new TypeError('Unsupported type of value "' + this.valueType + '"');
	  }
	}

	var SUPPORTED_TYPES = {
	  'number': true,
	  'string': true,
	  'boolean': true,
	  'undefined': true,
	  'null': true
	};

	ConstantNode.prototype = new Node();

	ConstantNode.prototype.type = 'ConstantNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	ConstantNode.prototype._compile = function (defs) {
	  switch (this.valueType) {
	    case 'number':
	      if (defs.math.config().number === 'bignumber') {
	        return 'math.bignumber("' + this.value + '")';
	      }
	      else {
	        // remove leading zeros like '003.2' which are not allowed by JavaScript
	        return this.value.replace(/^(0*)[0-9]/, function (match, zeros) {
	          return match.substring(zeros.length);
	        });
	      }

	    case 'string':
	      return '"' + this.value + '"';

	    case 'boolean':
	      return this.value;

	    case 'undefined':
	      return this.value;

	    case 'null':
	      return this.value;

	    default:
	        // TODO: move this error to the constructor?
	      throw new TypeError('Unsupported type of constant "' + this.valueType + '"');
	  }
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	ConstantNode.prototype.forEach = function (callback) {
	  // nothing to do, we don't have childs
	};


	/**
	 * Create a new ConstantNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node) : Node} callback
	 * @returns {ConstantNode} Returns a clone of the node
	 */
	ConstantNode.prototype.map = function (callback) {
	  return this.clone();
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {ConstantNode}
	 */
	ConstantNode.prototype.clone = function() {
	  return new ConstantNode(this.value, this.valueType);
	};

	/**
	 * Get string representation
	 * @return {String} str
	 */
	ConstantNode.prototype.toString = function() {
	  switch (this.valueType) {
	    case 'string':
	      return '"' + this.value + '"';

	    default:
	      return this.value;
	  }
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	ConstantNode.prototype.toTex = function() {
	  var value = this.value,
	      index;
	  switch (this.valueType) {
	    case 'string':
	      return '\\text{' + value + '}';

	    case 'number':
	      index = value.toLowerCase().indexOf('e');
	      if (index !== -1) {
	        return value.substring(0, index) + ' \\cdot 10^{' +
	            value.substring(index + 1) + '}';
	      }
	      return value;

	    default:
	      return value;
	  }
	};

	module.exports = ConstantNode;


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);
	var keywords = __webpack_require__(314);
	var latex = __webpack_require__(315);
	var isString = __webpack_require__(176).isString;
	var isArray = Array.isArray;

	/**
	 * @constructor FunctionAssignmentNode
	 * @extends {Node}
	 * Function assignment
	 *
	 * @param {String} name           Function name
	 * @param {String[]} params         Function parameter names
	 * @param {Node} expr             The function expression
	 */
	function FunctionAssignmentNode(name, params, expr) {
	  if (!(this instanceof FunctionAssignmentNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input
	  if (!isString(name)) throw new TypeError('String expected for parameter "name"');
	  if (!isArray(params) || !params.every(isString))  throw new TypeError('Array containing strings expected for parameter "params"');
	  if (!(expr instanceof Node)) throw new TypeError('Node expected for parameter "expr"');
	  if (name in keywords) throw new Error('Illegal function name, "'  + name +  '" is a reserved keyword');

	  this.name = name;
	  this.params = params;
	  this.expr = expr;
	}

	FunctionAssignmentNode.prototype = new Node();

	FunctionAssignmentNode.prototype.type = 'FunctionAssignmentNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	FunctionAssignmentNode.prototype._compile = function (defs) {
	  return 'scope["' + this.name + '"] = ' +
	      '  (function (scope) {' +
	      '    scope = Object.create(scope); ' +
	      '    var fn = function ' + this.name + '(' + this.params.join(',') + ') {' +
	      '      if (arguments.length != ' + this.params.length + ') {' +
	      // TODO: use util.error.ArgumentsError here
	      // TODO: test arguments error
	      '        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.params.length + ' expected)");' +
	      '      }' +
	      this.params.map(function (variable, index) {
	        return 'scope["' + variable + '"] = arguments[' + index + '];';
	      }).join('') +
	      '      return ' + this.expr._compile(defs) + '' +
	      '    };' +
	      '    fn.syntax = "' + this.name + '(' + this.params.join(', ') + ')";' +
	      '    return fn;' +
	      '  })(scope);';
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	FunctionAssignmentNode.prototype.forEach = function (callback) {
	  callback(this.expr, 'expr', this);
	};

	/**
	 * Create a new FunctionAssignmentNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {FunctionAssignmentNode} Returns a transformed copy of the node
	 */
	FunctionAssignmentNode.prototype.map = function (callback) {
	  var expr = this._ifNode(callback(this.expr, 'expr', this));

	  return new FunctionAssignmentNode(this.name, this.params.slice(0), expr);
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {FunctionAssignmentNode}
	 */
	FunctionAssignmentNode.prototype.clone = function() {
	  return new FunctionAssignmentNode(this.name, this.params.slice(0), this.expr);
	};

	/**
	 * get string representation
	 * @return {String} str
	 */
	FunctionAssignmentNode.prototype.toString = function() {
	  return 'function ' + this.name +
	      '(' + this.params.join(', ') + ') = ' +
	      this.expr.toString();
	};

	/**
	 * get LaTeX representation
	 * @return {String} str
	 */
	FunctionAssignmentNode.prototype.toTex = function() {
	  return this.name +
	      latex.addBraces(this.params.map(latex.toSymbol).join(', '), true) + '=' +
	      latex.addBraces(this.expr.toTex());
	};

	module.exports = FunctionAssignmentNode;


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);
	var RangeNode = __webpack_require__(170);
	var SymbolNode = __webpack_require__(171);

	var BigNumber = __webpack_require__(159);
	var Range = __webpack_require__(7);

	var isNode = Node.isNode;
	var isArray = Array.isArray;

	/**
	 * @constructor IndexNode
	 * @extends Node
	 *
	 * get a subset of a matrix
	 *
	 * @param {Node} object
	 * @param {Node[]} ranges
	 */
	function IndexNode (object, ranges) {
	  if (!(this instanceof IndexNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input
	  if (!(object instanceof Node)) throw new TypeError('Node expected for parameter "object"');
	  if (!isArray(ranges) || !ranges.every(isNode)) {
	    throw new TypeError('Array containing Nodes expected for parameter "ranges"');
	  }

	  this.object = object;
	  this.ranges = ranges;
	}

	IndexNode.prototype = new Node();

	IndexNode.prototype.type = 'IndexNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	IndexNode.prototype._compile = function (defs) {
	  return this.compileSubset(defs);
	};

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs           Object which can be used to define functions
	 *                                or constants globally available for the
	 *                                compiled expression
	 * @param {String} [replacement]  If provided, the function returns
	 *                                  "math.subset(obj, math.index(...), replacement)"
	 *                                Else, the function returns
	 *                                  "math.subset(obj, math.index(...))"
	 * @return {String} js
	 * @returns {string}
	 */
	IndexNode.prototype.compileSubset = function(defs, replacement) {
	  // check whether any of the ranges expressions uses the context symbol 'end'
	  function test(node) {
	    return (node instanceof SymbolNode) && (node.name == 'end');
	  }

	  var someUseEnd = false;
	  var rangesUseEnd = this.ranges.map(function (range) {
	    var useEnd = range.filter(test).length > 0;
	    someUseEnd = useEnd ? useEnd : someUseEnd;
	    return useEnd;
	  });

	  // create a Range from start, step and end
	  defs.range = function (start, end, step) {
	    return new Range(
	            start instanceof BigNumber ? start.toNumber() : start,
	            end instanceof BigNumber ? end.toNumber() : end,
	            step instanceof BigNumber ? step.toNumber() : step
	    );
	  };

	  // TODO: implement support for bignumber (currently bignumbers are silently
	  //       reduced to numbers when changing the value to zero-based)

	  // TODO: Optimization: when the range values are ConstantNodes,
	  //       we can beforehand resolve the zero-based value

	  var ranges = this.ranges.map(function(range, i) {
	    var useEnd = rangesUseEnd[i];
	    if (range instanceof RangeNode) {
	      if (useEnd) {
	        // resolve end and create range
	        return '(function (scope) {' +
	            '  scope = Object.create(scope); ' +
	            '  scope["end"] = size[' + i + '];' +
	            '  return range(' +
	            '    ' + range.start._compile(defs) + ', ' +
	            '    ' + range.end._compile(defs) + ', ' +
	            '    ' + (range.step ? range.step._compile(defs) : '1') +
	            '  );' +
	            '})(scope)';
	      }
	      else {
	        // create range
	        return 'range(' +
	            range.start._compile(defs) + ', ' +
	            range.end._compile(defs) + ', ' +
	            (range.step ? range.step._compile(defs) : '1') +
	            ')';
	      }
	    }
	    else {
	      if (useEnd) {
	        // resolve the parameter 'end'
	        return '(function (scope) {' +
	            '  scope = Object.create(scope); ' +
	            '  scope["end"] = size[' + i + '];' +
	            '  return ' + range._compile(defs) + ';' +
	            '})(scope)'
	      }
	      else {
	        // just evaluate the expression
	        return range._compile(defs);
	      }
	    }
	  });

	  // if some parameters use the 'end' parameter, we need to calculate the size
	  if (someUseEnd) {
	    return '(function () {' +
	        '  var obj = ' + this.object._compile(defs) + ';' +
	        '  var size = math.size(obj).valueOf();' +
	        '  return math.subset(' +
	        '    obj, ' +
	        '    math.index(' + ranges.join(', ') + ')' +
	        '    ' + (replacement ? (', ' + replacement) : '') +
	        '  );' +
	        '})()';
	  }
	  else {
	    return 'math.subset(' +
	        this.object._compile(defs) + ',' +
	        'math.index(' + ranges.join(', ') + ')' +
	        (replacement ? (', ' + replacement) : '') +
	        ')';
	  }
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	IndexNode.prototype.forEach = function (callback) {
	  // object
	  callback(this.object, 'object', this);

	  // ranges
	  for (var i = 0; i < this.ranges.length; i++) {
	    callback(this.ranges[i], 'ranges[' + i + ']', this);
	  }
	};

	/**
	 * Create a new IndexNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {IndexNode} Returns a transformed copy of the node
	 */
	IndexNode.prototype.map = function (callback) {
	  var object = this._ifNode(callback(this.object, 'object', this));

	  var ranges = [];
	  for (var i = 0; i < this.ranges.length; i++) {
	    ranges[i] = this._ifNode(callback(this.ranges[i], 'ranges[' + i + ']', this));
	  }

	  return new IndexNode(object, ranges);
	};

	/**
	 * Get the name of the object linked to this IndexNode
	 * @return {string} name
	 */
	IndexNode.prototype.objectName = function() {
	  return this.object.name;
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {IndexNode}
	 */
	IndexNode.prototype.clone = function() {
	  return new IndexNode(this.object, this.ranges.slice(0));
	};

	/**
	 * Get string representation
	 * @return {String} str
	 */
	IndexNode.prototype.toString = function() {
	  // format the parameters like "[1, 0:5]"
	  return this.object.toString() + '[' + this.ranges.join(', ') + ']';
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	IndexNode.prototype.toTex = function() {
	  return this.object.toTex() + '[' + this.ranges.join(', ') + ']';
	};

	module.exports = IndexNode;

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    ConstantNode = __webpack_require__(165),
	    SymbolNode = __webpack_require__(171),
	    FunctionNode = __webpack_require__(169),
	    latex = __webpack_require__(315);

	/**
	 * @constructor OperatorNode
	 * @extends {Node}
	 * An operator with two arguments, like 2+3
	 *
	 * @param {String} op       Operator name, for example '+'
	 * @param {String} fn       Function name, for example 'add'
	 * @param {Node[]} args     Operator arguments
	 */
	function OperatorNode (op, fn, args) {
	  if (!(this instanceof OperatorNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // TODO: validate input
	  this.op = op;
	  this.fn = fn;
	  this.args = args || [];
	}

	OperatorNode.prototype = new Node();

	OperatorNode.prototype.type = 'OperatorNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	OperatorNode.prototype._compile = function (defs) {
	  if (!(this.fn in defs.math)) {
	    throw new Error('Function ' + this.fn + ' missing in provided namespace "math"');
	  }

	  var args = this.args.map(function (arg) {
	    return arg._compile(defs);
	  });
	  return 'math.' + this.fn + '(' + args.join(', ') + ')';
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	OperatorNode.prototype.forEach = function (callback) {
	  for (var i = 0; i < this.args.length; i++) {
	    callback(this.args[i], 'args[' + i + ']', this);
	  }
	};

	/**
	 * Create a new OperatorNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {OperatorNode} Returns a transformed copy of the node
	 */
	OperatorNode.prototype.map = function (callback) {
	  var args = [];
	  for (var i = 0; i < this.args.length; i++) {
	    args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
	  }
	  return new OperatorNode(this.op, this.fn, args);
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {OperatorNode}
	 */
	OperatorNode.prototype.clone = function() {
	  return new OperatorNode(this.op, this.fn, this.args.slice(0));
	};

	/**
	 * Get string representation
	 * @return {String} str
	 */
	OperatorNode.prototype.toString = function() {
	  var args = this.args;

	  switch (args.length) {
	    case 1:
	      if (this.op == '-') {
	        // special case: unary minus
	        return '-' + args[0].toString();
	      }
	      else {
	        // for example '5!'
	        return args[0].toString() + this.op;
	      }

	    case 2: // for example '2+3'
	      var lhs = args[0].toString();
	      if (args[0] instanceof OperatorNode) {
	        lhs = '(' + lhs + ')';
	      }
	      var rhs = args[1].toString();
	      if (args[1] instanceof OperatorNode) {
	        rhs = '(' + rhs + ')';
	      }
	      return lhs + ' ' + this.op + ' ' + rhs;

	    default: // this should not occur. format as a function call
	      return this.op + '(' + this.args.join(', ') + ')';
	  }
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	OperatorNode.prototype.toTex = function() {
	  var args = this.args,
	      mop = latex.toOperator(this.op),
	      lp = args[0],
	      rp = args[1];

	  switch (args.length) {
	    case 1:
	      if (this.op === '-' || this.op === '+') {
	        // special case: unary minus
	        return this.op + lp.toTex();
	      }
	      // for example '5!'
	      return lp.toTex() + this.op;

	    case 2: // for example '2+3'
	      var lhs = lp.toTex(),
	          lhb = false,
	          rhs = rp.toTex(),
	          rhb = false,
	          lop = '',
	          rop = '';

	      switch (this.op) {
	        case '/':
	          lop = mop;
	          mop = '';

	          break;

	        case '*':
	          if (lp instanceof OperatorNode) {
	            if (lp.op === '+' || lp.op === '-') {
	              lhb = true;
	            }
	          }

	          if (rp instanceof OperatorNode) {
	            if (rp.op === '+' || rp.op === '-') {
	              rhb = true;
	            }
	            else if (rp.op === '*') {
	              rhb = true;
	            }
	          }

	          if ((lp instanceof ConstantNode || lp instanceof OperatorNode) &&
	              (rp instanceof ConstantNode || rp instanceof OperatorNode)) {
	            mop = ' \\cdot ';
	          }
	          else {
	            mop = ' \\, ';
	          }

	          break;

	        case '^':
	          if (lp instanceof OperatorNode || lp instanceof FunctionNode) {
	            lhb = true;
	          }
	          else if (lp instanceof SymbolNode) {
	            lhb = null;
	          }

	          break;

	        case 'to':
	          rhs = latex.toUnit(rhs, true);
	          break;
	      }

	      lhs = latex.addBraces(lhs, lhb);
	      rhs = latex.addBraces(rhs, rhb);

	      return lop + lhs + mop + rhs + rop;

	    default: // this should not occur. format as a function call
	      return mop + '(' + this.args.map(latex.toSymbol).join(', ') + ')';
	  }
	};

	module.exports = OperatorNode;


/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);
	var SymbolNode = __webpack_require__(171);

	var latex = __webpack_require__(315);
	var isNode = Node.isNode;
	var isArray = Array.isArray;

	/**
	 * @constructor FunctionNode
	 * @extends {Node}
	 * invoke a list with arguments on a node
	 * @param {string} name
	 * @param {Node[]} args
	 */
	function FunctionNode (name, args) {
	  if (!(this instanceof FunctionNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input
	  if (typeof name !== 'string') throw new TypeError('string expected for parameter "name"');
	  if (!isArray(args) || !args.every(isNode)) {
	    throw new TypeError('Array containing Nodes expected for parameter "args"');
	  }

	  this.name = name;
	  this.args = args || [];
	}

	FunctionNode.prototype = new Node();

	FunctionNode.prototype.type = 'FunctionNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	FunctionNode.prototype._compile = function (defs) {
	  var fn = defs.math[this.name];
	  var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

	  // compile the parameters
	  var args = this.args.map(function (arg) {
	    return arg._compile(defs);
	  });

	  if (isRaw) {
	    // pass unevaluated parameters (nodes) to the function
	    var paramsName;
	    do {
	      paramsName = 'p' + Math.round(Math.random() * 10000);
	    }
	    while (paramsName in defs);
	    defs[paramsName] = this.args;

	    return '("' + this.name + '" in scope ? ' +
	        'scope["' + this.name + '"](' + args.join(', ') + ') : ' +
	        'math["' + this.name + '"]' + '(' + paramsName + ', math, scope))';
	  }
	  else {
	    // "regular" evaluation
	    var symbol = new SymbolNode(this.name);
	    return symbol._compile(defs) + '(' + args.join(', ') + ')';
	  }
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	FunctionNode.prototype.forEach = function (callback) {
	  for (var i = 0; i < this.args.length; i++) {
	    callback(this.args[i], 'args[' + i + ']', this);
	  }
	};

	/**
	 * Create a new FunctionNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {FunctionNode} Returns a transformed copy of the node
	 */
	FunctionNode.prototype.map = function (callback) {
	  var args = [];
	  for (var i = 0; i < this.args.length; i++) {
	    args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
	  }
	  return new FunctionNode(this.name, args);
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {FunctionNode}
	 */
	FunctionNode.prototype.clone = function() {
	  return new FunctionNode(this.name, this.args.slice(0));
	};

	/**
	 * Get string representation
	 * @return {String} str
	 */
	FunctionNode.prototype.toString = function() {
	  // format the parameters like "add(2, 4.2)"
	  return this.name + '(' + this.args.join(', ') + ')';
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	FunctionNode.prototype.toTex = function() {
	  return latex.toArgs(this);
	};

	module.exports = FunctionNode;


/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173);

	var isNode = Node.isNode;

	/**
	 * @constructor RangeNode
	 * @extends {Node}
	 * create a range
	 * @param {Node} start  included lower-bound
	 * @param {Node} end    included lower-bound
	 * @param {Node} [step] optional step
	 */
	function RangeNode (start, end, step) {
	  if (!(this instanceof RangeNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate inputs
	  if (!isNode(start)) throw new TypeError('Node expected');
	  if (!isNode(end)) throw new TypeError('Node expected');
	  if (step && !isNode(step)) throw new TypeError('Node expected');
	  if (arguments.length > 3) throw new Error('Too many arguments');

	  this.start = start;         // included lower-bound
	  this.end   = end;           // included upper-bound
	  this.step  = step || null;  // optional step
	}

	RangeNode.prototype = new Node();

	RangeNode.prototype.type = 'RangeNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	RangeNode.prototype._compile = function (defs) {
	  return 'math.range(' +
	      this.start._compile(defs) + ', ' +
	      this.end._compile(defs) +
	      (this.step ? (', ' + this.step._compile(defs)) : '') +
	      ')';
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	RangeNode.prototype.forEach = function (callback) {
	  callback(this.start, 'start', this);
	  callback(this.end, 'end', this);
	  if (this.step) {
	    callback(this.step, 'step', this);
	  }
	};

	/**
	 * Create a new RangeNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {RangeNode} Returns a transformed copy of the node
	 */
	RangeNode.prototype.map = function (callback) {
	  return new RangeNode(
	      this._ifNode(callback(this.start, 'start', this)),
	      this._ifNode(callback(this.end, 'end', this)),
	      this.step && this._ifNode(callback(this.step, 'step', this))
	  );
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {RangeNode}
	 */
	RangeNode.prototype.clone = function() {
	  return new RangeNode(this.start, this.end, this.step && this.step);
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

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 */
	RangeNode.prototype.toTex = function() {
	  var str = this.start.toTex();
	  if (this.step) {
	    str += ':' + this.step.toTex();
	  }
	  str += ':' + this.end.toTex();

	  return str;
	};

	module.exports = RangeNode;


/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    Unit = __webpack_require__(10),

	    latex = __webpack_require__(315),
	    isString = __webpack_require__(176).isString;

	/**
	 * @constructor SymbolNode
	 * @extends {Node}
	 * A symbol node can hold and resolve a symbol
	 * @param {String} name
	 * @extends {Node}
	 */
	function SymbolNode(name) {
	  if (!(this instanceof SymbolNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  // validate input
	  if (!isString(name))  throw new TypeError('String expected for parameter "name"');

	  this.name = name;
	}

	SymbolNode.prototype = new Node();

	SymbolNode.prototype.type = 'SymbolNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	SymbolNode.prototype._compile = function (defs) {
	  // add a function to the definitions
	  defs['undef'] = undef;
	  defs['Unit'] = Unit;

	  if (this.name in defs.math) {
	    return '("' + this.name + '" in scope ? scope["' + this.name + '"] : math["' + this.name + '"])';
	  }
	  else {
	    return '(' +
	        '"' + this.name + '" in scope ? scope["' + this.name + '"] : ' +
	        (Unit.isValuelessUnit(this.name) ?
	            'new Unit(null, "' + this.name + '")' :
	            'undef("' + this.name + '")') +
	        ')';
	  }
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	SymbolNode.prototype.forEach = function (callback) {
	  // nothing to do, we don't have childs
	};

	/**
	 * Create a new SymbolNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node) : Node} callback
	 * @returns {SymbolNode} Returns a clone of the node
	 */
	SymbolNode.prototype.map = function (callback) {
	  return this.clone();
	};

	/**
	 * Throws an error 'Undefined symbol {name}'
	 * @param {String} name
	 */
	function undef (name) {
	  throw new Error('Undefined symbol ' + name);
	}

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {SymbolNode}
	 */
	SymbolNode.prototype.clone = function() {
	  return new SymbolNode(this.name);
	};

	/**
	 * Get string representation
	 * @return {String} str
	 * @override
	 */
	SymbolNode.prototype.toString = function() {
	  return this.name;
	};

	/**
	 * Get LaTeX representation
	 * @return {String} str
	 * @override
	 */
	SymbolNode.prototype.toTex = function() {
	  return latex.toSymbol(this.name);
	};

	module.exports = SymbolNode;


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Node = __webpack_require__(173),
	    IndexNode = __webpack_require__(167);

	/**
	 * @constructor UpdateNode
	 * @extends {Node}
	 * Update a matrix subset, like A[2,3] = 4.5
	 *
	 * @param {IndexNode} index             IndexNode containing symbol and ranges
	 * @param {Node} expr                   The expression defining the symbol
	 */
	function UpdateNode(index, expr) {
	  if (!(this instanceof UpdateNode)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }

	  if (!(index instanceof IndexNode)) {
	    throw new TypeError('Expected IndexNode for parameter "index"');
	  }
	  if (!(expr instanceof Node)) {
	    throw new TypeError('Expected Node for parameter "expr"');
	  }

	  this.index = index;
	  this.expr = expr;
	}

	UpdateNode.prototype = new Node();

	UpdateNode.prototype.type = 'UpdateNode';

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          or constants globally available for the compiled
	 *                          expression
	 * @return {String} js
	 * @private
	 */
	UpdateNode.prototype._compile = function (defs) {
	  return 'scope["' + this.index.objectName() + '\"] = ' +
	      this.index.compileSubset(defs,  this.expr._compile(defs));
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	UpdateNode.prototype.forEach = function (callback) {
	  callback(this.index, 'index', this);
	  callback(this.expr, 'expr', this);
	};

	/**
	 * Create a new UpdateNode having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {UpdateNode} Returns a transformed copy of the node
	 */
	UpdateNode.prototype.map = function (callback) {
	  return new UpdateNode(
	      this._ifNode(callback(this.index, 'index', this)),
	      this._ifNode(callback(this.expr, 'expr', this))
	  );
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {UpdateNode}
	 */
	UpdateNode.prototype.clone = function() {
	  return new UpdateNode(this.index, this.expr);
	};

	/**
	 * Get string representation
	 * @return {String}
	 */
	UpdateNode.prototype.toString = function() {
	  return this.index.toString() + ' = ' + this.expr.toString();
	};

	/**
	 * Get LaTeX representation
	 * @return {String}
	 */
	UpdateNode.prototype.toTex = function() {
	  return this.index.toTex() + ' = ' + this.expr.toTex();
	};

	module.exports = UpdateNode;


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keywords = __webpack_require__(314);

	/**
	 * Node
	 */
	function Node() {
	  if (!(this instanceof Node)) {
	    throw new SyntaxError('Constructor must be called with the new operator');
	  }
	}

	/**
	 * Evaluate the node
	 * @return {*} result
	 */
	// TODO: cleanup deprecated code one day. Deprecated since version 0.19.0
	Node.prototype.eval = function () {
	  throw new Error('Node.eval is deprecated. ' +
	      'Use Node.compile(math).eval([scope]) instead.');
	};

	Node.prototype.type = 'Node';

	/**
	 * Compile the node to javascript code
	 * @param {Object} math             math.js instance
	 * @return {{eval: function}} expr  Returns an object with a function 'eval',
	 *                                  which can be invoked as expr.eval([scope]),
	 *                                  where scope is an optional object with
	 *                                  variables.
	 */
	Node.prototype.compile = function (math) {
	  if (!(math instanceof Object)) {
	    throw new TypeError('Object expected for parameter math');
	  }

	  // definitions globally available inside the closure of the compiled expressions
	  var defs = {
	    math: _transform(math),
	    _validateScope: _validateScope
	  };

	  var code = this._compile(defs);

	  var defsCode = Object.keys(defs).map(function (name) {
	    return '    var ' + name + ' = defs["' + name + '"];';
	  });

	  var factoryCode =
	      defsCode.join(' ') +
	          'return {' +
	          '  "eval": function (scope) {' +
	          '    if (scope) _validateScope(scope);' +
	          '    scope = scope || {};' +
	          '    return ' + code + ';' +
	          '  }' +
	          '};';

	  var factory = new Function ('defs', factoryCode);
	  return factory(defs);
	};

	/**
	 * Compile the node to javascript code
	 * @param {Object} defs     Object which can be used to define functions
	 *                          and constants globally available inside the closure
	 *                          of the compiled expression
	 * @return {String} js
	 * @private
	 */
	Node.prototype._compile = function (defs) {
	  // must be implemented by each of the Node implementations
	  throw new Error('Cannot compile a Node interface');
	};

	/**
	 * Execute a callback for each of the child nodes of this node
	 * @param {function(child: Node, path: string, parent: Node)} callback
	 */
	Node.prototype.forEach = function (callback) {
	  // must be implemented by each of the Node implementations
	  throw new Error('Cannot run forEach on a Node interface');
	};

	/**
	 * Create a new Node having it's childs be the results of calling
	 * the provided callback function for each of the childs of the original node.
	 * @param {function(child: Node, path: string, parent: Node): Node} callback
	 * @returns {OperatorNode} Returns a transformed copy of the node
	 */
	Node.prototype.map = function (callback) {
	  // must be implemented by each of the Node implementations
	  throw new Error('Cannot run map on a Node interface');
	};

	/**
	 * Validate whether an object is a Node, for use with map
	 * @param {Node} node
	 * @returns {Node} Returns the input if it's a node, else throws an Error
	 * @protected
	 */
	Node.prototype._ifNode = function (node) {
	  if (!(node instanceof Node)) {
	    throw new TypeError('Callback function must return a Node');
	  }

	  return node;
	};

	/**
	 * Recursively traverse all nodes in a node tree. Executes given callback for
	 * this node and each of its child nodes.
	 * @param {function(node: Node, path: string, parent: Node)} callback
	 *          A callback called for every node in the node tree.
	 */
	Node.prototype.traverse = function (callback) {
	  // execute callback for itself
	  callback(this, null, null);

	  // recursively traverse over all childs of a node
	  function _traverse (node, callback) {
	    node.forEach(function(child, path, parent) {
	      callback(child, path, parent);
	      _traverse(child, callback);
	    });
	  }
	  _traverse(this, callback);
	};

	/**
	 * Recursively transform a node tree via a transform function.
	 *
	 * For example, to replace all nodes of type SymbolNode having name 'x' with a
	 * ConstantNode with value 2:
	 *
	 *     var res = Node.transform(function (node, path, parent) {
	 *       if (node instanceof SymbolNode) && (node.name == 'x')) {
	 *         return new ConstantNode(2);
	 *       }
	 *       else {
	 *         return node;
	 *       }
	 *     });
	 *
	 * @param {function(node: Node, path: string, parent: Node) : Node} callback
	 *          A mapping function accepting a node, and returning
	 *          a replacement for the node or the original node.
	 *          Signature: callback(node: Node, index: string, parent: Node) : Node
	 * @return {Node} Returns the original node or its replacement
	 */
	Node.prototype.transform = function (callback) {
	  // check itself
	  var replacement = callback(this, null, null);
	  if (replacement !== this) {
	    return replacement;
	  }

	  // traverse over all childs
	  function _transform (node, callback) {
	    return node.map(function(child, path, parent) {
	      var replacement = callback(child, path, parent);
	      return (replacement !== child) ? replacement : _transform(child, callback);
	    });
	  }
	  return _transform(this, callback);
	};

	/**
	 * Find any node in the node tree matching given filter function. For example, to
	 * find all nodes of type SymbolNode having name 'x':
	 *
	 *     var results = Node.filter(function (node) {
	 *       return (node instanceof SymbolNode) && (node.name == 'x');
	 *     });
	 *
	 * @param {function(node: Node, path: string, parent: Node) : Node} callback
	 *            A test function returning true when a node matches, and false
	 *            otherwise. Function signature:
	 *            callback(node: Node, index: string, parent: Node) : boolean
	 * @return {Node[]} nodes       An array with nodes matching given filter criteria
	 */
	Node.prototype.filter = function (callback) {
	  var nodes = [];

	  this.traverse(function (node, path, parent) {
	    if (callback(node, path, parent)) {
	      nodes.push(node);
	    }
	  });

	  return nodes;
	};

	// TODO: deprecated since version 1.1.0, remove this some day
	Node.prototype.find = function () {
	  throw new Error('Function Node.find is deprecated. Use Node.filter instead.');
	};

	// TODO: deprecated since version 1.1.0, remove this some day
	Node.prototype.match = function () {
	  throw new Error('Function Node.match is deprecated. See functions Node.filter, Node.transform, Node.traverse.');
	};

	/**
	 * Create a clone of this node, a shallow copy
	 * @return {Node}
	 */
	Node.prototype.clone = function() {
	  // must be implemented by each of the Node implementations
	  throw new Error('Cannot clone a Node interface');
	};

	/**
	 * Get string representation
	 * @return {String}
	 */
	Node.prototype.toString = function() {
	  return '';
	};

	/**
	 * Get LaTeX representation
	 * @return {String}
	 */
	Node.prototype.toTex = function() {
	  return '';
	};

	/**
	 * Test whether an object is a Node
	 * @param {*} object
	 * @returns {boolean} isNode
	 */
	Node.isNode = function(object) {
	  return object instanceof Node;
	};

	/**
	 * Validate the symbol names of a scope.
	 * Throws an error when the scope contains an illegal symbol.
	 * @param {Object} scope
	 */
	function _validateScope (scope) {
	  for (var symbol in scope) {
	    if (scope.hasOwnProperty(symbol)) {
	      if (symbol in keywords) {
	        throw new Error('Scope contains an illegal symbol, "' + symbol + '" is a reserved keyword');
	      }
	    }
	  }
	}

	/**
	 * Replace all functions having a transform function attached at property transform
	 * with their transform.
	 * @param {Object} math
	 * @return {Object} transformed
	 * @private
	 */
	function _transform(math) {
	  var transformed = Object.create(math);

	  for (var name in math) {
	    if (math.hasOwnProperty(name)) {
	      var fn = math[name];
	      var transform = fn && fn.transform;
	      if (transform) {
	        transformed[name] = transform;
	      }
	    }
	  }

	  return transformed;
	}

	module.exports = Node;


/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	var DimensionError = __webpack_require__(156);
	var IndexError = __webpack_require__(157);

	/**
	 * Transform zero-based indices to one-based indices in errors
	 * @param {Error} err
	 * @returns {Error} Returns the transformed error
	 */
	exports.transform = function (err) {
	  if (err instanceof IndexError) {
	    return new IndexError(err.index + 1, err.min + 1, err.max + 1);
	  }

	  return err;
	};


/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Test whether value is a Boolean
	 * @param {*} value
	 * @return {Boolean} isBoolean
	 */
	exports.isBoolean = function(value) {
	  return (value instanceof Boolean) || (typeof value == 'boolean');
	};


/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var number = __webpack_require__(4),
	    bignumber = __webpack_require__(152),
	    BigNumber = __webpack_require__(159);

	/**
	 * Test whether value is a String
	 * @param {*} value
	 * @return {Boolean} isString
	 */
	exports.isString = function(value) {
	  return (value instanceof String) || (typeof value == 'string');
	};

	/**
	 * Check if a text ends with a certain string.
	 * @param {String} text
	 * @param {String} search
	 */
	exports.endsWith = function(text, search) {
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
	 * If value is a function, the returned string is 'function' unless the function
	 * has a property `description`, in that case this properties value is returned.
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
	exports.format = function(value, options) {
	  if (number.isNumber(value)) {
	    return number.format(value, options);
	  }

	  if (value instanceof BigNumber) {
	    return bignumber.format(value, options);
	  }

	  if (Array.isArray(value)) {
	    return formatArray(value, options);
	  }

	  if (exports.isString(value)) {
	    return '"' + value + '"';
	  }

	  if (typeof value === 'function') {
	    return value.syntax ? value.syntax + '' : 'function';
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


/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'null',
	  'category': 'Constants',
	  'syntax': [
	    'null'
	  ],
	  'description': 'Value null',
	  'examples': [
	    'null'
	  ],
	  'seealso': ['true', 'false']
	};


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'phi',
	  'category': 'Constants',
	  'syntax': [
	    'phi'
	  ],
	  'description': 'Phi is the golden ratio. Two quantities are in the golden ratio if their ratio is the same as the ratio of their sum to the larger of the two quantities. Phi is defined as `(1 + sqrt(5)) / 2` and is approximately 1.618034...',
	  'examples': [
	    'tau'
	  ],
	  'seealso': []
	};


/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'tau',
	  'category': 'Constants',
	  'syntax': [
	    'tau'
	  ],
	  'description': 'Tau is the ratio constant of a circle\'s circumference to radius, equal to 2 * pi, approximately 6.2832.',
	  'examples': [
	    'tau',
	    '2 * pi'
	  ],
	  'seealso': ['pi']
	};


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'version',
	  'category': 'Constants',
	  'syntax': [
	    'version'
	  ],
	  'description': 'A string with the version number of math.js',
	  'examples': [
	    'version'
	  ],
	  'seealso': []
	};


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// NOTE: distribution is NOT added to math.distribution but returned by the factory function
	// TODO: rethink math.distribution

	module.exports = function (math) {
	  var Matrix = __webpack_require__(9);
	  var array = __webpack_require__(153);
	  var collection = __webpack_require__(13);
	  var isCollection = collection.isCollection;

	  /**
	   * Create a distribution object with a set of random functions for given
	   * random distribution.
	   *
	   * Syntax:
	   *
	   *     math.distribution(name)
	   *
	   * Examples:
	   *
	   *     var normalDist = math.distribution('normal'); // create a normal distribution
	   *     normalDist.random(0, 10);                      // get a random value between 0 and 10
	   *
	   * See also:
	   *
	   *     random, randomInt, pickRandom
	   *
	   * @param {String} name   Name of a distribution. Choose from 'uniform', 'normal'.
	   * @return {Object}       Returns a distribution object containing functions:
	   *                        `random([size] [, min] [, max])`,
	   *                        `randomInt([min] [, max])`,
	   *                        `pickRandom(array)`
	   */
	  function distribution(name) {
	    if (!distributions.hasOwnProperty(name))
	      throw new Error('Unknown distribution ' + name);

	    var args = Array.prototype.slice.call(arguments, 1),
	        distribution = distributions[name].apply(this, args);

	    return (function(distribution) {

	      // This is the public API for all distributions
	      var randFunctions = {

	        random: function(arg1, arg2, arg3) {
	          var size, min, max;
	          if (arguments.length > 3) {
	            throw new math.error.ArgumentsError('random', arguments.length, 0, 3);

	          // `random(max)` or `random(size)`
	          } else if (arguments.length === 1) {
	            if (isCollection(arg1)) {
	              size = arg1;
	            }
	            else {
	              max = arg1;
	            }
	          // `random(min, max)` or `random(size, max)`
	          } else if (arguments.length === 2) {
	            if (isCollection(arg1)) {
	              size = arg1;
	              max = arg2;
	            }
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

	          // TODO: validate type of min, max, and size

	          if (max === undefined) max = 1;
	          if (min === undefined) min = 0;
	          if (size !== undefined) {
	            var res = _randomDataForMatrix(size.valueOf(), min, max, _random);
	            return (size instanceof Matrix) ? new Matrix(res) : res;
	          }
	          else return _random(min, max);
	        },

	        randomInt: function(arg1, arg2, arg3) {
	          var size, min, max;
	          if (arguments.length > 3 || arguments.length < 1)
	            throw new math.error.ArgumentsError('randomInt', arguments.length, 1, 3);

	          // `random(max)` or `random(size)`
	          else if (arguments.length === 1)
	            if (isCollection(arg1)) {
	              size = arg1;
	            }
	            else {
	              max = arg1;
	            }
	          // `randomInt(min, max)` or `randomInt(size, max)`
	          else if (arguments.length === 2) {
	            if (isCollection(arg1)) {
	              size = arg1;
	              max = arg2;
	            }
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

	          // TODO: validate type of min, max, and size

	          if (min === undefined) min = 0;
	          if (size !== undefined) {
	            var res = _randomDataForMatrix(size.valueOf(), min, max, _randomInt);
	            return (size instanceof Matrix) ? new Matrix(res) : res;
	          }
	          else return _randomInt(min, max);
	        },

	        pickRandom: function(possibles) {
	          if (arguments.length !== 1) {
	            throw new math.error.ArgumentsError('pickRandom', arguments.length, 1);
	          }
	          if (possibles instanceof Matrix) {
	            possibles = possibles.valueOf(); // get Array
	          }
	          else if (!Array.isArray(possibles)) {
	            throw new math.error.UnsupportedTypeError('pickRandom', math['typeof'](possibles));
	          }

	          if (array.size(possibles).length > 1) {
	            throw new Error('Only one dimensional vectors supported');
	          }

	          // TODO: add support for multi dimensional matrices
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

	  return distribution;
	};


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./clone": 143,
		"./clone.js": 143,
		"./filter": 144,
		"./filter.js": 144,
		"./forEach": 151,
		"./forEach.js": 151,
		"./format": 145,
		"./format.js": 145,
		"./import": 146,
		"./import.js": 146,
		"./map": 147,
		"./map.js": 147,
		"./print": 148,
		"./print.js": 148,
		"./sort": 149,
		"./sort.js": 149,
		"./typeof": 150,
		"./typeof.js": 150
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 195;


/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Determine the type of a variable
	 *
	 *     type(x)
	 *
	 * @param {*} x
	 * @return {String} type  Lower case type, for example 'number', 'string',
	 *                        'array', 'date'.
	 */
	exports.type = function(x) {
	  var type = typeof x;

	  if (type === 'object') {
	    if (x === null)           return 'null';
	    if (x instanceof Boolean) return 'boolean';
	    if (x instanceof Number)  return 'number';
	    if (x instanceof String)  return 'string';
	    if (Array.isArray(x))     return 'array';
	    if (x instanceof Date)    return 'date';
	    if (x instanceof Function)return 'function';
	    if (x instanceof RegExp)  return 'regexp';
	  }

	  return type;
	};


/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'add',
	  'category': 'Operators',
	  'syntax': [
	    'x + y',
	    'add(x, y)'
	  ],
	  'description': 'Add two values.',
	  'examples': [
	    'a = 2.1 + 3.6',
	    'a - 3.6',
	    '3 + 2i',
	    '"hello" + " world"',
	    '3 cm + 2 inch'
	  ],
	  'seealso': [
	    'subtract'
	  ]
	};


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'ceil',
	  'category': 'Arithmetic',
	  'syntax': [
	    'ceil(x)'
	  ],
	  'description':
	      'Round a value towards plus infinity. If x is complex, both real and imaginary part are rounded towards plus infinity.',
	  'examples': [
	    'ceil(3.2)',
	    'ceil(3.8)',
	    'ceil(-4.2)'
	  ],
	  'seealso': ['floor', 'fix', 'round']
	};


/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'divide',
	  'category': 'Operators',
	  'syntax': [
	    'x / y',
	    'divide(x, y)'
	  ],
	  'description': 'Divide two values.',
	  'examples': [
	    'a = 2 / 3',
	    'a * 3',
	    '4.5 / 2',
	    '3 + 4 / 2',
	    '(3 + 4) / 2',
	    '18 km / 4.5'
	  ],
	  'seealso': [
	    'multiply'
	  ]
	};


/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'dotDivide',
	  'category': 'Operators',
	  'syntax': [
	    'x ./ y',
	    'dotDivide(x, y)'
	  ],
	  'description': 'Divide two values element wise.',
	  'examples': [
	    'a = [1, 2, 3; 4, 5, 6]',
	    'b = [2, 1, 1; 3, 2, 5]',
	    'a ./ b'
	  ],
	  'seealso': [
	    'multiply',
	    'dotMultiply',
	    'divide'
	  ]
	};


/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'dotMultiply',
	  'category': 'Operators',
	  'syntax': [
	    'x .* y',
	    'dotMultiply(x, y)'
	  ],
	  'description': 'Multiply two values element wise.',
	  'examples': [
	    'a = [1, 2, 3; 4, 5, 6]',
	    'b = [2, 1, 1; 3, 2, 5]',
	    'a .* b'
	  ],
	  'seealso': [
	    'multiply',
	    'divide',
	    'dotDivide'
	  ]
	};


/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'dotpow',
	  'category': 'Operators',
	  'syntax': [
	    'x .^ y',
	    'dotpow(x, y)'
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


/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

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
	    'pow',
	    'log'
	  ]
	};


/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'fix',
	  'category': 'Arithmetic',
	  'syntax': [
	    'fix(x)'
	  ],
	  'description':
	      'Round a value towards zero. If x is complex, both real and imaginary part are rounded towards zero.',
	  'examples': [
	    'fix(3.2)',
	    'fix(3.8)',
	    'fix(-4.2)',
	    'fix(-4.8)'
	  ],
	  'seealso': ['ceil', 'floor', 'round']
	};


/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

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
	    '10 ^ 4',
	    'log(10000, 10)',
	    'log(10000) / log(10)',
	    'b = log(1024, 2)',
	    '2 ^ b'
	  ],
	  'seealso': [
	    'exp',
	    'log10'
	  ]
	};

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'log10',
	  'category': 'Arithmetic',
	  'syntax': [
	    'log10(x)'
	  ],
	  'description': 'Compute the 10-base logarithm of a value.',
	  'examples': [
	    'log10(0.00001)',
	    'log10(10000)',
	    '10 ^ 4',
	    'log(10000) / log(10)',
	    'log(10000, 10)'
	  ],
	  'seealso': [
	    'exp',
	    'log'
	  ]
	};


/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

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
	  'seealso': ['divide']
	};


/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'multiply',
	  'category': 'Operators',
	  'syntax': [
	    'x * y',
	    'multiply(x, y)'
	  ],
	  'description': 'multiply two values.',
	  'examples': [
	    'a = 2.1 * 3.4',
	    'a / 3.4',
	    '2 * 3 + 4',
	    '2 * (3 + 4)',
	    '3 * 2.1 km'
	  ],
	  'seealso': [
	    'divide'
	  ]
	};


/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'norm',
	  'category': 'Arithmetic',
	  'syntax': [
	    'norm(x)',
	    'norm(x, p)'
	  ],
	  'description': 'Calculate the norm of a number, vector or matrix.',
	  'examples': [
	    'abs(-3.5)',
	    'norm(-3.5)',
	    'norm(3 - 4i))',
	    'norm([1, 2, -3], Infinity)',
	    'norm([1, 2, -3], -Infinity)',
	    'norm([3, 4], 2)',
	    'norm([[1, 2], [3, 4]], 1)',
	    'norm([[1, 2], [3, 4]], \'inf\')',
	    'norm([[1, 2], [3, 4]], \'fro\')'
	  ]
	};


/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'nthRoot',
	  'category': 'Arithmetic',
	  'syntax': [
	    'nthRoot(a)',
	    'nthRoot(a, root)'
	  ],
	  'description': 'Calculate the nth root of a value. ' +
	      'The principal nth root of a positive real number A, ' +
	      'is the positive real solution of the equation "x^root = A".',
	  'examples': [
	    '4 ^ 3',
	    'nthRoot(64, 3)',
	    'nthRoot(9, 2)',
	    'sqrt(9)'
	  ],
	  'seealso': [
	    'sqrt',
	    'pow'
	  ]
	};

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

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
	  'seealso': [ 'multiply' ]
	};


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'subtract',
	  'category': 'Operators',
	  'syntax': [
	    'x - y',
	    'subtract(x, y)'
	  ],
	  'description': 'subtract two values.',
	  'examples': [
	    'a = 5.3 - 2',
	    'a + 2',
	    '2/3 - 1/6',
	    '2 * 3 - 3',
	    '2.1 km - 500m'
	  ],
	  'seealso': [
	    'add'
	  ]
	};


/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'unaryMinus',
	  'category': 'Operators',
	  'syntax': [
	    '-x',
	    'unaryMinus(x)'
	  ],
	  'description':
	      'Inverse the sign of a value. Converts booleans and strings to numbers.',
	  'examples': [
	    '-4.5',
	    '-(-5.6)',
	    '-"22"'
	  ],
	  'seealso': [
	    'add', 'subtract', 'unaryPlus'
	  ]
	};


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'unaryPlus',
	  'category': 'Operators',
	  'syntax': [
	    '+x',
	    'unaryPlus(x)'
	  ],
	  'description':
	      'Converts booleans and strings to numbers.',
	  'examples': [
	    '+true',
	    '+"2"'
	  ],
	  'seealso': [
	    'add', 'subtract', 'unaryMinus'
	  ]
	};


/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'bitAnd',
	  'category': 'Bitwise',
	  'syntax': [
	    'x & y',
	    'bitAnd(x, y)'
	  ],
	  'description': 'Bitwise AND operation. Performs the logical AND operation on each pair of the corresponding bits of the two given values by multiplying them. If both bits in the compared position are 1, the bit in the resulting binary representation is 1, otherwise, the result is 0',
	  'examples': [
	    '5 & 3',
	    'bitAnd(53, 131)',
	    '[1, 12, 31] & 42'
	  ],
	  'seealso': [
	    'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'bitNot',
	  'category': 'Bitwise',
	  'syntax': [
	    '~x',
	    'bitNot(x)'
	  ],
	  'description': 'Bitwise NOT operation. Performs a logical negation on each bit of the given value. Bits that are 0 become 1, and those that are 1 become 0.',
	  'examples': [
	    '~1',
	    '~2',
	    'bitNot([2, -3, 4])'
	  ],
	  'seealso': [
	    'bitAnd', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'bitOr',
	  'category': 'Bitwise',
	  'syntax': [
	    'x | y',
	    'bitOr(x, y)'
	  ],
	  'description': 'Bitwise OR operation. Performs the logical inclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if the first bit is 1 or the second bit is 1 or both bits are 1, otherwise, the result is 0.',
	  'examples': [
	    '5 | 3',
	    'bitOr([1, 2, 3], 4)'
	  ],
	  'seealso': [
	    'bitAnd', 'bitNot', 'bitXor', 'leftShift', 'rightArithShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'bitXor',
	  'category': 'Bitwise',
	  'syntax': [
	    'bitXor(x, y)'
	  ],
	  'description': 'Bitwise XOR operation, exclusive OR. Performs the logical exclusive OR operation on each pair of corresponding bits of the two given values. The result in each position is 1 if only the first bit is 1 or only the second bit is 1, but will be 0 if both are 0 or both are 1.',
	  'examples': [
	    'bitOr(1, 2)',
	    'bitXor([2, 3, 4], 4)'
	  ],
	  'seealso': [
	    'bitAnd', 'bitNot', 'bitOr', 'leftShift', 'rightArithShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'leftShift',
	  'category': 'Bitwise',
	  'syntax': [
	    'x << y',
	    'leftShift(x, y)'
	  ],
	  'description': 'Bitwise left logical shift of a value x by y number of bits.',
	  'examples': [
	    '4 << 1',
	    '8 >> 1'
	  ],
	  'seealso': [
	    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'rightArithShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'rightArithShift',
	  'category': 'Bitwise',
	  'syntax': [
	    'x >> y',
	    'leftShift(x, y)'
	  ],
	  'description': 'Bitwise right arithmetic shift of a value x by y number of bits.',
	  'examples': [
	    '8 >> 1',
	    '4 << 1',
	    '-12 >> 2'
	  ],
	  'seealso': [
	    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightLogShift'
	  ]
	};


/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'rightLogShift',
	  'category': 'Bitwise',
	  'syntax': [
	    'x >> y',
	    'leftShift(x, y)'
	  ],
	  'description': 'Bitwise right logical shift of a value x by y number of bits.',
	  'examples': [
	    '8 >>> 1',
	    '4 << 1',
	    '-12 >>> 2'
	  ],
	  'seealso': [
	    'bitAnd', 'bitNot', 'bitOr', 'bitXor', 'leftShift', 'rightArithShift'
	  ]
	};


/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

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
	    'arg(2 + 3i)'
	  ],
	  'seealso': [
	    're',
	    'im',
	    'conj',
	    'abs'
	  ]
	};


/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'bignumber',
	  'category': 'Type',
	  'syntax': [
	    'bignumber(x)'
	  ],
	  'description':
	      'Create a big number from a number or string.',
	  'examples': [
	    '0.1 + 0.2',
	    'bignumber(0.1) + bignumber(0.2)',
	    'bignumber("7.2")',
	    'bignumber("7.2e500")',
	    'bignumber([0.1, 0.2, 0.3])'
	  ],
	  'seealso': [
	    'boolean', 'complex', 'index', 'matrix', 'string', 'unit'
	  ]
	};


/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'complex', 'index', 'matrix', 'number', 'string', 'unit'
	  ]
	};


/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'boolean', 'index', 'matrix', 'number', 'string', 'unit'
	  ]
	};


/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'boolean', 'complex', 'matrix,', 'number', 'range', 'string', 'unit'
	  ]
	};


/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'boolean', 'complex', 'index', 'number', 'string', 'unit'
	  ]
	};


/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

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
	    'number([true, false, true, true])',
	    'number("52cm", "m")'
	  ],
	  'seealso': [
	    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'string', 'unit'
	  ]
	};


/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'number', 'unit'
	  ]
	};


/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

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
	    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'number', 'string'
	  ]
	};


/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'and',
	  'category': 'Logical',
	  'syntax': [
	    'x and y',
	    'and(x, y)'
	  ],
	  'description': 'Logical and. Test whether two values are both defined with a nonzero/nonempty value.',
	  'examples': [
	    'true and false',
	    'true and true',
	    '2 and 4'
	  ],
	  'seealso': [
	    'not', 'or', 'xor'
	  ]
	};


/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'not',
	  'category': 'Logical',
	  'syntax': [
	    '!x',
	    'not x',
	    'not(x)'
	  ],
	  'description': 'Logical not. Flips the boolean value of given argument.',
	  'examples': [
	    '!true',
	    'not false',
	    '!2',
	    '!0'
	  ],
	  'seealso': [
	    'and', 'or', 'xor'
	  ]
	};


/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'or',
	  'category': 'Logical',
	  'syntax': [
	    'x or y',
	    'or(x, y)'
	  ],
	  'description': 'Logical or. Test if at least one value is defined with a nonzero/nonempty value.',
	  'examples': [
	    'true or false',
	    'false or false',
	    '0 or 4'
	  ],
	  'seealso': [
	    'not', 'and', 'xor'
	  ]
	};


/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'xor',
	  'category': 'Logical',
	  'syntax': [
	    'x or y',
	    'or(x, y)'
	  ],
	  'description': 'Logical exclusive or, xor. Test whether one and only one value is defined with a nonzero/nonempty value.',
	  'examples': [
	    'true xor false',
	    'false xor false',
	    'true xor true',
	    '0 or 4'
	  ],
	  'seealso': [
	    'not', 'and', 'or'
	  ]
	};


/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'concat',
	  'category': 'Matrix',
	  'syntax': [
	    'concat(A, B, C, ...)',
	    'concat(A, B, C, ..., dim)'
	  ],
	  'description': 'Concatenate matrices. By default, the matrices are concatenated by the last dimension. The dimension on which to concatenate can be provided as last argument.',
	  'examples': [
	    'A = [1, 2; 5, 6]',
	    'B = [3, 4; 7, 8]',
	    'concat(A, B)',
	    'concat(A, B, 1)',
	    'concat(A, B, 2)'
	  ],
	  'seealso': [
	    'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
	  ]
	};


/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'cross',
	  'category': 'Matrix',
	  'syntax': [
	    'cross(A, B)'
	  ],
	  'description': 'Calculate the cross product for two vectors in three dimensional space.',
	  'examples': [
	    'cross([1, 1, 0],  [0, 1, 1])',
	    'cross([3, -3, 1], [4, 9, 2])',
	    'cross([2, 3, 4],  [5, 6, 7])'
	  ],
	  'seealso': [
	    'multiply',
	    'dot'
	  ]
	};


/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'diag',
	  'category': 'Matrix',
	  'syntax': [
	    'diag(x)',
	    'diag(x, k)'
	  ],
	  'description': 'Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned. When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.',
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


/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'dot',
	  'category': 'Matrix',
	  'syntax': [
	    'dot(A, B)'
	  ],
	  'description': 'Calculate the dot product of two vectors. ' +
	      'The dot product of A = [a1, a2, a3, ..., an] and B = [b1, b2, b3, ..., bn] ' +
	      'is defined as dot(A, B) = a1 * b1 + a2 * b2 + a3 * b3 + ... + an * bn',
	  'examples': [
	    'dot([2, 4, 1], [2, 2, 3])',
	    '[2, 4, 1] * [2, 2, 3]'
	  ],
	  'seealso': [
	    'multiply',
	    'cross'
	  ]
	};


/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'flatten',
	  'category': 'Matrix',
	  'syntax': [
	    'flatten(x)'
	  ],
	  'description': 'Flatten a multi dimensional matrix into a single dimensional matrix.',
	  'examples': [
	    'a = [1, 2, 3; 4, 5, 6]',
	    'size(a)',
	    'b = flatten(a)',
	    'size(b)'
	  ],
	  'seealso': [
	    'concat', 'resize', 'size', 'squeeze'
	  ]
	};


/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'ones',
	  'category': 'Matrix',
	  'syntax': [
	    'ones(m)',
	    'ones(m, n)',
	    'ones(m, n, p, ...)',
	    'ones([m])',
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


/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

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
	    'a[1:2, 1:2]'
	  ],
	  'seealso': [
	    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
	  ]
	};


/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'resize',
	  'category': 'Matrix',
	  'syntax': [
	    'resize(x, size)',
	    'resize(x, size, defaultValue)'
	  ],
	  'description': 'Resize a matrix.',
	  'examples': [
	    'resize([1,2,3,4,5], [3])',
	    'resize([1,2,3], [5])',
	    'resize([1,2,3], [5], -1)',
	    'resize(2, [2, 3])',
	    'resize("hello", [8], "!")'
	  ],
	  'seealso': [
	    'size', 'subset', 'squeeze'
	  ]
	};


/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'squeeze',
	  'category': 'Matrix',
	  'syntax': [
	    'squeeze(x)'
	  ],
	  'description': 'Remove inner and outer singleton dimensions from a matrix.',
	  'examples': [
	    'a = zeros(3,2,1)',
	    'size(squeeze(a))',
	    'b = zeros(1,1,3)',
	    'size(squeeze(b))'
	  ],
	  'seealso': [
	    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'subset', 'transpose', 'zeros'
	  ]
	};


/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

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
	    'e[1, 1:2] = [5, 6]',
	    'e[2, :] = [7, 8]',
	    'f = d * e',
	    'f[2, 1]',
	    'f[:, 1]'
	  ],
	  'seealso': [
	    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
	  ]
	};


/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'zeros',
	  'category': 'Matrix',
	  'syntax': [
	    'zeros(m)',
	    'zeros(m, n)',
	    'zeros(m, n, p, ...)',
	    'zeros([m])',
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


/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'combinations',
	  'category': 'Probability',
	  'syntax': [
	    'combinations(n, k)'
	  ],
	  'description': 'Compute the number of combinations of n items taken k at a time',
	  'examples': [
	    'combinations(7, 5)'
	  ],
	  'seealso': ['permutations', 'factorial']
	};


/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'factorial',
	  'category': 'Probability',
	  'syntax': [
	    'n!',
	    'factorial(n)'
	  ],
	  'description': 'Compute the factorial of a value',
	  'examples': [
	    '5!',
	    '5 * 4 * 3 * 2 * 1',
	    '3!'
	  ],
	  'seealso': ['combinations', 'permutations', 'gamma']
	};


/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'gamma',
	  'category': 'Probability',
	  'syntax': [
	    'gamma(n)'
	  ],
	  'description': 'Compute the gamma function. For small values, the Lanczos approximation is used, and for large values the extended Stirling approximation.',
	  'examples': [
	    'gamma(4)',
	    '3!',
	    'gamma(1/2)',
	    'sqrt(pi)'
	  ],
	  'seealso': ['factorial']
	};


/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'permutations',
	  'category': 'Probability',
	  'syntax': [
	    'permutations(n)',
	    'permutations(n, k)'
	  ],
	  'description': 'Compute the number of permutations of n items taken k at a time',
	  'examples': [
	    'permutations(5)',
	    'permutations(5, 3)'
	  ],
	  'seealso': ['combinations', 'factorial']
	};


/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

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
	  'seealso': ['random', 'randomInt']
	};


/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

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
	  'seealso': ['pickRandom', 'randomInt']
	};


/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

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
	  'seealso': ['pickRandom', 'random']
	};

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'compare',
	  'category': 'Relational',
	  'syntax': [
	    'compare(x, y)'
	  ],
	  'description':
	      'Compare two values. Returns 1 if x is larger than y, -1 if x is smaller than y, and 0 if x and y are equal.',
	  'examples': [
	    'compare(2, 3)',
	    'compare(3, 2)',
	    'compare(2, 2)',
	    'compare(5cm, 40mm)',
	    'compare(2, [1, 2, 3])'
	  ],
	  'seealso': [
	    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq'
	  ]
	};


/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'deepEqual',
	  'category': 'Relational',
	  'syntax': [
	    'deepEqual(x, y)'
	  ],
	  'description':
	      'Check equality of two matrices element wise. Returns true if the size of both matrices is equal and when and each of the elements are equal.',
	  'examples': [
	    '[1,3,4] == [1,3,4]',
	    '[1,3,4] == [1,3]'
	  ],
	  'seealso': [
	    'equal', 'unequal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare'
	  ]
	};


/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'equal',
	  'category': 'Relational',
	  'syntax': [
	    'x == y',
	    'equal(x, y)'
	  ],
	  'description':
	      'Check equality of two values. Returns true if the values are equal, and false if not.',
	  'examples': [
	    '2+2 == 3',
	    '2+2 == 4',
	    'a = 3.2',
	    'b = 6-2.8',
	    'a == b',
	    '50cm == 0.5m'
	  ],
	  'seealso': [
	    'unequal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare', 'deepEqual'
	  ]
	};


/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'larger',
	  'category': 'Relational',
	  'syntax': [
	    'x > y',
	    'larger(x, y)'
	  ],
	  'description':
	      'Check if value x is larger than y. Returns true if x is larger than y, and false if not.',
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
	    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq', 'compare'
	  ]
	};


/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'largerEq',
	  'category': 'Relational',
	  'syntax': [
	    'x >= y',
	    'largerEq(x, y)'
	  ],
	  'description':
	      'Check if value x is larger or equal to y. Returns true if x is larger or equal to y, and false if not.',
	  'examples': [
	    '2 > 1+1',
	    '2 >= 1+1',
	    'a = 3.2',
	    'b = 6-2.8',
	    '(a > b)'
	  ],
	  'seealso': [
	    'equal', 'unequal', 'smallerEq', 'smaller', 'largerEq', 'compare'
	  ]
	};


/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'smaller',
	  'category': 'Relational',
	  'syntax': [
	    'x < y',
	    'smaller(x, y)'
	  ],
	  'description':
	      'Check if value x is smaller than value y. Returns true if x is smaller than y, and false if not.',
	  'examples': [
	    '2 < 3',
	    '5 < 2*2',
	    'a = 3.3',
	    'b = 6-2.8',
	    '(a < b)',
	    '5 cm < 2 inch'
	  ],
	  'seealso': [
	    'equal', 'unequal', 'larger', 'smallerEq', 'largerEq', 'compare'
	  ]
	};


/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'smallerEq',
	  'category': 'Relational',
	  'syntax': [
	    'x <= y',
	    'smallerEq(x, y)'
	  ],
	  'description':
	      'Check if value x is smaller or equal to value y. Returns true if x is smaller than y, and false if not.',
	  'examples': [
	    '2 < 1+1',
	    '2 <= 1+1',
	    'a = 3.2',
	    'b = 6-2.8',
	    '(a < b)'
	  ],
	  'seealso': [
	    'equal', 'unequal', 'larger', 'smaller', 'largerEq', 'compare'
	  ]
	};


/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'unequal',
	  'category': 'Relational',
	  'syntax': [
	    'x != y',
	    'unequal(x, y)'
	  ],
	  'description':
	      'Check unequality of two values. Returns true if the values are unequal, and false if they are equal.',
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
	    'equal', 'smaller', 'larger', 'smallerEq', 'largerEq', 'compare', 'deepEqual'
	  ]
	};


/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

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
	    'mean',
	    'median',
	    'min',
	    'prod',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

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
	    'max',
	    'median',
	    'min',
	    'prod',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'median',
	  'category': 'Statistics',
	  'syntax': [
	    'median(a, b, c, ...)',
	    'median(A)'
	  ],
	  'description': 'Compute the median of all values. The values are sorted and the middle value is returned. In case of an even number of values, the average of the two middle values is returned.',
	  'examples': [
	    'median(5, 2, 7)',
	    'median([3, -1, 5, 7])'
	  ],
	  'seealso': [
	    'max',
	    'mean',
	    'min',
	    'prod',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

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
	    'max',
	    'mean',
	    'median',
	    'prod',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'prod',
	  'category': 'Statistics',
	  'syntax': [
	    'prod(a, b, c, ...)',
	    'prod(A)'
	  ],
	  'description': 'Compute the product of all values.',
	  'examples': [
	    'prod(2, 3, 4)',
	    'prod([2, 3, 4])',
	    'prod([2, 5; 4, 3])'
	  ],
	  'seealso': [
	    'max',
	    'mean',
	    'min',
	    'median',
	    'min',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'std',
	  'category': 'Statistics',
	  'syntax': [
	    'std(a, b, c, ...)',
	    'std(A)',
	    'std(A, normalization)'
	  ],
	  'description': 'Compute the standard deviation of all values, defined as std(A) = sqrt(var(A)). Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
	  'examples': [
	    'std(2, 4, 6)',
	    'std([2, 4, 6, 8])',
	    'std([2, 4, 6, 8], "uncorrected")',
	    'std([2, 4, 6, 8], "biased")',
	    'std([1, 2, 3; 4, 5, 6])'
	  ],
	  'seealso': [
	    'max',
	    'mean',
	    'min',
	    'median',
	    'min',
	    'prod',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'sum',
	  'category': 'Statistics',
	  'syntax': [
	    'sum(a, b, c, ...)',
	    'sum(A)'
	  ],
	  'description': 'Compute the sum of all values.',
	  'examples': [
	    'sum(2, 3, 4, 1)',
	    'sum([2, 3, 4, 1])',
	    'sum([2, 5; 4, 3])'
	  ],
	  'seealso': [
	    'max',
	    'mean',
	    'median',
	    'min',
	    'prod',
	    'std',
	    'sum',
	    'var'
	  ]
	};


/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'var',
	  'category': 'Statistics',
	  'syntax': [
	    'var(a, b, c, ...)',
	    'var(A)',
	    'var(A, normalization)'
	  ],
	  'description': 'Compute the variance of all values. Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
	  'examples': [
	    'var(2, 4, 6)',
	    'var([2, 4, 6, 8])',
	    'var([2, 4, 6, 8], "uncorrected")',
	    'var([2, 4, 6, 8], "biased")',
	    'var([1, 2, 3; 4, 5, 6])'
	  ],
	  'seealso': [
	    'max',
	    'mean',
	    'min',
	    'median',
	    'min',
	    'prod',
	    'std',
	    'sum'
	  ]
	};


/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

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
	    'atan',
	    'asin'
	  ]
	};


/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

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
	    'atan'
	  ]
	};


/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'cosh',
	  'category': 'Trigonometry',
	  'syntax': [
	    'cosh(x)'
	  ],
	  'description': 'Compute the hyperbolic cosine of x in radians.',
	  'examples': [
	    'cosh(0.5)'
	  ],
	  'seealso': [
	    'sinh',
	    'tanh',
	    'coth'
	  ]
	};


/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'coth',
	  'category': 'Trigonometry',
	  'syntax': [
	    'coth(x)'
	  ],
	  'description': 'Compute the hyperbolic cotangent of x in radians.',
	  'examples': [
	    'coth(2)',
	    '1 / tanh(2)'
	  ],
	  'seealso': [
	    'sech',
	    'csch',
	    'tanh'
	  ]
	};


/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'csch',
	  'category': 'Trigonometry',
	  'syntax': [
	    'csch(x)'
	  ],
	  'description': 'Compute the hyperbolic cosecant of x in radians. Defined as 1/sinh(x)',
	  'examples': [
	    'csch(2)',
	    '1 / sinh(2)'
	  ],
	  'seealso': [
	    'sech',
	    'coth',
	    'sinh'
	  ]
	};


/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'sech',
	  'category': 'Trigonometry',
	  'syntax': [
	    'sech(x)'
	  ],
	  'description': 'Compute the hyperbolic secant of x in radians. Defined as 1/cosh(x)',
	  'examples': [
	    'sech(2)',
	    '1 / cosh(2)'
	  ],
	  'seealso': [
	    'coth',
	    'csch',
	    'cosh'
	  ]
	};


/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'sinh',
	  'category': 'Trigonometry',
	  'syntax': [
	    'sinh(x)'
	  ],
	  'description': 'Compute the hyperbolic sine of x in radians.',
	  'examples': [
	    'sinh(0.5)'
	  ],
	  'seealso': [
	    'cosh',
	    'tanh'
	  ]
	};


/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'tanh',
	  'category': 'Trigonometry',
	  'syntax': [
	    'tanh(x)'
	  ],
	  'description': 'Compute the hyperbolic tangent of x in radians.',
	  'examples': [
	    'tanh(0.5)',
	    'sinh(0.5) / cosh(0.5)'
	  ],
	  'seealso': [
	    'sinh',
	    'cosh'
	  ]
	};


/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'to',
	  'category': 'Units',
	  'syntax': [
	    'x to unit',
	    'to(x, unit)'
	  ],
	  'description': 'Change the unit of a value.',
	  'examples': [
	    '5 inch to cm',
	    '3.2kg to g',
	    '16 bytes in bits'
	  ],
	  'seealso': []
	};


/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'map',
	  'category': 'Utils',
	  'syntax': [
	    'map(x, callback)'
	  ],
	  'description': 'Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.',
	  'examples': [
	    'map([1, 2, 3], function(val) { return value * value })'
	  ],
	  'seealso': ['filter', 'forEach']
	};


/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'filter',
	  'category': 'Utils',
	  'syntax': [
	    'filter(x, test)'
	  ],
	  'description': 'Filter items in a matrix.',
	  'examples': [
	    'isPositive(x) = x > 0',
	    'filter([6, -2, -1, 4, 3], isPositive)',
	    'filter([6, -2, 0, 1, 0], x != 0)'
	  ],
	  'seealso': ['sort', 'map', 'forEach']
	};


/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'forEach',
	  'category': 'Utils',
	  'syntax': [
	    'forEach(x, callback)'
	  ],
	  'description': 'Iterates over all elements of a matrix/array, and executes the given callback function.',
	  'examples': [
	    'forEach([1, 2, 3], function(val) { console.log(val) })'
	  ],
	  'seealso': ['map', 'sort', 'filter']
	};


/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'name': 'sort',
	  'category': 'Utils',
	  'syntax': [
	    'sort(x)',
	    'sort(x, compare)'
	  ],
	  'description': 'Sort the items in a matrix. Compare can be a string "asc" or "desc", or a custom sort function.',
	  'examples': [
	    'sort([5, 10, 1])',
	    'sort(["C", "B", "A", "D"])',
	    'sortByLength(a, b) = size(a)[1] - size(b)[1]',
	    'sort(["Langdon", "Tom", "Sara"], sortByLength)'
	  ],
	  'seealso': ['map', 'filter', 'forEach']
	};


/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

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


/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// Reserved keywords not allowed to use in the parser
	module.exports = {
	  end: true
	};


/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ArrayNode = __webpack_require__(161),
	    OperatorNode = __webpack_require__(168);

	// GREEK LETTERS
	var greek = {
	  Alpha: 'A',     alpha: true,
	  Beta: 'B',      beta: true,
	  Gamma: true,    gamma: true,
	  Delta: true,    delta: true,
	  Epsilon: 'E',   epsilon: true,  varepsilon: true,
	  Zeta: 'Z',      zeta: true,
	  Eta: 'H',       eta: true,
	  Theta: true,    theta: true,    vartheta: true,
	  Iota: 'I',      iota: true,
	  Kappa: 'K',     kappa: true,    varkappa: true,
	  Lambda: true,   lambda: true,
	  Mu: 'M',        mu: true,
	  Nu: 'N',        nu: true,
	  Xi: true,       xi: true,
	  Omicron: 'O',   omicron: true,
	  Pi: true,       pi: true,       varpi: true,
	  Rho: 'P',       rho: true,      varrho: true,
	  Sigma: true,    sigma: true,    varsigma: true,
	  Tau: 'T',       tau: true,
	  Upsilon: true,  upsilon: true,
	  Phi: true,      phi: true,      varphi: true,
	  Chi: 'X',       chi: true,
	  Psi: true,      psi: true,
	  Omega: true,    omega: true
	};

	var dots = {
	  dots: true,
	  ldots: true,
	  cdots: true,
	  vdots: true,
	  ddots: true,
	  idots: true
	};

	var logic = {
	  'true': '\\mathrm{True}',
	  'false': '\\mathrm{False}'
	};

	var other = {
	  inf: '\\infty',
	  Inf: '\\infty',
	  infinity: '\\infty',
	  Infinity: '\\infty',
	  oo: '\\infty',
	  lim: true,
	  'undefined': '\\mathbf{?}'
	};

	// FUNCTIONS
	var functions = {
	  acos: '\\cos^{-1}',
	  arccos: '\\cos^{-1}',
	  cos: true,
	  csc: true,
	  csch: false,
	  exp: true,
	  ker: true,
	  limsup: true,
	  min: true,
	  sinh: true,
	  asin: '\\sin^{-1}',
	  arcsin: '\\sin^{-1}',
	  cosh: true,
	  deg: true,
	  gcd: true,
	  lg: true,
	  ln: true,
	  Pr: true,
	  sup: true,
	  atan: '\\tan^{-1}',
	  atan2: '\\tan2^{-1}',
	  arctan: '\\tan^{-1}',
	  cot: true,
	  det: true,
	  hom: true,
	  log: true,
	  log10: '\\log_{10}',
	  sec: true,
	  sech: false,
	  tan: true,
	  arg: true,
	  coth: true,
	  dim: true,
	  inf: true,
	  max: true,
	  sin: true,
	  tanh: true,

	  fix: false,
	  lcm: false,
	  sign: false,
	  xgcd: false,
	  unaryMinus: false,
	  unaryPlus: false,

	  // complex
	  complex: false,
	  conj: false,
	  im: false,
	  re: false,

	  // matrix
	  diag: false,
	  resize: false,
	  size: false,
	  squeeze: false,
	  subset: false,
	  index: false,
	  ones: false,
	  zeros: false,
	  range: false,

	  // probability
	  random: false,

	  // statistics
	  mean: '\\mu',
	  median: false,
	  prod: false,
	  std: '\\sigma',
	  'var': '\\sigma^2'
	};

	// CURLY FUNCTIONS
	// wrap parameters with {}
	var curlyFunctions = {
	  sqrt: true,
	  inv: true,
	  int: '\\int',
	  Int: '\\int',
	  integrate: '\\int',
	  eigenvalues: '\\lambda',
	  liminf: true,
	  lim: true,
	  exp: 'e^',
	  sum: true,

	  eye: '\\mathbf{I}'
	};

	var operators = {
	  '<=': '\\leq',
	  '>=': '\\geq',
	  '!=': '\\neq',
	  'in': true,
	  '*': '\\cdot',
	  '/': '\\frac',
	  'mod': '\\bmod',
	  'to': '\\rightarrow'
	};

	var units = {
	  deg: '^{\\circ}'
	};

	var symbols = {};

	function mapSymbols() {
	  var args = Array.prototype.slice.call(arguments),
	      obj;
	  for (var i = 0, len = args.length; i < len; i++) {
	    obj = args[i];
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        symbols[key] = obj[key];
	      }
	    }
	  }
	}

	mapSymbols(
	  functions,
	  curlyFunctions,
	  greek,
	  dots,
	  logic,
	  other
	);

	function latexIs(arr, value) {
	  return typeof arr[value] !== 'undefined';
	}

	function latexIsFn(arr) {
	  return function(value) {
	    return latexIs(arr, value);
	  };
	}

	function latexToFn(arr) {
	  return function(value) {
	    if (typeof arr[value] === 'boolean') {
	      if (arr[value] === true) {
	        value = '\\' + value;
	      }
	      else {
	        value = '\\mathrm{' + value + '}';
	      }
	    }
	    else if (typeof arr[value] === 'string') {
	      value = arr[value];
	    }
	    else if (typeof value === 'string') {
	      var index = value.indexOf('_');
	      if (index !== -1) {
	        value = exports.toSymbol(value.substring(0, index)) + '_{' +
	            exports.toSymbol(value.substring(index+1)) + '}';
	      }
	    }

	    return value;
	  };
	}

	exports.isSymbol = latexIsFn(symbols);
	exports.toSymbol = latexToFn(symbols);

	exports.isFunction = latexIsFn(functions);
	exports.toFunction = latexToFn(functions);

	exports.isCurlyFunction = latexIsFn(curlyFunctions);
	exports.toCurlyFunction = latexToFn(curlyFunctions);

	exports.isOperator = latexIsFn(operators);
	exports.toOperator = latexToFn(operators);

	exports.isUnit = latexIsFn(units);
	exports.toUnit = (function() {
	  var _toUnit = latexToFn(units);

	  return function(value, notSpaced) {
	    if (exports.isUnit(value)) {
	      return _toUnit(value);
	    }

	    return (notSpaced ? '' : '\\,') + '\\mathrm{' + value + '}';
	  };
	}());

	exports.addBraces = function(s, brace, type) {
	  if (brace === null) {
	    return s;
	  }

	  var braces = ['', ''];
	  type = type || 'normal';

	  if (typeof brace === 'undefined' || brace === false) {
	    braces = ['{', '}'];
	  }
	  else if (brace === true) {
	    braces = ['(', ')'];
	    type = 'lr';
	  }
	  else if (Array.isArray(brace) && brace.length === 2) {
	    braces = brace;
	  }
	  else {
	    braces = [brace, brace];
	  }

	  switch (type) {
	    case 'normal':
	    case false:
	      return braces[0] + s + braces[1];

	    case 'lr':
	      return '\\left' + braces[0] + '{' + s + '}' + '\\right' + braces[1];

	    case 'be':
	      return '\\begin{' + braces[0] + '}' + s + '\\end{' + braces[1] + '}';
	  }

	  return braces[0] + s + braces[1];
	};

	exports.toArgs = function(that) {
	  var name = that.name,
	      args = that.args,
	      func = exports.toSymbol(that.name),
	      texParams = null,
	      brace = null,
	      type = false,
	      showFunc = false,
	      prefix = '',
	      suffix = '',
	      op = null;

	  switch (name) {
	    // OPERATORS
	    case 'add':
	      op = '+';
	      break;

	    case 'subtract':
	      op = '-';
	      break;

	    case 'larger':
	      op = '>';
	      break;

	    case 'largerEq':
	      op = '>=';
	      break;

	    case 'smaller':
	      op = '<';
	      break;

	    case 'smallerEq':
	      op = '<=';
	      break;

	    case 'unequal':
	      op = '!=';
	      break;

	    case 'equal':
	      op = '=';
	      break;

	    case 'mod':
	      op = 'mod';
	      break;

	    case 'multiply':
	      op = '*';
	      break;

	    case 'pow':
	      op = '^';
	      break;

	    case 'concat':
	      op = '||';
	      break;

	    case 'factorial':
	      op = '!';
	      break;

	    case 'permutations':
	      if (args.length === 1) {
	        op = '!';
	      }
	      else {
	        // op = 'P';
	        var n = args[0].toTex(),
	            k = args[1].toTex();
	        return '\\frac{' + n + '!}{\\left(' + n + ' - ' + k + '\\right)!}';
	      }
	      break;

	    // probability
	    case 'combinations':
	      op = '\\choose';
	      break;

	    // LR BRACES
	    case 'abs':
	      brace = '|';
	      type = 'lr';
	      break;

	    case 'norm':
	      brace = '\\|';
	      type = 'lr';

	      if (args.length === 2) {
	        var tmp = args[1].toTex();

	        if (tmp === '\\text{inf}') {
	          tmp = '\\infty';
	        }
	        else if (tmp === '\\text{-inf}') {
	          tmp = '{- \\infty}';
	        }
	        else if (tmp === '\\text{fro}') {
	          tmp = 'F';
	        }

	        suffix = '_{' + tmp + '}';
	        args = [args[0]];
	      }
	      break;

	    case 'ceil':
	      brace = ['\\lceil', '\\rceil'];
	      type = 'lr';
	      break;

	    case 'floor':
	      brace = ['\\lfloor', '\\rfloor'];
	      type = 'lr';
	      break;

	    case 'round':
	      brace = ['\\lfloor', '\\rceil'];
	      type = 'lr';

	      if (args.length === 2) {
	        suffix = '_' + exports.addBraces(args[1].toTex());
	        args = [args[0]];
	      }
	      break;


	    // NORMAL BRACES
	    case 'inv':
	      suffix = '^{-1}';
	      break;

	    case 'transpose':
	      suffix = '^{T}';
	      brace = false;
	      break;

	    // SPECIAL NOTATION
	    case 'log':
	      var base = 'e';
	      if (args.length === 2) {
	        base = args[1].toTex();
	        func = '\\log_{' + base + '}';
	        args = [args[0]];
	      }
	      if (base === 'e') {
	        func = '\\ln';
	      }

	      showFunc = true;
	      break;

	    case 'square':
	      suffix = '^{2}';
	      break;

	    case 'cube':
	      suffix = '^{3}';
	      break;


	    // MATRICES
	    case 'eye':
	      showFunc = true;
	      brace = false;
	      func += '_';
	      break;

	    case 'det':
	      if (that.args[0] instanceof ArrayNode) {
	        return that.args[0].toTex('vmatrix');
	      }

	      brace = 'vmatrix';
	      type = 'be';
	      break;

	    default:
	      showFunc = true;
	      break;
	  }

	  if (op !== null) {
	    brace = (op === '+' || op === '-');
	    texParams = (new OperatorNode(op, name, args)).toTex();
	  }
	  else {
	    op = ', ';
	  }

	  if (brace === null && !exports.isCurlyFunction(name)) {
	    brace = true;
	  }

	  texParams = texParams || args.map(function(param) {
	    return '{' + param.toTex() + '}'  ;
	  }).join(op);

	  return prefix + (showFunc ? func : '') +
	      exports.addBraces(texParams, brace, type) +
	      suffix;
	};


/***/ }
/******/ ])
});
