'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var Complex = require('../../type/Complex');
  var collection = require('../../type/collection');

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2);        // returns Number 3.3
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.subtract(a, b);          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4);  // returns Array [1, 3, 0]
   *
   *    var c = math.unit('2.1 km');
   *    var d = math.unit('500m');
   *    math.subtract(c, d);          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x
   *            Initial value
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y
   *            Value to subtract from `x`
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  var subtract = typed('subtract', {
    'number, number': function (x, y) {
      return x - y;
    },

    'Complex, Complex': function (x, y) {
      return new Complex (
          x.re - y.re,
          x.im - y.im
      );
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.minus(y);
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) {
        throw new Error('Parameter x contains a unit with undefined value');
      }

      if (y.value == null) {
        throw new Error('Parameter y contains a unit with undefined value');
      }

      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      var res = x.clone();
      res.value -= y.value;
      res.fixPrefix = false;

      return res;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, subtract);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, subtract);
    }
  });

  return subtract;
};
