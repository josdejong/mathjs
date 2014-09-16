'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      nearlyEqual = util.number.nearlyEqual,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everying
   * except. `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3);       // returns true
   *    math.unequal(2 + 2, 4);       // returns false
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.unequal(a, b);           // returns false
   *
   *    var c = [2, 5, 1];
   *    var d = [2, 7, 1];
   *
   *    math.unequal(c, d);           // returns [false, true, false]
   *    math.deepEqual(c, d);         // returns false
   *
   *    math.unequal(0, null);        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} x First value to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix | null | undefined} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */
  math.unequal = function unequal(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('unequal', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        return !nearlyEqual(x, y, config.epsilon);
      }
      else if (isComplex(y)) {
        return !nearlyEqual(x, y.re, config.epsilon) || !nearlyEqual(y.im, 0, config.epsilon);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return !nearlyEqual(x.re, y, config.epsilon) || !nearlyEqual(x.im, 0, config.epsilon);
      }
      else if (isComplex(y)) {
        return !nearlyEqual(x.re, y.re, config.epsilon) || !nearlyEqual(x.im, y.im, config.epsilon);
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return !x.eq(y);
      }

      // downgrade to Number
      return unequal(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return !x.eq(y)
      }

      // downgrade to Number
      return unequal(x, y.toNumber());
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value != y.value;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, unequal);
    }

    // Note: test strings after testing collections,
    // else we can accidentally compare a stringified array with a string
    if (isString(x) || isString(y)) {
      return x != y;
    }

    if (isBoolean(x)) {
      return unequal(+x, y);
    }
    if (isBoolean(y)) {
      return unequal(x, +y);
    }

    if (x === null) {
      return y !== null;
    }
    if (y === null) {
      return x !== null;
    }

    if (x === undefined) {
      return y !== undefined;
    }
    if (y === undefined) {
      return x !== undefined;
    }

    throw new math.error.UnsupportedTypeError('unequal', math['typeof'](x), math['typeof'](y));
  };
};
