module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
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
      throw new util.error.ArgumentsError('asin', arguments.length, 1);
    }

    if (isNumBool(x)) {
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
      return collection.map(x, asin);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return asin(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('asin', x);
  };
};
