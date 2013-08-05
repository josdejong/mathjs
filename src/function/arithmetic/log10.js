var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the 10-base logarithm of a value
 *
 *     log10(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function log10(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('log10', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    if (x >= 0) {
      return Math.log(x) / Math.LN10;
    }
    else {
      // negative value -> complex value computation
      return log10(new Complex(x, 0));
    }
  }

  if (Complex.isComplex(x)) {
    return Complex.create (
        Math.log(Math.sqrt(x.re * x.re + x.im * x.im)) / Math.LN10,
        Math.atan2(x.im, x.re) / Math.LN10
    );
  }

  if (collection.isCollection(x)) {
    return collection.map(x, log10);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return log10(x.valueOf());
  }

  throw new error.UnsupportedTypeError('log10', x);
};
