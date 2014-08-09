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
   * Calculate the inverse cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acos(x)
   *
   * Examples:
   *
   *    math.acos(0.5);           // returns Number 1.0471975511965979
   *    math.acos(math.cos(1.5)); // returns Number 1.5
   *
   *    math.acos(2);             // returns Complex 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    cos, atan, asin
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} The arc cosine of x
   */
  math.acos = function acos(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('acos', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= -1 && x <= 1) {
        return Math.acos(x);
      }
      else {
        return acos(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
      var temp1 = new Complex(
          x.im * x.im - x.re * x.re + 1.0,
          -2.0 * x.re * x.im
      );
      var temp2 = math.sqrt(temp1);
      var temp3 = new Complex(
          temp2.re - x.im,
          temp2.im + x.re
      );
      var temp4 = math.log(temp3);

      // 0.5*pi = 1.5707963267948966192313216916398
      return new Complex(
          1.57079632679489661923 - temp4.im,
          temp4.re
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acos);
    }

    if (isBoolean(x) || x === null) {
      return Math.acos(x);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return acos(x.toNumber());
    }

    throw new math.error.UnsupportedTypeError('acos', math['typeof'](x));
  };
};
