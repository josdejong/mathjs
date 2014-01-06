module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Compute the number of combinations of x items taken k at a time
   *
   *     combinations(x, k)
   *
   * combinations only takes integer arguments
   * the following condition must be enforced: k <= x
   *
   * @Param {Number} x
   * @Param {Number} k
   * @return {Number} combinations
   */
  math.combinations = function combinations (x, k) {
    var arity = arguments.length;
    if (arity != 2) {
      throw new math.error.ArgumentsError('combinations', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (!isInteger(x) || x < 0) {
        throw new TypeError('Positive integer value expected in function combinations');
      }
      return parseInt(math.factorial(x) / (math.factorial(k) * math.factorial(x-k)));
    }
    throw new math.error.UnsupportedTypeError('combinations', x);
  };
};
