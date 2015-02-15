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

      bigAcoth = util.bignumber.atanh_acoth;

  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = 2 / ln((1 + x)/(1 - x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5);       // returns 0.4812118250596
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  math.acoth = function acoth(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acoth', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 2 / Math.log((1 + x)/(1 - x));
    }

    if (isComplex(x)) {
      return new Complex(
        2 / Math.log((1 + x.re)/(1 - x.re)),
        2 / (Math.log(1 + x.im) - Math.log(1 - x.im))
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function acoth is no angle');
      }
      return acoth(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acoth);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? Infinity : 0;
    }

    if (x instanceof BigNumber) {
      return bigAcoth(x, true);
    }

    throw new math.error.UnsupportedTypeError('acoth', math['typeof'](x));
  };
};
