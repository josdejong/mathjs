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
   * Calculate the greatest common divisor for two or more values or arrays.
   *
   *     gcd(a, b)
   *     gcd(a, b, c, ...)
   *
   * For matrices, the function is evaluated element wise.
   *
   * @param {... Number | Boolean | Array | Matrix} args    two or more integer numbers
   * @return {Number | Array | Matrix} greatest common divisor
   */
  math.gcd = function gcd(args) {
    var a = arguments[0],
        b = arguments[1],
        r; // remainder

    if (arguments.length == 2) {
      // two arguments
      if (isNumber(a) && isNumber(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function gcd must be integer numbers');
        }

        // http://en.wikipedia.org/wiki/Euclidean_algorithm
        while (b != 0) {
          r = a % b;
          a = b;
          b = r;
        }
        return (a < 0) ? -a : a;
      }

      // evaluate gcd element wise
      if (isCollection(a) || isCollection(b)) {
        return collection.deepMap2(a, b, gcd);
      }

      // TODO: implement BigNumber support for gcd

      // downgrade bignumbers to numbers
      if (a instanceof BigNumber) {
        return gcd(toNumber(a), b);
      }
      if (b instanceof BigNumber) {
        return gcd(a, toNumber(b));
      }

      if (isBoolean(a)) {
        return gcd(+a, b);
      }
      if (isBoolean(b)) {
        return gcd(a, +b);
      }

      throw new math.error.UnsupportedTypeError('gcd', a, b);
    }

    if (arguments.length > 2) {
      // multiple arguments. Evaluate them iteratively
      for (var i = 1; i < arguments.length; i++) {
        a = gcd(a, arguments[i]);
      }
      return a;
    }

    // zero or one argument
    throw new SyntaxError('Function gcd expects two or more arguments');
  };
};
