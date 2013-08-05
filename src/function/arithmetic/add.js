var error = require('../../util/error.js'),
    collection = require('../../type/collection.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Add two values
 *
 *     x + y
 *     add(x, y)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Number | Complex | Unit | String | Array | Matrix} res
 */
module.exports = function add(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('add', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      // number + number
      return x + y;
    }
    else if (Complex.isComplex(y)) {
      // number + complex
      return Complex.create(
          x + y.re,
          y.im
      )
    }
  }
  else if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      // complex + number
      return Complex.create(
          x.re + y,
          x.im
      )
    }
    else if (Complex.isComplex(y)) {
      // complex + complex
      return Complex.create(
          x.re + y.re,
          x.im + y.im
      );
    }
  }
  else if (Unit.isUnit(x)) {
    if (Unit.isUnit(y)) {
      if (!x.equalBase(y)) {
        throw new Error('Units do not match');
      }

      if (x.value == null) {
        throw new Error('Unit on left hand side of operator + has an undefined value');
      }

      if (y.value == null) {
        throw new Error('Unit on right hand side of operator + has an undefined value');
      }

      var res = x.clone();
      res.value += y.value;
      res.fixPrefix = false;
      return res;
    }
  }

  if (string.isString(x) || string.isString(y)) {
    return x + y;
  }

  if (collection.isCollection(x) || collection.isCollection(y)) {
    return collection.map2(x, y, add);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive value
    return add(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('add', x, y);
};
