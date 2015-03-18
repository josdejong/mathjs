'use strict';

var collection = require('../../type/collection');
var nearlyEqual = require('../../util/number').nearlyEqual;

function factory (type, config, load, typed) {
  /**
   * Test whether value x is larger than y.
   *
   * The function returns true when x is larger than y and the relative
   * difference between x and y is larger than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.larger(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 3);             // returns false
   *    math.larger(5, 2 + 2);         // returns true
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.larger(a, b);             // returns false
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is larger than y, else returns false
   */
  var larger = typed('larger', {
    'boolean, boolean': function (x, y) {
      return x > y;
    },

    'number, number': function (x, y) {
      return x > y && !nearlyEqual(x, y, config.epsilon);
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.gt(y);
    },

    'Complex, Complex': function (x, y) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    },

    'Unit, Unit': function (x, y) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value > y.value && !nearlyEqual(x.value, y.value, config.epsilon);
    },

    'string, string': function (x, y) {
      return x > y;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, larger);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, larger);
    }
  });

  return larger;
}

exports.type = 'function';
exports.name = 'larger';
exports.factory = factory;
