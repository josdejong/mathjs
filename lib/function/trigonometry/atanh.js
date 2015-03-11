'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAtanh = require('../../util/bignumber').atanh_acoth;

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
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arctangent of x
   */
  var atanh = typed('atanh', {
    'number': function (x) {
      if (x <= 1 && x >= -1) {
        return Math.log((1 + x)/(1 - x)) / 2;
      }
      return _atanhComplex(new Complex(x, 0));
    },

    'Complex': _atanhComplex,

    'BigNumber': function (x) {
      return bigAtanh(x, BigNumber, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, atanh);
    }
  });

  /**
   * Calculate the hyperbolic arctangent of a complex number
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _atanhComplex (x) {
    // x.im should equal -pi / 2 in this case
    var noIM = x.re > 1 && x.im == 0;

    var oneMinus = 1 - x.re;
    var onePlus = 1 + x.re;
    var den = oneMinus*oneMinus + x.im*x.im;
    x = (den != 0)
        ? new Complex(
        (onePlus*oneMinus - x.im*x.im) / den,
        (x.im*oneMinus + onePlus*x.im) / den
    )
        : new Complex(
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

  return atanh;
};
