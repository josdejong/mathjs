module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the square of a value
   *
   *     x .* x
   *     square(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.square = function square(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('square', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x * x;
    }

    if (isComplex(x)) {
      return math.multiply(x, x);
    }

    if (isCollection(x)) {
      return collection.map(x, square);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return square(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('square', x);
  };
};
