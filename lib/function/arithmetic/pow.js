module.exports = function (math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Matrix = require('../../type/Matrix.js'),

      array = util.array,
      isNumBool = util.number.isNumBool,
      isArray = Array.isArray,
      isInteger = util.number.isInteger,
      isComplex = Complex.isComplex;

  /**
   * Calculates the power of x to y
   *
   *     x ^ y
   *     pow(x, y)
   *
   * @param  {Number | Boolean | Complex | Array | Matrix} x
   * @param  {Number | Boolean | Complex} y
   * @return {Number | Complex | Array | Matrix} res
   */
  math.pow = function pow(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('pow', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
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
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        return powComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        return powComplex(x, y);
      }
    }
    else if (isArray(x)) {
      if (!isNumBool(y) || !isInteger(y) || y < 0) {
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
        return math.eye(s[0]);
      }
      else {
        // value > 0
        var res = x;
        for (var i = 1; i < y; i++) {
          res = math.multiply(x, res);
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

    throw new util.error.UnsupportedTypeError('pow', x, y);
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
