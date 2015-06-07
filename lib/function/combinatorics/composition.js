'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * The composition counts of n into k parts.
   *
   * composition only takes integer arguments.
   * The following condition must be enforced: k <= n.
   *
   * Syntax:
   *
   *   math.composition(n, k)
   *
   * Examples:
   *
   *    math.composition(5, 3); // returns 6
   *
   * See also:
   *
   *    combinations
   *
   * @param {Number | BigNumber} n    Total number of objects in the set
   * @param {Number | BigNumber} k    Number of objects in the subset
   * @return {Number | BigNumber}     Returns the composition counts of n into k parts.
   */
  math.composition = function composition (n, k) {
    var arity = arguments.length;
    if (arity != 2) {
      throw new math.error.ArgumentsError('composition', arguments.length, 2);
    }

    if ((isNumber(n) && isNumber(k)) || n instanceof BigNumber) {

      if (!isInteger(n) || n < 0 || !isInteger(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function composition');
      }
      else if (k > n) {
        throw new TypeError('k must be less than or equal to n');
      }
      return math.combinations(n-1, k-1);
    }
    else if (n instanceof BigNumber) {
      // make sure k is a BigNumber as well
      // not all numbers can be converted to BigNumber
      k = BigNumber.convert(k);

      if (!(k instanceof BigNumber) || !isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function composition');
      }
      if (k.gt(n)) {
        throw new TypeError('k must be less than n in function composition');
      }
      return math.combinations(n.minus(1), k.minus(1));
    } else {
      throw new TypeError('Integer values are expected in composition')
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
