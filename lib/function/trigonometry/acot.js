'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection,

      bigArcCot = util.bignumber.arctan_arccot;

  /**
   * Calculate the inverse cotangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acot(x)
   *
   * Examples:
   *
   *    math.acot(0.5);           // returns Number 0.4636476090008061
   *    math.acot(math.cot(1.5)); // returns Number 1.5
   *
   *    math.acot(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    cot, atan
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | Complex | Array | Matrix} The arc cotangent of x
   */
  math.acot = function acot(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acot', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (x) ? Math.atan(1 / x) : halfPi;
    }

    if (isComplex(x)) {
      if (x.im == 0) {
        return new Complex(x.re ? Math.atan(1 / x.re) : halfPi, 0);
      }

      var den = x.re*x.re + x.im*x.im;
      x = (den != 0)
        ? new Complex(
            x.re =  x.re / den,
            x.im = -x.im / den)
        : new Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0);

      return math.atan(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acot);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? 0.7853981633974483 : halfPi;
    }

    if (x instanceof BigNumber) {
      return bigArcCot(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('acot', math['typeof'](x));
  };

  var halfPi = 1.5707963267948966;
};
