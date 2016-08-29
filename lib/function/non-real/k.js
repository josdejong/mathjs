'usestrict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Get the real part of a complex number.
   * For a complex number `a + bi`, the function returns `a`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.k(x)
   *
   * Examples:
   *
   *    var a = math.complex(2, 3);
   *    math.k(a);                      // alwasys returns number 0 
   *    math.k(8)                       // alwasy returns 0

   *    var b = math.Quaternion(1,2,3,4);
   *
   *    math.k(b)             // returns 4
   *
   * See also:
   *
   *    im, conj, abs, arg, re, j
   *
   * @param {number | BigNumber | Complex | Array | Matrix | Quaternion} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Array | Matrix} The real part of x
   */
  var re = typed('k', {
    'number | Complex': function (x) {
      return 0;
    },

    'BigNumber': function (x) {
      return type.BigNumber(0);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, re);
    },

    'Quaternion': function (x) {
      return x.k();
    }
  });

  re.toTex = {1: '\\Re\\left\\lbrace${args[0]}\\right\\rbrace'};

  return re;
}

exports.name = 're';
exports.factory = factory;