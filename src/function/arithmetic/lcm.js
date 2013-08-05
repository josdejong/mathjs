var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    collection = require('../../type/collection.js');

/**
 * Calculate the least common multiple for two or more values or arrays.
 *
 *     lcm(a, b)
 *     lcm(a, b, c, ...)
 *
 * lcm is defined as:
 *     lcm(a, b) = abs(a * b) / gcd(a, b)
 *
 * For matrices, the function is evaluated element wise.
 *
 * @param {... Number | Array | Matrix} args    two or more integer numbers
 * @return {Number | Array | Matrix} least common multiple
 */
module.exports = function lcm(args) {
  var a = arguments[0],
      b = arguments[1],
      t;

  if (arguments.length == 2) {
    // two arguments
    if (number.isNumber(a) && number.isNumber(b)) {
      if (!number.isInteger(a) || !number.isInteger(b)) {
        throw new Error('Parameters in function lcm must be integer numbers');
      }

      // http://en.wikipedia.org/wiki/Euclidean_algorithm
      // evaluate gcd here inline to reduce overhead
      var prod = a * b;
      while (b != 0) {
        t = b;
        b = a % t;
        a = t;
      }
      return Math.abs(prod / a);
    }

    // evaluate lcm element wise
    if (collection.isCollection(a) || collection.isCollection(b)) {
      return collection.map2(a, b, lcm);
    }

    if (a.valueOf() !== a || b.valueOf() !== b) {
      // fallback on the objects primitive value
      return lcm(a.valueOf(), b.valueOf());
    }

    throw new error.UnsupportedTypeError('lcm', a, b);
  }

  if (arguments.length > 2) {
    // multiple arguments. Evaluate them iteratively
    for (var i = 1; i < arguments.length; i++) {
      a = lcm(a, arguments[i]);
    }
    return a;
  }

  // zero or one argument
  throw new SyntaxError('Function lcm expects two or more arguments');
};
