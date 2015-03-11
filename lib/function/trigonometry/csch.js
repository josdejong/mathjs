'use strict';

module.exports = function (config, type) {
  var typed = require('typed-function');
  var collection = require('../../type/collection');
  var Complex = require('../../type/Complex');
  var Unit = require('../../type/Unit');
  var BigNumber = type.BigNumber;
  var sign = require('../../util/number').sign;
  var bigCsch = require('../../util/bignumber').cosh_sinh_csch_sech;

  /**
   * Calculate the hyperbolic cosecant of a value,
   * defined as `csch(x) = 1 / sinh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csch(x)
   *
   * Examples:
   *
   *    // csch(x) = 1/ sinh(x)
   *    math.csch(0.5);       // returns 1.9190347513349437
   *    1 / math.sinh(0.5);   // returns 1.9190347513349437
   *
   * See also:
   *
   *    sinh, sech, coth
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Hyperbolic cosecant of x
   */
  var csch = typed('csch', {
    'number': _csch,

    'Complex': function (x) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep - en);
      var im = Math.sin(x.im) * (ep + en);
      var den = re * re + im * im;
      return new Complex(2 * re / den, -2 * im /den);
    },

    'BigNumber': function (x) {
      return bigCsch(x, BigNumber, true, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csch is no angle');
      }
      return _csch(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, csch);
    }
  });

  /**
   * Calculate the hyperbolic cosecant of a number
   * @param {number} x
   * @returns {number}
   * @private
   */
  function _csch(x) {
    // consider values close to zero (+/-)
    if (x == 0) {
      return Number.POSITIVE_INFINITY;
    }
    else {
      return Math.abs(2 / (Math.exp(x) - Math.exp(-x))) * sign(x);
    }
  }

  return csch;
};
