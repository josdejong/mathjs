'use strict';

var deepMap = require('../../utils/collection/deepMap');
var cosSinSecCsc = require('../../utils/bignumber/cosSinSecCsc');

function factory (type, config, load, typed) {
  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2);      // returns number -2.4029979617223822
   *    1 / math.cos(2);  // returns number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Secant of x
   */
  var sec = typed('sec', {
    'number': function (x) {
      return 1 / Math.cos(x);
    },

    'Complex': function (x) {
      // sec(z) = 1/cos(z) = 2 / (exp(iz) + exp(-iz))
      var den =
          0.25 * (Math.exp(-2 * x.im) + Math.exp(2 * x.im)) +
          0.5 * Math.cos(2 * x.re);

      return new type.Complex(
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) + Math.exp( x.im)) / den,
          0.5 * Math.sin(x.re) * (Math.exp( x.im) - Math.exp(-x.im)) / den
      );
    },

    'BigNumber': function (x) {
      return cosSinSecCsc(x, type.BigNumber, 0, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sec is no angle');
      }
      return sec(x.value);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, sec);
    }
  });

  sec.toTex = '\\sec\\left(${args[0]}\\right)';

  return sec;
}

exports.name = 'sec';
exports.factory = factory;
