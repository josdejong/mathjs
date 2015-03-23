'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isCollection = collection.isCollection,

      atan2Big = util.bignumber.arctan2;

  /**
   * Calculate the inverse tangent function with two arguments, y/x.
   * By providing two arguments, the right quadrant of the computed angle can be
   * determined.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.atan2(y, x)
   *
   * Examples:
   *
   *    math.atan2(2, 2) / math.pi;       // returns number 0.25
   *
   *    var angle = math.unit(60, 'deg'); // returns Unit 60 deg
   *    var x = math.cos(angle);
   *    var y = math.sin(angle);
   *
   *    math.atan(2);             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    tan, atan, sin, cos
   *
   * @param {Number | Boolean | Complex | Array | Matrix | null} y  Second dimension
   * @param {Number | Boolean | Complex | Array | Matrix | null} x  First dimension
   * @return {Number | Complex | Array | Matrix} Four-quadrant inverse tangent
   */
  math.atan2 = function atan2(y, x) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('atan2', arguments.length, 2);
    }

    if (isNumber(y)) {
      if (isNumber(x)) {
        return Math.atan2(y, x);
      }

      if (x instanceof BigNumber) {
        return atan2Big(new BigNumber(y), x, BigNumber);
      }
    }

    if (isCollection(y) || isCollection(x)) {
      return collection.deepMap2(y, x, atan2);
    }

    if (isBoolean(y) || y === null) {
      return atan2(y ? 1 : 0, x);
    }
    if (isBoolean(x) || x === null) {
      return atan2(y, x ? 1 : 0);
    }

    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        return atan2Big(y, new BigNumber(x), BigNumber);
      }

      if (x instanceof BigNumber) {
        return atan2Big(y, x, BigNumber);
      }

      return atan2(y.toNumber(), x);
    }
    if (x instanceof BigNumber) {
      if (y instanceof BigNumber) {
        return atan2Big(y, x, BigNumber);
      }

      return atan2(y, x.toNumber());
    }

    // TODO: support for complex computation of atan2

    throw new math.error.UnsupportedTypeError('atan2', math['typeof'](y), math['typeof'](x));
  };
};
