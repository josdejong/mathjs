'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

  BigNumber = math.type.BigNumber,
  isArray = Array.isArray,
  collection = math.collection,
  isInteger = util.number.isInteger,
  isPositiveInteger = util.number.isPositiveInteger;

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
   * @param {number[] | BigNumber[]} a    Integer numbers of objects in the subset
   * @return {Number | BigNumber}         Multinomial coefficient.
   */
   math.multinomial = function multinomial (a) {

    var arity = arguments.length;
    if (arity != 1) {
      throw new math.error.ArgumentsError('multinomial', arguments.length, 1);
    }

    if (!Array.isArray(a)) {
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

};
