var error = require('../../util/error.js'),
    collection = require('../../type/collection.js'),
    number = require('../../util/number.js'),

    Matrix = require('../../type/Matrix.js');

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
module.exports = function eye (size) {
  var args = collection.argsToArray(arguments);
  if (args.length == 0) {
    args = [1, 1];
  }
  else if (args.length == 1) {
    args[1] = args[0];
  }
  else if (args.length > 2) {
    throw new error.ArgumentsError('eye', args.length, 0, 2);
  }

  var rows = args[0],
      cols = args[1];

  if (!number.isNumber(rows) || !number.isInteger(rows) || rows < 1) {
    throw new Error('Parameters in function eye must be positive integers');
  }
  if (cols) {
    if (!number.isNumber(cols) || !number.isInteger(cols) || cols < 1) {
      throw new Error('Parameters in function eye must be positive integers');
    }
  }

  // create and args the matrix
  var matrix = new Matrix();
  matrix.resize(args);

  // fill in ones on the diagonal
  var minimum = min(args);
  var data = matrix.valueOf();
  for (var d = 0; d < minimum; d++) {
    data[d][d] = 1;
  }

  return matrix;
};

// require after module.exports because of possible circular references
var min = require('../statistics/min.js');
