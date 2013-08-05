var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the exponent of a value
 *
 *     exp(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function exp (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('exp', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.exp(x);
  }
  if (Complex.isComplex(x)) {
    var r = Math.exp(x.re);
    return Complex.create(
        r * Math.cos(x.im),
        r * Math.sin(x.im)
    );
  }

  if (collection.isCollection(x)) {
    return collection.map(x, exp);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return exp(x.valueOf());
  }

  throw new error.UnsupportedTypeError('exp', x);
};
