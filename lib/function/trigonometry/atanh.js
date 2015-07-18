'use strict';

var deepMap = require('../../utils/collection/deepMap');
var atanhAcoth = require('../../utils/bignumber/atanhAcoth');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic arctangent of a value,
   * defined as `atanh(x) = ln((1 + x)/(1 - x)) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atanh(x)
   *
   * Examples:
   *
   *    math.atanh(0.5);       // returns 0.5493061443340549
   *
   * See also:
   *
   *    acosh, asinh
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  var atanh = typed('atanh', {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        return Math.log((1 + x)/(1 - x)) / 2;
      }
      return _complexAtanh(new type.Complex(x, 0));
    },

    'Complex': _complexAtanh,

    'BigNumber': function (x) {
      return atanhAcoth(x, type.BigNumber, false);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since atanh(0) = 0
      return deepMap(x, atanh, true);
    }
  });

  /**
   * Calculate the hyperbolic arctangent of a complex number
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAtanh (x) {
    // x.im should equal -pi / 2 in this case
    var noIM = x.re > 1 && x.im == 0;

    var oneMinus = 1 - x.re;
    var onePlus = 1 + x.re;
    var den = oneMinus*oneMinus + x.im*x.im;
    x = (den != 0)
        ? new type.Complex(
        (onePlus*oneMinus - x.im*x.im) / den,
        (x.im*oneMinus + onePlus*x.im) / den
    )
        : new type.Complex(
        (x.re != -1) ? (x.re / 0) : 0,
        (x.im != 0) ? (x.im / 0) : 0
    );

    var temp = x.re;
    x.re = Math.log(Math.sqrt(x.re*x.re + x.im*x.im)) / 2;
    x.im = Math.atan2(x.im, temp) / 2;

    if (noIM) {
      x.im = -x.im;
    }
    return x;
  }

  atanh.toTex = '\\tanh^{-1}\\left(${args[0]}\\right)';

  return atanh;
}

exports.name = 'atanh';
exports.factory = factory;
