'use strict';

var deepMap = require('../../utils/collection/deepMap');

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
    'number': function (x) {
      return Math.sinh ? Math.sinh(x) : _sinh(x);
    },

    'Complex': function (x) {
      return x.sinh();
    },

    'BigNumber': function (x) {
      return x.sinh();
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

  sinh.toTex = '\\sinh\\left(${args[0]}\\right)';

  return sinh;
}

function _sinh (x) {
  if (Math.abs(x) < 1 && x !==  0) {
    // For |x| < 1, evaluate a degree 17 Taylor expansion of sinh using Horner’s rule.
    var y = x * x;
    return x * (1 +
      y * (1.666666666666667e-01 + // 1 / 6
      y * (8.333333333333333e-03 + // 1 / 120
      y * (1.984126984126984e-04 + // 1 / 5040
      y * (2.755731922398589e-06 + // 1 / 362880
      y * (2.505210838544172e-08 +  // 1 / 39916800
      y * (1.605904383682161e-10 +  // 1 / 6227020800
      y * (7.647163731819816e-13 + // 1 / 1307674368000
      y * (2.811457254345521e-15   // 1 / 355687428096000
      )))))))));
  } else {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  }
}


exports.name = 'sinh';
exports.factory = factory;
