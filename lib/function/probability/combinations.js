module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      toBigNumber = util.number.toBigNumber;

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

    if (n instanceof BigNumber) {
      // make sure k is a BigNumber as well
      // not all numbers can be converted to BigNumber
      k = toBigNumber(k);

      if (!(k instanceof BigNumber) || !isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function combinations');
      }
      if (k.gt(n)) {
        throw new TypeError('k must be less than n in function combinations');
      }

      return math.floor(math.divide(math.factorial(n),
          math.multiply(math.factorial(k),
              math.factorial(math.subtract(n, k)))));
    }

    throw new math.error.UnsupportedTypeError('combinations', n);
  };

  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
  var isPositiveInteger = function(n) {
    return n.round().equals(n) && n.gte(0);
  };
};
