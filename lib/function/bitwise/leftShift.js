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
      isCollection = collection.isCollection,

      bigLeftShift = util.bignumber.leftShift;

  /**
   * Bitwise left logical shift one value by another values, `x << y`.
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
   * @param  {Number | BigNumber | Boolean | String | Array | Matrix | null} x Value to be shifted
   * @param  {Number | BigNumber | Boolean | String | null} y Amount of shifts
   * @return {Number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  math.leftShift = function leftShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('leftShift', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return x << y;
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, leftShift);
    }

    if (isString(x)) {
      return leftShift((config.number === 'bignumber')
                       ? new BigNumber(x)
                       : +x, y);
    }
    if (isString(y)) {
      return leftShift(x, (config.number === 'bignumber')
                          ? new BigNumber(y)
                          : +y);
    }

    if (isBoolean(x) || x === null) {
      return leftShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return leftShift(x, +y);
    }

    if (x instanceof BigNumber) {
      if (isNumber(y) || y instanceof BigNumber) {
        return bigLeftShift(x, y);
      }

      // downgrade to Number
      return leftShift(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return bigLeftShift(x, y);
      }

      // downgrade to Number
      return leftShift(x, y.toNumber());
    }

    throw new math.error.UnsupportedTypeError('leftShift', math['typeof'](x), math['typeof'](y));
  };
};
