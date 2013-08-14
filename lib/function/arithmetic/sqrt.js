module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the square root of a value
   *
   *     sqrt(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= 0) {
        return Math.sqrt(x);
      }
      else {
        return sqrt(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      var r = Math.sqrt(x.re * x.re + x.im * x.im);
      if (x.im >= 0) {
        return Complex.create(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
      else {
        return Complex.create(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            -0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
    }

    if (isCollection(x)) {
      return collection.map(x, sqrt);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sqrt(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sqrt', x);
  };
};
