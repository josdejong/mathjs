'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  /**
   * Calculate the 2-base of a value. This is the same as calculating `log(x, 2)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log2(x)
   *
   * Examples:
   *
   *    math.log2(0.03125);           // returns -5
   *    math.log2(16);                // returns 4
   *    math.log2(16) / math.log2(2); // returns 4
   *    math.pow(2, 4);               // returns 16
   *
   * See also:
   *
   *    exp, log, log1p, log10
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            Value for which to calculate the logarithm.
   * @return {number | BigNumber | Complex | Array | Matrix}
   *            Returns the 2-base logarithm of `x`
   */
  var log2 = typed('log2', {
    'number': function (x) {
      if (x >= 0 || config.predictable) {
        return (Math.log2)
          ? Math.log2(x)
          : Math.log(x) / Math.LN2;
      }
      else {
        // negative value -> complex value computation
        return _log2Complex(new type.Complex(x, 0));
      }
    },

    'Complex': _log2Complex,

    'BigNumber': function (x) {
      if (!x.isNegative() || config.predictable) {
        return x.log(2);
      }
      else {
        // downgrade to number, return Complex valued result
        return _log2Complex(new type.Complex(x.toNumber(), 0));
      }
    },

    'Array | Matrix': function (x) {
      return deepMap(x, log2);
    }
  });

  /**
   * Calculate log2 for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _log2Complex(x) {
    var newX = Math.sqrt(x.re * x.re + x.im * x.im);
    return new type.Complex (
        (Math.log2) ? Math.log2(newX) : Math.log(newX) / Math.LN2,
        Math.atan2(x.im, x.re) / Math.LN2
    );
  }

  log2.toTex = '\\log_{2}\\left(${args[0]}\\right)';

  return log2;

}

exports.name = 'log2';
exports.factory = factory;

