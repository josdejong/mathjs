module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      object = util.object,
      isNumBool = util.number.isNumBool,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the complex conjugate of a complex value.
   * If x = a+bi, the complex conjugate is a-bi.
   *
   *     conj(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix | Boolean} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.conj = function conj(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('conj', arguments.length, 1);
    }

    if (isNumBool(x)) {
      return x;
    }

    if (isComplex(x)) {
      return new Complex(x.re, -x.im);
    }

    if (isCollection(x)) {
      return collection.map(x, conj);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return conj(x.valueOf());
    }

    // return a clone of the value for non-complex values
    return object.clone(x);
  };
};
