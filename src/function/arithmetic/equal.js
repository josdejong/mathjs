var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Check if value x equals y,
 *
 *     x == y
 *     equal(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, x.re must equal y.re, and x.im must equal y.im.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
module.exports = function equal(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('equal', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      return x == y;
    }
    else if (Complex.isComplex(y)) {
      return (x == y.re) && (y.im == 0);
    }
  }
  if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      return (x.re == y) && (x.im == 0);
    }
    else if (Complex.isComplex(y)) {
      return (x.re == y.re) && (x.im == y.im);
    }
  }

  if ((Unit.isUnit(x)) && (Unit.isUnit(y))) {
    if (!x.equalBase(y)) {
      throw new Error('Cannot compare units with different base');
    }
    return x.value == y.value;
  }

  if (string.isString(x) || string.isString(y)) {
    return x == y;
  }

  if (collection.isCollection(x) || collection.isCollection(y)) {
    return collection.map2(x, y, equal);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return equal(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('equal', x, y);
};
