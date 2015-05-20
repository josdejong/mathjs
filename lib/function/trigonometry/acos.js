'use strict';

var bigArcCos = require('../../util/bignumber').arccos_arcsec;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var complexSqrt = typed.find(load(require('../arithmetic/sqrt')), ['Complex']);
  var complexLog = typed.find(load(require('../arithmetic/log')), ['Complex']);

  /**
   * Calculate the inverse cosine of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acos(x)
   *
   * Examples:
   *
   *    math.acos(0.5);           // returns Number 1.0471975511965979
   *    math.acos(math.cos(1.5)); // returns Number 1.5
   *
   *    math.acos(2);             // returns Complex 0 + 1.3169578969248166 i
   *
   * See also:
   *
   *    cos, atan, asin
   *
   * @param {Number | BigNumber | Complex | Array | Matrix} x  Function input
   * @return {Number | BigNumber | Complex | Array | Matrix} The arc cosine of x
   */
  var acos = typed('acos', {
    'number': function (x) {
      if (x >= -1 && x <= 1) {
        return Math.acos(x);
      }
      else {
        return _complexAcos(new type.Complex(x, 0));
      }
    },

    'Complex': _complexAcos,

    'BigNumber': function (x) {
      return bigArcCos(x, type.BigNumber, false);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acos);
    }
  });

  /**
   * Calculate acos for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAcos(x) {
    // acos(z) = 0.5*pi + i*log(iz + sqrt(1-z^2))
    var temp1 = new type.Complex(
        x.im * x.im - x.re * x.re + 1.0,
        -2.0 * x.re * x.im
    );
    var temp2 = complexSqrt(temp1);
    var temp3 = new type.Complex(
        temp2.re - x.im,
        temp2.im + x.re
    );
    var temp4 = complexLog(temp3);

    // 0.5*pi = 1.5707963267948966192313216916398
    return new type.Complex(
        1.57079632679489661923 - temp4.im,
        temp4.re
    );
  }

  return acos;
}

exports.name = 'acos';
exports.factory = factory;
