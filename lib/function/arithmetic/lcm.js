module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Calculate the least common multiple for two or more values or arrays.
   *
   *     lcm(a, b)
   *     lcm(a, b, c, ...)
   *
   * lcm is defined as:
   *     lcm(a, b) = abs(a * b) / gcd(a, b)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {... Number | Boolean | Array | Matrix} args    two or more integer numbers
   * @return {Number | Array | Matrix} least common multiple
   */
  math.lcm = function lcm(args) {
    var a = arguments[0],
        b = arguments[1],
        t;

    if (arguments.length == 2) {
      // two arguments
      if (isNumber(a) && isNumber(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function lcm must be integer numbers');
        }

        if (a == 0 || b == 0) {
          return 0;
        }

        // http://en.wikipedia.org/wiki/Euclidean_algorithm
        // evaluate gcd here inline to reduce overhead
        var prod = a * b;
        while (b != 0) {
          t = b;
          b = a % t;
          a = t;
        }
        return Math.abs(prod / a);
      }

      // evaluate lcm element wise
      if (isCollection(a) || isCollection(b)) {
        return collection.deepMap2(a, b, lcm);
      }

      if (isBoolean(a)) {
        return lcm(+a, b);
      }
      if (isBoolean(b)) {
        return lcm(a, +b);
      }

      // TODO: implement BigNumber support for lcm

      // downgrade bignumbers to numbers
      if (a instanceof BigNumber) {
        return lcm(toNumber(a), b);
      }
      if (b instanceof BigNumber) {
        return lcm(a, toNumber(b));
      }

      throw new math.error.UnsupportedTypeError('lcm', a, b);
    }

    if (arguments.length > 2) {
      // multiple arguments. Evaluate them iteratively
      for (var i = 1; i < arguments.length; i++) {
        a = lcm(a, arguments[i]);
      }
      return a;
    }

    // zero or one argument
    throw new SyntaxError('Function lcm expects two or more arguments');
  };
};
