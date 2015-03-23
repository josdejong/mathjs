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

      bigAcsch = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arccosecant of a value,
   * defined as `acsch(x) = ln(1/x + sqrt(1/x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsch(x)
   *
   * Examples:
   *
   *    math.acsch(0.5);       // returns 1.4436354751788103
   *
   * See also:
   *
   *    asech, acoth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccosecant of x
   */
  math.acsch = function acsch(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acsch', arguments.length, 1);
    }

    if (isNumber(x)) {
      x = 1 / x;
      return Math.log(x + Math.sqrt(x*x + 1));
    }

    if (isComplex(x)) {
      if (x.im == 0) {
        x = (x.re != 0)
          ? Math.log(x.re + Math.sqrt(x.re*x.re + 1))
          : Infinity;
        return new Complex(x, 0);
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

      return math.asinh(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acsch);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0.881373587019543 : Infinity;
    }

    if (x instanceof BigNumber) {
      return bigAcsch(x, BigNumber, true, true);
    }

    throw new math.error.UnsupportedTypeError('acsch', math['typeof'](x));
  };
};
