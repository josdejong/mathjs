var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    object = require('../../util/object.js'),
    Complex = require('../../type/Complex.js');

/**
 * Compute the complex conjugate of a complex value.
 * If x = a+bi, the complex conjugate is a-bi.
 *
 *     conj(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function conj(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('conj', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return x;
  }

  if (Complex.isComplex(x)) {
    return Complex.create(x.re, -x.im);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, conj);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return conj(x.valueOf());
  }

  // return a clone of the value for non-complex values
  return object.clone(x);
};
