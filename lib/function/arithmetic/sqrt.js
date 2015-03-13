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
   * Calculate the square root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sqrt(x)
   *
   * Examples:
   *
   *    math.sqrt(25);                // returns 5
   *    math.square(5);               // returns 25
   *    math.sqrt(-4);                // returns Complex -2i
   *
   * See also:
   *
   *    square, multiply
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Value for which to calculate the square root.
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Returns the square root of `x`
   */
  math.sqrt = function sqrt (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('sqrt', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (x >= 0) {
        return Math.sqrt(x);
      }
      else {
        return sqrt(new Complex(x, 0));
      }
    }

    if (isComplex(x)) {
      var r = Math.sqrt(x.re * x.re + x.im * x.im);

      var re, im;

      if (x.re >= 0) {
        re = 0.5 * Math.sqrt(2.0 * (r + x.re));
      }
      else {
        re = Math.abs(x.im) / Math.sqrt(2 * (r - x.re));
      }

      if (x.re <= 0) {
        im = 0.5 * Math.sqrt(2.0 * (r - x.re));
      }
      else {
        im = Math.abs(x.im) / Math.sqrt(2 * (r + x.re));
      }

      if (x.im >= 0) {
        return new Complex(re, im);
      }
      else {
        return new Complex(re, -im);
      }
    }

    if (x instanceof BigNumber) {
      if (x.isNegative()) {
        // negative value -> downgrade to number to do complex value computation
        return sqrt(x.toNumber());
      }
      else {
        return x.sqrt();
      }
    }

    if (isCollection(x)) {
      // deep map collection, skip zeros since sqrt(0) = 0
      return collection.deepMap(x, sqrt, true);
    }

    if (isBoolean(x) || x === null) {
      return sqrt(+x);
    }

    throw new math.error.UnsupportedTypeError('sqrt', math['typeof'](x));
  };
};
