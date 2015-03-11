'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAsech = require('../../util/bignumber').acosh_asinh_asech_acsch;
  var acosh = require('./acosh')(config, type).signatures['Complex'];

  /**
   * Calculate the hyperbolic arcsecant of a value,
   * defined as `asech(x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asech(x)
   *
   * Examples:
   *
   *    math.asech(0.5);       // returns 1.3169578969248166
   *
   * See also:
   *
   *    acsch, acoth
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  var asech = typed('asech', {
    'number': function (x) {
      if (x <= 1 && x >= -1) {
        x = 1 / x;

        var ret = Math.sqrt(x*x - 1);
        if (x > 0) {
          return Math.log(ret + x);
        }

        return new Complex(Math.log(ret - x), Math.PI);
      }

      return _asechComplex(new Complex(x, 0));
    },

    'Complex': _asechComplex,

    'BigNumber': function (x) {
      return bigAsech(x, BigNumber, false, true);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, asech);
    }
  });

  /**
   * Calculate the hyperbolic arcsecant of a number
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _asechComplex (x) {
    if (x.re == 0 && x.im == 0) {
      return new Complex(Infinity, 0);
    }

    // acsch(z) = -i*asinh(1/z)
    var den = x.re*x.re + x.im*x.im;
    x = (den != 0)
        ? new Complex(
        x.re / den,
        -x.im / den
    )
        : new Complex(
        (x.re != 0) ?  (x.re / 0) : 0,
        (x.im != 0) ? -(x.im / 0) : 0
    );

    return acosh(x);
  }

  return asech;
};
