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

      bigSinh = util.bignumber.cosh_sinh;

  /**
   * Calculate the hyperbolic sine of a value,
   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sinh(x)
   *
   * Examples:
   *
   *    math.sinh(0.5);       // returns Number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Hyperbolic sine of x
   */
  math.sinh = function sinh(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sinh', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (Math.abs(x) < 1) {
        return x + (x * x * x) / 6 + (x * x * x * x * x) / 120;
      } else {
        return (Math.exp(x) - Math.exp(-x)) / 2;
      }
    }

    if (isComplex(x)) {
      var cim = Math.cos(x.im);
      var sim = Math.sin(x.im);
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new Complex(cim * (ep - en) / 2, sim * (ep + en) / 2);
    }

    if (isUnit(x)) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sinh is no angle');
      }
      return sinh(x.value);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sinh);
    }

    if (isBoolean(x) || x === null) {
      return sinh(x ? 1 : 0);
    }

    if (x instanceof BigNumber) {
      return bigSinh(x, 1);
    }

    throw new math.error.UnsupportedTypeError('sinh', math['typeof'](x));
  };
};
