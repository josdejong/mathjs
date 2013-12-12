module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse cosine of a value
   *
   *     acos(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseCosine.html
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
      var temp3;
      if (temp2 instanceof Complex) {
        temp3 = new Complex(
            temp2.re - x.im,
            temp2.im + x.re
        )
      }
      else {
        temp3 = new Complex(
            temp2 - x.im,
            x.re
        )
      }
      var temp4 = math.log(temp3);

      // 0.5*pi = 1.5707963267948966192313216916398
      if (temp4 instanceof Complex) {
        return new Complex(
            1.57079632679489661923 - temp4.im,
            temp4.re
        );
      }
      else {
        return new Complex(
            1.57079632679489661923,
            temp4
        );
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, acos);
    }

    if (isBoolean(x)) {
      return Math.acos(x);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return acos(util.number.toNumber(x));
    }

    throw new math.error.UnsupportedTypeError('acos', x);
  };
};
