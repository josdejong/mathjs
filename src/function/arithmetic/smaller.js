var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Check if value x is smaller y
 *
 *     x < y
 *     smaller(x, y)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
module.exports = function smaller(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('smaller', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      return x < y;
    }
    else if (Complex.isComplex(y)) {
      return x < abs(y);
    }
  }
  if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      return abs(x) < y;
    }
    else if (Complex.isComplex(y)) {
      return abs(x) < abs(y);
    }
  }

  if ((Unit.isUnit(x)) && (Unit.isUnit(y))) {
    if (!x.equalBase(y)) {
      throw new Error('Cannot compare units with different base');
    }
    return x.value < y.value;
  }

  if (string.isString(x) || string.isString(y)) {
    return x < y;
  }

  if (collection.isCollection(x) || collection.isCollection(y)) {
    return collection.map2(x, y, smaller);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return smaller(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('smaller', x, y);
};

// require after module.exports because of possible circular references
var abs = require('./abs.js');
