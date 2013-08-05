var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Get the imaginary part of a complex number.
 *
 *     im(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} im
 */
module.exports = function im(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('im', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return 0;
  }

  if (Complex.isComplex(x)) {
    return x.im;
  }

  if (collection.isCollection(x)) {
    return collection.map(x, im);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return im(x.valueOf());
  }

  // return 0 for all non-complex values
  return 0;
};
