'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var BigNumber = type.BigNumber;
  var bigAcsch = require('../../util/bignumber').acosh_asinh_asech_acsch;
  var asinh = require('./asinh')(config, type).signatures['Complex'];

  /**
   * Calculate the hyperbolic arccosecant of a value,
   * defined as `acsch(x) = ln(1/x + sqrt(1/x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsch(x)
   *
   * Examples:
   *
   *    math.acsch(0.5);       // returns 1.4436354751788103
   *
   * See also:
   *
   *    asech, acoth
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic arccosecant of x
   */
  var acsch = typed('acsch', {
    'number': function (x) {
      x = 1 / x;
      return Math.log(x + Math.sqrt(x*x + 1));
    },

    'Complex': function (x) {
      if (x.im == 0) {
        x = (x.re != 0)
            ? Math.log(x.re + Math.sqrt(x.re*x.re + 1))
            : Infinity;
        return new Complex(x, 0);
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

      return asinh(x);

    },

    'BigNumber': function (x) {
      return bigAcsch(x, BigNumber, true, true);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acsch);
    }
  });

  return acsch;
};
