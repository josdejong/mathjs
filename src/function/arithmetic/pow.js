var error = require('../../util/error.js'),
    number = require('../../util/number.js'),
    array = require('../../util/array.js'),
    Complex = require('../../type/Complex.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Calculates the power of x to y
 *
 *     x ^ y
 *     pow(x, y)
 *
 * @param  {Number | Complex | Array | Matrix} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Array | Matrix} res
 */
module.exports = function pow(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('pow', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      if (number.isInteger(y) || x >= 0) {
        // real value computation
        return Math.pow(x, y);
      }
      else {
        return powComplex(new Complex(x, 0), new Complex(y, 0));
      }
    }
    else if (Complex.isComplex(y)) {
      return powComplex(new Complex(x, 0), y);
    }
  }
  else if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      return powComplex(x, new Complex(y, 0));
    }
    else if (Complex.isComplex(y)) {
      return powComplex(x, y);
    }
  }
  else if (Array.isArray(x)) {
    if (!number.isNumber(y) || !number.isInteger(y) || y < 0) {
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

    if (y == 0) {
      // return the identity matrix
      return eye(s[0]);
    }
    else {
      // value > 0
      var res = x;
      for (var i = 1; i < y; i++) {
        res = multiply(x, res);
      }
      return res;
    }
  }
  else if (x instanceof Matrix) {
    return new Matrix(pow(x.valueOf(), y));
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return pow(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('pow', x, y);
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
  var temp1 = log(x);
  var temp2 = multiply(temp1, y);
  return exp(temp2);
}

// require after module.exports because of possible circular references
var multiply = require('./multiply.js'),
    exp = require('./exp.js'),
    log = require('./log.js'),
    eye = require('../matrix/eye.js');
