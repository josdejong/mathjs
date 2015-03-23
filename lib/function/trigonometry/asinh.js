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

      bigAsinh = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arcsine of a value,
   * defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asinh(x)
   *
   * Examples:
   *
   *    math.asinh(0.5);       // returns 0.48121182505960347
   *
   * See also:
   *
   *    acosh, atanh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arcsine of x
   */
  math.asinh = function asinh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('asinh', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.log(Math.sqrt(x*x + 1) + x);
    }

    if (isComplex(x)) {
      // asinh(z) = (-asin((z.im, -z.re)).im, asin((z.im, -z.re)).re)
      var temp = x.im;
      x.im = -x.re;
      x.re = temp;

      var asin = math.asin(x);

      // restore original values
      x.re = -x.im;
      x.im = temp;

      temp = asin.re;
      asin.re = -asin.im;
      asin.im = temp;

      return asin;
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since asinh(0) = 0
      return collection.deepMap(x, asinh, true);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0.881373587019543 : 0;
    }

    if (x instanceof BigNumber) {
      return bigAsinh(x, BigNumber, true, false);
    }

    throw new math.error.UnsupportedTypeError('asinh', math['typeof'](x));
  };
};
