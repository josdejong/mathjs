'use strict';

var isFactory = require('../util/object').isFactory;
var traverse = require('../util/object').traverse;
var extend = require('../util/object').extend;

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
   *   - `silent: boolean`
   *     If true, the function will not throw errors on duplicates or invalid
   *     types. False by default.
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
   *    // import the npm module 'numbers'
   *    // (must be installed first with `npm install numbers`)
   *    math.import(require('numbers'), {wrap: true});
   *
   *    math.fibonacci(7); // returns 13
   *
   * @param {Object | Array} object   Object with functions to be imported.
   * @param {Object} [options]        Import options.
   * @return {Object} Returns the imported objects
   */
  function math_import(object, options) {
    var num = arguments.length;
    if (num != 1 && num != 2) {
      throw new math.error.ArgumentsError('import', num, 1, 2);
    }

    if (!options) {
      options = {};
    }

    if (isFactory(object)) {
      return _importFactory(object, options);
    }
    else if (Array.isArray(object)) {
      return object.map(function (entry) {
        return math_import(entry, options);
      });
    }
    else if (typeof object === 'object') {
      // a map with functions
      var imported = {};

      for (var name in object) {
        if (object.hasOwnProperty(name)) {
          var value = object[name];
          if (isSupportedType(value)) {
            imported[name] = _import(name, value, options);
          }
          else if (isFactory(object)) {
            imported[name] = _importFactory(object, options);
          }
          else {
            imported[name] = math_import(value, options);
          }
        }
      }

      return imported;
    }
    else {
      if (!options.silent) {
        throw new TypeError('Factory, Object, or Array expected');
      }
    }
  }

  /**
   * Add a property to the math namespace and create a chain proxy for it.
   * @param {string} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @return {*} Returns the imported value
   * @private
   */
  function _import(name, value, options) {
    if (options.wrap && typeof value === 'function') {
      // create a wrapper around the function
      value = _wrap(value);
    }

    if (typeof math[name] === 'function' &&
        typeof math[name].signatures === 'object' &&
        typeof value === 'function' &&
        typeof value.signatures === 'object') {
      // merge two typed functions
      if (options.override) {
        value = typed(extend({}, math[name].signatures, value.signatures));
      }
      else {
        value = typed(math[name], value);
      }

      math[name] = value;
      math.emit('import', name, value);
      return value;
    }

    if (math[name] === undefined || options.override) {
      math[name] = value;
      math.emit('import', name, value);
      return value;
    }

    if (!options.silent) {
      throw new Error('Cannot import "' + name + '": already exists');
    }
  }

  /**
   * Create a wrapper a round an function which converts the arguments
   * to their primitive values (like convert a Matrix to Array)
   * @param {Function} fn
   * @return {Function} Returns the wrapped function
   * @private
   */
  function _wrap (fn) {
    var wrapper = function wrapper () {
      var args = [];
      for (var i = 0, len = arguments.length; i < len; i++) {
        var arg = arguments[i];
        args[i] = arg && arg.valueOf();
      }
      return fn.apply(math, args);
    };

    if (fn.transform) {
      wrapper.transform = fn.transform;
    }

    return wrapper;
  }

  /**
   * Import an instance of a factory into math.js
   * @param {{factory: Function, name: string, path: string, math: boolean}} factory
   * @param {Object} options  See import for a description of the options
   * @returns {*} Returns the created and imported instance
   * @private
   */
  function _importFactory(factory, options) {
    var instance = load(factory);

    if (typeof factory.name === 'string') {
      var name = factory.name;
      var namespace = factory.path ? traverse(math, factory.path) : math;

      if (typeof namespace[name] === 'function' &&
          typeof namespace[name].signatures === 'object' &&
          typeof instance === 'function' &&
          typeof instance.signatures === 'object') {
        // merge two typed functions
        if (options.override) {
          instance = typed(extend({}, namespace[name].signatures, instance.signatures));
        }
        else {
          instance = typed(namespace[name], instance);
        }

        namespace[name] = instance;
        math.emit('import', name, instance, factory.path);
        return instance;
      }

      if (namespace[name] === undefined || options.override) {
        namespace[name] = instance;
        math.emit('import', name, instance, factory.path);
        return instance;
      }

      if (!options.silent) {
        throw new Error('Cannot import "' + name + '": already exists');
      }
    }

    return instance;
  }

  /**
   * Check whether given object is a type which can be imported
   * @param {Function | number | string | boolean | null | Unit | Complex} object
   * @return {boolean}
   * @private
   */
  function isSupportedType(object) {
    return typeof object == 'function'
        || typeof object === 'number'
        || typeof object === 'string'
        || typeof object === 'boolean'
        || object === null
        || (object && object.isUnit === true)
        || (object && object.isComplex === true)
  }

  return math_import;
}

exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
