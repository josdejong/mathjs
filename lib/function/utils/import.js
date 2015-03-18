'use strict';

var util = require('../../util/index');
var isNumber = util.number.isNumber;
var isString = util.string.isString;

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
      // a string with a filename

      // istanbul ignore else (we cannot unit test the else case in a node.js environment)
      if (typeof (require) !== 'undefined') {
        // load the file using require
        var _module = require(object);
        math_import(_module, options);
      }
      else {
        throw new Error('Cannot load module: require not available.');
      }
      // TODO: return imported stuff?
    }
    else if (isFunctionFactory(object)) {
      var instance = load(object);

      // TODO: give an error when conflicting
      if (math[object.name]) {
        throw new Error('"' + object.name + '" already exists');
      }
      math[object.name] = instance;

      return instance;
    }
    else if (typeof object === 'object') {
      // a map with functions
      // TODO: support a map with functionFactories
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

      // TODO: return map with imported stuff?
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
        object instanceof type.Complex || object instanceof type.Unit;
    // TODO: add boolean?
  }

  function isFunctionFactory (object) {
    return object.type === 'function' &&
        typeof object.name === 'string' &&
        typeof object.factory === 'function';
  }

  return math_import;
}

exports.type = 'function';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.name = 'import';
exports.factory = factory;
