module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Compute the number of combinations of n items taken k at a time
   *
   *     combinations(n, k)
   *
   * combinations only takes integer arguments
   * the following condition must be enforced: k <= n
   *
   * @Param {Number} n
   * @Param {Number} k
   * @return {Number} combinations
   */
  math.combinations = function combinations (n, k) {
    var arity = arguments.length;
    if (arity != 2) {
      throw new math.error.ArgumentsError('combinations', arguments.length, 2);
    }

    if (isNumber(n)) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value enpected in function combinations');
      }
      if (k > n) {
        throw new TypeError('k must be less than or equal to n');
      }
      return Math.floor(math.factorial(n) / (math.factorial(k) * math.factorial(n-k)));
    }
    throw new math.error.UnsupportedTypeError('combinations', n);
  };
};
