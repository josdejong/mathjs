'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');

  var divideScalar = require('./divideScalar')(config);

  /**
   * Calculate the logarithm of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.log(x)
   *    math.log(x, base)
   *
   * Examples:
   *
   *    math.log(3.5);                  // returns 1.252762968495368
   *    math.exp(math.log(2.4));        // returns 2.4
   *
   *    math.pow(10, 4);                // returns 10000
   *    math.log(10000, 10);            // returns 4
   *    math.log(10000) / math.log(10); // returns 4
   *
   *    math.log(1024, 2);              // returns 10
   *    math.pow(2, 10);                // returns 1024
   *
   * See also:
   *
   *    exp, log10
   *
   * @param {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x
   *            Value for which to calculate the logarithm.
   * @param {Number | BigNumber | Boolean | Complex | null} [base=e]
   *            Optional base for the logarithm. If not provided, the natural
   *            logarithm of `x` is calculated.
   * @return {Number | BigNumber | Complex | Array | Matrix}
   *            Returns the logarithm of `x`
   */
  var log = typed('log', {
    'number': _logNumber,

    // FIXME: boolean and null should be converted automatically to number (is this not working because of any?
    'boolean | null': function(x) {
      return _logNumber(+x);
    },

    'Complex': function (x) {
      return new Complex (
          Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
          Math.atan2(x.im, x.re)
      );
    },

    'BigNumber': function (x) {
      return x.ln();
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, log);
    },

    'any, any': function (x, base) {
      // calculate logarithm for a specified base, log(x, base)
      return divideScalar(log(x), log(base));
    }
  });

  /**
   * Calculate the natural logarithm of a number
   * @param {number} x
   * @returns {number | Complex}
   * @private
   */
  function _logNumber(x) {
    if (x >= 0) {
      return Math.log(x);
    }
    else {
      // negative value -> complex value computation
      return log(new Complex(x, 0));
    }
  }

  return log;
};
