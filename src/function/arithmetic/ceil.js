var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Round a value towards plus infinity
 *
 *     ceil(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function ceil(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('ceil', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.ceil(x);
  }

  if (Complex.isComplex(x)) {
    return Complex.create (
        Math.ceil(x.re),
        Math.ceil(x.im)
    );
  }

  if (collection.isCollection(x)) {
    return collection.map(x, ceil);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return ceil(x.valueOf());
  }

  throw new error.UnsupportedTypeError('ceil', x);
};
