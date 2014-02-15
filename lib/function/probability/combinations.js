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
   * @Param {Number | BigNumber} n
   * @Param {Number | BigNumber} k
   * @return {Number | BigNumber} combinations
   */
  math.combinations = function combinations (n, k) {
    var max, result, i,ii;

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

      max = Math.max(k, n - k);
      result = 1;
      for (i = 1; i <= n - max; i++) {
        result = result * (max + i) / i;
      }
      return result;
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

      max = n.minus(k);
      if (k.lt(max)) max = k;
      result = new BigNumber(1);
      for (i = new BigNumber(1), ii = n.minus(max); i.lte(ii); i = i.plus(1)) {
        result = result.times(max.plus(i)).dividedBy(i);
      }
      return result;
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
