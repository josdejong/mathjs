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

  // create a namespace for the mathjs instance
  var math = {
    type: {}
  };

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

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {{type: string, name: string, factory: function}} factory
   * @returns {*}
   */
  function load (factory) {
    if (!object.isFactory(factory)) {
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected');
    }

    var index = factories.indexOf(factory);
    var instance;
    if (index === -1) {
      // doesn't yet exist
      if (factory.math) {
        // pass math namespace
        instance = factory.factory(math.type, _config, load, typed, math);
      }
      else {
        instance = factory.factory(math.type, _config, load, typed);
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

  // load the import function, which can be used to load all other functions,
  // constants, and types
  math['import'] = load(require('./lib/function/utils/import'));

  // TODO: dynamically load data types into the loader, via factory functions for types
  var Complex = require('./lib/type/Complex');
  var Range = require('./lib/type/Range');
  var Index = require('./lib/type/Index');
  var Matrix = require('./lib/type/Matrix');
  var Unit = require('./lib/type/Unit');
  var Help = require('./lib/type/Help');
  var ResultSet = require('./lib/type/ResultSet');
  var BigNumber = math.import(require('./lib/type/BigNumber'));

  // types (Matrix, Complex, Unit, ...)
  math.type.Complex = Complex;
  math.type.Range = Range;
  math.type.Index = Index;
  math.type.Matrix = Matrix;
  math.type.Unit = Unit;
  math.type.Help = Help;
  math.type.ResultSet = ResultSet;

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

  // FIXME: load constants via math.import() like all functions (problem: it must be reloaded when config changes)
  // constants
  require('./lib/constants')(math, _config);

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

  math._config = _config; // TODO: cleanup when everything is converted

  // TODO: remove errors from the namespace as soon as they are redundant
  // errors
  math.error = require('./lib/error/index');

  return math;
};
