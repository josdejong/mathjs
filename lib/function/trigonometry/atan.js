module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the inverse tangent of a value
   *
   *     atan(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   *
   * @see http://mathworld.wolfram.com/InverseTangent.html
   */
  math.atan = function atan(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('atan', arguments.length, 1);
    }

    if (isNumBool(x)) {
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

      if (temp2 instanceof Complex) {
        return new Complex(
            -0.5 * temp2.im,
            0.5 * temp2.re
        );
      }
      else {
        return new Complex(
            0,
            0.5 * temp2
        );
      }
    }

    if (isCollection(x)) {
      return collection.map(x, atan);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return atan(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('atan', x);
  };
};
