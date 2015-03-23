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

      bigSec = util.bignumber.cos_sin_sec_csc;

  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2);      // returns Number -2.4029979617223822
   *    1 / math.cos(2);  // returns Number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Secant of x
   */
  math.sec = function sec(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sec', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 1 / Math.cos(x);
    }

    if (isComplex(x)) {
      // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
      var den = 0.25 * (Math.exp(-2.0 * x.im) + Math.exp(2.0 * x.im)) +
          0.5 * Math.cos(2.0 * x.re);

      return new Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
          0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sec is no angle');
      }
      return 1 / Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sec);
    }

    if (isBoolean(x) || x === null) {
      return sec(+x);
    }

    if (x instanceof BigNumber) {
      return bigSec(x, BigNumber, 0, true);
    }

    throw new math.error.UnsupportedTypeError('sec', math['typeof'](x));
  };
};
