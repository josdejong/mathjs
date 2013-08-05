var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Compute the cube of a value
 *
 *     x .* x .* x
 *     cube(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function cube(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('cube', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return x * x * x;
  }

  if (Complex.isComplex(x)) {
    return multiply(multiply(x, x), x);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, cube);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return cube(x.valueOf());
  }

  throw new error.UnsupportedTypeError('cube', x);
};

// require after module.exports because of possible circular references
var multiply = require('./multiply.js');
