module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Compute the factorial of a value
   *
   *     n!
   *     factorial(n)
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * @Param {Number | BigNumber | Array | Matrix} n
   * @return {Number | BigNumber | Array | Matrix} res
   */
  math.factorial = function factorial (n) {
    var value, res;

    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(n)) {
      if (!isInteger(n) || n < 0) {
        throw new TypeError('Positive integer value expected in function factorial');
      }

      value = n - 1;
      res = n;
      while (value > 1) {
        res *= value;
        value--;
      }

      if (res == 0) {
        res = 1;        // 0! is per definition 1
      }

      return res;
    }

    if (n instanceof BigNumber) {
      if (!(isPositiveInteger(n))) {
        throw new TypeError('Positive integer value expected in function factorial');
      }

      var one = new BigNumber(1);

      value = n.minus(one);
      res = n;
      while (value.gt(one)) {
        res = res.times(value);
        value = value.minus(one);
      }

      if (res.equals(0)) {
        res = one;        // 0! is per definition 1
      }

      return res;
    }

    if (isBoolean(n)) {
      return 1; // factorial(1) = 1, factorial(0) = 1
    }

    if (isCollection(n)) {
      return collection.deepMap(n, factorial);
    }

    throw new math.error.UnsupportedTypeError('factorial', n);
  };

  /**
   * Test whether BigNumber n is a positive integer
   * @param {BigNumber} n
   * @returns {boolean} isPositiveInteger
   */
  var isPositiveInteger = function(n) {
    return n.round().equals(n) && n.gte(0);
  };
};
