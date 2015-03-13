'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      number = util.number,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Compute the sign of a value. The sign of a value x is:
   *
   * -  1 when x > 1
   * - -1 when x < 0
   * -  0 when x == 0
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sign(x)
   *
   * Examples:
   *
   *    math.sign(3.5);               // returns 1
   *    math.sign(-4.2);              // returns -1
   *    math.sign(0);                 // returns 0
   *
   *    math.sign([3, 5, -2, 0, 2]);  // returns [1, 1, -1, 0, 1]
   *
   * See also:
   *
   *    abs
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            The number for which to determine the sign
   * @return {Number | BigNumber | Complex | Array | Matrix}e
   *            The sign of `x`
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
      // deep map collection, skip zeros since sign(0) = 0
      return collection.deepMap(x, sign, true);
    }

    if (isBoolean(x) || x === null) {
      return number.sign(x);
    }

    throw new math.error.UnsupportedTypeError('sign', math['typeof'](x));
  };
};
