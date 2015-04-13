'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitOr = require('../../util/bignumber').or;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Bitwise OR two values, `x | y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the lowest print base.
   *
   * Syntax:
   *
   *    math.bitOr(x, y)
   *
   * Examples:
   *
   *    math.bitOr(1, 2);               // returns Number 3
   *
   *    math.bitOr([1, 2, 3], 4);       // returns Array [5, 6, 7]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to or
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to or
   * @return {Number | BigNumber | Array | Matrix} OR of `x` and `y`
   */
  var bitOr = typed('bitOr', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitOr');
      }

      return x | y;
    },

    'BigNumber, BigNumber': bigBitOr,

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, bitOr);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, bitOr);
    }
  });

  return bitOr;
}

exports.name = 'bitOr';
exports.factory = factory;
