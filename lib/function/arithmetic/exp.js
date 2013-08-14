module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the exponent of a value
   *
   *     exp(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.exp = function exp (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('exp', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.exp(x);
    }
    if (isComplex(x)) {
      var r = Math.exp(x.re);
      return Complex.create(
          r * Math.cos(x.im),
          r * Math.sin(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.map(x, exp);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return exp(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('exp', x);
  };
};
