'use strict';

var isNumber = require('../../util/number').isNumber;
var isString = require('../../util/string').isString;
var isFactory = require('../../util/object').isFactory;
var traverse = require('../../util/object').traverse;

// TODO: rework the import function to a typed function

function factory (type, config, load, typed, math) {
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
   *     support these data type. False by default.
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
   * @return {Object} Returns the imported objects
   */
  // TODO: return status information
  function math_import(object, options) {
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
      // a string with a module name

      if (typeof (require) === 'undefined') {
        throw new Error('Cannot load module: require not available.');
      }

      // load the module using require
      var _module = require(object);
      return math_import(_module, options);
    }
    else if (isFactory(object)) {
      return _importFactory(object);
    }
    else if (typeof object === 'object') {
      // a map with functions
      var imported = {};

      for (name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            imported[name] = _import(name, value, opts);
          }
          else if (isFactory(object)) {
            imported[name] = _importFactory(object);
          }
          else {
            imported[name] = math_import(value, options);
          }
        }
      }

      return imported;
    }
    else {
      throw new TypeError('Object or module name expected');
    }
  }

  /**
   * Add a property to the math namespace and create a chain proxy for it.
   * @param {String} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @return {*} Returns the imported value
   * @private
   */
  function _import(name, value, options) {
    // TODO: throw an error when override == false and the name is already defined
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
        if (value && value.transform) {
          math[name].transform = value.transform;
        }
      }
      else {
        // just create a link to the function or value
        math[name] = value;
      }

      // register the transform function if any
      if (value && value.transform) {
        math.expression.transform[name] = value.transform;
      }

      // create a proxy for the chain
      math.type.Chain.createProxy(name, value);

      return value;
    }
  }

  /**
   * Import an instance of a factory into math.js
   * @param {{name: string, factory: function}} factory
   * @returns {*} Returns the created and imported instance
   * @private
   */
  function _importFactory(factory) {
    var instance = load(factory);
    var namespace = factory.path ? traverse(math, factory.path) : math;

    if (namespace[factory.name]) {
      throw new Error('"' + factory.name + '" already exists');
    }
    namespace[factory.name] = instance;

    return instance;
  }

  /**
   * Check whether given object is a supported type
   * @param object
   * @return {Boolean}
   * @private
   */
  function isSupportedType(object) {
    return (typeof object == 'function')
        || isNumber(object)
        || isString(object)
        || object instanceof type.Unit
        || object instanceof type.Complex;
    // TODO: add boolean?
  }

  return math_import;
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
