'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      string = util.string;

  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only two dimensional matrices are supported.
   *
   * Syntax:
   *
   *     math.transpose(x)
   *
   * Examples:
   *
   *     var A = [[1, 2, 3], [4, 5, 6]];
   *     math.transpose(A);               // returns [[1, 4], [2, 5], [3, 6]]
   *
   * See also:
   *
   *     diag, inv, subset, squeeze
   *
   * @param {Array | Matrix} x  Matrix to be transposed
   * @return {Array | Matrix}   The transposed matrix
   */
  math.transpose = function transpose (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);

      case 1:
        // vector
        return object.clone(x);

      case 2:
        // two dimensional array
        var rows = size[1],
            cols = size[0],
            asMatrix = (x instanceof Matrix),
            data = x.valueOf(),
            transposed = [],
            transposedRow,
            clone = object.clone;

        if (rows === 0) {
          // whoops
          throw new RangeError('Cannot transpose a 2D matrix with no rows' +
              '(size: ' + string.format(size) + ')');
        }

        for (var r = 0; r < rows; r++) {
          transposedRow = transposed[r] = [];
          for (var c = 0; c < cols; c++) {
            transposedRow[c] = clone(data[c][r]);
          }
        }

        return asMatrix ? new Matrix(transposed) : transposed;

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional ' +
            '(size: ' + string.format(size) + ')');
    }
  };
};
