'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      object = util.object,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isCollection =collection.isCollection,
      isComplex = Complex.isComplex;

  /**
   * Compute the complex conjugate of a complex value.
   * If `x = a+bi`, the complex conjugate of `x` is `a - bi`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.conj(x)
   *
   * Examples:
   *
   *    math.conj(math.complex('2 + 3i'));  // returns Complex 2 - 3i
   *    math.conj(math.complex('2 - 3i'));  // returns Complex 2 + 3i
   *    math.conj(math.complex('-5.2i'));  // returns Complex 5.2i
   *
   * See also:
   *
   *    re, im, arg, abs
   *
   * @param {Number | BigNumber | Complex | Array | Matrix | Boolean | null} x
   *            A complex number or array with complex numbers
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            The complex conjugate of x
   */
  math.conj = function conj(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('conj', arguments.length, 1);
    }

    if (isNumber(x)) {
      return x;
    }

    if (x instanceof BigNumber) {
      return new BigNumber(x);
    }

    if (isComplex(x)) {
      return new Complex(x.re, -x.im);
    }

    if (isCollection(x)) {
      return collection.deepMap(x, conj);
    }

    if (isBoolean(x) || x === null) {
      return +x;
    }

    // return a clone of the value for non-complex values
    return object.clone(x);
  };
};
