var error = require('../../util/error.js'),
    collection = require('../../type/collection.js'),
    number = require('../../util/number.js'),

    Complex = require('../../type/Complex.js'),
    Unit = require('../../type/Unit.js');

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
module.exports = function divide(x, y) {
  if (arguments.length != 2) {
    throw new error.ArgumentsError('divide', arguments.length, 2);
  }

  if (number.isNumber(x)) {
    if (number.isNumber(y)) {
      // number / number
      return x / y;
    }
    else if (Complex.isComplex(y)) {
      // number / complex
      return _divideComplex(new Complex(x, 0), y);
    }
  }

  if (Complex.isComplex(x)) {
    if (number.isNumber(y)) {
      // complex / number
      return _divideComplex(x, new Complex(y, 0));
    }
    else if (Complex.isComplex(y)) {
      // complex / complex
      return _divideComplex(x, y);
    }
  }

  if (Unit.isUnit(x)) {
    if (number.isNumber(y)) {
      var res = x.clone();
      res.value /= y;
      return res;
    }
  }

  if (collection.isCollection(x)) {
    if (collection.isCollection(y)) {
      // TODO: implement matrix right division using pseudo inverse
      // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
      // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
      // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
      return multiply(x, inv(y));
    }
    else {
      // matrix / scalar
      return collection.map2(x, y, divide);
    }
  }

  if (collection.isCollection(y)) {
    // TODO: implement matrix right division using pseudo inverse
    return multiply(x, inv(y));
  }

  if (x.valueOf() !== x || y.valueOf() !== y) {
    // fallback on the objects primitive value
    return divide(x.valueOf(), y.valueOf());
  }

  throw new error.UnsupportedTypeError('divide', x, y);
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

// require after module.exports because of possible circular references
var multiply = require('./multiply.js'),
    inv = require('../matrix/inv.js');
