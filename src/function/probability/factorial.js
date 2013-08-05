var collection = require('../../type/collection.js'),
    error = require('../../util/error.js'),
    number = require('../../util/number.js');

/**
 * Compute the factorial of a value
 *
 *     x!
 *     factorial(x)
 *
 * Factorial only supports an integer value as argument.
 * For matrices, the function is evaluated element wise.
 *
 * @Param {Number | Array | Matrix} x
 * @return {Number | Array | Matrix} res
 */
module.exports = function factorial (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('factorial', arguments.length, 1);
  }

  if (number.isNumber(x)) {
    if (!number.isInteger(x) || x < 0) {
      throw new TypeError('Positive integer value expected in function factorial');
    }

    var value = x,
        res = value;
    value--;
    while (value > 1) {
      res *= value;
      value--;
    }

    if (res == 0) {
      res = 1;        // 0! is per definition 1
    }

    return res;
  }

  if (collection.isCollection(x)) {
    return collection.map(x, factorial);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return factorial(x.valueOf());
  }

  throw new error.UnsupportedTypeError('factorial', x);
};

// require after module.exports because of possible circular references
var abs = require('../arithmetic/abs.js');
