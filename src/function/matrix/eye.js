module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger;

  /**
   * Create an identity matrix with size m x n
   *
   *     eye(m)
   *     eye(m, n)
   *
   * TODO: more documentation on eye
   *
   * @param {...Number | Matrix | Array} size
   * @return {Matrix} matrix
   */
  math.eye = function eye (size) {
    var args = collection.argsToArray(arguments);
    if (args.length == 0) {
      args = [1, 1];
    }
    else if (args.length == 1) {
      args[1] = args[0];
    }
    else if (args.length > 2) {
      throw new util.error.ArgumentsError('eye', args.length, 0, 2);
    }

    var rows = args[0],
        cols = args[1];

    if (!isNumber(rows) || !isInteger(rows) || rows < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
    if (cols) {
      if (!isNumber(cols) || !isInteger(cols) || cols < 1) {
        throw new Error('Parameters in function eye must be positive integers');
      }
    }

    // create and args the matrix
    var matrix = new Matrix();
    matrix.resize(args);

    // fill in ones on the diagonal
    var minimum = math.min(args);
    var data = matrix.valueOf();
    for (var d = 0; d < minimum; d++) {
      data[d][d] = 1;
    }

    return matrix;
  };
};
