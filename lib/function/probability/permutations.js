module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Compute the number of permutations of x items taken k at a time
   *
   *     permutations(x)
   *     permutations(x, k)
   *
   * permutations only takes integer arguments
   * the following condition must be enforced: k <= x
   *
   * @Param {Number} x
   * @Param {Number} k
   * @return {Number} permutations
   */
  math.permutations = function permutations (x, k) {
    var arity = arguments.length;
    if (arity > 2) {
      throw new math.error.ArgumentsError('permutations', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (!isInteger(x) || x < 0) {
        throw new TypeError('Positive integer value expected in function permutations');
      }
      
      // Permute x objects
      if (arity == 1) {
        return math.factorial(x);
      }
      
      // Permute x objects, k at a time
      if (arity == 2) {
        if (isNumber(k)) {
          if (!isInteger(k) || k < 0) {
            throw new TypeError('Positive integer value expected in function permutations');
          }
          if (k > x) {
            throw new TypeError('second argument k must be less than or equal to first argument x');
          }
          return parseInt(math.factorial(x) / math.factorial(x-k));
        }
      }
    }
    throw new math.error.UnsupportedTypeError('permutations', x);
  };
};
