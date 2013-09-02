module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the 10-base logarithm of a value
   *
   *     log10(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.log10 = function log10(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('log10', arguments.length, 1);
    }

    if (isNumBool(x)) {
      if (x >= 0) {
        return Math.log(x) / Math.LN10;
      }
      else {
        // negative value -> complex value computation
        return log10(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      return new Complex (
          Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
          Math.atan2(x.im, x.re) / Math.LN10
      );
    }

    if (isCollection(x)) {
      return collection.map(x, log10);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return log10(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('log10', x);
  };
};
