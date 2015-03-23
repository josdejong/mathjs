'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = math.type.Matrix,
      
      array = util.array,
      isNumber = util.number.isNumber,
      isBoolean = util.boolean.isBoolean,
      isArray = Array.isArray,
      isInteger = util.number.isInteger,
      isComplex = Complex.isComplex;

  /**
   * Calculates the power of x to y, `x ^ y`.
   * Matrix exponentiation is supported for square matrices `x`, and positive
   * integer exponents `y`.
   *
   * Syntax:
   *
   *    math.pow(x, y)
   *
   * Examples:
   *
   *    math.pow(2, 3);               // returns Number 8
   *
   *    var a = math.complex(2, 3);
   *    math.pow(a, 2)                // returns Complex -5 + 12i
   *
   *    var b = [[1, 2], [4, 3]];
   *    math.pow(b, 2);               // returns Array [[9, 8], [16, 17]]
   *
   * See also:
   *
   *    multiply, sqrt
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix | null} x  The base
   * @param  {Number | BigNumber | Boolean | Complex | null} y                   The exponent
   * @return {Number | BigNumber | Complex | Array | Matrix} The value of `x` to the power `y`
   */
  math.pow = function pow(x, y) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('pow', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        if (isInteger(y) || x >= 0) {
          // real value computation
          return Math.pow(x, y);
        }
        else {
          return powComplex(new Complex(x, 0), new Complex(y, 0));
        }
      }
      else if (isComplex(y)) {
        return powComplex(new Complex(x, 0), y);
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        return powComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        return powComplex(x, y);
      }
    }

    if (x instanceof BigNumber) {
      // try to upgrade y to to bignumber
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y) || y === null) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        if (y.isInteger() || !x.isNegative()) {
          return x.pow(y);
        }
        else {
          // downgrade to number to do complex valued computation
          return pow(x.toNumber(), y.toNumber());
        }
      }
      else {
        // failed to upgrade y to bignumber, lets downgrade x to number
        return pow(x.toNumber(), y);
      }
    }

    if (y instanceof BigNumber) {
      // try to convert x to bignumber
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x) || x === null) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        if (y.isInteger() && !x.isNegative()) {
          return x.pow(y);
        }
        else {
          // downgrade to number to do complex valued computation
          return pow(x.toNumber(), y.toNumber());
        }
      }
      else {
        // failed to upgrade x to bignumber, lets downgrade y to number
        return pow(x, y.toNumber());
      }
    }

    if (isArray(x)) {
      if (!isNumber(y) || !isInteger(y) || y < 0) {
        throw new TypeError('For A^b, b must be a positive integer ' +
            '(value is ' + y + ')');
      }
      // verify that A is a 2 dimensional square matrix
      var s = array.size(x);
      if (s.length != 2) {
        throw new Error('For A^b, A must be 2 dimensional ' +
            '(A has ' + s.length + ' dimensions)');
      }
      if (s[0] != s[1]) {
        throw new Error('For A^b, A must be square ' +
            '(size is ' + s[0] + 'x' + s[1] + ')');
      }

      // compute power of matrix
      var res = math.eye(s[0]).valueOf();
      var px = x;
      while (y >= 1) {
        if ((y & 1) == 1) {
          res = math.multiply(px, res);
        }
        y >>= 1;
        px = math.multiply(px, px);
      }
      return res;
    }
    else if (x instanceof Matrix) {
      return math.matrix(pow(x.valueOf(), y));
    }

    if (isBoolean(x) || x === null) {
      return pow(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return pow(x, +y);
    }

    throw new math.error.UnsupportedTypeError('pow', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Calculates the power of x to y, x^y, for two complex numbers.
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex} res
   * @private
   */
  function powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    var temp1 = math.log(x);
    var temp2 = math.multiply(temp1, y);
    return math.exp(temp2);
  }
};
