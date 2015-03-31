'use strict';

var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Test whether value x is larger or equal to y.
   *
   * The function returns true when x is larger than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.largerEq(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 1 + 1);         // returns false
   *    math.largerEq(2, 1 + 1);       // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is larger or equal to y, else returns false
   */
  var largerEq = typed('largerEq', {
    'boolean, boolean': function (x, y) {
      return x >= y;
    },

    'number, number': function (x, y) {
      return x >= y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.gte(y);
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value >= y.value || nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x >= y;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, largerEq);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, largerEq);
    }
  });

  return largerEq;
}

exports.name = 'largerEq';
exports.factory = factory;
