'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isNumber = util.number.isNumber,
      isCollection = collection.isCollection,

      bigRightShift = util.bignumber.rightShift;

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
  math.rightArithShift = function rightArithShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('rightArithShift', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        if (!isInteger(x) || !isInteger(y)) {
          throw new Error('Parameters in function rightArithShift must be integer numbers');
        }

        return x >> y;
      }

      if (y instanceof BigNumber) {
        return bigRightShift(BigNumber.convert(x), y);
      }
    }
    if (isNumber(y)) {
      if (isFinite(y) && !isInteger(y)) {
        throw new Error('Parameters in function rightArithShift must be integer numbers');
      }

      if (x instanceof BigNumber) {
        if (x.isFinite() && !x.isInteger()) {
          throw new Error('Parameters in function rightArithShift must be integer numbers');
        }

        if (x.isNaN() || isNaN(y) || y < 0) {
          return new BigNumber(NaN);
        }
        if (y == Infinity) {
          if (x.isNegative()) {
            return new BigNumber(-1);
          }
          if (!x.isFinite()) {
            return new BigNumber(NaN);
          }
          return new BigNumber(0);
        }

        // Math.pow(2, y) is fully precise for y < 55, and fast
        if (y < 55) {
          return x.div(Math.pow(2, y) + '').floor();
        }

        y = BigNumber.convert(y);
        return bigRightShift(x, y);
      }
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, rightArithShift);
    }

    if (isBoolean(x) || x === null) {
      return rightArithShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return rightArithShift(x, +y);
    }

    if (x instanceof BigNumber) {
      if (y instanceof BigNumber) {
        return bigRightShift(x, y);
      }

      // downgrade to Number
      return rightArithShift(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // x is probably incompatible with BigNumber
      return rightArithShift(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('rightArithShift', math['typeof'](x), math['typeof'](y));
  };
};
