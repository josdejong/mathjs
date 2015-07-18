'use strict';

var deepMap = require('../../utils/collection/deepMap');
var atanhAcoth = require('../../utils/bignumber/atanhAcoth');

var HALF_PI = 1.5707963267948966;

function factory (type, config, load, typed) {
  var atanh = typed.find(load(require('./atanh')), ['Complex']);

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
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  var acoth = typed('acoth', {
    'number': function (x) {
      if (x >= 1 || x <= -1 || config.predictable) {
        return isFinite(x) ? (Math.log((x+1)/x) + Math.log(x/(x-1))) / 2 : 0;
      }
      return x !== 0 ? _complexAcoth(new type.Complex(x, 0)) : new type.Complex(0, HALF_PI);
    },

    'Complex': _complexAcoth,

    'BigNumber': function (x) {
      return atanhAcoth(x, type.BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acoth);
    }
  });

  /**
   * Calculate the hyperbolic arccotangent of a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAcoth (x) {
    if (x.re == 0 && x.im == 0) {
      return new type.Complex(0, HALF_PI);
    }

    // acoth(z) = -i*atanh(1/z)
    var den = x.re*x.re + x.im*x.im;
    x = (den != 0)
        ? new type.Complex(
            x.re / den,
           -x.im / den
          )
        : new type.Complex(
            (x.re != 0) ?  (x.re / 0) : 0,
            (x.im != 0) ? -(x.im / 0) : 0
          );

    return atanh(x);
  }

  acoth.toTex = '\\coth^{-1}\\left(${args[0]}\\right)';

  return acoth;
}

exports.name = 'acoth';
exports.factory = factory;
