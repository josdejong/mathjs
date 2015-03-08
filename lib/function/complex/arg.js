'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');

  /**
   * Compute the argument of a complex value.
   * For a complex number `a + bi`, the argument is computed as `atan2(b, a)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.arg(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 2);
   *    math.arg(a) / math.pi;          // returns Number 0.25
   *
   *    var b = math.complex('2 + 3i');
   *    math.arg(b);                    // returns Number 0.982793723247329
   *    math.atan2(3, 2);               // returns Number 0.982793723247329
   *
   * See also:
   *
   *    re, im, conj, abs
   *
   * @param {Number | Complex | Array | Matrix | Boolean | null} x
   *            A complex number or array with complex numbers
   * @return {Number | Array | Matrix} The argument of x
   */
  var arg = typed('arg', {
    'number': function (x) {
      return Math.atan2(0, x);
    },

    // FIXME: must arg(Complex return a complex or a number?
    'Complex': function (x) {
      return Math.atan2(x.im, x.re);
    },

    // TODO: implement BigNumber support for function arg

    'Array | Matrix': function (x) {
      return collection.deepMap(x, arg);
    }
  });

  return arg;
};
