'use strict';

var size = require('../../util/array').size;
var clone = require('../../util/object').clone;
var format = require('../../util/string').format;

function factory (type, config, load, typed) {
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
  return typed('transpose', {
    'Array': function (x) {
      return _transpose(x, size(x));
    },

    'Matrix': function (x) {
      // use optimized matrix implementation if available
      return x.transpose();
    },

    // scalars
    'any': function (x) {
      return clone(x);
    }
  });

  /**
   * Transpose an array
   * @param {Array} data
   * @param {Array} size
   * @returns {Array}
   * @private
   */
  function _transpose (data, size) {
    switch (size.length) {
      case 1:
        // vector
        return clone(data);

      case 2:
        // two dimensional array
        var rows = size[1];
        var cols = size[0];
        var transposed = [];

        if (rows === 0) {
          // whoops
          throw new RangeError('Cannot transpose a 2D matrix with no rows' +
          '(size: ' + format(size) + ')');
        }

        for (var r = 0; r < rows; r++) {
          var transposedRow = transposed[r] = [];
          for (var c = 0; c < cols; c++) {
            transposedRow[c] = clone(data[c][r]);
          }
        }

        return transposed;

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be a vector or two dimensional ' +
        '(size: ' + format(size) + ')');
    }
  }
}

exports.name = 'transpose';
exports.factory = factory;
