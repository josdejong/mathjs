var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    Complex = require('../../type/Complex.js');

/**
 * Compute the argument of a complex value.
 * If x = a + bi, the argument is computed as atan2(b, a).
 *
 *     arg(x)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
module.exports = function arg(x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('arg', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    return Math.atan2(0, x);
  }

  if (Complex.isComplex(x)) {
    return Math.atan2(x.im, x.re);
  }

  if (collection.isCollection(x)) {
    return collection.map(x, arg);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return arg(x.valueOf());
  }

  // handle other types just as non-complex values
  return atan2(0, x);
};

// require after module.exports because of possible circular references
var atan2 = require('../trigonometry/atan2.js');
