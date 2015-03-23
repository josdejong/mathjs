'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = math.type.Matrix,
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection;

  /**
   * Calculate the exponent of a value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.exp(x)
   *
   * Examples:
   *
   *    math.exp(2);                  // returns Number 7.3890560989306495
   *    math.pow(math.e, 2);          // returns Number 7.3890560989306495
   *    math.log(math.exp(2));        // returns Number 2
   *
   *    math.exp([1, 2, 3]);
   *    // returns Array [
   *    //   2.718281828459045,
   *    //   7.3890560989306495,
   *    //   20.085536923187668
   *    // ]
   *
   * See also:
   *
   *    log, pow
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  A number or matrix to exponentiate
   * @return {Number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  math.exp = function exp (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('exp', arguments.length, 1);
    }

    if (isNumber(x)) {
      return Math.exp(x);
    }

    if (isComplex(x)) {
      var r = Math.exp(x.re);
      return new Complex(
          r * Math.cos(x.im),
          r * Math.sin(x.im)
      );
    }

    if (x instanceof BigNumber) {
      return x.exp();
    }

    if (isCollection(x)) {
      return collection.deepMap(x, exp);
    }

    if (isBoolean(x) || x === null) {
      return Math.exp(x);
    }

    throw new math.error.UnsupportedTypeError('exp', math['typeof'](x));
  };
};
