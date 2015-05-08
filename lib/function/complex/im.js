'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
  var im = typed('im', {
    'number': function (x) {
      return 0;
    },

    'BigNumber': function (x) {
      return new x.constructor(0);
    },

    'Complex': function (x) {
      return x.im;
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, im);
    }
  });

  return im;
}

exports.name = 'im';
exports.factory = factory;
