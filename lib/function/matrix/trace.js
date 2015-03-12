'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = math.type.Matrix,

      object = util.object,
      array = util.array,
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
   *
   * @return {Number} The trace of `x`
   */
  math.trace = function trace (x) {
    if (arguments.length != 1) {
      throw new math.error.ArgumentsError('trace', arguments.length, 1);
    }

    // check x is a matrix
    if (x instanceof Matrix) {
      // use optimized operation for the matrix storage format
      return x.trace();
    }
    
    // size
    var size;
    if (x instanceof Array) {
      // calculate sixe
      size = array.size(x);
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
          // clone value
          return object.clone(x[0]);
        }
        throw new RangeError('Array must be square (size: ' + string.format(size) + ')');

      case 2:
        // two dimensional array
        var rows = size[0];
        var cols = size[1];
        // check array is square
        if (rows == cols) {
          // diagonal sum
          var sum = 0;
          // loop diagonal
          for (var i = 0; i < x.length; i++) {
            // sum
            sum = math.add(sum, x[i][i]);
          }
          return sum;
        }
        throw new RangeError('Array must be square (size: ' + string.format(size) + ')');

      default:
        // multi dimensional array
        throw new RangeError('Matrix must be two dimensional (size: ' + string.format(size) + ')');
    }
  };
};
