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
   * Flips boolean value of a given parameter.
   *
   * Syntax:
   *
   *    math.not(x)
   *
   * Examples:
   *
   *    math.not(2);      // returns false
   *    math.not(0);      // returns true
   *    math.not(true);   // returns false
   *
   *    a = [];
   *    b = [2, 7, 1];
   *
   *    math.and(a);      // returns true
   *    math.and(b);      // returns false
   *
   * See also:
   *
   *    and, or
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to check
   * @return {Boolean}
   *            Returns true when input is a zero or empty value.
   */
  math.not = function not(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('not', arguments.length, 1);
    }

    if (isComplex(x)) {
      return x.re == 0 && x.im == 0;
    }

    if (x instanceof BigNumber) {
      return x.isZero() || x.isNaN();
    }

    if (isUnit(x)) {
      return x.value === null || x.value == 0;
    }

    if (isCollection(x)) {
      return !!(x.length == 0 || (x.size && x.size() == 0));
    }

    return !x;
  };
};
