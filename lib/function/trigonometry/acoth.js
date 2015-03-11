'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAcoth = require('../../util/bignumber').atanh_acoth;
  var atanh = require('./atanh')(config, type).signatures['Complex'];

  var HALF_PI = 1.5707963267948966;

  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5);       // returns 0.8047189562170503
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  var acoth = typed('acoth', {
    'number': function (x) {
      if (x >= 1 || x <= -1) {
        return isFinite(x) ? (Math.log((x+1)/x) + Math.log(x/(x-1))) / 2 : 0;
      }
      return x !== 0 ? _acothComplex(new Complex(x, 0)) : new Complex(0, HALF_PI);
    },

    'Complex': _acothComplex,

    'BigNumber': function (x) {
      return bigAcoth(x, BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acoth);
    }
  });

  /**
   * Calculate the hyperbolic arccotangent of a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _acothComplex (x) {
    if (x.re == 0 && x.im == 0) {
      return new Complex(0, HALF_PI);
    }

    // acoth(z) = -i*atanh(1/z)
    var den = x.re*x.re + x.im*x.im;
    x = (den != 0)
        ? new Complex(
            x.re / den,
           -x.im / den
          )
        : new Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0
          );

    return atanh(x);
  }

  return acoth;
};
