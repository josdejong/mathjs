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

      bigCot = util.bignumber.tan_cot;

  /**
   * Calculate the cotangent of a value. `cot(x)` is defined as `1 / tan(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cot(x)
   *
   * Examples:
   *
   *    math.cot(2);      // returns Number -0.45765755436028577
   *    1 / math.tan(2);  // returns Number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Cotangent of x
   */
  math.cot = function cot(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('cot', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 1 / Math.tan(x);
    }

    if (isComplex(x)) {
      var den = Math.exp(-4.0 * x.im) -
          2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) + 1.0;

      return new Complex(
          2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
          (Math.exp(-4.0 * x.im) - 1.0) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return 1 / Math.tan(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cot);
    }

    if (isBoolean(x) || x === null) {
      return cot(+x);
    }

    if (x instanceof BigNumber) {
      return bigCot(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('cot', math['typeof'](x));
  };
};
