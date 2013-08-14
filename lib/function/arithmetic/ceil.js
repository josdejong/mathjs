module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Round a value towards plus infinity
   *
   *     ceil(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.ceil = function ceil(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('ceil', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.ceil(x);
    }

    if (isComplex(x)) {
      return Complex.create (
          Math.ceil(x.re),
          Math.ceil(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.map(x, ceil);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return ceil(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('ceil', x);
  };
};
