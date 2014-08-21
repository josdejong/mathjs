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
      isCollection = collection.isCollection;

  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5);                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5);  // returns 0.46211715726000974
   *    1 / math.coth(0.5);               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic tangent of x
   */
  math.tanh = function tanh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('tanh', arguments.length, 1);
    }

    if (isNumber(x)) {
      var e = Math.exp(2 * x);
      return (e - 1) / (e + 1);
    }

    if (isComplex(x)) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re + 1) * (re + 1) + im * im;
      return new Complex(
        ((re - 1) * (re + 1) + im * im) / den,
        im * 2 / den
      );
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tanh is no angle');
      }
      return tanh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, tanh);
    }

    if (isBoolean(x) || x === null) {
      return tanh(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return tanh(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('tanh', math['typeof'](x));
  };
};
