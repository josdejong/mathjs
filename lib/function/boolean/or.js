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
   * Test if at least one value is defined with a nonzero/nonempty value.
   *
   * Syntax:
   *
   *    math.or(x, y)
   *
   * Examples:
   *
   *    math.or(2, 4);   // returns true
   *
   *    a = [2, 5, 1];
   *    b = [];
   *    c = 0;
   *
   *    math.or(a, b);   // returns true
   *    math.or(b, c);   // returns false
   *
   * See also:
   *
   *    and, not
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to check
   * @return {Boolean}
   *            Returns true when one of the inputs is defined with a nonzero/nonempty value.
   */
  math.or = function or(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('or', arguments.length, 2);
    }

    if (isComplex(x)) {
      if (x.re == 0 && x.im == 0) {
        return or(false, y);
      }
      return true;
    }
    if (isComplex(y)) {
      if (y.re == 0 && y.im == 0) {
        return or(x, false);
      }
      return true;
    }

    if (x instanceof BigNumber) {
      if (x.isZero() || x.isNaN()) {
        return or(false, y);
      }
      return true;
    }
    if (y instanceof BigNumber) {
      if (y.isZero() || y.isNaN()) {
        return or(x, false);
      }
      return true;
    }

    if (isUnit(x)) {
      if (x.value === null || x.value == 0) {
        return or(false, y);
      }
      return true;
    }
    if (isUnit(y)) {
      if (y.value === null || y.value == 0) {
        return or(x, false);
      }
      return true;
    }

    if (isCollection(x)) {
      if (x.length == 0 || (x.size && x.size() == 0)) {
        return or(false, y);
      }
      return true;
    }
    if (isCollection(y)) {
      if (y.length == 0 || (y.size && y.size() == 0)) {
        return or(x, false);
      }
      return true;
    }

    return !!(x || y);
  };
};
