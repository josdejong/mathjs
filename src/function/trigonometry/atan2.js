var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Computes the principal value of the arc tangent of y/x in radians
 *
 *     atan2(y, x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} y
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Complex | Array | Matrix} res
 *
 * @see http://mathworld.wolfram.com/InverseTangent.html
 */
module.exports = function atan2(y, x) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('atan2', arguments.length, 2);
  }

  if (number.isNumber(y)) {
    if (number.isNumber(x)) {
      return Math.atan2(y, x);
    }
    /* TODO: support for complex computation of atan2
     else if (Complex.isComplex(x)) {
     return Math.atan2(y.re, x.re);
     }
     */
  }
  else if (Complex.isComplex(y)) {
    if (number.isNumber(x)) {
      return Math.atan2(y.re, x);
    }
    /* TODO: support for complex computation of atan2
     else if (Complex.isComplex(x)) {
     return Math.atan2(y.re, x.re);
     }
     */
  }

  if (collection.isCollection(y) || collection.isCollection(x)) {
    return collection.map2(y, x, atan2);
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return atan2(y.valueOf(), x.valueOf());
  }

  throw new error.UnsupportedTypeError('atan2', y, x);
};
