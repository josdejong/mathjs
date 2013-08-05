var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Compute the square of a value
 *
 *     x .* x
 *     square(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function square(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('square', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return x * x;
  }

  if (Complex.isComplex(x)) {
    return multiply(x, x);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, square);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return square(x.valueOf());
  }

  throw new error.UnsupportedTypeError('square', x);
};

// require after module.exports because of possible circular references
var multiply = require('./multiply.js');
