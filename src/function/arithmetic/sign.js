var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Compute the sign of a value.
 *
 *     sign(x)
 *
 * The sign of a value x is 1 when x > 1, -1 when x < 0, and 0 when x == 0
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function sign(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('sign', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return number.sign(x);
  }

  if (Complex.isComplex(x)) {
    var abs = Math.sqrt(x.re * x.re + x.im * x.im);
    return Complex.create(x.re / abs, x.im / abs);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, sign);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return sign(x.valueOf());
  }

  throw new error.UnsupportedTypeError('sign', x);
};
