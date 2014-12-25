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

      bigBitOr = util.bignumber.or;

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
  math.bitOr = function bitOr(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('bitOr', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Parameters in function bitOr must be integer numbers');
      }

      return x | y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, bitOr);
    }

    if (isBoolean(x) || x === null) {
      return bitOr(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return bitOr(x, +y);
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }

      if (y instanceof BigNumber) {
        return bigBitOr(x, y);
      }

      // downgrade to Number
      return bitOr(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }

      if (x instanceof BigNumber) {
        return bigBitOr(x, y);
      }

      // downgrade to Number
      return bitOr(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('bitOr', math['typeof'](x), math['typeof'](y));
  };
};
