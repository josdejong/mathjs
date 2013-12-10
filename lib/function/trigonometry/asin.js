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
   * Calculate the inverse sine of a value
   *
   *     asin(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseSine.html
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
      var temp3;
      if (temp2 instanceof Complex) {
        temp3 = new Complex(
            temp2.re - im,
            temp2.im + re
        );
      }
      else {
        temp3 = new Complex(
            temp2 - im,
            re
        );
      }

      var temp4 = math.log(temp3);

      if (temp4 instanceof Complex) {
        return new Complex(temp4.im, -temp4.re);
      }
      else {
        return new Complex(0, -temp4);
      }
    }

    if (isCollection(x)) {
      return collection.deepMap(x, asin);
    }

    if (isBoolean(x)) {
      return Math.asin(x);
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return asin(util.number.toNumber(x));
    }

    throw new math.error.UnsupportedTypeError('asin', x);
  };
};
