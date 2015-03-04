'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection,

      bigArcSec = util.bignumber.arccos_arcsec;

  /**
   * Calculate the inverse secant of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asec(x)
   *
   * Examples:
   *
   *    math.asec(0.5);           // returns 1.0471975511965979
   *    math.asec(math.sec(1.5)); // returns 1.5
   *
   *    math.asec(2);             // returns 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    acos, acot, acsc
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} The arc secant of x
   */
  math.asec = function asec(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('asec', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x <= -1 || x >= 1) {
        return Math.acos(1 / x);
      }
      return asec(new Complex(x, 0));
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return new Complex(0, Infinity);
      }

      var den = x.re*x.re + x.im*x.im;
      x = (den != 0)
        ? new Complex(
            x.re =  x.re / den,
            x.im = -x.im / den)
        : new Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0);

      return math.acos(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, asec);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0 : new Complex(0, Infinity);
    }

    if (x instanceof BigNumber) {
      return bigArcSec(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('asec', math['typeof'](x));
  };
};
