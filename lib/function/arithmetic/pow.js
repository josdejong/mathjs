module.exports = function (math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,
      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util['boolean'].isBoolean,
      isArray = Array.isArray,
      isInteger = util.number.isInteger,
      isComplex = Complex.isComplex;

  /**
   * Calculates the power of x to y
   *
   *     x ^ y
   *     pow(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex} y
   * @return {Number | BigNumber | Complex | Array | Matrix} res
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

    // TODO: pow for complex numbers and bignumbers

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.pow(y);
      }

      // downgrade to Number
      return pow(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.pow(y)
      }

      // downgrade to Number
      return pow(x, toNumber(y));
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
      return new Matrix(pow(x.valueOf(), y));
    }

    if (isBoolean(x)) {
      return pow(+x, y);
    }
    if (isBoolean(y)) {
      return pow(x, +y);
    }

    throw new math.error.UnsupportedTypeError('pow', x, y);
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
