module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      toBigNumber = util.number.toBigNumber;

  /**
   * Compute the number of permutations of n items taken k at a time
   *
   *     permutations(n)
   *     permutations(n, k)
   *
   * permutations only takes integer arguments
   * the following condition must be enforced: k <= n
   *
   * @Param {Number | BigNumber} n
   * @Param {Number | BigNumber} k
   * @return {Number | BigNumber} permutations
   */
  math.permutations = function permutations (n, k) {
    var result, i;

    var arity = arguments.length;
    if (arity > 2) {
      throw new math.error.ArgumentsError('permutations', arguments.length, 2);
    }

    if (isNumber(n)) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function permutations');
      }
      
      // Permute n objects
      if (arity == 1) {
        return math.factorial(n);
      }
      
      // Permute n objects, k at a time
      if (arity == 2) {
        if (isNumber(k)) {
          if (!isInteger(k) || k < 0) {
            throw new TypeError('Positive integer value expected in function permutations');
          }
          if (k > n) {
            throw new TypeError('second argument k must be less than or equal to first argument n');
          }

          result = 1;
          for (i = n - k + 1; i <= n; i++) {
            result = result * i;
          }
          return result;
        }
      }
    }

    if (n instanceof BigNumber) {
      if (k === undefined && isPositiveInteger(n)) {
        return math.factorial(n);
      }

      // make sure k is a BigNumber as well
      // not all numbers can be converted to BigNumber
      k = toBigNumber(k);

      if (!(k instanceof BigNumber) || !isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function permutations');
      }
      if (k.gt(n)) {
        throw new TypeError('second argument k must be less than or equal to first argument n');
      }

      result = new BigNumber(1);
      for (i = n.minus(k).plus(1); i.lte(n); i = i.plus(1)) {
        result = result.times(i);
      }
      return result;
    }

    throw new math.error.UnsupportedTypeError('permutations', n);
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
