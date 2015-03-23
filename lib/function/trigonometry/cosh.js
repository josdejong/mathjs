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

      bigCosh = util.bignumber.cosh_sinh_csch_sech;

  /**
   * Calculate the hyperbolic cosine of a value,
   * defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cosh(x)
   *
   * Examples:
   *
   *    math.cosh(0.5);       // returns Number 1.1276259652063807
   *
   * See also:
   *
   *    sinh, tanh
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Hyperbolic cosine of x
   */
  math.cosh = function cosh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('cosh', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (Math.exp(x) + Math.exp(-x)) / 2;
    }

    if (isComplex(x)) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new Complex(Math.cos(x.im) * (ep + en) / 2, Math.sin(x.im) * (ep - en) / 2);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cosh is no angle');
      }
      return cosh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cosh);
    }

    if (isBoolean(x) || x === null) {
      return cosh(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      return bigCosh(x, BigNumber, false, false);
    }

    throw new math.error.UnsupportedTypeError('cosh', math['typeof'](x));
  };
};
