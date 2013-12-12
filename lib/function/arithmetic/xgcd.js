module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),

      toNumber = util.number.toNumber,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
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
      if (isNumber(a) && isNumber(b)) {
        if (!isInteger(a) || !isInteger(b)) {
          throw new Error('Parameters in function xgcd must be integer numbers');
        }

        return _xgcd(a, b);
      }

      // TODO: implement BigNumber support for xgcd

      // downgrade bignumbers to numbers
      if (a instanceof BigNumber) {
        return xgcd(toNumber(a), b);
      }
      if (b instanceof BigNumber) {
        return xgcd(a, toNumber(b));
      }

      if (isBoolean(a)) {
        return xgcd(+a, b);
      }
      if (isBoolean(b)) {
        return xgcd(a, +b);
      }

      throw new math.error.UnsupportedTypeError('xgcd', a, b);
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
