var collection = require('../../type/collection.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * Create a matrix filled with ones
 *
 *     ones(n)
 *     ones(m, n)
 *     ones([m, n])
 *     ones([m, n, p, ...])
 *
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
module.exports = function ones (size) {
  var args = collection.argsToArray(arguments);

  if (args.length == 0) {
    args = [1, 1];
  }
  else if (args.length == 1) {
    args[1] = args[0];
  }

  // create and size the matrix
  var matrix = new Matrix();
  var defaultValue = 1;
  matrix.resize(args, defaultValue);
  return matrix;
};
