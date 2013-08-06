var math = require('../../math.js'),
    util = require('../../util/index.js'),

    collection = require('../../type/collection.js'),

    isNumber = util.number.isNumber,
    isInteger = util.number.isInteger,
    isCollection = collection.isCollection;

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
math.factorial = function factorial (x) {
  if (arguments.length != 1) {
    throw new util.error.ArgumentsError('factorial', arguments.length, 1);
  }

  if (isNumber(x)) {
    if (!isInteger(x) || x < 0) {
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

  if (isCollection(x)) {
    return collection.map(x, factorial);
  }

  if (x.valueOf() !== x) {
    // fallback on the objects primitive value
    return factorial(x.valueOf());
  }

  throw new util.error.UnsupportedTypeError('factorial', x);
};
