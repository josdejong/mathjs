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
   * Logical `xor`. Test whether one and only one value is defined with a nonzero/nonempty value.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.xor(x, y)
   *
   * Examples:
   *
   *    math.xor(2, 4);   // returns false
   *
   *    a = [2, 0, 0];
   *    b = [2, 7, 0];
   *    c = 0;
   *
   *    math.xor(a, b);   // returns [false, true, false]
   *    math.xor(a, c);   // returns [true, false, false]
   *
   * See also:
   *
   *    and, not, or
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to check
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to check
   * @return {Boolean | Array | Matrix}
   *            Returns true when one and only one input is defined with a nonzero/nonempty value.
   */
  math.xor = function xor(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('xor', arguments.length, 2);
    }

    if ((isNumber(x) || isBoolean(x) || x === null) &&
        (isNumber(y) || isBoolean(y) || y === null)) {
      return !!(!!x ^ !!y);
    }

    if (isComplex(x)) {
      return xor(!(x.re == 0 && x.im == 0), y);
    }
    if (isComplex(y)) {
      return xor(x, !(y.re == 0 && y.im == 0));
    }

    if (x instanceof BigNumber) {
      return xor(!(x.isZero() || x.isNaN()), y);
    }
    if (y instanceof BigNumber) {
      return xor(x, !(y.isZero() || y.isNaN()));
    }

    if (isUnit(x)) {
      return xor(!(x.value === null || x.value == 0), y);
    }
    if (isUnit(y)) {
      return xor(x, !(y.value === null || y.value == 0));
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, xor);
    }

    throw new math.error.UnsupportedTypeError('xor', math['typeof'](x), math['typeof'](y));
  };
};
