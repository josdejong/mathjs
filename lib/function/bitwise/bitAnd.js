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
      
      bigBitAnd = util.bignumber.and;

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
  math.bitAnd = function bitAnd(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('bitAnd', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      if (!isInteger(x) || !isInteger(y)) {
        throw new Error('Parameters in function bitAnd must be integer numbers');
      }

      return x & y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, bitAnd);
    }

    if (isBoolean(x) || x === null) {
      return bitAnd(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return bitAnd(x, +y);
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }

      if (y instanceof BigNumber) {
        return bigBitAnd(x, y);
      }

      // downgrade to Number
      return bitAnd(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }

      if (x instanceof BigNumber) {
        return bigBitAnd(x, y);
      }

      // downgrade to Number
      return bitAnd(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('bitAnd', math['typeof'](x), math['typeof'](y));
  };
};
