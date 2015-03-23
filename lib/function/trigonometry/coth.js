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

      bigCoth = util.bignumber.tanh_coth;

  /**
   * Calculate the hyperbolic cotangent of a value,
   * defined as `coth(x) = 1 / tanh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.coth(x)
   *
   * Examples:
   *
   *    // coth(x) = 1 / tanh(x)
   *    math.coth(2);         // returns 1.0373147207275482
   *    1 / math.tanh(2);     // returns 1.0373147207275482
   *
   * See also:
   *
   *    sinh, tanh, cosh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic cotangent of x
   */
  math.coth = function coth(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('coth', arguments.length, 1);
    }

    if (isNumber(x)) {
      var e = Math.exp(2 * x);
      return (e + 1) / (e - 1);
    }

    if (isComplex(x)) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re - 1) * (re - 1) + im * im;
      return new Complex(
        ((re + 1) * (re - 1) + im * im) / den,
        -2 * im / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function coth is no angle');
      }
      return coth(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, coth);
    }

    if (isBoolean(x) || x === null) {
      return coth(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      return bigCoth(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('coth', math['typeof'](x));
  };
};
