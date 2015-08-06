'use strict';

var isInteger = require('../../utils/number').isInteger;
var size = require('../../utils/array').size;

function factory (type, config, load, typed) {
  var latex = require('../../utils/latex');
  var exp = load(require('./exp'));
  var eye = load(require('../matrix/eye'));
  var log = load(require('./log'));
  var multiply = load(require('./multiply'));
  var matrix = load(require('../../type/matrix/function/matrix'));

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
   *    math.pow(2, 3);               // returns number 8
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
   * @param  {number | BigNumber | Complex | Array | Matrix} x  The base
   * @param  {number | BigNumber | Complex} y                   The exponent
   * @return {number | BigNumber | Complex | Array | Matrix} The value of `x` to the power `y`
   */
  var pow = typed('pow', {
    'number, number': _pow,

    'Complex, Complex': _powComplex,

    'BigNumber, BigNumber': function (x, y) {
      if (y.isInteger() || x >= 0 || config.predictable) {
        return x.pow(y);
      }
      else {
        return _powComplex(new type.Complex(x.toNumber(), 0), new type.Complex(y.toNumber(), 0));
      }
    },

    'Fraction, Fraction': function (x, y) {
      if (y.d !== 1) {
        if (config.predictable) {
          throw new Error('Function pow does not support non-integer exponents for fractions.');
        }
        else {
          return _pow(x.valueOf(), y.valueOf());
        }
      }
      else {
        return x.pow(y);
     }
    },

    'Array, number': _powArray,

    'Array, BigNumber': function (x, y) {
      return _powArray(x, y.toNumber());
    },

    'Matrix, number': _powMatrix,

    'Matrix, BigNumber': function (x, y) {
      return _powMatrix(x, y.toNumber());
    },

    'Unit, number': function (x, y) {
      return x.pow(y);
    }

  });

  /**
   * Calculates the power of x to y, x^y, for two numbers.
   * @param {number} x
   * @param {number} y
   * @return {number | Complex} res
   * @private
   */
  function _pow(x, y) {
    if (isInteger(y) || x >= 0 || config.predictable) {
      return Math.pow(x, y);
    }
    else {
      return _powComplex(new type.Complex(x, 0), new type.Complex(y, 0));
    }
  }

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
    return matrix(_powArray(x.valueOf(), y));
  }



  pow.toTex = '\\left(${args[0]}\\right)' + latex.operators['pow'] + '{${args[1]}}';

  return pow;
}

exports.name = 'pow';
exports.factory = factory;
