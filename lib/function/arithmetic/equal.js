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
   * Test whether two values are equal.
   *
   * The function tests whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * For matrices, the function tests whether the size and all elements of the
   * matrices are equal (a deep comparison).
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * Syntax:
   *
   *    math.equal(x, y)
   *
   * Examples:
   *
   *    var math = mathjs();
   *
   *    math.equal(2 + 2, 3);         // returns false
   *    math.equal(2 + 2, 4);         // returns true
   *
   *    var a = math.unit('50 cm');
   *    var b = math.unit('5 m');
   *    math.equal(a, b);             // returns true
   *
   * See also:
   *
   *    unequal, smaller, smallerEq, larger, largerEq, compare, dotEqual
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x First value to compare
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y Second value to compare
   * @return {Boolean | Array | Matrix} Returns true when the compared values are equal, else returns false
   */
  math.equal = function equal(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('equal', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        return nearlyEqual(x, y, config.epsilon);
      }
      else if (isComplex(y)) {
        return nearlyEqual(x, y.re, config.epsilon) && nearlyEqual(y.im, 0, config.epsilon);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return nearlyEqual(x.re, y, config.epsilon) && nearlyEqual(x.im, 0, config.epsilon);
      }
      else if (isComplex(y)) {
        return nearlyEqual(x.re, y.re, config.epsilon) && nearlyEqual(x.im, y.im, config.epsilon);
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
        return x.eq(y);
      }

      // downgrade to Number
      return equal(x.toNumber(), y);
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
        return x.eq(y)
      }

      // downgrade to Number
      return equal(x, y.toNumber());
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value == y.value;
    }

    if (isCollection(x) || isCollection(y)) {
      return deepEqual(x.valueOf(), y.valueOf());
    }

    // Note: test strings after testing collections,
    // else we can accidentally compare a stringified array with a string
    if (isString(x) || isString(y)) {
      return x == y;
    }

    if (isBoolean(x)) {
      return equal(+x, y);
    }
    if (isBoolean(y)) {
      return equal(x, +y);
    }

    throw new math.error.UnsupportedTypeError('equal', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Test whether two arrays have the same size and all elements are equal
   * @param {Array | *} x
   * @param {Array | *} y
   * @return {boolean} Returns true if both arrays are deep equal
   */
  function deepEqual(x, y) {
    if (isArray(x)) {
      if (isArray(y)) {
        var len = x.length;
        if (len !== y.length) return false;

        for (var i = 0; i < len; i++) {
          if (!deepEqual(x[i], y[i])) return false;
        }

        return true;
      }
      else {
        return false;
      }
    }
    else {
      if (isArray(y)) {
        return false;
      }
      else {
        return math.equal(x, y);
      }
    }
  }
};
