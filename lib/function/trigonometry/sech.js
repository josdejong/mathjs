'use strict';

var deepMap = require('../../utils/collection/deepMap');
var coshSinhCschSech = require('../../utils/bignumber/coshSinhCschSech');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic secant of a value,
   * defined as `sech(x) = 1 / cosh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sech(x)
   *
   * Examples:
   *
   *    // sech(x) = 1/ cosh(x)
   *    math.sech(0.5);       // returns 0.886818883970074
   *    1 / math.cosh(0.5);   // returns 0.886818883970074
   *
   * See also:
   *
   *    cosh, csch, coth
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic secant of x
   */
  var sech = typed('sech', {
    'number': _sech,

    'Complex': function (x) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep + en);
      var im = Math.sin(x.im) * (ep - en);
      var den = re * re + im * im;
      return new type.Complex(2 * re / den, -2 * im / den);
    },

    'BigNumber': function (x) {
      return coshSinhCschSech(x, type.BigNumber, false, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sech is no angle');
      }
      return sech(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sech);
    }
  });

  sech.toTex = '\\mathrm{sech}\\left(${args[0]}\\right)';

  return sech;
}

/**
 * Calculate the hyperbolic secant of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

exports.name = 'sech';
exports.factory = factory;
