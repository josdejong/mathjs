var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Round a value towards zero
 *
 *     fix(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function fix(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('fix', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return (x > 0) ? Math.floor(x) : Math.ceil(x);
  }

  if (Complex.isComplex(x)) {
    return Complex.create(
        (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
        (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
    );
  }

  if (collection.isCollection(x)) {
    return collection.map(x, fix);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return fix(x.valueOf());
  }

  throw new error.UnsupportedTypeError('fix', x);
};
