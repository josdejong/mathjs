'use strict';

var deepMap = require('../../utils/collection/deepMap');
var asinAcsc = require('../../utils/bignumber/asinAcsc');

function factory (type, config, load, typed) {
  var complexSqrt = typed.find(load(require('../arithmetic/sqrt')), ['Complex']);
  var complexLog = typed.find(load(require('../arithmetic/log')), ['Complex']);

  /**
   * Calculate the inverse sine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asin(x)
   *
   * Examples:
   *
   *    math.asin(0.5);           // returns number 0.5235987755982989
   *    math.asin(math.sin(1.5)); // returns number ~1.5
   *
   *    math.asin(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    sin, atan, acos
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x   Function input
   * @return {number | BigNumber | Complex | Array | Matrix} The arc sine of x
   */
  var asin = typed('asin', {
    'number': function (x) {
      if ((x >= -1 && x <= 1) || config.predictable) {
        return Math.asin(x);
      }
      else {
        return _complexAsin(new type.Complex(x, 0));
      }
    },

    'Complex': _complexAsin,

    'BigNumber': function (x) {
      return asinAcsc(x, type.BigNumber, false);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since asin(0) = 0
      return deepMap(x, asin, true);
    }
  });

  /**
   * Calculate asin for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAsin(x) {
    // asin(z) = -i*log(iz + sqrt(1-z^2))
    var re = x.re;
    var im = x.im;
    var temp1 = new type.Complex(
        im * im - re * re + 1.0,
        -2.0 * re * im
    );
    var temp2 = complexSqrt(temp1);
    var temp3 = new type.Complex(
        temp2.re - im,
        temp2.im + re
    );
    var temp4 = complexLog(temp3);

    return new type.Complex(temp4.im, -temp4.re);
  }

  asin.toTex = '\\sin^{-1}\\left(${args[0]}\\right)';

  return asin;
}

exports.name = 'asin';
exports.factory = factory;
