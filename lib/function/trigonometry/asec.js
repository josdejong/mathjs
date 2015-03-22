'use strict';

var collection = require('../../type/collection');
var bigArcSec = require('../../util/bignumber').arccos_arcsec;

function factory (type, config, load, typed) {
  var complexAcos = load(require('./acos')).signatures['Complex'];

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
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  Function input
   * @return {Number | Complex | Array | Matrix} The arc secant of x
   */
  var asec = typed('asec', {
    'number': function (x) {
      if (x <= -1 || x >= 1) {
        return Math.acos(1 / x);
      }
      return _complexAsec(new type.Complex(x, 0));
    },

    'Complex': _complexAsec,

    'BigNumber': function (x) {
      return bigArcSec(x, type.BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, asec);
    }
  });

  /**
   * Calculate asec for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAsec (x) {
    if (x.re == 0 && x.im == 0) {
      return new type.Complex(0, Infinity);
    }

    var den = x.re*x.re + x.im*x.im;
    x = (den != 0)
        ? new type.Complex(
        x.re =  x.re / den,
        x.im = -x.im / den)
        : new type.Complex(
        (x.re != 0) ?  (x.re / 0) : 0,
        (x.im != 0) ? -(x.im / 0) : 0);

    return complexAcos(x);
  }

  return asec;
}

exports.type = 'function';
exports.name = 'asec';
exports.factory = factory;
