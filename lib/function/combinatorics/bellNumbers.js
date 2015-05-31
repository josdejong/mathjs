'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,

      isNumber = util.number.isNumber,
      isPositiveInteger = util.number.isPositiveInteger;

  /**
   * The Bell Numbers count the number of partitions of a set. A partition is a pairwise disjoint subset of S whose union is S.
   * bellNumbers only takes integer arguments.
   * The following condition must be enforced: n >= 0
   *
   * Syntax:
   *
   *   math.bellNumbers(n)
   *
   * Examples:
   *
   *    math.bellNumbers(3); // returns 5;
   *    math.bellNumbers(8); // returns 4140;
   *
   * See also:
   *
   *    stirlingS2
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

    if (isNumber(n) || n instanceof BigNumber) {

      if (!isPositiveInteger(n)) {
        throw new TypeError('Positive integer value expected in function bellNumbers');
      }

      // Sum (k=0, n) S(n,k).
      for(var i = 0; i <= n; i++) {
        result = math.add(result, math.stirlingS2(n,i));
      }
      return result;
    }
    throw new math.error.UnsupportedTypeError('bellNumbers', math['typeof'](n));
  }
 };