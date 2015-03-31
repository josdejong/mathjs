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
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when input is a zero or empty value.
   */
  math.not = function not(x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('not', arguments.length, 1);
    }

    if (isNumber(x) || isBoolean(x) || x === null) {
      return !x;
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

    throw new math.error.UnsupportedTypeError('not', math['typeof'](x));
  };
};
