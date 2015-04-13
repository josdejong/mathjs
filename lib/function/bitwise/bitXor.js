'use strict';

var isInteger = require('../../util/number').isInteger;
var bigBitXor = require('../../util/bignumber').xor;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Bitwise XOR two values, `x ^ y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.bitXor(x, y)
   *
   * Examples:
   *
   *    math.bitXor(1, 2);               // returns Number 3
   *
   *    math.bitXor([2, 3, 4], 4);       // returns Array [6, 7, 0]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x First value to xor
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} y Second value to xor
   * @return {Number | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  var bitXor = typed('bitXor', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function bitXor');
      }

      return x ^ y;
    },

    'BigNumber, BigNumber': bigBitXor,

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, bitXor);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, bitXor);
    }
  });

  return bitXor;
}

exports.name = 'bitXor';
exports.factory = factory;
