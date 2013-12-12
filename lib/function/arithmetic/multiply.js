module.exports = function(math) {
  var util = require('../../util/index'),

      BigNumber = require('bignumber.js'),
      Complex = require('../../type/Complex'),
      Matrix = require('../../type/Matrix'),
      Unit = require('../../type/Unit'),
      collection = require('../../type/collection'),

      array = util.array,
      isNumber = util.number.isNumber,
      toNumber = util.number.toNumber,
      toBigNumber = util.number.toBigNumber,
      isBoolean = util['boolean'].isBoolean,
      isComplex = Complex.isComplex,
      isArray = Array.isArray,
      isUnit = Unit.isUnit;

  /**
   * Multiply two values.
   *
   *     x * y
   *     multiply(x, y)
   *
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} x
   * @param  {Number | BigNumber | Boolean | Complex | Unit | Array | Matrix} y
   * @return {Number | BigNumber | Complex | Unit | Array | Matrix} res
   */
  math.multiply = function multiply(x, y) {
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
        res.value *= x;
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
        y = toBigNumber(y);
      }
      else if (isBoolean(y)) {
        y = new BigNumber(y ? 1 : 0);
      }

      if (y instanceof BigNumber) {
        return x.times(y);
      }

      // downgrade to Number
      return multiply(toNumber(x), y);
    }
    if (y instanceof BigNumber) {
      // try to convert to big number
      if (isNumber(x)) {
        x = toBigNumber(x);
      }
      else if (isBoolean(x)) {
        x = new BigNumber(x ? 1 : 0);
      }

      if (x instanceof BigNumber) {
        return x.times(y)
      }

      // downgrade to Number
      return multiply(x, toNumber(y));
    }

    if (isUnit(x)) {
      if (isNumber(y)) {
        res = x.clone();
        res.value *= y;
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
              throw new RangeError('Dimensions mismatch in multiplication. ' +
                  'Length of A must match length of B ' +
                  '(A is ' + sizeX[0] +
                  ', B is ' + sizeY[0] +
                  sizeX[0] + ' != ' + sizeY[0] + ')');
            }

            return _multiplyVectorVector(x, y);
          }
          else if (sizeY.length == 2) {
            // vector * matrix
            if (sizeX[0] != sizeY[0]) {
              throw new RangeError('Dimensions mismatch in multiplication. ' +
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
              throw new RangeError('Dimensions mismatch in multiplication. ' +
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
              throw new RangeError('Dimensions mismatch in multiplication. ' +
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
        return new Matrix(multiply(x, y.valueOf()));
      }
      else {
        // array * scalar
        return collection.deepMap2(x, y, multiply);
      }
    }

    if (x instanceof Matrix) {
      if (y instanceof Matrix) {
        // matrix * matrix
        return new Matrix(multiply(x.valueOf(), y.valueOf()));
      }
      else {
        // matrix * array
        // matrix * scalar
        return new Matrix(multiply(x.valueOf(), y));
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

    if (isBoolean(x)) {
      return multiply(+x, y);
    }
    if (isBoolean(y)) {
      return multiply(x, +y);
    }

    throw new math.error.UnsupportedTypeError('multiply', x, y);
  };

  /**
   * Multiply two 2-dimensional matrices.
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A 2d matrix
   * @return {Array} result
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

    return res;
  }

  /**
   * Multiply a vector with a 2-dimensional matrix
   * The size of the matrices is not validated.
   * @param {Array} x   A vector
   * @param {Array} y   A 2d matrix
   * @return {Array} result
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

    return res;
  }

  /**
   * Multiply a 2-dimensional matrix with a vector
   * The size of the matrices is not validated.
   * @param {Array} x   A 2d matrix
   * @param {Array} y   A vector
   * @return {Array} result
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

    return res;
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
    var len = x.length,
        dot = null;

    if (len) {
      dot = 0;

      for (var i = 0, ii = x.length; i < ii; i++) {
        dot = math.add(dot, math.multiply(x[i], y[i]));
      }
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
