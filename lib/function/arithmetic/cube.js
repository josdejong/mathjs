module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the cube of a value
   *
   *     x .* x .* x
   *     cube(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.cube = function cube(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('cube', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x * x * x;
    }

    if (isComplex(x)) {
      return math.multiply(math.multiply(x, x), x);
    }

    if (isCollection(x)) {
      return collection.map(x, cube);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return cube(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('cube', x);
  };
};
