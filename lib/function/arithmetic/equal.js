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
   * Check if value x equals y,
   *
   *     x == y
   *     equal(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
   *
   * The function checks whether the relative difference between x and y is
   * smaller than the configured epsilon. The function cannot be used to
   * compare values smaller than approximately 2.22e-16.
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | String | Array | Matrix} y
   * @return {Boolean | Array | Matrix} res
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
      return collection.deepMap2(x, y, equal);
    }

    // Note: test strings after testing collections,
    // else we can't compare a string with a matrix
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
};
