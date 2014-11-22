'use strict';

module.exports = function (math) {
  var util = require('../../util/index'),
      Matrix = require('../../type/Matrix');

  /**
   * Create a Matrix. The function creates a new `math.type.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   *
   * Syntax:
   *
   *    math.matrix()      // creates an empty matrix
   *    math.matrix(data)  // creates a matrix with initial data.
   *
   * Examples:
   *
   *    var m = math.matrix([[1, 2], [3, 4]]);
   *    m.size();                        // Array [2, 2]
   *    m.resize([3, 2], 5);
   *    m.valueOf();                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @return {Matrix} The created matrix
   */
  math.matrix = function matrix(data) {
    if (arguments.length > 1) {
      throw new math.error.ArgumentsError('matrix', arguments.length, 0, 1);
    }

    return new Matrix(data);
  };
};
