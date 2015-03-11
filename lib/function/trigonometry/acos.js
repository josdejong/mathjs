'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigArcCos = require('../../util/bignumber').arccos_arcsec;
  var complexSqrt = require('../arithmetic/sqrt')(config, type).signatures['Complex'];
  var complexLog = require('../arithmetic/log')(config, type).signatures['Complex'];

  /**
   * Calculate the inverse cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acos(x)
   *
   * Examples:
   *
   *    math.acos(0.5);           // returns Number 1.0471975511965979
   *    math.acos(math.cos(1.5)); // returns Number 1.5
   *
   *    math.acos(2);             // returns Complex 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    cos, atan, asin
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} The arc cosine of x
   */
  var acos = typed('acos', {
    'number': function (x) {
      if (x >= -1 && x <= 1) {
        return Math.acos(x);
      }
      else {
        return _acosComplex(new Complex(x, 0));
      }
    },

    'Complex': _acosComplex,

    'BigNumber': function (x) {
      return bigArcCos(x, BigNumber, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acos);
    }
  });

  /**
   * Calculate acos for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _acosComplex(x) {
    // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
    var Complex = x.constructor;

    var temp1 = new Complex(
        x.im * x.im - x.re * x.re + 1.0,
        -2.0 * x.re * x.im
    );
    var temp2 = complexSqrt(temp1);
    var temp3 = new Complex(
        temp2.re - x.im,
        temp2.im + x.re
    );
    var temp4 = complexLog(temp3);

    // 0.5*pi = 1.5707963267948966192313216916398
    return new Complex(
        1.57079632679489661923 - temp4.im,
        temp4.re
    );
  }

  return acos;
};
