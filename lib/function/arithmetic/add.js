'use strict';

var collection = require('../../type/collection');

function factory (type, config, load, typed) {
  /**
   * Add two values, `x + y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.add(x, y)
   *
   * Examples:
   *
   *    math.add(2, 3);               // returns Number 5
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(-4, 1);
   *    math.add(a, b);               // returns Complex -2 + 4i
   *
   *    math.add([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   *    var c = math.unit('5 cm');
   *    var d = math.unit('2.1 mm');
   *    math.add(c, d);               // returns Unit 52.1 mm
   *
   * See also:
   *
   *    subtract
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} x First value to add
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null} y Second value to add
   * @return {Number | BigNumber | Complex | Unit | String | Array | Matrix} Sum of `x` and `y`
   */
  var add = typed('add', {
    'number, number': function (x, y) {
      return x + y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y);
    },

    'Complex, Complex': function (x, y) {
      return new type.Complex(
          x.re + y.re,
          x.im + y.im
      );
    },

    'Unit, Unit': function (x, y) {
      if (x.value == null) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value == null) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');

      var res = x.clone();
      res.value += y.value;
      res.fixPrefix = false;
      return res;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, add);
    },

    'string, string': function (x, y) {
      return x + y;
    }
  });

  return add;
}

exports.type = 'function';
exports.name = 'add';
exports.factory = factory;
