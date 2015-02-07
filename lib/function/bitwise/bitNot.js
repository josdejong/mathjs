'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection,

      bigBitNot = util.bignumber.not;

  /**
   * Bitwise NOT value, `~x`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.bitNot(x)
   *
   * Examples:
   *
   *    math.bitNot(1);               // returns Number -2
   *
   *    math.bitNot([2, -3, 4]);      // returns Array [-3, 2, 5]
   *
   * See also:
   *
   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {Number | BigNumber | Boolean | Array | Matrix | null} x Value to not
   * @return {Number | BigNumber | Array | Matrix} NOT of `x`
   */
  math.bitNot = function bitNot(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('bitNot', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (!isInteger(x)) {
        throw new Error('Parameter in function bitNot must be integer numbers');
      }

      return ~x;
    }

    if (x instanceof BigNumber) {
      return bigBitNot(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, bitNot);
    }

    if (isBoolean(x) || x === null) {
      return bitNot(+x);
    }

    throw new math.error.UnsupportedTypeError('bitNot', math['typeof'](x));
  };
};
