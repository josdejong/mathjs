module.exports = function (math) {
  var util = require('../../util/index.js'),

      isNumBool = util.number.isNumBool,
      isInteger = util.number.isInteger;

  /**
   * Calculate the extended greatest common divisor for two values.
   *
   *     xgcd(a, b)
   *
   * @param {Number | Boolean} a  An integer number
   * @param {Number | Boolean} b  An integer number
   * @return {Array}              An array containing 3 integers [div, m, n]
   *                              where div = gcd(a, b) and a*m + b*n = div
   *
   * @see http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
   */
  math.xgcd = function xgcd(a, b) {
    if (arguments.length == 2) {
      // two arguments
      if (isNumBool(a) && isNumBool(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function xgcd must be integer numbers');
        }

        return _xgcd(a, b);
      }

      throw new util.error.UnsupportedTypeError('xgcd', a, b);
    }

    // zero or one argument
    throw new SyntaxError('Function xgcd expects two arguments');
  };

  /**
   * Calculate xgcd for two numbers
   * @param {Number} a
   * @param {Number} b
   * @private
   */
  function _xgcd(a, b) {
    //*
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        x = 0, lastx = 1,
        y = 1, lasty = 0;

    while (b) {
      q = Math.floor(a / b);
      r = a % b;

      t = x;
      x = lastx - q * x;
      lastx = t;

      t = y;
      y = lasty - q * y;
      lasty = t;

      a = b;
      b = r;
    }

    if (a < 0) {
      return [-a, a ? -lastx : 0, -lasty];
    }
    else {
      return [a, a ? lastx : 0, lasty];
    }
  }
};
