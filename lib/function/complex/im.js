'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the imaginary part of a complex number.
   * For a complex number `a + bi`, the function returns `b`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.im(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 3);
   *    math.re(a);                     // returns Number 2
   *    math.im(a);                     // returns Number 3
   *
   *    math.re(math.complex('-5.2i')); // returns Number -5.2
   *    math.re(math.complex(2.4));     // returns Number 0
   *
   * See also:
   *
   *    re, conj, abs, arg
   *
   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
   *            A complex number or array with complex numbers
   * @return {Number | BigNumber | Array | Matrix} The imaginary part of x
   */
  math.im = function im(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('im', arguments.length, 1);
    }

    if (isNumber(x)) {
      return 0;
    }

    if (x instanceof BigNumber) {
      return new BigNumber(0);
    }

    if (isComplex(x)) {
      return x.im;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, im);
    }

    if (isBoolean(x) || x === null) {
      return 0;
    }

    // return 0 for all non-complex values
    return 0;
  };
};
