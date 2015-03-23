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

      bigAcosh = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acosh(x)
   *
   * Examples:
   *
   *    math.acosh(1.5);       // returns 0.9624236501192069
   *
   * See also:
   *
   *    cosh, asinh, atanh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccosine of x
   */
  math.acosh = function acosh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acosh', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= 1) {
        return Math.log(Math.sqrt(x*x - 1) + x);
      }
      if (x <= -1) { 
        return new Complex(Math.log(Math.sqrt(x*x - 1) - x), Math.PI);
      }
      return acosh(new Complex(x, 0));
    }

    if (isComplex(x)) {
      // acosh(z) = (-acos(z).im,  acos(z).re)   for acos(z).im <= 0
      //            ( acos(z).im, -acos(z).re)   otherwise
      var temp;
      var acos = math.acos(x);
      if (acos.im <= 0) {
        temp = acos.re;
        acos.re = -acos.im;
        acos.im = temp;
      } else {
        temp = acos.im;
        acos.im = -acos.re;
        acos.re = temp;
      }

      return acos;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acosh);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0 : new Complex(0, 1.5707963267948966);
    }

    if (x instanceof BigNumber) {
      return bigAcosh(x, BigNumber, false, false);
    }

    throw new math.error.UnsupportedTypeError('acosh', math['typeof'](x));
  };
};
