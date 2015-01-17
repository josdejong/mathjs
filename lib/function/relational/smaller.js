'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var nearlyEqual = require('../../util/number').nearlyEqual;
  var collection = require('../../type/collection');

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
  var smaller = typed('smaller', {
    'boolean, boolean': function (x, y) {
      return x < y;
    },

    'number, number': function (x, y) {
      return !nearlyEqual(x, y, config.epsilon) && x < y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lt(y);
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return !nearlyEqual(x.value, y.value, config.epsilon) && x.value < y.value;
    },

    'string, string': function (x, y) {
      return x < y;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, smaller);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, smaller);
    }
  });

  return smaller;
};
