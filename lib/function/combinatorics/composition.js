'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var combinations = load(require('../probability/combinations'));

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
  return typed('composition', {
    'number, number': function (n, k) {
      if (!isInteger(n) || n < 0 || !isInteger(k) || k < 0) {
        throw new TypeError('Positive integer value expected in function composition');
      }
      else if (k > n) {
        throw new TypeError('k must be less than or equal to n in function composition');
      }

      return combinations(n-1, k-1);
    },

    'BigNumber, BigNumber': function (n, k) {
      if (!isPositiveInteger(n) || !isPositiveInteger(k)) {
        throw new TypeError('Positive integer value expected in function composition');
      }
      if (k.gt(n)) {
        throw new TypeError('k must be less than or equal to n in function composition');
      }

      return combinations(n.minus(1), k.minus(1));
    }
  });

  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
  function isPositiveInteger(n) {
    return n.isInteger() && n.gte(0);
  }
}

exports.name = 'composition';
exports.factory = factory;
