module.exports = function (math) {
  var util = require('../util/index.js'),
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
   * - done()     Finalize the chained operation and return the selectors value.
   * - valueOf()  The same as done()
   * - toString() Executes math.format() onto the selectors value, returning
   *              a string representation of the value.
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
     * Get the string representation of the value in the selector
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
