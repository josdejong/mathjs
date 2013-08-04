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
math.pow = function pow(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('pow', arguments.length, 2);
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
    else if (y instanceof Complex) {
      return powComplex(new Complex(x, 0), y);
    }
  }
  else if (x instanceof Complex) {
    if (isNumber(y)) {
      return powComplex(x, new Complex(y, 0));
    }
    else if (y instanceof Complex) {
      return powComplex(x, y);
    }
  }
  else if (Array.isArray(x)) {
    if (!isNumber(y) || !isInteger(y) || y < 0) {
      throw new TypeError('For A^b, b must be a positive integer ' +
          '(value is ' + y + ')');
    }
    // verify that A is a 2 dimensional square matrix
    var s = util.size(x);
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
    return new Matrix(math.pow(x.valueOf(), y));
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive values
    return math.pow(x.valueOf(), y.valueOf());
  }

  throw newUnsupportedTypeError('pow', x, y);
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
