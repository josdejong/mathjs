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

      bigTan = util.bignumber.tan_cot;

  /**
   * Calculate the tangent of a value. `tan(x)` is equal to `sin(x) / cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tan(x)
   *
   * Examples:
   *
   *    math.tan(0.5);                    // returns Number 0.5463024898437905
   *    math.sin(0.5) / math.cos(0.5);    // returns Number 0.5463024898437905
   *    math.tan(math.pi / 4);            // returns Number 1
   *    math.tan(math.unit(45, 'deg'));   // returns Number 1
   *
   * See also:
   *
   *    atan, sin, cos
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Tangent of x
   */
  math.tan = function tan(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('tan', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.tan(x);
    }

    if (isComplex(x)) {
      var den = Math.exp(-4.0 * x.im) +
          2.0 * Math.exp(-2.0 * x.im) * Math.cos(2.0 * x.re) +
          1.0;

      return new Complex(
          2.0 * Math.exp(-2.0 * x.im) * Math.sin(2.0 * x.re) / den,
          (1.0 - Math.exp(-4.0 * x.im)) / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tan is no angle');
      }
      return Math.tan(x.value);
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since tan(0) = 0
      return collection.deepMap(x, tan, true);
    }

    if (isBoolean(x) || x === null) {
      return Math.tan(x);
    }

    if (x instanceof BigNumber) {
      return bigTan(x, BigNumber, false);
    }

    throw new math.error.UnsupportedTypeError('tan', math['typeof'](x));
  };
};
