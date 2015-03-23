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

      bigArcCsc = util.bignumber.arcsin_arccsc;

  /**
   * Calculate the inverse cosecant of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsc(x)
   *
   * Examples:
   *
   *    math.acsc(0.5);           // returns Number 0.5235987755982989
   *    math.acsc(math.csc(1.5)); // returns Number ~1.5
   *
   *    math.acsc(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    csc, asin, asec
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | Complex | Array | Matrix} The arc cosecant of x
   */
  math.acsc = function acsc(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acsc', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x <= -1 || x >= 1) {
        return Math.asin(1 / x);
      }
      return acsc(new Complex(x, 0));
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return new Complex(halfPi, Infinity);
      }

      var den = x.re*x.re + x.im*x.im;
      x = (den != 0)
        ? new Complex(
            x.re =  x.re / den,
            x.im = -x.im / den)
        : new Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0);

      return math.asin(x);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acsc);
    }

    if (isBoolean(x) || x === null) {
      return (x) ? halfPi : new Complex(halfPi, Infinity);
    }

    if (x instanceof BigNumber) {
      return bigArcCsc(x, BigNumber, true);
    }

    throw new math.error.UnsupportedTypeError('acsc', math['typeof'](x));
  };

  var halfPi = 1.5707963267948966;
};
