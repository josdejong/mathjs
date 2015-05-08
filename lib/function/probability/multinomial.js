'use strict';
var _ = require('underscore');

module.exports = function (math) {
  var util = require('../../util/index'),

  BigNumber = math.type.BigNumber,
  isArray = Array.isArray,
  collection = math.collection,

  isNumber = util.number.isNumber,
  isInteger = util.number.isInteger;

  /**
   * Multinomial Coefficients compute the number of ways of picking a1, a2, ..., ai unordered outcomes from `n` possibilities.
   *
   * multinomial takes one array of integers as an argument.
   * The following condition must be enforced: every ai <= 0
   *
   * Syntax:
   *
   *     math.multinomial(a) // a is an array type
   *
   * Examples:
   *
   *    math.multinomial([1,2,1]); // returns 12
   *
   * See also:
   *
   *    combinations, factorial
   *
   * @param {Integer[] | BigNumber[]} a    Number of objects in the subset
   * @return {Number | BigNumber}     Multinomial coefficient.
   */
   math.multinomial = function multinomial (a) {

    var arity = arguments.length;
    if (arity != 1) {
      throw new math.error.ArgumentsError('multinomial', arguments.length, 1);
    }

    if (!_.isArray(a)) {
      throw new math.error.UnsupportedTypeError('multinomial', math['typeof'](a));
    }
    var n = 0;
    var denom = 1;
    collection.deepForEach(a, function(ai) {
      if(!isPositiveInteger(ai)) {
        throw new TypeError('Positive integer value expected in function multinomial');
      }
      n = math.add(n, ai);
      denom = math.multiply(denom, math.factorial(ai));
    });
    return math.divide(math.factorial(n), denom);
  };

  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
   var isPositiveInteger = function(a) {
    return ((a % 1 === 0) && (math.larger(a, 0)));
  };
};
