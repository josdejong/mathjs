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

      bigAcsch = util.bignumber.acosh_asinh_asech_acsch;

  /**
   * Calculate the hyperbolic arccosecant of a value,
   * defined as `acsch(x) = 1 / ln(x + sqrt(x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsch(x)
   *
   * Examples:
   *
   *    math.acsch(0.5);       // returns 0.4812118250596
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
      return 1 / Math.log(x + Math.sqrt(x*x + 1));
    }

    if (isComplex(x)) {
      return new Complex(
        1 / Math.log(x.re + Math.sqrt(x.re*x.re + 1)),
        1 / Math.log(x.im + Math.sqrt(x.im*x.im + 1))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function acsch is no angle');
      }
      return acsch(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acsch);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? Math.log(1 + Math.SQRT1_2) : Infinity;
    }

    if (x instanceof BigNumber) {
      return bigAcsch(x, 1, true);
    }

    throw new math.error.UnsupportedTypeError('acsch', math['typeof'](x));
  };
};
