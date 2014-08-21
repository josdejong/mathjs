'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse tangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan(x)
   *
   * Examples:
   *
   *    math.atan(0.5);           // returns Number 0.4636476090008061
   *    math.atan(math.tan(1.5)); // returns Number 1.5
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, asin, acos
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | Complex | Array | Matrix} The arc tangent of x
   */
  math.atan = function atan(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('atan', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.atan(x);
    }

    if (isComplex(x)) {
      // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
      var re = x.re;
      var im = x.im;
      var den = re * re + (1.0 - im) * (1.0 - im);

      var temp1 = new Complex(
          (1.0 - im * im - re * re) / den,
          (-2.0 * re) / den
      );
      var temp2 = math.log(temp1);

      return new Complex(
          -0.5 * temp2.im,
          0.5 * temp2.re
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, atan);
    }

    if (isBoolean(x) || x === null) {
      return Math.atan(x);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return atan(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('atan', math['typeof'](x));
  };
};
