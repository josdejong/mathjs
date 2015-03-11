'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var Unit = require('../../type/Unit');
  var BigNumber = type.BigNumber;
  var bigCosh = require('../../util/bignumber').cosh_sinh_csch_sech;

  /**
   * Calculate the hyperbolic cosine of a value,
   * defined as `cosh(x) = 1/2 * (exp(x) + exp(-x))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cosh(x)
   *
   * Examples:
   *
   *    math.cosh(0.5);       // returns Number 1.1276259652063807
   *
   * See also:
   *
   *    sinh, tanh
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Hyperbolic cosine of x
   */
  var cosh = typed('cosh', {
    'number': _cosh,

    'Complex': function (x) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new Complex(Math.cos(x.im) * (ep + en) / 2, Math.sin(x.im) * (ep - en) / 2);
    },

    'BigNumber': function (x) {
      return bigCosh(x, BigNumber, false, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function cosh is no angle');
      }
      return _cosh(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, cosh);
    }
  });

  /**
   * Calculate the hyperbolic cosine of a number
   * @param {number} x
   * @returns {number}
   * @private
   */
  function _cosh(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
  }

  return cosh;
};
