'use strict';

var collection = require('../../type/collection');
var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {
  /**
   * Compare two values. Returns 1 when x > y, -1 when x < y, and 0 when x == y.
   *
   * x and y are considered equal when the relative difference between x and y
   * is smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.compare(x, y)
   *
   * Examples:
   *
   *    math.compare(6, 1);           // returns 1
   *    math.compare(2, 3);           // returns -1
   *    math.compare(7, 7);           // returns 0
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('40 mm');
   *    math.compare(a, b);           // returns 1
   *
   *    math.compare(2, [1, 2, 3]);   // returns [1, 0, -1]
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, largerEq
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Number | BigNumber | Array | Matrix} Returns the result of the comparison: 1, 0 or -1.
   */
  var compare = typed('compare', {
    'boolean, boolean': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1);
    },

    'number, number': function (x, y) {
      return (x === y || nearlyEqual(x, y, config.epsilon)) ? 0 : (x > y ? 1 : -1);
    },

    'BigNumber, BigNumber': function (x, y) {
      return new x.constructor(x.cmp(y));
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return (x.value === y.value || nearlyEqual(x.value, y.value, config.epsilon)) ? 0 : (x.value > y.value ? 1 : -1);
    },

    'string, string': function (x, y) {
      return x === y ? 0 : (x > y ? 1 : -1);
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, compare);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, compare);
    }
  });

  return compare;
}

exports.type = 'function';
exports.name = 'compare';
exports.factory = factory;
