'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,
      collection = math.collection,

      array = util.array,
      string = util.string,
      isArray = Array.isArray;

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.zeros(m)
   *    math.zeros(m, n)
   *    math.zeros([m, n])
   *    math.zeros([m, n, p, ...])
   *
   * Examples:
   *
   *    math.zeros(3);                  // returns [0, 0, 0]
   *    math.zeros(3, 2);               // returns [[0, 0], [0, 0], [0, 0]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.zeros(math.size(A));       // returns [[0, 0, 0], [0, 0, 0]]
   *
   * See also:
   *
   *    ones, eye, size, range
   *
   * @param {...Number | Array} size    The size of each dimension of the matrix
   * @param {string} [format]           The Matrix storage format
   * @return {Array | Matrix | Number}  A matrix filled with zeros
   */
  math.zeros = function zeros (size) {
    // args
    var args = collection.argsToArray(arguments);
    // check format was provided
    var f = args.length > 0 && string.isString(args[args.length - 1]) ? args[args.length - 1] : undefined;
    if (f) {
      // remove last arg
      args.splice(args.length - 1, 1);
    }
    
    // check result type
    var asMatrix = f || (size instanceof Matrix) ? true : (isArray(size) ? false : (config.matrix === 'matrix'));
    
    if (args.length === 0) {
      // output an empty matrix
      return asMatrix ? (f ? math.matrix(f) : math.matrix()) : [];
    }
    // convert arguments from bignumber to numbers if needed
    var asBigNumber = false;
    args = args.map(function (value) {
      if (value instanceof BigNumber) {
        asBigNumber = true;
        return value.toNumber();
      } else {
        return value;
      }
    });

    // resize the matrix
    var res = [];
    var defaultValue = asBigNumber ? new BigNumber(0) : 0;
    res = array.resize(res, args, defaultValue);

    return asMatrix ? (f ? math.matrix(res, f) : math.matrix(res)) : res;
  };
};
