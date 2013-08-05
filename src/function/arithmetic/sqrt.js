var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the square root of a value
 *
 *     sqrt(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function sqrt (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('sqrt', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    if (x >= 0) {
      return Math.sqrt(x);
    }
    else {
      return sqrt(new Complex(x, 0));
    }
  }

  if (Complex.isComplex(x)) {
    var r = Math.sqrt(x.re * x.re + x.im * x.im);
    if (x.im >= 0) {
      return Complex.create(
          0.5 * Math.sqrt(2.0 * (r + x.re)),
          0.5 * Math.sqrt(2.0 * (r - x.re))
      );
    }
    else {
      return Complex.create(
          0.5 * Math.sqrt(2.0 * (r + x.re)),
          -0.5 * Math.sqrt(2.0 * (r - x.re))
      );
    }
  }

  if (collection.isCollection(x)) {
    return collection.map(x, sqrt);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return sqrt(x.valueOf());
  }

  throw new error.UnsupportedTypeError('sqrt', x);
};
