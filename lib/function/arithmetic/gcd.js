module.exports = function (math) {
  var util = require('../../util/index.js'),

      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
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
      if (isNumBool(a) && isNumBool(b)) {
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
        return collection.map2(a, b, gcd);
      }

      if (a.valueOf() !== a || b.valueOf() !== b) {
        // fallback on the objects primitive value
        return gcd(a.valueOf(), b.valueOf());
      }

      throw new util.error.UnsupportedTypeError('gcd', a, b);
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
