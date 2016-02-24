'use strict';

var deepMap = require('../../utils/collection/deepMap');
var atanAcot = require('../../utils/bignumber/atanAcot');

var HALF_PI = 1.5707963267948966;

function factory (type, config, load, typed) {

  /**
   * Calculate the inverse cotangent of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acot(x)
   *
   * Examples:
   *
   *    math.acot(0.5);           // returns number 0.4636476090008061
   *    math.acot(math.cot(1.5)); // returns number 1.5
   *
   *    math.acot(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    cot, atan
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cotangent of x
   */
  var acot = typed('acot', {
    'number': function (x) {
      return (x) ? Math.atan(1 / x) : HALF_PI;
    },

    'Complex': function (x) {
      return x.acot();
    },

    'BigNumber': function (x) {
      return atanAcot(x, type.BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acot);
    }
  });

  acot.toTex = '\\cot^{-1}\\left(${args[0]}\\right)';

  return acot;
}

exports.name = 'acot';
exports.factory = factory;
