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

      bigArcSin = util.bignumber.arcsin_arccsc;

  /**
   * Calculate the inverse sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asin(x)
   *
   * Examples:
   *
   *    math.asin(0.5);           // returns Number 0.5235987755982989
   *    math.asin(math.sin(1.5)); // returns Number ~1.5
   *
   *    math.asin(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    sin, atan, acos
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} The arc sine of x
   */
  math.asin = function asin(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('asin', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= -1 && x <= 1) {
        return Math.asin(x);
      }
      else {
        return asin(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      // asin(z) = -i*log(iz + sqrt(1-z^2))
      var re = x.re;
      var im = x.im;
      var temp1 = new Complex(
          im * im - re * re + 1.0,
          -2.0 * re * im
      );
      var temp2 = math.sqrt(temp1);
      var temp3 = new Complex(
          temp2.re - im,
          temp2.im + re
      );
      var temp4 = math.log(temp3);

      return new Complex(temp4.im, -temp4.re);
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since asin(0) = 0
      return collection.deepMap(x, asin, true);
    }

    if (isBoolean(x) || x === null) {
      return Math.asin(x);
    }

    if (x instanceof BigNumber) {
      return bigArcSin(x, BigNumber, false);
    }

    throw new math.error.UnsupportedTypeError('asin', math['typeof'](x));
  };
};
