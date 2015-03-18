'use strict';

var collection = require('../../type/collection');
var bigSinh = require('../../util/bignumber').cosh_sinh_csch_sech;

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
   *    math.sinh(0.5);       // returns Number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Hyperbolic sine of x
   */
  var sinh = typed('sinh', {
    'number': _sinh,

    'Complex': function (x) {
      var cim = Math.cos(x.im);
      var sim = Math.sin(x.im);
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      return new type.Complex(cim * (ep - en) / 2, sim * (ep + en) / 2);
    },

    'BigNumber': function (x) {
      return bigSinh(x, type.BigNumber, true, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function sinh is no angle');
      }
      return _sinh(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, sinh);
    }
  });

  return sinh;
}

/**
 * Calculate the hyperbolic sine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _sinh (x) {
  if (Math.abs(x) < 1) {
    return x + (x * x * x) / 6 + (x * x * x * x * x) / 120;
  } else {
    return (Math.exp(x) - Math.exp(-x)) / 2;
  }
}

exports.type = 'function';
exports.name = 'sinh';
exports.factory = factory;
