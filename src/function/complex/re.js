module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      object = util.object,
      isNumber = util.number.isNumber,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the real part of a complex number.
   *
   *     re(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Array | Matrix} re
   */
  math.re = function re(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x;
    }

    if (isComplex(x)) {
      return x.re;
    }

    if (isCollection(x)) {
      return collection.map(x, re);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return re(x.valueOf());
    }

    // return a clone of the value itself for all non-complex values
    return object.clone(x);
  };
};
