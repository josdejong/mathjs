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
   * Test whether value x is larger or equal to y.
   *
   * The function returns true when x is larger than y or the relative
   * difference between x and y is smaller than the configured epsilon. The
   * function cannot be used to compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.largerEq(x, y)
   *
   * Examples:
   *
   *    math.larger(2, 1 + 1);         // returns false
   *    math.largerEq(2, 1 + 1);       // returns true
   *
   * See also:
   *
   *    equal, unequal, smaller, smallerEq, larger, compare
   *
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} x First value to compare
   * @param  {Number | BigNumber | Boolean | Unit | String | Array | Matrix | null} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the x is larger or equal to y, else returns false
   */
  math.largerEq = function largerEq(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('largerEq', arguments.length, 2);
    }

    if (isNumber(x) && isNumber(y)) {
      return nearlyEqual(x, y, config.epsilon) || x > y;
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
        return x.gte(y);
      }

      // downgrade to Number
      return largerEq(x.toNumber(), y);
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
        return x.gte(y)
      }

      // downgrade to Number
      return largerEq(x, y.toNumber());
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value >= y.value;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, largerEq);
    }

    // Note: test strings after testing collections,
    // else we can't compare a string with a matrix
    if (isString(x) || isString(y)) {
      return x >= y;
    }

    if (isBoolean(x) || x === null) {
      return largerEq(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return largerEq(x, +y);
    }

    if (isComplex(x) || isComplex(y)) {
      throw new TypeError('No ordering relation is defined for complex numbers');
    }

    throw new math.error.UnsupportedTypeError('largerEq', math['typeof'](x), math['typeof'](y));
  };

  // TODO: deprecated since version 0.23.0, cleanup some day
  math.largereq = function () {
    throw new Error('Function largereq is renamed to largerEq');
  }
};
