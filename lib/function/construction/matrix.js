module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js');

  /**
   * Create a matrix. The function creates a new math.type.Matrix object.
   *
   * The method accepts the following arguments:
   *     matrix()       creates an empty matrix
   *     matrix(data)   creates a matrix with initial data.
   *
   * Example usage:
   *     var m = matrix([[1, 2], [3, 4]);
   *     m.size();                        // [2, 2]
   *     m.resize([3, 2], 5);
   *     m.valueOf();                     // [[1, 2], [3, 4], [5, 5]]
   *     m.get([1, 0])                    // 3
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @return {Matrix} matrix
   */
  math.matrix = function matrix(data) {
    if (arguments.length > 1) {
      throw new util.error.ArgumentsError('matrix', arguments.length, 0, 1);
    }

    return new Matrix(data);
  };
};
