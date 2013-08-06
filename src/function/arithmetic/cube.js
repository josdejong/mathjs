var math = require('../../math.js'),
    util = require('../../util/index.js'),

    Complex = require('../../type/Complex.js').Complex,
    collection = require('../../type/collection.js'),

    isNumber = util.number.isNumber,
    isComplex = Complex.isComplex,
    isCollection = collection.isCollection;

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
math.cube = function cube(x) {
  if (arguments.length != 1) {
    throw new util.error.ArgumentsError('cube', arguments.length, 1);
  }

  if (isNumber(x)) {
    return x * x * x;
  }

  if (isComplex(x)) {
    return math.multiply(math.multiply(x, x), x);
  }

  if (isCollection(x)) {
    return collection.map(x, cube);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return cube(x.valueOf());
  }

  throw new util.error.UnsupportedTypeError('cube', x);
};
