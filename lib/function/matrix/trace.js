'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      string = util.string;

  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * Syntax:
   *
   *    math.trace(x)
   *
   * Examples:
   *
   *    math.trace([[1, 2], [3, 4]]); // returns 5
   *
   *    var A = [
   *      [1, 2, 3],
   *      [-1, 2, 3],
   *      [2, 0, 3]
   *    ]
   *    math.trace(A); // returns 6
   *
   * See also:
   *
   *    diag
   *
   * @param {Array | Matrix} x  A matrix
   * @return {Number} The trace of `x`
   */
  math.trace = function trace (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('trace', arguments.length, 1);
    }

    var size;
    if (x instanceof Matrix) {
      size = x.size();
    }
    else if (x instanceof Array) {
      x = new Matrix(x);
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
          return _trace(x.clone().valueOf());
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
   * Calculate the trace of a matrix
   * @param {Array[]} matrix  A square, two dimensional matrix
   * @returns {Number} trace
   * @private
   */
  function _trace (matrix) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        sum = math.add(sum, matrix[i][i]);
    }
    return sum;
  }
};
