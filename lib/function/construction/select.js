'use strict';

module.exports = function (math) {
  /**
   * Wrap any value in a Selector, allowing to perform chained operations on
   * the value.
   *
   * All methods available in the math.js library can be called upon the selector,
   * and then will be evaluated with the value itself as first argument.
   * The selector can be closed by executing `selector.done()`, which returns
   * the final value.
   *
   * The Selector has a number of special functions:
   *
   * - `done()`     Finalize the chained operation and return the selectors value.
   * - `valueOf()`  The same as `done()`
   * - `toString()` Executes `math.format()` onto the selectors value, returning
   *                a string representation of the value.
   *
   * Syntax:
   *
   *    math.select(value)
   *
   * Examples:
   *
   *     math.select(3)
   *         .add(4)
   *         .subtract(2)
   *         .done();     // 5
   *
   *     math.select( [[1, 2], [3, 4]] )
   *         .set([1, 1], 8)
   *         .multiply(3)
   *         .done();     // [[24, 6], [9, 12]]
   *
   * @param {*} [value]   A value of any type on which to start a chained operation.
   * @return {math.chaining.Selector} The created selector
   */
  math.select = function select(value) {
    // TODO: check number of arguments
    return new math.chaining.Selector(value);
  };
};
