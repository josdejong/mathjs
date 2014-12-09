'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

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
   * @param  {Number | BigNumber | Boolean | String | Array | Matrix | null} x First value to xor
   * @param  {Number | BigNumber | Boolean | String | Array | Matrix | null} y Second value to xor
   * @return {Integer | BigNumber | Array | Matrix} XOR of `x` and `y`
   */
  math.bitXor = function bitXor(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('bitXor', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return x ^ y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, bitXor);
    }

    if (isString(x)) {
      return bitXor((config.number === 'bignumber')
                    ? new BigNumber(x)
                    : +x, y);
    }
    if (isString(y)) {
      return bitXor(x, (config.number === 'bignumber')
                       ? new BigNumber(y)
                       : +y);
    }

    if (isBoolean(x) || x === null) {
      return bitXor(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return bitXor(x, +y);
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }

      if (y instanceof BigNumber) {
        return x.xor(y);
      }

      // downgrade to Number
      return bitXor(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }

      if (x instanceof BigNumber) {
        return x.xor(y);
      }

      // downgrade to Number
      return bitXor(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('bitXor', math['typeof'](x), math['typeof'](y));
  };
};
