module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      number = util.number,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
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
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @return {Number | BigNumber | Complex | Array | Matrix} res
   */
  math.sign = function sign(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sign', arguments.length, 1);
    }

    if (isNumber(x)) {
      return number.sign(x);
    }

    if (isComplex(x)) {
      var abs = Math.sqrt(x.re * x.re + x.im * x.im);
      return new Complex(x.re / abs, x.im / abs);
    }

    if (x instanceof BigNumber) {
      return new BigNumber(x.cmp(0));
    }

    if (isCollection(x)) {
      return collection.deepMap(x, sign);
    }

    if (isBoolean(x)) {
      return number.sign(x);
    }

    throw new math.error.UnsupportedTypeError('sign', x);
  };
};
