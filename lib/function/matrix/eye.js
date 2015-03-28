'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,
      collection = math.collection,
      array = util.array,

      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isString = util.string.isString,
      isArray = Array.isArray;

  /**
   * Create a 2-dimensional identity matrix with size m x n or n x n.
   * The matrix has ones on the diagonal and zeros elsewhere.
   *
   * Syntax:
   *
   *    math.eye(n)
   *    math.eye(n, format)
   *    math.eye(m, n)
   *    math.eye(m, n, format)
   *    math.eye([m, n])
   *    math.eye([m, n], format)
   *
   * Examples:
   *
   *    math.eye(3);                    // returns [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
   *    math.eye(3, 2);                 // returns [[1, 0], [0, 1], [0, 0]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.eye(math.size(b));         // returns [[1, 0, 0], [0, 1, 0]]
   *
   * See also:
   *
   *    diag, ones, zeros, size, range
   *
   * @param {...Number | Matrix | Array} size   The size for the matrix
   * @param {string} [format]                   The Matrix storage format
   *
   * @return {Matrix | Array | Number} A matrix with ones on the diagonal.
   */
  math.eye = function eye (size, format) {
    // process arguments
    var args = collection.argsToArray(arguments);    
    // matrix storage format
    var f;
    // check format was provided
    if (args.length > 0 && isString(args[args.length - 1])) {
      // set format
      f = args[args.length - 1];
      // re-process arguments, ignore last one
      args = collection.argsToArray(args.slice(0, args.length - 1));
    }
    else if (size instanceof Matrix) {
      // use matrix format
      f = size.storage();
    }
    else if (!isArray(size) && config.matrix === 'matrix') {
      // use default matrix format
      f = 'default';
    }

    // check a single arg was provided
    if (args.length == 1) {
      // change to a 2-dimensional square
      args[1] = args[0];
    }
    else if (args.length > 2) {
      // error in case of an n-dimensional size
      throw new math.error.ArgumentsError('eye', args.length, 0, 2);
    }
    
    // convert arguments from bignumber to numbers if needed
    var asBigNumber = false;
    // map arguments & validate
    args = args.map(function (value) {
      // check it is a big number
      if (value instanceof BigNumber) {
        // set flag
        asBigNumber = true;
        // convert it
        value = value.toNumber();
      }
      // validate arguments
      if (!isNumber(value) || !isInteger(value) || value < 0) {
        throw new Error('Parameters in function eye must be positive integers');
      } 
      return value;
    });

    // one
    var one = asBigNumber ? new BigNumber(1) : 1;
    // default value
    var defaultValue = asBigNumber ? new BigNumber(0) : 0;

    // check we need to return a matrix
    if (f) {      
      // check dimensions
      if (args.length === 0) {
        // empty matrix
        return math.matrix(f);
      }
      // get matrix storage constructor
      var F = Matrix.storage(f);
      // create diagonal matrix (use optimized implementation for storage format)
      return F.diagonal(args, one, 0, defaultValue);
    }

    // empty array
    var res = [];
    // check we need to resize array
    if (args.length > 0) {
      // resize array
      res = array.resize(res, args, defaultValue);
      // fill in ones on the diagonal
      var minimum = math.min(args);
      // fill diagonal
      for (var d = 0; d < minimum; d++) {
        res[d][d] = one;
      }
    }
    return res;
  };
};
