var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the absolute value of a value.
 *
 *     abs(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function abs(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('abs', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.abs(x);
  }

  if (Complex.isComplex(x)) {
    return Math.sqrt(x.re * x.re + x.im * x.im);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, abs);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return abs(x.valueOf());
  }

  throw new error.UnsupportedTypeError('abs', x);
};
