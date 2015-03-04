'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(2, 4);   // returns true
   *
   *    a = [2, 0, 0];
   *    b = [3, 7, 0];
   *    c = 0;
   *
   *    math.and(a, b);   // returns [true, false, false]
   *    math.and(a, c);   // returns [false, false, false]
   *
   * See also:
   *
   *    not, or, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when both inputs are defined with a nonzero/nonempty value.
   */
  math.and = function and(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('and', arguments.length, 2);
    }

    if ((isNumber(x) || isBoolean(x) || x === null) &&
        (isNumber(y) || isBoolean(y) || y === null)) {
      return !!(x && y);
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return false;
      }

      return and(true, y);
    }
    if (isComplex(y)) {
      if (y.re == 0 && y.im == 0) {
        return false;
      }

      return and(x, true);
    }

    if (x instanceof BigNumber) {
      if (x.isZero() || x.isNaN()) {
        return false;
      }

      return and(true, y);
    }
    if (y instanceof BigNumber) {
      if (y.isZero() || y.isNaN()) {
        return false;
      }

      return and(x, true);
    }

    if (isUnit(x)) {
      if (x.value === null || x.value == 0) {
        return false;
      }

      return and(true, y);
    }
    if (isUnit(y)) {
      if (y.value === null || y.value == 0) {
        return false;
      }

      return and(x, true);
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, and);
    }

    throw new math.error.UnsupportedTypeError('and', math['typeof'](x), math['typeof'](y));
  };
};
