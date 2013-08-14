module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),

      object = util.object,
      array = util.array,
      string = util.string;

  /**
   * @constructor det
   * Calculate the determinant of a matrix
   *
   *     det(x)
   *
   * @param {Array | Matrix} x
   * @return {Number} determinant
   */
  math.det = function det (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('det', arguments.length, 1);
    }

    var size = array.size(x.valueOf());
    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);
        break;

      case 1:
        // vector
        if (size[0] == 1) {
          return object.clone(x.valueOf()[0]);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        if (rows == cols) {
          return _det(x.valueOf(), rows, cols);
        }
        else {
          throw new RangeError('Matrix must be square ' +
              '(size: ' + string.format(size) + ')');
        }
        break;

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
      return matrix[0][0];
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
      var d = 1;
      var lead = 0;
      for (var r = 0; r < rows; r++) {
        if (lead >= cols) {
          break;
        }
        var i = r;
        // Find the pivot element.
        while (matrix[i][lead] == 0) {
          i++;
          if (i == rows) {
            i = r;
            lead++;
            if (lead == cols) {
              // We found the last pivot.
              if (object.deepEqual(matrix, eye(rows).valueOf())) {
                return math.round(d, 6);
              } else {
                return 0;
              }
            }
          }
        }
        if (i != r) {
          // Swap rows i and r, which negates the determinant.
          for (var a = 0; a < cols; a++) {
            var temp = matrix[i][a];
            matrix[i][a] = matrix[r][a];
            matrix[r][a] = temp;
          }
          d *= -1;
        }
        // Scale row r and the determinant simultaneously.
        var div = matrix[r][lead];
        for (var a = 0; a < cols; a++) {
          matrix[r][a] = matrix[r][a] / div;
        }
        d *= div;
        // Back-substitute upwards.
        for (var j = 0; j < rows; j++) {
          if (j != r) {
            // Taking linear combinations does not change the det.
            var c = matrix[j][lead];
            for (var a = 0; a < cols; a++) {
              matrix[j][a] = matrix[j][a] - matrix[r][a] * c;
            }
          }
        }
        lead++; // Now looking for a pivot further right.
      }
      // If reduction did not result in the identity, the matrix is singular.
      if (object.deepEqual(matrix, math.eye(rows).valueOf())) {
        return math.round(d, 6);
      } else {
        return 0;
      }
    }
  }
};
