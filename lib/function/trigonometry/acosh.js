'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection,

      bigAcosh = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `acosh(x) = ln(x + sqrt(x^2 - 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acosh(x)
   *
   * Examples:
   *
   *    math.acosh(1.5);       // returns 0.962423650119206
   *
   * See also:
   *
   *    asinh, atanh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccosine of x
   */
  math.acosh = function acosh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acosh', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.log(x + Math.sqrt(x*x - 1));
    }

    if (isComplex(x)) {
      return new Complex(
        Math.log(x.re + Math.sqrt(x.re*x.re - 1)),
        Math.log(x.im + Math.sqrt(x.im + 1)*Math.sqrt(x.im - 1))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function acosh is no angle');
      }
      return acosh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acosh);
    }

    if (isBoolean(x) || x === null) {
      return 0;
    }

    if (x instanceof BigNumber) {
      return bigAcosh(x, 0, false);
    }

    throw new math.error.UnsupportedTypeError('acosh', math['typeof'](x));
  };
};
