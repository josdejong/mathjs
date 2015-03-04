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

      bigAcoth = util.bignumber.atanh_acoth;

  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5);       // returns 0.8047189562170503
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  math.acoth = function acoth(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acoth', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= 1 || x <= -1) {
        return isFinite(x) ? (Math.log((x+1)/x) + Math.log(x/(x-1))) / 2 : 0;
      }
      return (x) ? acoth(new Complex(x, 0)) : new Complex(0, halfPi);
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return new Complex(0, halfPi);
      }

      // acoth(z) = -i*atanh(1/z)
      var den = x.re*x.re + x.im*x.im;
      x = (den != 0)
        ? new Complex(
            x.re / den,
           -x.im / den
          )
        : new Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0
          );

      return math.atanh(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acoth);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? Infinity : new Complex(0, halfPi);
    }

    if (x instanceof BigNumber) {
      return bigAcoth(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('acoth', math['typeof'](x));
  };

  var halfPi = 1.5707963267948966;
};
