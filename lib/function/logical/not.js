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
   * Logical `not`. Flips boolean value of a given parameter.
   * For matrices, the function is evaluated element wise.
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
   *    a = [2, -7, 0];
   *    math.not(a);      // returns [false, false, true]
   *
   * See also:
   *
   *    and, or, xor
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to check
   * @return {Boolean | Matrix}
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
      return collection.deepMap(x, not);
    }

    return !x;
  };
};
