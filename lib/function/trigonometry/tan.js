'use strict';

var bigTan = require('../../util/bignumber').tan_cot;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/collection'));

  /**
   * Calculate the tangent of a value. `tan(x)` is equal to `sin(x) / cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tan(x)
   *
   * Examples:
   *
   *    math.tan(0.5);                    // returns Number 0.5463024898437905
   *    math.sin(0.5) / math.cos(0.5);    // returns Number 0.5463024898437905
   *    math.tan(math.pi / 4);            // returns Number 1
   *    math.tan(math.unit(45, 'deg'));   // returns Number 1
   *
   * See also:
   *
   *    atan, sin, cos
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Tangent of x
   */
  var tan = typed('tan', {
    'number': Math.tan,

    'Complex': function (x) {
      var den =
          Math.exp(-4 * x.im) +
          2 * Math.exp(-2 * x.im) * Math.cos(2 * x.re) +
          1;

      return new type.Complex(
          2 * Math.exp(-2 * x.im) * Math.sin(2 * x.re) / den,
          (1 - Math.exp(-4 * x.im)) / den
      );
    },

    'BigNumber': function (x) {
      return bigTan(x, type.BigNumber, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tan is no angle');
      }
      return Math.tan(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, tan);
    }
  });

  return tan;
}

exports.name = 'tan';
exports.factory = factory;
