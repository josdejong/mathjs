module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the 10-base logarithm of a value
   *
   *     log10(x)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {Number | Boolean | Complex | Array | Matrix} x
   * @return {Number | Complex | Array | Matrix} res
   */
  math.log10 = function log10(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('log10', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= 0) {
        return Math.log(x) / Math.LN10;
      }
      else {
        // negative value -> complex value computation
        return log10(new Complex(x, 0));
      }
    }

    if (x instanceof BigNumber) {
      // TODO: implement BigNumber support
      // downgrade to Number
      return log10(util.number.toNumber(x));
    }

    if (isComplex(x)) {
      return new Complex (
          Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
          Math.atan2(x.im, x.re) / Math.LN10
      );
    }

    if (isCollection(x)) {
      return collection.deepMap(x, log10);
    }

    if (isBoolean(x)) {
      return log10(+x);
    }

    throw new math.error.UnsupportedTypeError('log10', x);
  };
};
