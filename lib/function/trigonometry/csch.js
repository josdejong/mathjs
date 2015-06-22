'use strict';

var bigCsch = require('../../util/bignumber').cosh_sinh_csch_sech;
var sign = require('../../util/number').sign;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));

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
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic cosecant of x
   */
  var csch = typed('csch', {
    'number': _csch,

    'Complex': function (x) {
      var ep = Math.exp(x.re);
      var en = Math.exp(-x.re);
      var re = Math.cos(x.im) * (ep - en);
      var im = Math.sin(x.im) * (ep + en);
      var den = re * re + im * im;
      return new type.Complex(2 * re / den, -2 * im /den);
    },

    'BigNumber': function (x) {
      return bigCsch(x, type.BigNumber, true, true);
    },

    'Unit': function (x) {
      if (!x.hasBase(type.Unit.BASE_UNITS.ANGLE)) {
        throw new TypeError ('Unit in function csch is no angle');
      }
      return _csch(x.value);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, csch);
    }
  });

  csch.toTex = '\\mathrm{csch}\\left(${args[0]}\\right)';

  return csch;
}

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

exports.name = 'csch';
exports.factory = factory;
