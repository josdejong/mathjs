'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = math.collection,

      isNumber = util.number.isNumber,
      nearlyEqual = util.number.nearlyEqual,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Test whether value x is smaller than y.
   *
   * The function returns true when x is smaller than y and the relative
   * difference between x and y is larger than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.smaller(x, y)
   *
   * Examples:
   *
   *    math.smaller(2, 3);            // returns true
   *    math.smaller(5, 2 * 2);        // returns false
   *
   *    var a = math.unit('5 cm');
   *    var b = math.unit('2 inch');
   *    math.smaller(a, b);            // returns true
   *
   * See also:
   *
   *    equal, unequal, smallerEq, larger, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is smaller than y, else returns false
   */
  math.smaller = function smaller(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('smaller', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return !nearlyEqual(x, y, config.epsilon) && x < y;
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y) || y === null) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.lt(y);
      }

      // downgrade to Number
      return smaller(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x) || x === null) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.lt(y)
      }

      // downgrade to Number
      return smaller(x, y.toNumber());
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value < y.value;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, smaller);
    }

    // Note: test strings after testing collections,
    // else we can't compare a string with a matrix
    if (isString(x) || isString(y)) {
      return x < y;
    }

    if (isBoolean(x) || x === null) {
      return smaller(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return smaller(x, +y);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    throw new math.error.UnsupportedTypeError('smaller', math['typeof'](x), math['typeof'](y));
  };
};
