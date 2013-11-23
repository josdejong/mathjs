module.exports = function(math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util.boolean.isBoolean,
      isComplex = Complex.isComplex,
      isUnit = Unit.isUnit,
      isCollection = collection.isCollection;

  /**
   * Divide two values.
   *
   *     x / y
   *     divide(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.divide = function divide(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('divide', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number / number
        return x / y;
      }
      else if (isComplex(y)) {
        // number / complex
        return _divideComplex(new Complex(x, 0), y);
      }
    }

    if (isComplex(x)) {
      if (isComplex(y)) {
        // complex / complex
        return _divideComplex(x, y);
      }
      else if (isNumber(y)) {
        // complex / number
        return _divideComplex(x, new Complex(y, 0));
      }
    }

    if (x instanceof BigNumber) {
      if (isNumber(y)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        y = toBigNumber(y);
        if (isNumber(y)) {
          return toNumber(x) / y;
        }
      }

      if (y instanceof BigNumber) {
        return x.div(y);
      }
    }
    if (y instanceof BigNumber) {
      if (isNumber(x)) {
        // try to convert to big number, if not possible, downgrade to Numbers
        x = toBigNumber(x);
        if (isNumber(x)) {
          return x / toNumber(y);
        }
      }

      if (x instanceof BigNumber) {
        return x.div(y)
      }
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
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
        return collection.deepMap2(x, y, divide);
      }
    }

    if (isCollection(y)) {
      // TODO: implement matrix right division using pseudo inverse
      return math.multiply(x, math.inv(y));
    }

    if (isBoolean(x)) {
      return divide(+x, y);
    }
    if (isBoolean(y)) {
      return divide(x, +y);
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
