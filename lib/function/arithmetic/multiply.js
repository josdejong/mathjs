'use strict';

module.exports = function (config) {
  var typed = require('typed-function');
  var size = require('../../util/array').size;

  var Complex = require('../../type/Complex');
  var Matrix = require('../../type/Matrix');
  var collection = require('../../type/collection');

  var add = require('./add')(config);

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
  var multiply = typed('multiply', {
    'number, number': function (x, y) {
      return x * y;
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.times(y);
    },

    'Complex, Complex': function (x, y) {
      return new Complex(
          x.re * y.re - x.im * y.im,
          x.re * y.im + x.im * y.re
      );
    },

    'number, Unit': function (x, y) {
      var res = y.clone();
      res.value = (res.value === null) ? res._normalize(x) : (res.value * x);
      return res;
    },

    'Unit, number': function (x, y) {
      var res = x.clone();
      res.value = (res.value === null) ? res._normalize(y) : (res.value * y);
      return res;
    },

    'Array, Array': function (x, y) {
      return _multiply(x, y);
    },

    'Matrix, Matrix': function (x, y) {
      var res = multiply(x.valueOf(), y.valueOf());
      return Array.isArray(res) ? new Matrix(res) : res;
    },

    'Matrix, Array': function (x, y) {
      var res = multiply(x.valueOf(), y);
      return Array.isArray(res) ? new Matrix(res) : res;
    },

    'Array, Matrix': function (x, y) {
      var res = multiply(x, y.valueOf());
      return Array.isArray(res) ? new Matrix(res) : res;
    },

    'Array | Matrix, any': function (x, y) {
      return collection.deepMap2(x, y, multiply);
    },

    'any, Array | Matrix': function (x, y) {
      return collection.deepMap2(x, y, multiply);
    }
  });

  /**
   * Multiply two arrays. Checks dimensions
   * @param {Array} x
   * @param {Array} y
   * @returns {Array | *} Returns an Array or a scalar
   * @private
   */
  function _multiply(x, y) {
    var sizeX = size(x);
    var sizeY = size(y);

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
          var p = multiply(x[r][n], y[n][c]);
          result = (result === null) ? p : add(result, p);
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
        var p = multiply(x[r], y[r][c]);
        result = (r === 0) ? p : add(result, p);
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
        var p = multiply(x[r][c], y[c]);
        result = (c === 0) ? p : add(result, p);
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
      dot = add(dot, multiply(x[i], y[i]));
    }
    return dot;
  }

  return multiply;
};
