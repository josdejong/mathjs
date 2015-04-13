'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Bitwise right logical shift of value x by y number of bits, `x >>> y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.rightLogShift(x, y)
   *
   * Examples:
   *
   *    math.rightLogShift(4, 2);               // returns Number 1
   *
   *    math.rightLogShift([16, -32, 64], 4);   // returns Array [1, 2, 3]
   *
   * See also:
   *
   *    bitAnd, bitNot, bitOr, bitXor, leftShift, rightArithShift
   *
   * @param  {Number | Boolean | Array | Matrix | null} x Value to be shifted
   * @param  {Number | Boolean | null} y Amount of shifts
   * @return {Number | Array | Matrix} `x` zero-filled shifted right `y` times
   */

  var rightLogShift = typed('rightLogShift', {
    'number, number': function (x, y) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Integers expected in function rightLogShift');
      }

      return x >>> y;
    },

    // 'BigNumber, BigNumber': ..., // TODO: implement BigNumber support for rightLogShift

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, rightLogShift);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, rightLogShift);
    }
  });

  return rightLogShift;
}

exports.name = 'rightLogShift';
exports.factory = factory;
