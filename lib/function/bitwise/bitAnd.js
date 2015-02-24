'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var isInteger = require('../../util/number').isInteger;
  var bigBitAnd = require('../../util/bignumber').and;
  var collection = require('../../type/collection');

  /**
   * Bitwise AND two values, `x & y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitAnd(x, y)
   *
   * Examples:
   *
   *    math.bitAnd(53, 131);               // returns Number 1
   *
   *    math.bitAnd([1, 12, 31], 42);       // returns Array [0, 8, 10]
   *
   * See also:
   *
   *    bitNot, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to and
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to and
   * @return {Number | BigNumber | Array | Matrix} AND of `x` and `y`
   */
  var bitAnd = typed('bitAnd', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Parameters in function bitAnd must be integer numbers');
      }

      return x & y;
    },

    'BigNumber, BigNumber': bigBitAnd,

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, bitAnd);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, bitAnd);
    }
  });

  return bitAnd;
};
