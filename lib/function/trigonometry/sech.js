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

      bigSech = util.bignumber.cosh_sinh_csch_sech;

  /**
   * Calculate the hyperbolic secant of a value,
   * defined as `sech(x) = 1 / cosh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sech(x)
   *
   * Examples:
   *
   *    // sech(x) = 1/ cosh(x)
   *    math.sech(0.5);       // returns 0.886818883970074
   *    1 / math.cosh(0.5);   // returns 0.886818883970074
   *
   * See also:
   *
   *    cosh, csch, coth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic secant of x
   */
  math.sech = function sech(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sech', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 2 / (Math.exp(x) + Math.exp(-x));
    }

    if (isComplex(x)) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep + en);
      var im = Math.sin(x.im) * (ep - en);
      var den = re * re + im * im;
      return new Complex(2 * re / den, -2 * im / den);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sech is no angle');
      }
      return sech(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sech);
    }

    if (isBoolean(x) || x === null) {
      return sech(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      return bigSech(x, BigNumber, false, true);
    }

    throw new math.error.UnsupportedTypeError('sech', math['typeof'](x));
  };
};
