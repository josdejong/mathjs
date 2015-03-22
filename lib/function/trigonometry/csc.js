'use strict';

var collection = require('../../type/collection');
var bigCsc = require('../../util/bignumber').cos_sin_sec_csc;

function factory (type, config, load, typed) {
  /**
   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csc(x)
   *
   * Examples:
   *
   *    math.csc(2);      // returns Number 1.099750170294617
   *    1 / math.sin(2);  // returns Number 1.099750170294617
   *
   * See also:
   *
   *    sin, sec, cot
   *
   * @param {Number | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} Cosecant of x
   */
  var csc = typed('csc', {
    'number': function (x) {
      return 1 / Math.sin(x);
    },

    'Complex': function (x) {
      // csc(z) = 1/sin(z) = (2i) / (exp(iz) - exp(-iz))
      var den =
          0.25 * (Math.exp(-2 * x.im) + Math.exp(2 * x.im)) -
          0.5 * Math.cos(2 * x.re);

      return new type.Complex (
          0.5 * Math.sin(x.re) * (Math.exp(-x.im) + Math.exp(x.im)) / den,
          0.5 * Math.cos(x.re) * (Math.exp(-x.im) - Math.exp(x.im)) / den
      );
    },

    'BigNumber': function (x) {
      return bigCsc(x, type.BigNumber, 1, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csc is no angle');
      }
      return 1 / Math.sin(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, csc);
    }
  });

  return csc;
}

exports.type = 'function';
exports.name = 'csc';
exports.factory = factory;
