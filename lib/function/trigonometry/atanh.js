'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = math.collection,

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
   *    math.atanh(0.5);       // returns 0.5493061443340549
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
      if (x <= 1 && x >= -1) {
        return Math.log((1 + x)/(1 - x)) / 2;
      }
      return atanh(new Complex(x, 0));
    }

    if (isComplex(x)) {
      // x.im should equal -pi / 2 in this case
      var noIM = x.re > 1 && x.im == 0;

      var oneMinus = 1 - x.re;
      var onePlus = 1 + x.re;
      var den = oneMinus*oneMinus + x.im*x.im;
      x = (den != 0)
        ? new Complex(
            (onePlus*oneMinus - x.im*x.im) / den,
            (x.im*oneMinus + onePlus*x.im) / den
          )
        : new Complex(
            (x.re != -1) ? (x.re / 0) : 0,
            (x.im != 0) ? (x.im / 0) : 0
          );

      var temp = x.re;
      x.re = Math.log(Math.sqrt(x.re*x.re + x.im*x.im)) / 2;
      x.im = Math.atan2(x.im, temp) / 2;

      if (noIM) {
        x.im = -x.im;
      }
      return x;
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since atanh(0) = 0
      return collection.deepMap(x, atanh, true);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? Infinity : 0;
    }

    if (x instanceof BigNumber) {
      return bigAtanh(x, BigNumber, false);
    }

    throw new math.error.UnsupportedTypeError('atanh', math['typeof'](x));
  };
};
