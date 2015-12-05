'use strict';

var deepMap = require('../../utils/collection/deepMap');
var tanCot = require('../../utils/bignumber/tanCot');

function factory (type, config, load, typed) {
  /**
   * Calculate the cotangent of a value. `cot(x)` is defined as `1 / tan(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cot(x)
   *
   * Examples:
   *
   *    math.cot(2);      // returns number -0.45765755436028577
   *    1 / math.tan(2);  // returns number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cotangent of x
   */
  var cot = typed('cot', {
    'number': function (x) {
      return 1 / Math.tan(x);
    },

    'Complex': function (x) {
      var den =
          Math.exp(-4 * x.im) -
          2 * Math.exp(-2 * x.im) * Math.cos(2 * x.re) + 1;

      return new type.Complex(
          2 * Math.exp(-2 * x.im) * Math.sin(2 * x.re) / den,
          (Math.exp(-4 * x.im) - 1) / den
      );
    },

    'BigNumber': function (x) {
      return tanCot(x, type.BigNumber, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return cot(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, cot);
    }
  });

  cot.toTex = '\\cot\\left(${args[0]}\\right)';

  return cot;
}

exports.name = 'cot';
exports.factory = factory;
