module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util['boolean'].isBoolean,
      isString = util.string.isString,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection,
      epsilon = math.config().epsilon;
 
  // minimum number added to one that makes the result different than one
  var DBL_EPSILON = Number.EPSILON || 2.2204460492503130808472633361816E-16;

  /**
   * Compares two floating point numbers.
   */
  var _nearlyEqual = function(x, y) {
    // use "==" operator, handles infinities
    if (x == y)
      return true;
	// NaN
	if (isNaN(x) || isNaN(y))
	  return false;
	// at this point x and y should be finite
	if(isFinite(x) && isFinite(y)) {
      // check numbers are very close, needed when comparing numbers near zero
	  var diff = Math.abs(x - y);
      if (diff < DBL_EPSILON) 
        return true;
      // use relative error
      return diff <= Math.max(Math.abs(x) + Math.abs(y)) * epsilon;
	}
	// Infinite and Number or negative Infinite and positive Infinite cases
	return false;
  };

  /**
   * Check if value x equals y,
   *
   *     x == y
   *     equal(x, y)
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
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
        return _nearlyEqual(x, y);
      }
      else if (isComplex(y)) {
        return _nearlyEqual(x, y.re) && _nearlyEqual(y.im, 0);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return _nearlyEqual(x.re, y) && _nearlyEqual(x.im, 0);
      }
      else if (isComplex(y)) {
        return _nearlyEqual(x.re, y.re) && _nearlyEqual(x.im, y.im);
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.eq(y);
      }

      // downgrade to Number
      return equal(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.eq(y)
      }

      // downgrade to Number
      return equal(x, toNumber(y));
    }

    if ((isUnit(x)) && (isUnit(y))) {
      if (!x.equalBase(y)) {
        throw new Error('Cannot compare units with different base');
      }
      return x.value == y.value;
    }

    if (isString(x) || isString(y)) {
      return x == y;
    }

    if (isCollection(x) || isCollection(y)) {
      return collection.deepMap2(x, y, equal);
    }

    if (isBoolean(x)) {
      return equal(+x, y);
    }
    if (isBoolean(y)) {
      return equal(x, +y);
    }

    throw new math.error.UnsupportedTypeError('equal', x, y);
  };
};
