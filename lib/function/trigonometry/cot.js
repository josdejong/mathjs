'use strict';

var bigCot = require('../../util/bignumber').tan_cot;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
   *    math.cot(2);      // returns Number -0.45765755436028577
   *    1 / math.tan(2);  // returns Number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Cotangent of x
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
      return bigCot(x, type.BigNumber, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cot is no angle');
      }
      return 1 / Math.tan(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, cot);
    }
  });

  return cot;
}

exports.name = 'cot';
exports.factory = factory;
