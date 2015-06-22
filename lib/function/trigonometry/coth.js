'use strict';

var bigCoth = require('../../util/bignumber').tanh_coth;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

  /**
   * Calculate the hyperbolic cotangent of a value,
   * defined as `coth(x) = 1 / tanh(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.coth(x)
   *
   * Examples:
   *
   *    // coth(x) = 1 / tanh(x)
   *    math.coth(2);         // returns 1.0373147207275482
   *    1 / math.tanh(2);     // returns 1.0373147207275482
   *
   * See also:
   *
   *    sinh, tanh, cosh
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic cotangent of x
   */
  var coth = typed('coth', {
    'number': _coth,

    'Complex': function (x) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re - 1) * (re - 1) + im * im;
      return new type.Complex(
          ((re + 1) * (re - 1) + im * im) / den,
          -2 * im / den
      );
    },

    'BigNumber': function (x) {
      return bigCoth(x, type.BigNumber, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function coth is no angle');
      }
      return _coth(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, coth);
    }
  });

  coth.toTex = '\\coth\\left(${args[0]}\\right)';

  return coth;
}

/**
 * Calculate the hyperbolic cosine of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _coth(x) {
  var e = Math.exp(2 * x);
  return (e + 1) / (e - 1);
}

exports.name = 'coth';
exports.factory = factory;
