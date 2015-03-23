'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = math.type.Matrix,

      object = util.object,
      string = util.string;

  /**
   * Calculate the determinant of a matrix.
   *
   * Syntax:
   *
   *    math.det(x)
   *
   * Examples:
   *
   *    math.det([[1, 2], [3, 4]]); // returns -2
   *
   *    var A = [
   *      [-2, 2, 3],
   *      [-1, 1, 3],
   *      [2, 0, -1]
   *    ]
   *    math.det(A); // returns 6
   *
   * See also:
   *
   *    inv
   *
   * @param {Array | Matrix} x  A matrix
   * @return {Number} The determinant of `x`
   */
  math.det = function det (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('det', arguments.length, 1);
    }

    var size;
    if (x instanceof Matrix) {
      size = x.size();
    }
    else if (x instanceof Array) {
      x = math.matrix(x);
      size = x.size();
    }
    else {
      // a scalar
      size = [];
    }

    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);

      case 1:
        // vector
        if (size[0] == 1) {
          return object.clone(x.valueOf()[0]);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows == cols) {
          return _det(x.clone().valueOf(), rows, cols);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + string.format(size) + ')');
    }
  };

  /**
   * Calculate the determinant of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @param {Number} rows     Number of rows of the matrix (zero-based)
   * @param {Number} cols     Number of columns of the matrix (zero-based)
   * @returns {Number} det
   * @private
   */
  function _det (matrix, rows, cols) {
    if (rows == 1) {
      // this is a 1 x 1 matrix
      return object.clone(matrix[0][0]);
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      // the determinant of [a11,a12;a21,a22] is det = a11*a22-a21*a12
      return math.subtract(
          math.multiply(matrix[0][0], matrix[1][1]),
          math.multiply(matrix[1][0], matrix[0][1])
      );
    }
    else {
      // this is an n x n matrix
      var compute_mu = function (matrix) {
        var i, j;

        // Compute the matrix with zero lower triangle, same upper triangle,
        // and diagonals given by the negated sum of the below diagonal
        // elements.
        var mu = new Array(matrix.length);
        var sum = 0;
        for (i = 1; i < matrix.length; i++) {
          sum = math.add(sum, matrix[i][i]);
        }

        for (i = 0; i < matrix.length; i++) {
          mu[i] = new Array(matrix.length);
          mu[i][i] = math.unaryMinus(sum);

          for (j = 0; j < i; j++) {
            mu[i][j] = 0; // TODO: make bignumber 0 in case of bignumber computation
          }

          for (j = i + 1; j < matrix.length; j++) {
            mu[i][j] = matrix[i][j];
          }

          if (i+1 < matrix.length) {
            sum = math.subtract(sum, matrix[i + 1][i + 1]);
          }
        }

        return mu;
      };

      var fa = matrix;
      for (var i = 0; i < rows - 1; i++) {
        fa = math.multiply(compute_mu(fa), matrix);
      }

      if (rows % 2 == 0) {
        return math.unaryMinus(fa[0][0]);
      } else {
        return fa[0][0];
      }
    }
  }
};
