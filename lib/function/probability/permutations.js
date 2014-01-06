module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Compute the number of permutations of n items taken k at a time
   *
   *     permutations(n)
   *     permutations(n, k)
   *
   * permutations only takes integer arguments
   * the following condition must be enforced: k <= n
   *
   * @Param {Number} n
   * @Param {Number} k
   * @return {Number} permutations
   */
  math.permutations = function permutations (n, k) {
    var arity = arguments.length;
    if (arity > 2) {
      throw new math.error.ArgumentsError('permutations', arguments.length, 2);
    }

    if (isNumber(n)) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value enpected in function permutations');
      }
      
      // Permute n objects
      if (arity == 1) {
        return math.factorial(n);
      }
      
      // Permute n objects, k at a time
      if (arity == 2) {
        if (isNumber(k)) {
          if (!isInteger(k) || k < 0) {
            throw new TypeError('Positive integer value enpected in function permutations');
          }
          if (k > n) {
            throw new TypeError('second argument k must be less than or equal to first argument n');
          }
          return parseInt(math.factorial(n) / math.factorial(n-k));
        }
      }
    }
    throw new math.error.UnsupportedTypeError('permutations', n);
  };
};
