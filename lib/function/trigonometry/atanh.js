'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection,

      bigAtanh = util.bignumber.atanh_acoth;

  /**
   * Calculate the hyperbolic arctangent of a value,
   * defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atanh(x)
   *
   * Examples:
   *
   *    math.atanh(0.5);       // returns 0.4812118250596
   *
   * See also:
   *
   *    acosh, asinh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  math.atanh = function atanh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('atanh', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.log((1 + x)/(1 - x)) / 2;
    }

    if (isComplex(x)) {
      return new Complex(
        Math.log((1 + x.re)/(1 - x.re)) / 2,
        (Math.log(1 + x.im) - Math.log(1 - x.im)) / 2
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function atanh is no angle');
      }
      return atanh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, atanh);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? Infinity : 0;
    }

    if (x instanceof BigNumber) {
      return bigAtanh(x, false);
    }

    throw new math.error.UnsupportedTypeError('atanh', math['typeof'](x));
  };
};
