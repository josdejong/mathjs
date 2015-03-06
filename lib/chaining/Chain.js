'use strict';

module.exports = function () {
  var string = require('../util/string');

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

  /**
   * Create a proxy for a single method, or an object with multiple methods.
   * Example usage:
   *
   *   Chain.createProxy('add', function add (x, y) {...});
   *   Chain.createProxy({
   *     add:      function add (x, y) {...},
   *     subtract: function subtract (x, y) {...}
   *   }
   *
   *
   * @param {String | Object} arg0   A function name (string), or an object with
   *                                 methods
   * @param {*} [arg1]               Function or value, when arg0 is a name
   */
  Chain.createProxy = function (arg0, arg1) {
    if (typeof arg0 === 'string') {
      // createProxy(name, value)
      createProxy(arg0, arg1);
    }
    else {
      // createProxy(values)
      for (var prop in arg0) {
        if (arg0.hasOwnProperty(prop)) {
          createProxy(prop, arg0[prop]);
        }
      }
    }
  };

  return Chain;
};
