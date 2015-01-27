'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),

      object = util.object,
      string = util.string;

  /**
   * Calculate the trace of a matrix.
   *
   * Syntax:
   *
   *    math.tr(x)
   *
   * Examples:
   *
   *    math.tr([[1, 2], [3, 4]]); // returns 5
   *
   *    var A = [
   *      [1, 2, 3],
   *      [-1, 2, 3],
   *      [2, 0, 3]
   *    ]
   *    math.det(A); // returns 6
   *
   * @param {Array | Matrix} x  A matrix
   * @return {Number} The trace of `x`
   */
  math.tr = function tr (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('tr', arguments.length, 1);
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
          return _tr(x.clone().valueOf());
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
   * @returns {Number} tr
   * @private
   */
  function _tr (matrix) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        sum = math.add(sum, matrix[i][i]);
    }
    return sum;
  }
};
