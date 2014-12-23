'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Logical `and`. Test whether two values are both defined with a nonzero/nonempty value.
   *
   * Syntax:
   *
   *    math.and(x, y)
   *
   * Examples:
   *
   *    math.and(2, 4);   // returns true
   *
   *    a = [2, 5, 1];
   *    b = [2, 7, 1];
   *    c = 0;
   *
   *    math.and(a, b);   // returns true
   *    math.and(a, c);   // returns false
   *
   * See also:
   *
   *    not, or
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to check
   * @return {Boolean}
   *            Returns true when both inputs are defined with a nonzero/nonempty value.
   */
  math.and = function and(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('and', arguments.length, 2);
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

    if (isCollection(x)) {
      if (x.length == 0 || (x.size && x.size() == 0)) {
        return false;
      }

      return and(true, y);
    }
    if (isCollection(y)) {
      if (y.length == 0 || (y.size && y.size() == 0)) {
        return false;
      }

      return and(x, true);
    }

    return !!(x && y);
  };
};
