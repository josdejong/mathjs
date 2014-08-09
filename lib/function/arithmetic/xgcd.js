'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      BigNumber = math.type.BigNumber,

      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isInteger = util.number.isInteger;

  /**
   * Calculate the extended greatest common divisor for two values.
   * See http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm.
   *
   * Syntax:
   *
   *    math.xgcd(a, b)
   *
   * Examples:
   *
   *    math.xgcd(8, 12);             // returns [4, -1, 1]
   *    math.gcd(8, 12);              // returns 4
   *    math.xgcd(36163, 21199);      // returns [1247, -7, 12]
   *
   * See also:
   *
   *    gcd, lcm
   *
   * @param {Number | BigNumber | Boolean} a  An integer number
   * @param {Number | BigNumber | Boolean} b  An integer number
   * @return {Array}              Returns an array containing 3 integers `[div, m, n]`
   *                              where `div = gcd(a, b)` and `a*m + b*n = div`
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

      if (a instanceof BigNumber) {
        // try to convert to big number
        if (isNumber(b)) {
          b = BigNumber.convert(b);
        }
        else if (isBoolean(b) || b === null) {
          b = new BigNumber(b ? 1 : 0);
        }

        if (b instanceof BigNumber) {
          return _bigXgcd(a, b);
        }

        // downgrade to Number
        return xgcd(a.toNumber(), b);
      }
      if (b instanceof BigNumber) {
        // try to convert to big number
        if (isNumber(a)) {
          a = BigNumber.convert(a);
        }
        else if (isBoolean(a) || a === null) {
          a = new BigNumber(a ? 1 : 0);
        }

        if (a instanceof BigNumber) {
          return _bigXgcd(a, b);
        }

        // downgrade to Number
        return xgcd(a.toNumber(), b);
      }

      if (isBoolean(a) || a === null) {
        return xgcd(+a, b);
      }
      if (isBoolean(b) || b === null) {
        return xgcd(a, +b);
      }

      throw new math.error.UnsupportedTypeError('xgcd', math['typeof'](a), math['typeof'](b));
    }

    // zero or one argument
    throw new SyntaxError('Function xgcd expects two arguments');
  };

  /**
   * Calculate xgcd for two numbers
   * @param {Number} a
   * @param {Number} b
   * @return {Number} result
   * @private
   */
  function _xgcd(a, b) {
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

    var res;
    if (a < 0) {
      res = [-a, -lastx, -lasty];
    }
    else {
      res = [a, a ? lastx : 0, lasty];
    }
    return (config.matrix === 'array') ? res : new Matrix(res);
  }

  /**
   * Calculate xgcd for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @return {BigNumber[]} result
   * @private
   */
  function _bigXgcd(a, b) {
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        zero = new BigNumber(0),
        x = new BigNumber(0), lastx = new BigNumber(1),
        y = new BigNumber(1), lasty = new BigNumber(0);

    while (!b.isZero()) {
      q = a.div(b).floor();
      r = a.mod(b);

      t = x;
      x = lastx.minus(q.times(x));
      lastx = t;

      t = y;
      y = lasty.minus(q.times(y));
      lasty = t;

      a = b;
      b = r;
    }

    var res;
    if (a.lt(zero)) {
      res = [a.neg(), lastx.neg(), lasty.neg()];
    }
    else {
      res = [a, !a.isZero() ? lastx : 0, lasty];
    }
    return (config.matrix === 'array') ? res : new Matrix(res);
  }
};
