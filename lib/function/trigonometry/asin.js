'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var Complex = require('../../type/Complex');
  var collection = require('../../type/collection');
  var BigNumber = type.BigNumber;
  var bigArcSin = require('../../util/bignumber').arcsin_arccsc;
  var complexSqrt = require('../arithmetic/sqrt')(config, type).signatures['Complex'];
  var complexLog = require('../arithmetic/log')(config, type).signatures['Complex'];

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
   *    math.asin(0.5);           // returns Number 0.5235987755982989
   *    math.asin(math.sin(1.5)); // returns Number ~1.5
   *
   *    math.asin(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    sin, atan, acos
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} The arc sine of x
   */
  var asin = typed('asin', {
    'number': function (x) {
      if (x >= -1 && x <= 1) {
        return Math.asin(x);
      }
      else {
        return _asinComplex(new Complex(x, 0));
      }
    },

    'Complex': _asinComplex,

    'BigNumber': function (x) {
      return bigArcSin(x, BigNumber, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, asin);
    }
  });

  /**
   * Calculate asin for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _asinComplex(x) {
    // asin(z) = -i*log(iz + sqrt(1-z^2))
    var re = x.re;
    var im = x.im;
    var temp1 = new Complex(
        im * im - re * re + 1.0,
        -2.0 * re * im
    );
    var temp2 = complexSqrt(temp1);
    var temp3 = new Complex(
        temp2.re - im,
        temp2.im + re
    );
    var temp4 = complexLog(temp3);

    return new Complex(temp4.im, -temp4.re);
  }

  return asin;
};
