module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards minus infinity
   *
   *     floor(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.floor = function floor(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('floor', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return Math.floor(x);
    }

    if (isComplex(x)) {
      return new Complex (
          Math.floor(x.re),
          Math.floor(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.map(x, floor);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return floor(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('floor', x);
  };
};
