module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the imaginary part of a complex number.
   *
   *     im(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Array | Matrix} im
   */
  math.im = function im(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('im', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return 0;
    }

    if (isComplex(x)) {
      return x.im;
    }

    if (isCollection(x)) {
      return collection.map(x, im);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return im(x.valueOf());
    }

    // return 0 for all non-complex values
    return 0;
  };
};
