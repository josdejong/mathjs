'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the 10-base of a value. This is the same as calculating `log(x, 10)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log10(x)
   *
   * Examples:
   *
   *    math.log10(0.00001);            // returns -5
   *    math.log10(10000);              // returns 4
   *    math.log(10000) / math.log(10); // returns 4
   *    math.pow(10, 4);                // returns 10000
   *
   * See also:
   *
   *    exp, log
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Value for which to calculate the logarithm.
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Returns the 10-base logarithm of `x`
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
      if (x.isNegative()) {
        // negative value -> downgrade to number to do complex value computation
        return log10(x.toNumber());
      }
      else {
        return x.log();
      }
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

    if (isBoolean(x) || x === null) {
      return log10(+x);
    }

    throw new math.error.UnsupportedTypeError('log10', math['typeof'](x));
  };
};
