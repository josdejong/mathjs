'use strict';

var deepMap = require('../../utils/collection/deepMap');
var number = require('../../utils/number');
var sqrt = require('../arithmetic/sqrt');

function factory (type, config, load, typed) {
  /**
   * Test whether a value is prime: has no divisors other than itself and one.
   * The function supports type `number`, `bignumber`.
   *
   * The function is evaluated element-wise in case of Array or Matrix input.
   *
   * Syntax:
   *
   *     math.isPrime(x)
   *
   * Examples:
   *
   *    math.isPrime(3);                     // returns true
   *    math.isPrime(-2);                    // returns false
   *    math.isPrime(0);                     // returns false
   *    math.isPrime(-0);                    // returns false
   *    math.isPrime(0.5);                   // returns false
   *    math.isPrime('2');                   // returns true
   *    math.isPrime([2, 17, 100]');           // returns [true, true, false]
   *
   * See also:
   *
   *    isNumeric, isZero, isNegative, isInteger
   *
   * @param {number | BigNumber | Fraction | Unit | Array | Matrix} x  Value to be tested
   * @return {boolean}  Returns true when `x` is larger than zero.
   *                    Throws an error in case of an unknown data type.
   */
  var isPrime = typed('isPrime', {
    'number': function (x) {
      if (x <= 1){
        return false;
      }
      for(var y = 2; y <= Math.sqrt(x); y+=2){
        if (x % y == 0){
          return false;
        }
      }
      return true;
    },

    'BigNumber': function (x) {
      if (x <= 1){
        return false;
      }
      for(var y = 2; y <= x.sqrt(); y+=2){
        if (x % y == 0){
          return false;
        }
      }
      return true;
    },

    'Array | Matrix': function (x) {
      return deepMap(x, isPrime);
    }
  });

  return isPrime;
}

exports.name = 'isPrime';
exports.factory = factory;
