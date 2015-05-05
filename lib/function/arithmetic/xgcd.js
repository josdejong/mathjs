'use strict';

var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var collection = load(require('../../type/matrix/collection'));
  var matrix = load(require('../../type/matrix/function/matrix'));

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
  return typed('xgcd', {
    'number, number': _xgcd,
    'BigNumber, BigNumber': _xgcdBigNumber
  });

  /**
   * Calculate xgcd for two numbers
   * @param {Number} a
   * @param {Number} b
   * @return {Number} result
   * @private
   */
  function _xgcd (a, b) {
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        x = 0, lastx = 1,
        y = 1, lasty = 0;

    if (!isInteger(a) || !isInteger(b)) {
      throw new Error('Parameters in function xgcd must be integer numbers');
    }

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
    return (config.matrix === 'array') ? res : matrix(res);
  }

  /**
   * Calculate xgcd for two BigNumbers
   * @param {BigNumber} a
   * @param {BigNumber} b
   * @return {BigNumber[]} result
   * @private
   */
  function _xgcdBigNumber(a, b) {
    // source: http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
    var t, // used to swap two variables
        q, // quotient
        r, // remainder
        zero = new type.BigNumber(0),
        x = new type.BigNumber(0), lastx = new type.BigNumber(1),
        y = new type.BigNumber(1), lasty = new type.BigNumber(0);

    if (!a.isInt() || !b.isInt()) {
      throw new Error('Parameters in function xgcd must be integer numbers');
    }

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
    return (config.matrix === 'array') ? res : matrix(res);
  }
}

exports.name = 'xgcd';
exports.factory = factory;