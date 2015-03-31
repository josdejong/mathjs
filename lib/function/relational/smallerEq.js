'use strict';

var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Test whether value x is smaller or equal to y.
   *
   * The function returns true when x is smaller than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.smallerEq(x, y)
   *
   * Examples:
   *
   *    math.smaller(1 + 2, 3);        // returns false
   *    math.smallerEq(1 + 2, 3);      // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, larger, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  var smallerEq = typed('smallerEq', {
    'boolean, boolean': function (x, y) {
      return x <= y;
    },

    'number, number': function (x, y) {
      return x <= y || nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.lte(y);
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value <= y.value || nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x <= y;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, smallerEq);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, smallerEq);
    }
  });

  return smallerEq;
}

exports.name = 'smallerEq';
exports.factory = factory;
