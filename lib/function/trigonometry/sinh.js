'use strict';

var deepMap = require('../../utils/collection/deepMap');
var coshSinhCschSech = require('../../utils/bignumber/coshSinhCschSech');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic sine of a value,
   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sinh(x)
   *
   * Examples:
   *
   *    math.sinh(0.5);       // returns number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic sine of x
   */

  var sinh = typed('sinh', {
    'number': _sinh,

    'Complex': function (x) {
      var cim = Math.cos(x.im);
      var sim = Math.sin(x.im);
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new type.Complex(cim * (ep - en) / 2, sim * (ep + en) / 2);
    },

    'BigNumber': function (x) {
      return coshSinhCschSech(x, type.BigNumber, true, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sinh is no angle');
      }
      return sinh(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since sinh(0) = 0
      return deepMap(x, sinh, true);
    }
  });

  function _sinh (x) {
    if (Math.abs(x) < 1 && x !==  0) {
      var y = x*x
      var a0 = 1 / 6;
      var a1 = 1 / 120;
      var a2 = 1 / 5040;
      var a3 = 1 / 362880;
      var a4 = 1 / 39916800;
      var a5 = 1 / 6227020800;
      var a6 = 1 / 1307674368000;
      var a7 = 1 / 355687428096000;
      return x*(1+y*(a0+y*(a1+y*(a2+y*(a3+y*(a4+y*(a5+y*(a6+y*a7))))))))
    } else {
      return (Math.exp(x) - Math.exp(-x)) / 2;
    }
  }

  sinh.toTex = '\\sinh\\left(${args[0]}\\right)';

  return sinh;
}

/**
 * Calculate the hyperbolic sine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */

exports.name = 'sinh';
exports.factory = factory;
