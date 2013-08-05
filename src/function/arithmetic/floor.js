var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Round a value towards minus infinity
 *
 *     floor(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function floor(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('floor', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.floor(x);
  }

  if (Complex.isComplex(x)) {
    return Complex.create (
        Math.floor(x.re),
        Math.floor(x.im)
    );
  }

  if (collection.isCollection(x)) {
    return collection.map(x, floor);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return floor(x.valueOf());
  }

  throw new error.UnsupportedTypeError('floor', x);
};
