var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Check if value x unequals y, x != y
 * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} x
 * @param  {Number | Complex | Unit | String | Array | Matrix | Range} y
 * @return {Boolean | Array | Matrix} res
 */
module.exports = function unequal(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('unequal', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      return x != y;
    }
    else if (Complex.isComplex(y)) {
      return (x != y.re) || (y.im != 0);
    }
  }

  if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      return (x.re != y) || (x.im != 0);
    }
    else if (Complex.isComplex(y)) {
      return (x.re != y.re) || (x.im != y.im);
    }
  }

  if ((Unit.isUnit(x)) && (Unit.isUnit(y))) {
    if (!x.equalBase(y)) {
      throw new Error('Cannot compare units with different base');
    }
    return x.value != y.value;
  }

  if (string.isString(x) || string.isString(y)) {
    return x != y;
  }

  if (collection.isCollection(x) || collection.isCollection(y)) {
    return collection.map2(x, y, unequal);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return unequal(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('unequal', x, y);
};
