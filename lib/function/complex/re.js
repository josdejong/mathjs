'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      object = util.object,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection = collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Get the real part of a complex number.
   * For a complex number `a + bi`, the function returns `a`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.re(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 3);
   *    math.re(a);                     // returns Number 2
   *    math.im(a);                     // returns Number 3
   *
   *    math.re(math.complex('-5.2i')); // returns Number 0
   *    math.re(math.complex(2.4));     // returns Number 2.4
   *
   * See also:
   *
   *    im, conj, abs, arg
   *
   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
   *            A complex number or array with complex numbers
   * @return {Number | BigNumber | Array | Matrix} The real part of x
   */
  math.re = function re(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('re', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x;
    }

    if (x instanceof BigNumber) {
      return new BigNumber(x);
    }

    if (isComplex(x)) {
      return x.re;
    }

    if (isCollection(x)) {
      return collection.deepMap(x, re);
    }

    if (isBoolean(x) || x === null) {
      return +x;
    }

    // return a clone of the value itself for all non-complex values
    return object.clone(x);
  };
};
