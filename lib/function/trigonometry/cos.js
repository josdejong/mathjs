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

      bigCos = util.bignumber.cos_sin_sec_csc;

  /**
   * Calculate the cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cos(x)
   *
   * Examples:
   *
   *    math.cos(2);                      // returns Number -0.4161468365471422
   *    math.cos(math.pi / 4);            // returns Number  0.7071067811865475
   *    math.cos(math.unit(180, 'deg'));  // returns Number -1
   *    math.cos(math.unit(60, 'deg'));   // returns Number  0.5
   *
   *    var angle = 0.2;
   *    math.pow(math.sin(angle), 2) + math.pow(math.cos(angle), 2); // returns Number ~1
   *
   * See also:
   *
   *    cos, tan
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Cosine of x
   */
  math.cos = function cos(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('cos', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.cos(x);
    }

    if (isComplex(x)) {
      // cos(z) = (exp(iz) + exp(-iz)) / 2
      return new Complex(
          Math.cos(x.re) * math.cosh(-x.im),
          Math.sin(x.re) * math.sinh(-x.im)
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cos is no angle');
      }
      return Math.cos(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, cos);
    }

    if (isBoolean(x) || x === null) {
      return Math.cos(x);
    }

    if (x instanceof BigNumber) {
      return bigCos(x, BigNumber, 0, false);
    }

    throw new math.error.UnsupportedTypeError('cos', math['typeof'](x));
  };
};
