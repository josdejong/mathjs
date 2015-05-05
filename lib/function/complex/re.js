'use strict';

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
  var re = typed('re', {
    'number': function (x) {
      return x;
    },

    'BigNumber': function (x) {
      return x;
    },

    'Complex': function (x) {
      return x.re;
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, re);
    }
  });

  return re;
}

exports.name = 're';
exports.factory = factory;
