'use strict';

var deepMap = require('../../utils/collection/deepMap');
var acoshAsinhAsechAcsch = require('../../utils/bignumber/acoshAsinhAsechAcsch');

function factory (type, config, load, typed) {
  var acosh = typed.find(load(require('./acosh')), ['Complex']);

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
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  var asech = typed('asech', {
    'number': function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        x = 1 / x;

        var ret = Math.sqrt(x*x - 1);
        if (x > 0 || config.predictable) {
          return Math.log(ret + x);
        }

        return new type.Complex(Math.log(ret - x), Math.PI);
      }

      return _complexAsech(new type.Complex(x, 0));
    },

    'Complex': _complexAsech,

    'BigNumber': function (x) {
      return acoshAsinhAsechAcsch(x, type.BigNumber, false, true);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asech);
    }
  });

  /**
   * Calculate the hyperbolic arcsecant of a number
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAsech (x) {
    if (x.re == 0 && x.im == 0) {
      return new type.Complex(Infinity, 0);
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

    return acosh(x);
  }

  asech.toTex = '\\mathrm{sech}^{-1}\\left(${args[0]}\\right)';

  return asech;
}

exports.name = 'asech';
exports.factory = factory;
