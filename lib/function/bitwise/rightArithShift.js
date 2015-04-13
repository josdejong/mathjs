'use strict';

var isInteger = require('../../util/number').isInteger;
var bigRightArithShift = require('../../util/bignumber').rightArithShift;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Bitwise right arithmetic shift of a value x by y number of bits, `x >> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightArithShift(x, y)
   *
   * Examples:
   *
   *    math.rightArithShift(4, 2);               // returns Number 1
   *
   *    math.rightArithShift([16, -32, 64], 4);   // returns Array [1, -2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | null} y Amount of shifts
   * @return {Number | BigNumber | Array | Matrix} `x` sign-filled shifted right `y` times
   */
  var rightArithShift = typed('rightArithShift', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function rightArithShift');
      }

      return x >> y;
    },

    'BigNumber, BigNumber': bigRightArithShift,

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, rightArithShift);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, rightArithShift);
    }
  });

  return rightArithShift;
}

exports.name = 'rightArithShift';
exports.factory = factory;
