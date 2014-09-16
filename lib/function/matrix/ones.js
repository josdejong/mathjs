'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,

      isArray = Array.isArray;

  /**
   * Create a matrix filled with ones. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.ones(m)
   *    math.ones(m, n)
   *    math.ones([m, n])
   *    math.ones([m, n, p, ...])
   *
   * Examples:
   *
   *    math.ones(3);                   // returns [1, 1, 1]
   *    math.ones(3, 2);                // returns [[1, 1], [1, 1], [1, 1]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.zeros(math.size(A));       // returns [[1, 1, 1], [1, 1, 1]]
   *
   * See also:
   *
   *    zeros, eye, size, range
   *
   * @param {...Number | Array} size    The size of each dimension of the matrix
   * @return {Array | Matrix | Number}  A matrix filled with ones
   */
  math.ones = function ones (size) {
    var args = collection.argsToArray(arguments);
    var asMatrix = (size instanceof Matrix) ? true :
        (isArray(size) ? false : (config.matrix === 'matrix'));

    if (args.length == 0) {
      // output an empty matrix
      return asMatrix ? new Matrix() : [];
    }
    else {
      // output an array or matrix

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
      var defaultValue = asBigNumber ? new BigNumber(1) : 1;
      res = array.resize(res, args, defaultValue);

      return asMatrix ? new Matrix(res) : res;
    }
  };
};
