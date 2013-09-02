module.exports = function(math) {
  var util = require('../../util/index.js'),

      Complex = require('../../type/Complex.js'),
      Matrix = require('../../type/Matrix.js'),
      Unit = require('../../type/Unit.js'),
      collection = require('../../type/collection.js'),

      array = util.array,
      isNumBool = util.number.isNumBool,
      isComplex = Complex.isComplex,
      isArray = Array.isArray,
      isUnit = Unit.isUnit;

  /**
   * Multiply two values.
   *
   *     x * y
   *     multiply(x, y)
   *
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | Complex | Unit | Array | Matrix} res
   */
  math.multiply = function multiply(x, y) {
    if (arguments.length != 2) {
      throw new util.error.ArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumBool(x)) {
      if (isNumBool(y)) {
        // number * number
        return x * y;
      }
      else if (isComplex(y)) {
        // number * complex
        return _multiplyComplex (new Complex(x, 0), y);
      }
      else if (isUnit(y)) {
        res = y.clone();
        res.value *= x;
        return res;
      }
    }
    else if (isComplex(x)) {
      if (isNumBool(y)) {
        // complex * number
        return _multiplyComplex (x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex * complex
        return _multiplyComplex (x, y);
      }
    }
    else if (isUnit(x)) {
      if (isNumBool(y)) {
        res = x.clone();
        res.value *= y;
        return res;
      }
    }
    else if (isArray(x)) {
      if (isArray(y)) {
        // matrix * matrix
        var sizeX = array.size(x);
        var sizeY = array.size(y);

        if (sizeX.length != 2) {
          throw new Error('Can only multiply a 2 dimensional matrix ' +
              '(A has ' + sizeX.length + ' dimensions)');
        }
        if (sizeY.length != 2) {
          throw new Error('Can only multiply a 2 dimensional matrix ' +
              '(B has ' + sizeY.length + ' dimensions)');
        }
        if (sizeX[1] != sizeY[0]) {
          throw new RangeError('Dimensions mismatch in multiplication. ' +
              'Columns of A must match rows of B ' +
              '(A is ' + sizeX[0] + 'x' + sizeX[1] +
              ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
              sizeY[1] + ' != ' + sizeY[0] + ')');
        }

        // TODO: performance of matrix multiplication can be improved
        var res = [],
            rows = sizeX[0],
            cols = sizeY[1],
            num = sizeX[1];
        for (var r = 0; r < rows; r++) {
          res[r] = [];
          for (var c = 0; c < cols; c++) {
            var result = null;
            for (var n = 0; n < num; n++) {
              var p = multiply(x[r][n], y[n][c]);
              result = (result == null) ? p : math.add(result, p);
            }
            res[r][c] = result;
          }
        }

        return res;
      }
      else if (y instanceof Matrix) {
        return new Matrix(multiply(x.valueOf(), y.valueOf()));
      }
      else {
        // matrix * scalar
        return collection.map2(x, y, multiply);
      }
    }
    else if (x instanceof Matrix) {
      return new Matrix(multiply(x.valueOf(), y.valueOf()));
    }

    if (isArray(y)) {
      // scalar * matrix
      return collection.map2(x, y, multiply);
    }
    else if (y instanceof Matrix) {
      return new Matrix(multiply(x.valueOf(), y.valueOf()));
    }

    if (x.valueOf() !== x || y.valueOf() !== y) {
      // fallback on the objects primitive values
      return multiply(x.valueOf(), y.valueOf());
    }

    throw new util.error.UnsupportedTypeError('multiply', x, y);
  };

  /**
   * Multiply two complex numbers. x * y or multiply(x, y)
   * @param {Complex} x
   * @param {Complex} y
   * @return {Complex | Number} res
   * @private
   */
  function _multiplyComplex (x, y) {
    // Note: we test whether x or y are pure real or pure complex,
    // to prevent unnecessary NaN values. For example, Infinity*i should
    // result in Infinity*i, and not in NaN+Infinity*i

    if (x.im == 0) {
      // x is pure real
      if (y.im == 0) {
        // y is pure real
        return x.re * y.re;
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            0,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re,
            x.re * y.im
        );
      }
    }
    else if (x.re == 0) {
      // x is pure complex
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            0,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return -x.im * y.im;
      }
      else {
        // y has a real and complex part
        return new Complex(
            -x.im * y.im,
            x.im * y.re
        );
      }
    }
    else {
      // x has a real and complex part
      if (y.im == 0) {
        // y is pure real
        return new Complex(
            x.re * y.re,
            x.im * y.re
        );
      }
      else if (y.re == 0) {
        // y is pure complex
        return new Complex(
            -x.im * y.im,
            x.re * y.im
        );
      }
      else {
        // y has a real and complex part
        return new Complex(
            x.re * y.re - x.im * y.im,
            x.re * y.im + x.im * y.re
        );
      }
    }
  }
};
