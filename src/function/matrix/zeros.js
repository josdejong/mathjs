var collection = require('../../type/collection.js'),
    Matrix = require('../../type/Matrix.js');

/**
 * create a matrix filled with zeros
 *
 *     zeros(n)
 *     zeros(m, n)
 *     zeros([m, n])
 *     zeros([m, n, p, ...])
 *
 * @param {...Number | Array} size
 * @return {Matrix} matrix
 */
module.exports = function zeros (size) {
  var args = collection.argsToArray(arguments);

  if (args.length == 0) {
    args = [1, 1];
  }
  else if (args.length == 1) {
    args[1] = args[0];
  }

  // create and size the matrix
  var matrix = new Matrix();
  matrix.resize(args);
  return matrix;
};
