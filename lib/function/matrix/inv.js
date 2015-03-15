'use strict';

module.exports = function (math) {
  var util = require('../../util/index');
  var Matrix = math.type.Matrix;

  /**
   * Calculate the inverse of a square matrix.
   *
   * Syntax:
   *
   *     math.inv(x)
   *
   * Examples:
   *
   *     math.inv([[1, 2], [3, 4]]);  // returns [[-2, 1], [1.5, -0.5]]
   *     math.inv(4);                 // returns 0.25
   *     1 / 4;                       // returns 0.25
   *
   * See also:
   *
   *     det, transpose
   *
   * @param {Number | Complex | Array | Matrix} x     Matrix to be inversed
   * @return {Number | Complex | Array | Matrix} The inverse of `x`.
   */
  math.inv = function inv (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('inv', arguments.length, 1);
    }
    var size = math.size(x).valueOf();
    switch (size.length) {
      case 0:
        // scalar
        return math._divide(1, x);

      case 1:
        // vector
        if (size[0] == 1) {
          if (x instanceof Matrix) {
            return math.matrix([
              math._divide(1, x.valueOf()[0])
            ]);
          }
          else {
            return [
              math._divide(1, x[0])
            ];
          }
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + util.string.format(size) + ')');
        }

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows == cols) {
          if (x instanceof Matrix) {
            return math.matrix(
              _inv(x.valueOf(), rows, cols),
              x.storage()
            );
          }
          else {
            // return an Array
            return _inv(x, rows, cols);
          }
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + util.string.format(size) + ')');
        }

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + util.string.format(size) + ')');
    }
  };

  /**
   * Calculate the inverse of a square matrix
   * @param {Array[]} matrix  A square matrix
   * @param {Number} rows     Number of rows
   * @param {Number} cols     Number of columns, must equal rows
   * @return {Array[]} inv    Inverse matrix
   * @private
   */
  function _inv (matrix, rows, cols){
    var r, s, f, value, temp;

    if (rows == 1) {
      // this is a 1 x 1 matrix
      value = matrix[0][0];
      if (value == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [[
        math._divide(1, value)
      ]];
    }
    else if (rows == 2) {
      // this is a 2 x 2 matrix
      var d = math.det(matrix);
      if (d == 0) {
        throw Error('Cannot calculate inverse, determinant is zero');
      }
      return [
        [
          math._divide(matrix[1][1], d),
          math._divide(math.unaryMinus(matrix[0][1]), d)
        ],
        [
          math._divide(math.unaryMinus(matrix[1][0]), d),
          math._divide(matrix[0][0], d)
        ]
      ];
    }
    else {
      // this is a matrix of 3 x 3 or larger
      // calculate inverse using gauss-jordan elimination
      //      http://en.wikipedia.org/wiki/Gaussian_elimination
      //      http://mathworld.wolfram.com/MatrixInverse.html
      //      http://math.uww.edu/~mcfarlat/inverse.htm

      // make a copy of the matrix (only the arrays, not of the elements)
      var A = matrix.concat();
      for (r = 0; r < rows; r++) {
        A[r] = A[r].concat();
      }

      // create an identity matrix which in the end will contain the
      // matrix inverse
      var B = math.eye(rows).valueOf();

      // loop over all columns, and perform row reductions
      for (var c = 0; c < cols; c++) {
        // element Acc should be non zero. if not, swap content
        // with one of the lower rows
        r = c;
        while (r < rows && A[r][c] == 0) {
          r++;
        }
        if (r == rows || A[r][c] == 0) {
          // TODO: in case of zero det, just return a matrix wih Infinity values? (like octave)
          throw Error('Cannot calculate inverse, determinant is zero');
        }
        if (r != c) {
          temp = A[c]; A[c] = A[r]; A[r] = temp;
          temp = B[c]; B[c] = B[r]; B[r] = temp;
        }

        // eliminate non-zero values on the other rows at column c
        var Ac = A[c],
            Bc = B[c];
        for (r = 0; r < rows; r++) {
          var Ar = A[r],
              Br = B[r];
          if(r != c) {
            // eliminate value at column c and row r
            if (Ar[c] != 0) {
              f = math._divide(math.unaryMinus(Ar[c]), Ac[c]);

              // add (f * row c) to row r to eliminate the value
              // at column c
              for (s = c; s < cols; s++) {
                Ar[s] = math.add(Ar[s], math.multiply(f, Ac[s]));
              }
              for (s = 0; s < cols; s++) {
                Br[s] = math.add(Br[s],  math.multiply(f, Bc[s]));
              }
            }
          }
          else {
            // normalize value at Acc to 1,
            // divide each value on row r with the value at Acc
            f = Ac[c];
            for (s = c; s < cols; s++) {
              Ar[s] = math._divide(Ar[s], f);
            }
            for (s = 0; s < cols; s++) {
              Br[s] = math._divide(Br[s], f);
            }
          }
        }
      }
      return B;
    }
  }
};
