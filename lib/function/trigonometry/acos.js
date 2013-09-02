module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
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
      throw new util.error.ArgumentsError('acos', arguments.length, 1);
    }

    if (isNumBool(x)) {
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
      return collection.map(x, acos);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return acos(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('acos', x);
  };
};
