/**
 * Divide two values.
 *
 *     x / y
 *     divide(x, y)
 *
 * @param  {Number | Complex | Unit | Array | Matrix} x
 * @param  {Number | Complex} y
 * @return {Number | Complex | Unit | Array | Matrix} res
 */
math.divide = function divide(x, y) {
  if (arguments.length != 2) {
    throw newArgumentsError('divide', arguments.length, 2);
  }

  if (isNumber(x)) {
    if (isNumber(y)) {
      // number / number
      return x / y;
    }
    else if (y instanceof Complex) {
      // number / complex
      return _divideComplex(new Complex(x, 0), y);
    }
  }

  if (x instanceof Complex) {
    if (isNumber(y)) {
      // complex / number
      return _divideComplex(x, new Complex(y, 0));
    }
    else if (y instanceof Complex) {
      // complex / complex
      return _divideComplex(x, y);
    }
  }

  if (x instanceof Unit) {
    if (isNumber(y)) {
      var res = x.clone();
      res.value /= y;
      return res;
    }
  }

  if (x instanceof Array || x instanceof Matrix) {
    if (y instanceof Array || y instanceof Matrix) {
      // TODO: implement matrix right division using pseudo inverse
      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return math.multiply(x, math.inv(y));
    }
    else {
      // matrix / scalar
      return util.map2(x, y, math.divide);
    }
  }

  if (y instanceof Array || y instanceof Matrix) {
    // TODO: implement matrix right division using pseudo inverse
    return math.multiply(x, math.inv(y));
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive value
    return math.divide(x.valueOf(), y.valueOf());
  }

  throw newUnsupportedTypeError('divide', x, y);
};

/**
 * Divide two complex numbers. x / y or divide(x, y)
 * @param {Complex} x
 * @param {Complex} y
 * @return {Complex} res
 * @private
 */
function _divideComplex (x, y) {
  var den = y.re * y.re + y.im * y.im;
  if (den != 0) {
    return Complex.create(
        (x.re * y.re + x.im * y.im) / den,
        (x.im * y.re - x.re * y.im) / den
    );
  }
  else {
    // both y.re and y.im are zero
    return Complex.create(
        (x.re != 0) ? (x.re / 0) : 0,
        (x.im != 0) ? (x.im / 0) : 0
    );
  }
}
