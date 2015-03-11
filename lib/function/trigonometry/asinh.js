'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAsinh = require('../../util/bignumber').acosh_asinh_asech_acsch;
  var asin = require('./asin')(config, type).signatures['Complex'];

  /**
   * Calculate the hyperbolic arcsine of a value,
   * defined as `asinh(x) = ln(x + sqrt(x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asinh(x)
   *
   * Examples:
   *
   *    math.asinh(0.5);       // returns 0.48121182505960347
   *
   * See also:
   *
   *    acosh, atanh
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arcsine of x
   */
  var asinh = typed('asinh', {
    'number': function (x) {
      return Math.log(Math.sqrt(x*x + 1) + x);
    },

    'Complex': function (x) {
      // asinh(z) = (-asin((z.im, -z.re)).im, asin((z.im, -z.re)).re)
      var temp = x.im;
      x.im = -x.re;
      x.re = temp;

      var res = asin(x);

      // restore original values
      x.re = -x.im;
      x.im = temp;

      temp = res.re;
      res.re = -res.im;
      res.im = temp;

      return res;
    },

    'BigNumber': function (x) {
      return bigAsinh(x, BigNumber, true, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, asinh);
    }
  });

  return asinh;
};
