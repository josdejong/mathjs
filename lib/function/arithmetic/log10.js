'use strict';


function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Value for which to calculate the logarithm.
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Returns the 10-base logarithm of `x`
   */
  var log10 = typed('log10', {
    'number': function (x) {
      if (x >= 0) {
        return Math.log(x) / Math.LN10;
      }
      else {
        // negative value -> complex value computation
        return log10(new type.Complex(x, 0));
      }
    },

    'Complex': _log10Complex,

    'BigNumber': function (x) {
      if (x.isNegative()) {
        // downgrade to number, return Complex valued result
        return _log10Complex(new type.Complex(x.toNumber(), 0));
      }
      else {
        return x.log();
      }
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, log10);
    }
  });

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

