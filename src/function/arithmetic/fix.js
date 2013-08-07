module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js').Complex,
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Round a value towards zero
   *
   *     fix(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.fix = function fix(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('fix', arguments.length, 1);
    }

    if (isNumber(x)) {
      return (x > 0) ? Math.floor(x) : Math.ceil(x);
    }

    if (isComplex(x)) {
      return Complex.create(
          (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
          (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      );
    }

    if (isCollection(x)) {
      return collection.map(x, fix);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return fix(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('fix', x);
  };
};
