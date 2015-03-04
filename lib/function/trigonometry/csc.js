'use strict';

module.exports = function (math, config) {
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

      bigCsc = util.bignumber.cos_sin_sec_csc;

  /**
   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csc(x)
   *
   * Examples:
   *
   *    math.csc(2);      // returns Number 1.099750170294617
   *    1 / math.sin(2);  // returns Number 1.099750170294617
   *
   * See also:
   *
   *    sin, sec, cot
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Cosecant of x
   */
  math.csc = function csc(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('csc', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 1 / Math.sin(x);
    }

    if (isComplex(x)) {
      // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
      var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) -
          0.5 * Math.cos(2.0 * x.re);

      return new Complex (
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csc is no angle');
      }
      return 1 / Math.sin(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, csc);
    }

    if (isBoolean(x) || x === null) {
      return csc(+x);
    }

    if (x instanceof BigNumber) {
      return bigCsc(x, BigNumber, 1, true);
    }

    throw new math.error.UnsupportedTypeError('csc', math['typeof'](x));
  };
};
