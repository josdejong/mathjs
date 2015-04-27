'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

  BigNumber = math.type.BigNumber,
  collection = math.collection,

  isNumber = util.number.isNumber,
  isInteger = util.number.isInteger;

  /**
  * The Bell Numbers count the number of partitions of a set. A partition is a pairwise disjoint subset of S whose union is S.

  * bellNumbers only take integer arguments.
  * The following condition must be enforced: n >= 0
  *
  * Syntax:
  *
  *   math.bellNumbers(n)
  *
  * Examples:
  *
  *    math.bellNumbers(4, 3); //returns 10
  *
  *
  * @param {Number | BigNumber} n    Total number of objects in the set
  * @return {Number | BigNumber}     B(n)
  */

  math.bellNumbers = function bellNumbers (n) {
    var result = 0;
    var arity = arguments.length;
    if (arity != 1) {
      throw new math.error.ArgumentsError('bellNumbers', arguments.length, 1);
    }

    if (isNumber(n)) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function bellNumbers');
      }
      // Sum (k=0, n) S(n,k).
      for(var i = 0; i <= n; i++) {
        var stirlingS2 = math.stirlingS2(n,i);
        result += stirlingS2;
      }
      return result;
   //  } else if (n instanceof BigNumber) {
   //   result = new BigNumber(0);
   //   for (var i = new BigNumber(1); i.lte(n); i = i.plus(1)) {
   //     result += (math.stirlingS2(n, i));
   //   }
   //   return result;
   // } else{
     throw new math.error.UnsupportedTypeError('bellNumbersg', math['typeof'](n));
   }
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
