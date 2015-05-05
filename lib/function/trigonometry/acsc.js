'use strict';

var bigArcCsc = require('../../util/bignumber').arcsin_arccsc;

var HALF_PI = 1.5707963267948966;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var complexAsin = load(require('./asin')).signatures['Complex'];

  /**
   * Calculate the inverse cosecant of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsc(x)
   *
   * Examples:
   *
   *    math.acsc(0.5);           // returns Number 0.5235987755982989
   *    math.acsc(math.csc(1.5)); // returns Number ~1.5
   *
   *    math.acsc(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    csc, asin, asec
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} x   Function input
   * @return {Number | Complex | Array | Matrix} The arc cosecant of x
   */
  var acsc = typed('acsc', {
    'number': function (x) {
      if (x <= -1 || x >= 1) {
        return Math.asin(1 / x);
      }
      return _complexAcsc(new type.Complex(x, 0));
    },

    'Complex': _complexAcsc,

    'BigNumber': function (x) {
      return bigArcCsc(x, type.BigNumber, true);
    },

    'Array | Matrix': function (x) {
      return collection.deepMap(x, acsc);
    }
  });

  /**
   * Calculate acsc for a complex value
   * @param {Complex} x
   * @returns {Complex}
   * @private
   */
  function _complexAcsc (x) {
    if (x.re == 0 && x.im == 0) {
      return new type.Complex(HALF_PI, Infinity);
    }

    var den = x.re*x.re + x.im*x.im;
    x = (den != 0)
        ? new type.Complex(
        x.re =  x.re / den,
        x.im = -x.im / den)
        : new type.Complex(
        (x.re != 0) ?  (x.re / 0) : 0,
        (x.im != 0) ? -(x.im / 0) : 0);

    return complexAsin(x);
  }

  return acsc;
}

exports.name = 'acsc';
exports.factory = factory;
