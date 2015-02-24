'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),

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
      if (typeof (require) !== 'undefined') {
        // load the file using require
        var _module = require(object);
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
        isComplex(object) || isUnit(object);
    // TODO: add boolean?
  }
};
