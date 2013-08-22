module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),

      object = util.object,
      string = util.string;

  /**
   * Create the transpose of a matrix
   *
   *     transpose(x)
   *
   * @param {Array | Matrix} x
   * @return {Array | Matrix} transpose
   */
  math.transpose = function transpose (x) {
    if (arguments.length != 1) {
      throw new util.error.ArgumentsError('transpose', arguments.length, 1);
    }

    var size = math.size(x).valueOf();
    switch (size.length) {
      case 0:
        // scalar
        return object.clone(x);
        break;

      case 1:
        // vector
        return object.clone(x);
        break;

      case 2:
        // two dimensional array
        var rows = size[1],
            cols = size[0],
            asMatrix = Matrix.isMatrix(x),
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
};
