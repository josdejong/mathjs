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
   * Logical `or`. Test if at least one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.or(x, y)
   *
   * Examples:
   *
   *    math.or(2, 4);   // returns true
   *
   *    a = [2, 5, 0];
   *    b = [0, 22, 0];
   *    c = 0;
   *
   *    math.or(a, b);   // returns [true, true, false]
   *    math.or(b, c);   // returns [false, true, false]
   *
   * See also:
   *
   *    and, not, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one of the inputs is defined with a nonzero/nonempty value.
   */
  math.or = function or(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('or', arguments.length, 2);
    }

    if ((isNumber(x) || isBoolean(x) || x === null) &&
        (isNumber(y) || isBoolean(y) || y === null)) {
      return !!(x || y);
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

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, or);
    }

    throw new math.error.UnsupportedTypeError('or', math['typeof'](x), math['typeof'](y));
  };
};
