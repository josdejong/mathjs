module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      collection = require('../../type/collection.js'),

      number = util.number,
      isNumber = util.number.isNumber,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the sign of a value.
   *
   *     sign(x)
   *
   * The sign of a value x is 1 when x > 1, -1 when x < 0, and 0 when x == 0
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.sign = function sign(x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('sign', arguments.length, 1);
    }

    if (isNumber(x)) {
      return number.sign(x);
    }

    if (isComplex(x)) {
      var abs = Math.sqrt(x.re * x.re + x.im * x.im);
      return Complex.create(x.re / abs, x.im / abs);
    }

    if (isCollection(x)) {
      return collection.map(x, sign);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive value
      return sign(x.valueOf());
    }

    throw new util.error.UnsupportedTypeError('sign', x);
  };
};
