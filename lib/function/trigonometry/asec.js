'use strict';

var deepMap = require('../../utils/collection/deepMap');
var acosAsec = require('../../utils/bignumber/acosAsec');

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse secant of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asec(x)
   *
   * Examples:
   *
   *    math.asec(0.5);           // returns 1.0471975511965979
   *    math.asec(math.sec(1.5)); // returns 1.5
   *
   *    math.asec(2);             // returns 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    acos, acot, acsc
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} The arc secant of x
   */
  var asec = typed('asec', {
    'number': function (x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return Math.acos(1 / x);
      }
      return new type.Complex(x, 0).asec();
    },

    'Complex': function (x) {
      return x.asec();
    },

    'BigNumber': function (x) {
      return acosAsec(x, type.BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asec);
    }
  });

  asec.toTex = '\\sec^{-1}\\left(${args[0]}\\right)';

  return asec;
}

exports.name = 'asec';
exports.factory = factory;
