'use strict';

var deepMap = require('../../utils/collection/deepMap');
var acoshAsinhAsechAcsch = require('../../utils/bignumber/acoshAsinhAsechAcsch');

function factory (type, config, load, typed) {
  var asinh = typed.find(load(require('./asinh')), ['Complex']);

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
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccosecant of x
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
        return new type.Complex(x, 0);
      }

      // acsch(z) = -i*asinh(1/z)
      var den = x.re*x.re + x.im*x.im;
      x = (den != 0)
          ? new type.Complex(
          x.re / den,
          -x.im / den
      )
          : new type.Complex(
          (x.re != 0) ?  (x.re / 0) : 0,
          (x.im != 0) ? -(x.im / 0) : 0
      );

      return asinh(x);
    },

    'BigNumber': function (x) {
      return acoshAsinhAsechAcsch(x, type.BigNumber, true, true);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acsch);
    }
  });

  acsch.toTex = '\\mathrm{csch}^{-1}\\left(${args[0]}\\right)';

  return acsch;
}

exports.name = 'acsch';
exports.factory = factory;
