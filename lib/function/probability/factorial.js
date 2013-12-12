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
   *     x!
   *     factorial(x)
   *
   * Factorial only supports an integer value as argument.
   * For matrices, the function is evaluated element wise.
   *
   * @Param {Number | BigNumber | Array | Matrix} x
   * @return {Number | BigNumber | Array | Matrix} res
   */
  math.factorial = function factorial (x) {
    var value, res;

    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('factorial', arguments.length, 1);
    }

    if (isNumber(x)) {
      if (!isInteger(x) || x < 0) {
        throw new TypeError('Positive integer value expected in function factorial');
      }

      value = x - 1;
      res = x;
      while (value > 1) {
        res *= value;
        value--;
      }

      if (res == 0) {
        res = 1;        // 0! is per definition 1
      }

      return res;
    }

    if (x instanceof BigNumber) {
      if (!x.round().equals(x) || x.lt(0)) {
        throw new TypeError('Positive integer value expected in function factorial');
      }

      var one = new BigNumber(1);

      value = x.minus(one);
      res = x;
      while (value.gt(one)) {
        res = res.times(value);
        value = value.minus(one);
      }

      if (res.equals(0)) {
        res = one;        // 0! is per definition 1
      }

      return res;
    }

    if (isBoolean(x)) {
      return 1; // factorial(1) = 1, factorial(0) = 1
    }

    if (isCollection(x)) {
      return collection.deepMap(x, factorial);
    }

    throw new math.error.UnsupportedTypeError('factorial', x);
  };
};
