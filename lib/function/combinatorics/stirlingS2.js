'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,

      isNumber = util.number.isNumber,
      isPositiveInteger = util.number.isPositiveInteger;
  
  /**
   * The Stirling numbers of the second kind, counts the number of ways to partition
   * a set of n labelled objects into k nonempty unlabelled subsets.
   * stirlingS2 only takes integer arguments.
   * The following condition must be enforced: k <= n.
   *
   *  If n = k or k = 1, then s(n,k) = 1
   *
   * Syntax:
   *
   *   math.stirlingS2(n, k)
   *
   * Examples:
   *
   *    math.stirlingS2(5, 3); //returns 25
   *
   * See also:
   *
   *    Bell numbers
   *
   * @param {Number | BigNumber} n    Total number of objects in the set
   * @param {Number | BigNumber} k    Number of objects in the subset
   * @return {Number | BigNumber}     S(n,k)
   */

  math.stirlingS2 = function stirlingS2 (n, k) {
    var arity = arguments.length;
    if (arity != 2) {
      throw new math.error.ArgumentsError('stirlingS2', arguments.length, 2);
    }

    if ((isNumber(n) && isNumber(k)) || n instanceof BigNumber) {

      if (!isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function stirlingS2');
      }
      else if (k > n) {
        throw new TypeError('k must be less than or equal to n');
      }

      if(n instanceof BigNumber) {
        k = BigNumber.convert(k);
      }

      // 1/k! Sum(i=0 -> k) [(-1)^(k-i)*C(k,j)* i^n]
      var kFactorial = math.factorial(k);
      var denom = math.divide(1, kFactorial);
      var result = 0;
      for(var i = 0; i <= k; i++) {
        var negativeOne = math.pow(-1, math.subtract(k,i));
        var kChooseI = math.combinations(k,i);
        var iPower = Math.pow(i,n);
        result = math.chain(kChooseI)
        .multiply(iPower)
        .multiply(negativeOne)
        .add(result)
        .done();
      }
      return math.divide(result,kFactorial);
    } else {
      throw new TypeError('Integer values are expected in stirlingS2')
    }
  };
};
