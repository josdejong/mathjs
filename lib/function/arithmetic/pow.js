'use strict';

var collection = require('../../type/collection');
var isInteger = require('../../util/number').isInteger;
var size = require('../../util/array').size;

function factory (type, config, load, typed) {
  var exp = load(require('./exp'));
  var eye = load(require('../matrix/eye'));
  var log = load(require('./log'));
  var multiply = load(require('./multiply'));

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
  var pow = typed('pow', {
    'number, number': function (x, y) {
      if (isInteger(y) || x >= 0) {
        return Math.pow(x, y);
      }
      else {
        return _powComplex(new type.Complex(x, 0), new type.Complex(y, 0));
      }
    },

    'BigNumber, BigNumber': function (x, y) {
      if (isInteger(y) || x >= 0) {
        return x.pow(y);
      }
      else {
        return _powComplex(new type.Complex(x.toNumber(), 0), new type.Complex(y.toNumber(), 0));
      }
    },

    'Complex, Complex': _powComplex,

    'Array, number': _powArray,

    'Array, BigNumber': function (x, y) {
      return _powArray(x, y.toNumber());
    },

    'Matrix, number': _powMatrix,

    'Matrix, BigNumber': function (x, y) {
      return _powMatrix(x, y.toNumber());
    }
  });

  /**
   * Calculates the power of x to y, x^y, for two complex numbers.
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex} res
   * @private
   */
  function _powComplex (x, y) {
    // complex computation
    // x^y = exp(log(x)*y) = exp((abs(x)+i*arg(x))*y)
    // TODO: we can optimize this as we know x and y are Complex
    //   expComplex      = exp.signatures['Complex,Complex']
    //   multiplyComplex = multiply.signatures['Complex,Complex']
    //   logComplex      = log.signatures['Complex,Complex']
    //   return expComplex(multiplyComplex(logComplex(x), y));
    return exp(multiply(log(x), y));
  }

  /**
   * Calculate the power of a 2d array
   * @param {Array} x     must be a 2 dimensional, square matrix
   * @param {number} y    a positive, integer value
   * @returns {Array}
   * @private
   */
  function _powArray(x, y) {
    if (!isInteger(y) || y < 0) {
      throw new TypeError('For A^b, b must be a positive integer (value is ' + y + ')');
    }
    // verify that A is a 2 dimensional square matrix
    var s = size(x);
    if (s.length != 2) {
      throw new Error('For A^b, A must be 2 dimensional (A has ' + s.length + ' dimensions)');
    }
    if (s[0] != s[1]) {
      throw new Error('For A^b, A must be square (size is ' + s[0] + 'x' + s[1] + ')');
    }

    var res = eye(s[0]).valueOf();
    var px = x;
    while (y >= 1) {
      if ((y & 1) == 1) {
        res = multiply(px, res);
      }
      y >>= 1;
      px = multiply(px, px);
    }
    return res;
  }

  /**
   * Calculate the power of a 2d matrix
   * @param {Matrix} x     must be a 2 dimensional, square matrix
   * @param {number} y    a positive, integer value
   * @returns {Matrix}
   * @private
   */
  function _powMatrix (x, y) {
    return new type.Matrix(_powArray(x.valueOf(), y));
  }

  return pow;
}

exports.type = 'function';
exports.name = 'pow';
exports.factory = factory;
