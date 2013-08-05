var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    string = require('../../util/string.js'),
    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

/**
 * Check if value a is smaller or equal to b
 *
 *     a <= b
 *     smallereq(a, b)
 *
 * For matrices, the function is evaluated element wise.
 * In case of complex numbers, the absolute values of a and b are compared.
 *
 * @param  {Number | Complex | Unit | String | Array | Matrix} x
 * @param  {Number | Complex | Unit | String | Array | Matrix} y
 * @return {Boolean | Array | Matrix} res
 */
module.exports = function smallereq(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('smallereq', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      return x <= y;
    }
    else if (Complex.isComplex(y)) {
      return x <= abs(y);
    }
  }
  if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      return abs(x) <= y;
    }
    else if (Complex.isComplex(y)) {
      return abs(x) <= abs(y);
    }
  }

  if ((Unit.isUnit(x)) && (Unit.isUnit(y))) {
    if (!x.equalBase(y)) {
      throw new Error('Cannot compare units with different base');
    }
    return x.value <= y.value;
  }

  if (string.isString(x) || string.isString(y)) {
    return x <= y;
  }

  if (collection.isCollection(x) || collection.isCollection(y)) {
    return collection.map2(x, y, smallereq);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return smallereq(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('smallereq', x, y);
};

// require after module.exports because of possible circular references
var abs = require('./abs.js');
