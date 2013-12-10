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
   * Calculate the square root of a value
   *
   *     sqrt(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sqrt', arguments.length, 1);
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
        return new Complex(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
      else {
        return new Complex(
            0.5 * Math.sqrt(2.0 * (r + x.re)),
            -0.5 * Math.sqrt(2.0 * (r - x.re))
        );
      }
    }

    if (x instanceof BigNumber) {
      return x.sqrt();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sqrt);
    }

    if (isBoolean(x)) {
      return sqrt(+x);
    }

    throw new math.error.UnsupportedTypeError('sqrt', x);
  };
};
