'use strict';

function factory (type, config, load, typed) {
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
  return typed('matrix', {
    '': function () {
      return new type.Matrix();
    },

    'Array | Matrix': function (data) {
      return new type.Matrix(data);
    }
  });
}

exports.type = 'function';
exports.name = 'matrix';
exports.factory = factory;
