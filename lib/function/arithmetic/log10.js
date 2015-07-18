'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the 10-base of a value. This is the same as calculating `log(x, 10)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log10(x)
   *
   * Examples:
   *
   *    math.log10(0.00001);            // returns -5
   *    math.log10(10000);              // returns 4
   *    math.log(10000) / math.log(10); // returns 4
   *    math.pow(10, 4);                // returns 10000
   *
   * See also:
   *
   *    exp, log
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the 10-base logarithm of `x`
   */
  var log10 = typed('log10', {
    'number': function (x) {
      if (x >= 0 || config.predictable) {
        return Math.log(x) / Math.LN10;
      }
      else {
        // negative value -> complex value computation
        return log10(new type.Complex(x, 0));
      }
    },

    'Complex': _log10Complex,

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.log();
      }
      else {
        // downgrade to number, return Complex valued result
        return _log10Complex(new type.Complex(x.toNumber(), 0));
      }
    },

    'Array | Matrix': function (x) {
      return deepMap(x, log10);
    }
  });

  log10.toTex = '\\log_{10}\\left(${args[0]}\\right)';

  return log10;

  /**
   * Calculate log10 for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _log10Complex(x) {
    return new type.Complex (
        Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
        Math.atan2(x.im, x.re) / Math.LN10
    );
  }
}

exports.name = 'log10';
exports.factory = factory;

