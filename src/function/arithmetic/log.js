var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js'),
    Complex = require('../../type/Complex.js');

/**
 * Calculate the logarithm of a value
 *
 *     log(x)
 *     log(x, base)
 *
 * base is optional. If not provided, the natural logarithm of x is calculated.
 * For matrices, the function is evaluated element wise.
 *
 * @param {Number | Complex | Array | Matrix} x
 * @param {Number | Complex} [base]
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function log(x, base) {
  if (arguments.length == 1) {
    // calculate natural logarithm, log(x)
    if (number.isNumber(x)) {
      if (x >= 0) {
        return Math.log(x);
      }
      else {
        // negative value -> complex value computation
        return log(new Complex(x, 0));
      }
    }

    if (Complex.isComplex(x)) {
      return Complex.create (
          Math.log(Math.sqrt(x.re * x.re + x.im * x.im)),
          Math.atan2(x.im, x.re)
      );
    }

    if (collection.isCollection(x)) {
      return collection.map(x, log);
    }

    if (x.valueOf() !== x) {
      // fallback on the objects primitive values
      return log(x.valueOf());
    }

    throw new error.UnsupportedTypeError('log', x);
  }
  else if (arguments.length == 2) {
    // calculate logarithm for a specified base, log(x, base)
    return divide(log(x), log(base));
  }
  else {
    throw new error.ArgumentsError('log', arguments.length, 1, 2);
  }
};

// require after module.exports because of possible circular references
var divide = require('./divide.js');
