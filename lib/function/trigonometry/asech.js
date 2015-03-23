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

      bigAsech = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `asech(x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asech(x)
   *
   * Examples:
   *
   *    math.asech(0.5);       // returns 1.3169578969248166
   *
   * See also:
   *
   *    acsch, acoth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  math.asech = function asech(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('asech', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x <= 1 && x >= -1) {
        x = 1 / x;

        var ret = Math.sqrt(x*x - 1);
        if (x > 0) {
          return Math.log(ret + x);
        }

        return new Complex(Math.log(ret - x), Math.PI);
      }

      return asech(new Complex(x, 0));
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return new Complex(Infinity, 0);
      }

      // acsch(z) = -i*asinh(1/z)
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

      return math.acosh(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, asech);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0 : Infinity;
    }

    if (x instanceof BigNumber) {
      return bigAsech(x, BigNumber, false, true);
    }

    throw new math.error.UnsupportedTypeError('asech', math['typeof'](x));
  };
};
