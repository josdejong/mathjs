'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

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
  var conj = typed('conj', {
    'number': function (x) {
      return x;
    },

    'BigNumber': function (x) {
      return x;
    },

    'Complex': function (x) {
      return new x.constructor(x.re, -x.im);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, conj);
    }
  });

  return conj;
}

exports.name = 'conj';
exports.factory = factory;
