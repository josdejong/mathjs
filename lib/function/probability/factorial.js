'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      collection = math.collection,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Compute the factorial of a value
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.factorial(n)
   *
   * Examples:
   *
   *    math.factorial(5);    // returns 120
   *    math.factorial(3);    // returns 6
   *
   * See also:
   *
   *    combinations, gamma, permutations
   *
   * @param {Number | BigNumber | Array | Matrix | Boolean | null} n   An integer number
   * @return {Number | BigNumber | Array | Matrix}    The factorial of `n`
   */
  math.factorial = function factorial (n) {
    var value, res, preciseFacs;

    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(n)) {
      return n !== Number.POSITIVE_INFINITY
        ? math.gamma(n + 1)
        : Math.sqrt(2*Math.PI);
    }

    if (n instanceof BigNumber) {
      if (!(isNonNegativeInteger(n))) {
        return n.isNegative() || n.isFinite()
          ? math.gamma(n.plus(1))
          : util.bignumber.tau(config.precision).sqrt();
      }

      n = n.toNumber();   // should definitely be below Number.MAX_VALUE
      if (n < smallBigFacs.length) {
        return BigNumber.convert(smallBigFacs[n]).toSD(config.precision);
      }

      // be wary of round-off errors
      var precision = config.precision + (Math.log(n) | 0);
      var Big = BigNumber.constructor({precision: precision});

      // adjust n do align with the precision specific tables
      n -= smallBigFacs.length;
      if (preciseFacs = bigBigFacs[precision]) {
        if (preciseFacs[n]) {
          return new BigNumber(preciseFacs[n].toPrecision(config.precision));
        }
        res = preciseFacs[preciseFacs.length-1];
      } else {
        preciseFacs = bigBigFacs[precision] = [];
        res = new Big(smallBigFacs[smallBigFacs.length-1])
          .toSD(precision);
      }

      var one = new Big(1);
      value = new Big(preciseFacs.length + smallBigFacs.length);
      for (var i = preciseFacs.length; i < n; ++i) {
        preciseFacs[i] = res = res.times(value);
        value = value.plus(one);
      }

      preciseFacs[n] = res.times(value);
      return new BigNumber(preciseFacs[n].toPrecision(config.precision));
    }

    if (isBoolean(n) || n === null) {
      return 1;           // factorial(1) = 1, factorial(0) = 1
    }

    if (isCollection(n)) {
      return collection.deepMap(n, factorial);
    }

    throw new math.error.UnsupportedTypeError('factorial', math['typeof'](n));
  };

  /**
   * Test whether BigNumber n is a non-negative integer
   * @param {BigNumber} n
   * @returns {boolean} isNonNegativeInteger
   */
  var isNonNegativeInteger = function(n) {
    return n.isInteger() && (!n.isNegative() || n.isZero());
  };

  // 21! >= values for each precision
  var bigBigFacs = [];

  // 0-20! values
  var smallBigFacs = [
    1,
    1,
    2,
    6,
    24,
    120,
    720,
    5040,
    40320,
    362880,
    3628800,
    39916800,
    479001600,
    6227020800,
    87178291200,
    1307674368000,
    20922789888000,
    355687428096000,
    6402373705728000,
    121645100408832000,
    2432902008176640000
  ]
};
