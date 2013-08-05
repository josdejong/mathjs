var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    object = require('../../util/object.js'),
    Complex = require('../../type/Complex.js');

/**
 * Get the real part of a complex number.
 *
 *     re(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} re
 */
module.exports = function re(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('re', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return x;
  }

  if (Complex.isComplex(x)) {
    return x.re;
  }

  if (collection.isCollection(x)) {
    return collection.map(x, re);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return re(x.valueOf());
  }

  // return a clone of the value itself for all non-complex values
  return object.clone(x);
};
