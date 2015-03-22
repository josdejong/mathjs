var object = require('./lib/util/object');
var digits = require('./lib/util/number').digits;

/**
 * Math.js loader. Creates a new, empty math.js instance
 * @returns {Object} Returns a math.js instance containing
 *                   a function `import` to add new functions
 */
exports.create = function create () {
  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
    'Please load the es5-shim and es5-sham library for compatibility.');
  }

  // cached factories and instances
  var factories = [];
  var instances = [];

  // the created factory
  var math = {};

  var typed = require('typed-function');
  // TODO: must create a separate instance of typed, with custom config.
  // TODO: typed-function must be able to silently ignore signatures with unknown data types

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

  // TODO: dynamically load data types into the loader, via factory functions for types
  var Complex = require('./lib/type/Complex');
  var Range = require('./lib/type/Range');
  var Index = require('./lib/type/Index');
  var Matrix = require('./lib/type/Matrix');
  var Unit = require('./lib/type/Unit');
  var Help = require('./lib/type/Help');
  var ResultSet = require('./lib/type/ResultSet');

  // create a new BigNumber factory for this instance of math.js
  var BigNumber = require('./lib/type/BigNumber').constructor(_config);

  // TODO: remove BigNumber.convert as soon as it's deprecated
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

  // TODO: remove errors from the namespace as soon as they are redundant
  // errors
  math.error = require('./lib/error/index');

  // types (Matrix, Complex, Unit, ...)
  math.type = {
    Complex: Complex,
    Range: Range,
    Index: Index,
    Matrix: Matrix,
    Unit: Unit,
    Help: Help,
    ResultSet: ResultSet,
    BigNumber: BigNumber
  };

  // configure typed functions
  typed.types['Complex']    = function (x) { return x instanceof Complex; };
  typed.types['Range']      = function (x) { return x instanceof Range; };
  typed.types['Index']      = function (x) { return x instanceof Index; };
  typed.types['Matrix']     = function (x) { return x instanceof Matrix; };
  typed.types['Unit']       = function (x) { return x instanceof Unit; };
  typed.types['Help']       = function (x) { return x instanceof Help; };
  typed.types['ResultSet']  = function (x) { return x instanceof ResultSet; };
  typed.types['BigNumber']  = function (x) { return x instanceof BigNumber; };

  typed.conversions = [
    {
      from: 'number',
      to: 'BigNumber',
      convert: function (x) {
        // note: conversion from number to BigNumber can fail if x has >15 digits
        if (digits(x) > 15) {
          throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' +
          '(value: ' + x + '). ' +
          'Use function bignumber(x) to convert to BigNumber.');
        }
        return new BigNumber(x);
      }
    }, {
      from: 'number',
      to: 'Complex',
      convert: function (x) {
        return new Complex(x, 0);
      }
    }, {
      from: 'number',
      to: 'string',
      convert: function (x) {
        return x + '';
      }
    }, {
      from: 'BigNumber',
      to: 'Complex',
      convert: function (x) {
        return new Complex(x.toNumber(), 0);
      }
    }, {
      from: 'boolean',
      to: 'number',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'boolean',
      to: 'BigNumber',
      convert: function (x) {
        return new BigNumber(+x);
      }
    }, {
      from: 'boolean',
      to: 'string',
      convert: function (x) {
        return +x;
      }
    }, {
      from: 'null',
      to: 'number',
      convert: function () {
        return 0;
      }
    }, {
      from: 'null',
      to: 'string',
      convert: function () {
        return 'null';
      }
    }, {
      from: 'null',
      to: 'BigNumber',
      convert: function () {
        return new BigNumber(0);
      }
    }, {
      from: 'Array',
      to: 'Matrix',
      convert: function (array) {
        return new Matrix(array);
      }
    }
  ];

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
  // TODO: change the function config into a regular function, move it to /lib/function/utils
  math.config = function config(options) {
    if (options) {
      // merge options
      object.deepExtend(_config, options);

      if (options.precision) {
        BigNumber.config({
          precision: options.precision
        });
      }

      // reload the constants (they depend on option number and precision)
      // this must be done after math.type.BigNumber.config is applied
      require('./lib/constants')(math, _config);
    }

    // return a clone of the settings
    return object.clone(_config);
  };

  // FIXME: load constants via math.import() like all functions (problem: it must be reloaded when config changes)
  // constants
  require('./lib/constants')(math, _config);

  /**
   * Load a . If the function already exists,
   * the existing instance is returned
   * @param object
   * @returns {*}
   */
  function load (object) {
    if (isFunctionFactory(object)) {
      var factory = object.factory;
      var index = factories.indexOf(factory);
      var instance;
      if (index === -1) {
        // doesn't yet exist
        if (object.math) {
          // pass math namespace
          instance = factory(math.type, _config, load, typed, math);
        }
        else {
          instance = factory(math.type, _config, load, typed);
        }

        // append to the cache
        factories.push(factory);
        instances.push(instance);
      }
      else {
        // already existing function, return this instance
        instance = instances[index];
      }

      return instance;
    }
    else {
      throw new Error('Function factory expected');
    }
  }

  // TODO: isFunctionFactory is defined twice: also in /lib/function/util/import.js
  function isFunctionFactory (object) {
    return object.type === 'function' &&
        typeof object.name === 'string' &&
        typeof object.factory === 'function';
  }

  // load the import function, which can be used to load all other functions,
  // constants, and types
  math['import'] = load(require('./lib/function/utils/import'));

  math._config = _config; // TODO: cleanup when everything is converted

  return math;
};