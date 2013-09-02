module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the argument of a complex value.
   * If x = a + bi, the argument is computed as atan2(b, a).
   *
   *     arg(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} res
   */
  math.arg = function arg(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('arg', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.atan2(0, x);
    }

    if (isComplex(x)) {
      return Math.atan2(x.im, x.re);
    }

    if (isCollection(x)) {
      return collection.map(x, arg);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return arg(x.valueOf());
    }

    // handle other types just as non-complex values
    return math.atan2(0, x);
  };
};
