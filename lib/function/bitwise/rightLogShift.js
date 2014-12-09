'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isBoolean = util['boolean'].isBoolean,
      isNumber = util.number.isNumber,
      isString = util.string.isString,
      isCollection = collection.isCollection;

  /**
   * Bitwise right logical shift one value by another values, `x >>> y`.
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
   * @param  {Number | Boolean | String | Array | Matrix | null} x Value to be shifted
   * @param  {Number | Boolean | String | null} y Amount of shifts
   * @return {Integer | Array | Matrix} `x` zero-filled shifted right `y` times
   */
  math.rightLogShift = function rightLogShift(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('rightLogShift', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return x >>> y;
    }

    if (isCollection(x) && isNumber(y)) {
      return collection.deepMap2(x, y, rightLogShift);
    }

    if (isString(x)) {
      return rightLogShift((config.number === 'bignumber')
                           ? new BigNumber(x)
                           : +x, y);
    }
    if (isString(y)) {
      return rightLogShift(x, (config.number === 'bignumber')
                              ? new BigNumber(y)
                              : +y);
    }

    if (isBoolean(x) || x === null) {
      return rightLogShift(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return rightLogShift(x, +y);
    }

    throw new math.error.UnsupportedTypeError('rightLogShift', math['typeof'](x), math['typeof'](y));
  };
};
