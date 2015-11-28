'use strict';

var deepMap = require('../../utils/collection/deepMap');
var tanhCoth = require('../../utils/bignumber/tanhCoth');

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5);                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5);  // returns 0.46211715726000974
   *    1 / math.coth(0.5);               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | BigNumber | Complex | Array | Matrix} Hyperbolic tangent of x
   */
  var tanh = typed('tanh', {
    'number': _tanh,

    'Complex': function (x) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re + 1) * (re + 1) + im * im;
      return new type.Complex(
          ((re - 1) * (re + 1) + im * im) / den,
          im * 2 / den
      );
    },

    'BigNumber': function (x) {
      return tanhCoth(x, type.BigNumber, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tanh is no angle');
      }
      return tanh(x.value);
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since tanh(0) = 0
      return deepMap(x, tanh, true);
    }
  });

  tanh.toTex = '\\tanh\\left(${args[0]}\\right)';

  return tanh;
}

/**
 * Calculate the hyperbolic tangent of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _tanh (x) {
  var e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
}

exports.name = 'tanh';
exports.factory = factory;
