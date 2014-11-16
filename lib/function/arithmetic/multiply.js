'use strict';

module.exports = function(math) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      array = util.array,
      isNumber = util.number.isNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isArray = Array.isArray,
      isUnit = Unit.isUnit;

  /**
   * Multiply two values, `x * y`. The result is squeezed.
   * For matrices, the matrix product is calculated.
   *
   * Syntax:
   *
   *    math.multiply(x, y)
   *
   * Examples:
   *
   *    math.multiply(4, 5.2);        // returns Number 20.8
   *
   *    var a = math.complex(2, 3);
   *    var b = math.complex(4, 1);
   *    math.multiply(a, b);          // returns Complex 5 + 14i
   *
   *    var c = [[1, 2], [4, 3]];
   *    var d = [[1, 2, 3], [3, -4, 7]];
   *    math.multiply(c, d);          // returns Array [[7, -6, 17], [13, -4, 33]]
   *
   *    var e = math.unit('2.1 km');
   *    math.multiply(3, e);          // returns Unit 6.3 km
   *
   * See also:
   *
   *    divide
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} x First value to multiply
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix | null} y Second value to multiply
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} Multiplication of `x` and `y`
   */
  math.multiply = function multiply(x, y) {
    var res;

    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('multiply', arguments.length, 2);
    }

    if (isNumber(x)) {
      if (isNumber(y)) {
        // number * number
        return x * y;
      }
      else if (isComplex(y)) {
        // number * complex
        return _multiplyComplex (new Complex(x, 0), y);
      }
      else if (isUnit(y)) {
        res = y.clone();
        res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
        return res;
      }
    }

    if (isComplex(x)) {
      if (isNumber(y)) {
        // complex * number
        return _multiplyComplex (x, new Complex(y, 0));
      }
      else if (isComplex(y)) {
        // complex * complex
        return _multiplyComplex (x, y);
      }
    }

    if (x instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(y)) {
        y = BigNumber.convert(y);
      }
      else if (isBoolean(y) || y === null) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.times(y);
      }

      // downgrade to Number
      return multiply(x.toNumber(), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = BigNumber.convert(x);
      }
      else if (isBoolean(x) || x === null) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.times(y)
      }

      // downgrade to Number
      return multiply(x, y.toNumber());
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
        res = x.clone();
        res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
        return res;
      }
    }

    if (isArray(x)) {
      if (isArray(y)) {
        // array * array
        var sizeX = array.size(x);
        var sizeY = array.size(y);

        if (sizeX.length == 1) {
          if (sizeY.length == 1) {
            // vector * vector
            if (sizeX[0] != sizeY[0]) {
              throw new RangeError('Dimension mismatch in multiplication. ' +
                  'Length of A must match length of B ' +
                  '(A is ' + sizeX[0] +
                  ', B is ' + sizeY[0] + ', ' +
                  sizeX[0] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyVectorVector(x, y);
          }
          else if (sizeY.length == 2) {
            // vector * matrix
            if (sizeX[0] != sizeY[0]) {
              throw new RangeError('Dimension mismatch in multiplication. ' +
                  'Length of A must match rows of B ' +
                  '(A is ' + sizeX[0] +
                  ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
                  sizeX[0] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyVectorMatrix(x, y);
          }
          else {
            throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                '(B has ' + sizeY.length + ' dimensions)');
          }
        }
        else if (sizeX.length == 2) {
          if (sizeY.length == 1) {
            // matrix * vector
            if (sizeX[1] != sizeY[0]) {
              throw new RangeError('Dimension mismatch in multiplication. ' +
                  'Columns of A must match length of B ' +
                  '(A is ' + sizeX[0] + 'x' + sizeX[0] +
                  ', B is ' + sizeY[0] + ', ' +
                  sizeX[1] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyMatrixVector(x, y);
          }
          else if (sizeY.length == 2) {
            // matrix * matrix
            if (sizeX[1] != sizeY[0]) {
              throw new RangeError('Dimension mismatch in multiplication. ' +
                  'Columns of A must match rows of B ' +
                  '(A is ' + sizeX[0] + 'x' + sizeX[1] +
                  ', B is ' + sizeY[0] + 'x' + sizeY[1] + ', ' +
                  sizeX[1] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyMatrixMatrix(x, y);
          }
          else {
            throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
                '(B has ' + sizeY.length + ' dimensions)');
          }
        }
        else {
          throw new Error('Can only multiply a 1 or 2 dimensional matrix ' +
              '(A has ' + sizeX.length + ' dimensions)');
        }
      }
      else if (y instanceof Matrix) {
        // array * matrix
        res = multiply(x, y.valueOf());
        return isArray(res) ? new Matrix(res) : res;
      }
      else {
        // array * scalar
        return collection.deepMap2(x, y, multiply);
      }
    }

    if (x instanceof Matrix) {
      if (y instanceof Matrix) {
        // matrix * matrix
        res = multiply(x.valueOf(), y.valueOf());
        return isArray(res) ? new Matrix(res) : res;
      }
      else {
        // matrix * array
        // matrix * scalar
        res = multiply(x.valueOf(), y);
        return isArray(res) ? new Matrix(res) : res;
      }
    }

    if (isArray(y)) {
      // scalar * array
      return collection.deepMap2(x, y, multiply);
    }
    else if (y instanceof Matrix) {
      // scalar * matrix
      return new Matrix(collection.deepMap2(x, y.valueOf(), multiply));
    }

    if (isBoolean(x) || x === null) {
      return multiply(+x, y);
    }
    if (isBoolean(y) || y === null) {
      return multiply(x, +y);
    }

    throw new math.error.UnsupportedTypeError('multiply', math['typeof'](x), math['typeof'](y));
  };

  /**
   * Multiply two 2-dimensional matrices.
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A 2d matrix
   * @return {Array | Number} result
   * @private
   */
  function _multiplyMatrixMatrix(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = x.length,
        cols = y[0].length,
        num = x[0].length;

    for (var r = 0; r < rows; r++) {
      res[r] = [];
      for (var c = 0; c < cols; c++) {
        var result = null;
        for (var n = 0; n < num; n++) {
          var p = math.multiply(x[r][n], y[n][c]);
          result = (result === null) ? p : math.add(result, p);
        }
        res[r][c] = result;
      }
    }

    var isScalar = rows === 1 && cols === 1;
    return isScalar ? res[0][0] : res;
  }

  /**
   * Multiply a vector with a 2-dimensional matrix
   * The size of the matrices is not validated.
   * @param {Array} x   A vector
   * @param {Array} y   A 2d matrix
   * @return {Array | Number} result
   * @private
   */
  function _multiplyVectorMatrix(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = y.length,
        cols = y[0].length;

    for (var c = 0; c < cols; c++) {
      var result = null;
      for (var r = 0; r < rows; r++) {
        var p = math.multiply(x[r], y[r][c]);
        result = (r === 0) ? p : math.add(result, p);
      }
      res[c] = result;
    }

    return res.length === 1 ? res[0] : res;
  }

  /**
   * Multiply a 2-dimensional matrix with a vector
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A vector
   * @return {Array | Number} result
   * @private
   */
  function _multiplyMatrixVector(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var res = [],
        rows = x.length,
        cols = x[0].length;

    for (var r = 0; r < rows; r++) {
      var result = null;
      for (var c = 0; c < cols; c++) {
        var p = math.multiply(x[r][c], y[c]);
        result = (c === 0) ? p : math.add(result, p);
      }
      res[r] = result;
    }

    return res.length === 1 ? res[0] : res;
  }

  /**
   * Multiply two vectors, calculate the dot product
   * The size of the matrices is not validated.
   * @param {Array} x   A vector
   * @param {Array} y   A vector
   * @return {Number} dotProduct
   * @private
   */
  function _multiplyVectorVector(x, y) {
    // TODO: performance of matrix multiplication can be improved
    var len = x.length;

    if (!len) {
      throw new Error('Cannot multiply two empty vectors');
    }

    var dot = 0;
    for (var i = 0; i < len; i++) {
      dot = math.add(dot, math.multiply(x[i], y[i]));
    }
    return dot;
  }

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
        return new Complex(x.re * y.re, 0);
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
        return new Complex(-x.im * y.im, 0);
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
