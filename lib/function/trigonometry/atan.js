'use strict';

var deepMap = require('../../utils/collection/deepMap');
var atanAcot = require('../../utils/bignumber/atanAcot');

function factory (type, config, load, typed) {
  var complexLog = typed.find(load(require('../arithmetic/log')), ['Complex']);

  /**
   * Calculate the inverse tangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan(x)
   *
   * Examples:
   *
   *    math.atan(0.5);           // returns number 0.4636476090008061
   *    math.atan(math.tan(1.5)); // returns number 1.5
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, asin, acos
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x   Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc tangent of x
   */
  var atan = typed('atan', {
    'number': function (x) {
      return Math.atan(x);
    },

    'Complex': function (x) {
      if (x.re == 0) {
        if (x.im == 1) {
          return new type.Complex(0, Infinity);
        }
        if (x.im == -1) {
          return new type.Complex(0, -Infinity);
        }
      }

      // atan(z) = 1/2 * i * (ln(1-iz) - ln(1+iz))
      var re = x.re;
      var im = x.im;
      var den = re * re + (1.0 - im) * (1.0 - im);

      var temp1 = new type.Complex(
          (1.0 - im * im - re * re) / den,
          (-2.0 * re) / den
      );
      var temp2 = complexLog(temp1);

      return new type.Complex(
          -0.5 * temp2.im,
          0.5 * temp2.re
      );
    },

    'BigNumber': function (x) {
      return atanAcot(x, type.BigNumber, false);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atan(0) = 0
      return deepMap(x, atan, true);
    }
  });

  atan.toTex = '\\tan^{-1}\\left(${args[0]}\\right)';

  return atan;
}

exports.name = 'atan';
exports.factory = factory;
