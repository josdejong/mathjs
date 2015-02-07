'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Compute the factorial of a value
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.factorial(n)
   *
   * Examples:
   *
   *    math.factorial(5);    // returns 120
   *    math.factorial(3);    // returns 6
   *
   * See also:
   *
   *    combinations, gamma, permutations
   *
   * @param {Number | BigNumber | Array | Matrix | Boolean | null} n   An integer number
   * @return {Number | BigNumber | Array | Matrix}    The factorial of `n`
   */
  math.factorial = function factorial (n) {
    var value, res;

    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(n)) {
      return math.gamma(n + 1);
    }

    if (n instanceof BigNumber) {
      if (!(isPositiveInteger(n)) && n.isFinite()) {
        return math.gamma(n.plus(1));
      }

      if (!n.isFinite()) {
        return new BigNumber(n);
      }

      n = n.toNumber();
      if (n < fac.length) {
        return (n < 21)
          ? new BigNumber(fac[n])
          : fac[n];
      }

      var one = new BigNumber(1);
      value = new BigNumber(fac.length);
      res = fac[fac.length - 1];
      for (var i = fac.length; i < n; ++i) {
        res = res.times(value);
        value = value.plus(one);
        fac[i] = res;
      }

      return fac[n] = res.times(value);
    }

    if (isBoolean(n) || n === null) {
      return 1;           // factorial(1) = 1, factorial(0) = 1
    }

    if (isCollection(n)) {
      return collection.deepMap(n, factorial);
    }

    throw new math.error.UnsupportedTypeError('factorial', math['typeof'](n));
  };

  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
  var isPositiveInteger = function(n) {
    return n.isInteger() && (!n.isNegative() || n.isZero());
  };

  // 0-21! values
  var fac = [
    1,
    1,
    2,
    6,
    24,
    120,
    720,
    5040,
    40320,
    362880,
    3628800,
    39916800,
    479001600,
    6227020800,
    87178291200,
    1307674368000,
    20922789888000,
    355687428096000,
    6402373705728000,
    121645100408832000,
    2432902008176640000,
    new BigNumber('51090942171709440000')
  ]
};
