var error = require('../../util/error.js'),
    string = require('../../util/string.js'),
    object = require('../../util/object.js'),
    array = require('../../util/array.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Create the transpose of a matrix
 *
 *     transpose(x)
 *
 * @param {Array | Matrix} x
 * @return {Array | Matrix} transpose
 */
module.exports = function transpose (x) {
  if (arguments.length != 1) {
    throw new error.ArgumentsError('transpose', arguments.length, 1);
  }

  var size = array.size(x.valueOf());
  switch (size.length) {
    case 0:
      // scalar
      return object.clone(x);
      break;

    case 1:
      // vector
      // TODO: is it logic to return a 1 dimensional vector itself as transpose?
      return object.clone(x);
      break;

    case 2:
      // two dimensional array
      var rows = size[1],  // index 1 is no error
          cols = size[0],  // index 0 is no error
          asMatrix = Matrix.isMatrix(x),
          data = x.valueOf(),
          transposed = [],
          transposedRow,
          clone = object.clone;
      for (var r = 0; r < rows; r++) {
        transposedRow = transposed[r] = [];
        for (var c = 0; c < cols; c++) {
          transposedRow[c] = clone(data[c][r]);
        }
      }
      if (cols == 0) {
        transposed[0] = [];
      }
      return asMatrix ? new Matrix(transposed) : transposed;
      break;

    default:
      // multi dimensional array
      throw new RangeError('Matrix must be two dimensional ' +
          '(size: ' + string.format(size) + ')');
  }
};
