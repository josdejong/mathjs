'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Unit = require('../../type/Unit');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAcosh = require('../../util/bignumber').acosh_asinh_asech_acsch;
  var acosComplex = require('./acos')(config, type).signatures['Complex'];

  /**
   * Calculate the hyperbolic arccos of a value,
   * defined as `acosh(x) = ln(sqrt(x^2 - 1) + x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acosh(x)
   *
   * Examples:
   *
   *    math.acosh(1.5);       // returns 0.9624236501192069
   *
   * See also:
   *
   *    cosh, asinh, atanh
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccosine of x
   */
  var acosh = typed('acosh', {
    'number': function (x) {
      if (x >= 1) {
        return Math.log(Math.sqrt(x*x - 1) + x);
      }
      if (x <= -1) {
        return new Complex(Math.log(Math.sqrt(x*x - 1) - x), Math.PI);
      }
      return _acoshComplex(new Complex(x, 0));
    },

    'Complex': _acoshComplex,

    'BigNumber': function (x) {
      return bigAcosh(x, BigNumber, false, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acosh);
    }
  });

  /**
   * Calculate acosh for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _acoshComplex(x) {
    // acosh(z) = (-acos(z).im,  acos(z).re)   for acos(z).im <= 0
    //            ( acos(z).im, -acos(z).re)   otherwise
    var temp;
    var res = acosComplex(x);
    if (res.im <= 0) {
      temp = res.re;
      res.re = -res.im;
      res.im = temp;
    } else {
      temp = res.im;
      res.im = -res.re;
      res.re = temp;
    }

    return res;
  }

  return acosh;
};
