'use strict';

var collection = require('../../type/collection');
var bigTanh = require('../../util/bignumber').tanh_coth;

function factory (type, config, load, typed) {
  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5);                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5);  // returns 0.46211715726000974
   *    1 / math.coth(0.5);               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} Hyperbolic tangent of x
   */  
  var tanh = typed('tanh', {
    'number': _tanh,

    'Complex': function (x) {
      var r = Math.exp(2 * x.re);
      var re = r * Math.cos(2 * x.im);
      var im = r * Math.sin(2 * x.im);
      var den = (re + 1) * (re + 1) + im * im;
      return new type.Complex(
          ((re - 1) * (re + 1) + im * im) / den,
          im * 2 / den
      );
    },

    'BigNumber': function (x) {
      return bigTanh(x, type.BigNumber, false);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function tanh is no angle');
      }
      return _tanh(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, tanh);
    }
  });

  return tanh;
}

/**
 * Calculate the hyperbolic tangent of a number
 * @param {number} x
 * @returns {number}
 * @private
 */
function _tanh (x) {
  var e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
}

exports.name = 'tanh';
exports.factory = factory;
