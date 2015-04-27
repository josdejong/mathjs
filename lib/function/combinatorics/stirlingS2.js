'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

  BigNumber = math.type.BigNumber,
  collection = math.collection,

  isNumber = util.number.isNumber,
  isInteger = util.number.isInteger;

  /**
  * The Stirling numbers of the second kind, counts the number of ways to partition a set of n labelled objects into k nonempty unlabelled subsets.

  * stirlingS2 only take integer arguments.
  * The following condition must be enforced: k <= n.
  *
  * Syntax:
  *
  *   math.stirlingS2(n, k)
  *
  * Examples:
  *
  *    math.stirlingS2(5, 3); //returns 25
  *
  *  If n = k or k = 1, then s(n,k) = 1
  *
  * @param {Number | BigNumber} n    Total number of objects in the set
  * @param {Number | BigNumber} k    Number of objects in the subset
  * @return {Number | BigNumber}     S(n,k)
  */

  math.stirlingS2 = function stirlingS2 (n, k) {
    var result = 0;
    var arity = arguments.length;
    if (arity != 2) {
      throw new math.error.ArgumentsError('stirlingS2', arguments.length, 2);
    }

    if (isNumber(n) && isNumber(k)) {
      if (!isInteger(n) || n < 0 || !isInteger(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function stirlingS2');
      }
      if (k > n) {
        throw new TypeError('k must be less than or equal to n');
      }

      // 1/k! Sum(i=0 -> k) [(-1)^(k-i)*C(k,j)* i^n]
      var kFactorial = math.factorial(k);
      var denom = 1/kFactorial;
      for(var i = 0; i <= k; i++) {
        var negativeOne = Math.pow(-1, k-i);
        var kChooseI = math.combinations(k,i);
        var iPower = Math.pow(i,n);
        result += (negativeOne * kChooseI * iPower);
      }
      result *= denom;
      console.log("result: ", result)
      return result;
    } else {
      throw new TypeError('Integer values are expected in stirlingS2')
    }

    // if (n instanceof BigNumber) {
  //     // make sure k is a BigNumber as well
  //     // not all numbers can be converted to BigNumber
  //     k = BigNumber.convert(k);

  //     if (!(k instanceof BigNumber) || !isPositiveInteger(k)) {
  //       throw new TypeError('Positive integer value expected in function stirlingS2');
  //     }
  //     if (k.gt(n)) {
  //       throw new TypeError('k must be less than n in function stirlingS2');
  //     }

  //     result = new BigNumber(1);
  //     result = result.dividedBy(math.factorial(k));
  //     for (var i = new BigNumber(1); i.lte(k); i = i.plus(1)) {
  //       var negativeOne = Math.pow(-1, k-i);
  //       var kChooseI = math.combinations(k,i);
  //       var iPower = Math.pow(i,n);
  //       result += (negativeOne * kChooseI * iPower);
  //     }
  //     return result;
  //   }
  //   throw new math.error.UnsupportedTypeError('stirlingS2g', math['typeof'](n));
  };



  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
   var isPositiveInteger = function(n) {
     return n.isInteger() && n.gte(0);
   };
 };
