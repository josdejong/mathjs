module.exports = function(math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Matrix = require('../../type/Matrix.js'),
      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Divide two values.
   *
   *     x / y
   *     divide(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.divide = function divide(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('divide', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number / number
        return x / y;
      }
      else if (isComplex(y)) {
        // number / complex
        return _divideComplex(new Complex(x, 0), y);
      }
    }

    if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex / number
        return _divideComplex(x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex / complex
        return _divideComplex(x, y);
      }
    }

    if (isUnit(x)) {
      if (isNumBool(y)) {
        var res = x.clone();
        res.value /= y;
        return res;
      }
    }

    if (isCollection(x)) {
      if (isCollection(y)) {
        // TODO: implement matrix right division using pseudo inverse
        // http://www.mathworks.nl/help/matlab/ref/mrdivide.html
        // http://www.gnu.org/software/octave/doc/interpreter/Arithmetic-Ops.html
        // http://stackoverflow.com/questions/12263932/how-does-gnu-octave-matrix-division-work-getting-unexpected-behaviour
        return math.multiply(x, math.inv(y));
      }
      else {
        // matrix / scalar
        return collection.map2(x, y, divide);
      }
    }

    if (isCollection(y)) {
      // TODO: implement matrix right division using pseudo inverse
      return math.multiply(x, math.inv(y));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive value
      return divide(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('divide', x, y);
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
      return new Complex(
          (x.re * y.re + x.im * y.im) / den,
          (x.im * y.re - x.re * y.im) / den
      );
    }
    else {
      // both y.re and y.im are zero
      return new Complex(
          (x.re != 0) ? (x.re / 0) : 0,
          (x.im != 0) ? (x.im / 0) : 0
      );
    }
  }
};
