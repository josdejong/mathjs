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

      bigLeftShift = util.bignumber.leftShift;

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
  math.leftShift = function leftShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('leftShift', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        if (!isInteger(x) || !isInteger(y)) {
          throw new Error('Parameters in function leftShift must be integer numbers');
        }

        return x << y;
      }

      if (y instanceof BigNumber) {
        return bigLeftShift(BigNumber.convert(x), y);
      }
    }
    if (isNumber(y)) {
      if (isFinite(y) && !isInteger(y)) {
        throw new Error('Parameters in function leftShift must be integer numbers');
      }

      if (x instanceof BigNumber) {
        if (x.isFinite() && !x.isInteger()) {
          throw new Error('Parameters in function leftShift must be integer numbers');
        }

        if (x.isNaN() || isNaN(y) || y < 0) {
          return new BigNumber(NaN);
        }

        if (y == 0 || x.isZero()) {
          return x;
        }
        if (y == Infinity && !x.isFinite()) {
          return new BigNumber(NaN);
        }

        // Math.pow(2, y) is fully precise for y < 55, and fast
        if (y < 55) {
          return x.times(Math.pow(2, y) + '');
        }

        y = BigNumber.convert(y);
        return bigLeftShift(x, y);
      }
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, leftShift);
    }

    if (isBoolean(x) || x === null) {
      return leftShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return leftShift(x, +y);
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber) {
        return bigLeftShift(x, y);
      }

      // downgrade to Number
      return leftShift(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // x is probably incompatible with BigNumber
      return leftShift(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('leftShift', math['typeof'](x), math['typeof'](y));
  };
};
