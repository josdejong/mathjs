var math = require('../../math.js'),
    util = require('../../util/index.js'),

    isNumber = util.number.isNumber,
    isInteger = util.number.isInteger;

/**
 * Calculate the extended greatest common divisor for two values.
 *
 *     xgcd(a, b)
 *
 * @param {Number} a       An integer number
 * @param {Number} b       An integer number
 * @return {Array}         An array containing 3 integers [div, m, n]
 *                         where div = gcd(a, b) and a*m + b*n = div
 *
 * @see http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
 */
math.xgcd = function xgcd(a, b) {
  if (arguments.length == 2) {
    // two arguments
    if (isNumber(a) && isNumber(b)) {
      if (!isInteger(a) || !isInteger(b)) {
        throw new Error('Parameters in function xgcd must be integer numbers');
      }

      if(b == 0) {
        return [a, 1, 0];
      }

      var tmp = xgcd(b, a % b),
          div = tmp[0],
          x = tmp[1],
          y = tmp[2];

      return [div, y, x - y * Math.floor(a / b)];
    }

    throw new util.error.UnsupportedTypeError('xgcd', a, b);
  }

  // zero or one argument
  throw new SyntaxError('Function xgcd expects two arguments');
};
