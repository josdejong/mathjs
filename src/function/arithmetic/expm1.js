'use strict';

var deepMap = require('../../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');

  /**
   * Calculate the value of subtracting 1 from the exponential value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.expm1(x)
   *
   * Examples:
   *
   *    math.expm1(2);                      // returns number 6.38905609893065
   *    math.pow(math.e, 2) - 1;            // returns number 6.3890560989306495
   *    math.log(math.expm1(2) + 1);        // returns number 2
   *
   *    math.expm1([1, 2, 3]);
   *    // returns Array [
   *    //   1.718281828459045,
   *    //   6.3890560989306495,
   *    //   19.085536923187668
   *    // ]
   *
   * See also:
   *
   *    exp, log, pow
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x  A number or matrix to apply expm1
   * @return {number | BigNumber | Complex | Array | Matrix} Exponent of `x`
   */
  var expm1 = typed('expm1', {
    'number': Math.expm1 || _expm1,

    'Complex': function (x) {
      var r = Math.exp(x.re);
      return new type.Complex(
          r * Math.cos(x.im) - 1,
          r * Math.sin(x.im)
      );
    },

    'BigNumber': function (x) {
      return x.exp().minus(1);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, expm1);
    }
  });

  /**
   * Calculates exponentiation minus 1.
   * @param {number} x
   * @return {number} res
   * @private
   */
  function _expm1(x) {
    return (x >= 2e-4 || x <= -2e-4)
      ? Math.exp(x) - 1
      : x + x*x/2 + x*x*x/6;
  }

  expm1.toTex = '\\left(e' + latex.operators['pow'] + '{${args[0]}}-1\\right)';

  return expm1;
}

exports.name = 'expm1';
exports.factory = factory;
