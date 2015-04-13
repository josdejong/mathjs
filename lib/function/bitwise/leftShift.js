'use strict';

var isInteger = require('../../util/number').isInteger;
var bigLeftShift = require('../../util/bignumber').leftShift;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2);               // returns Number 4
   *
   *    math.leftShift([1, 2, 3], 4);       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
   * @return {Number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  var leftShift = typed('leftShift', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function leftShift');
      }

      return x << y;
    },

    'BigNumber, BigNumber': bigLeftShift,

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, leftShift);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, leftShift);
    }
  });

  return leftShift;
}

exports.name = 'leftShift';
exports.factory = factory;
