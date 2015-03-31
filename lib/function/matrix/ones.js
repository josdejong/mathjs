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
   * Create a matrix filled with ones. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.ones(m)
   *    math.ones(m, format)
   *    math.ones(m, n)
   *    math.ones(m, n, format)
   *    math.ones([m, n])
   *    math.ones([m, n], format)
   *    math.ones([m, n, p, ...])
   *    math.ones([m, n, p, ...], format)
   *
   * Examples:
   *
   *    math.ones(3);                   // returns [1, 1, 1]
   *    math.ones(3, 2);                // returns [[1, 1], [1, 1], [1, 1]]
   *    math.ones(3, 2, 'dense');       // returns Dense Matrix [[1, 1], [1, 1], [1, 1]]
   *
   *    var A = [[1, 2, 3], [4, 5, 6]];
   *    math.zeros(math.size(A));       // returns [[1, 1, 1], [1, 1, 1]]
   *
   * See also:
   *
   *    zeros, eye, size, range
   *
   * @param {...Number | Array} size    The size of each dimension of the matrix
   * @param {string} [format]           The Matrix storage format
   *
   * @return {Array | Matrix | Number}  A matrix filled with ones
   */
  math.ones = function ones (size, format) {
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
    
    // default value
    var defaultValue = asBigNumber ? new BigNumber(1) : 1;

    // check we need to return a matrix
    if (f) {
      // create empty matrix
      var m = math.matrix(f);
      // check we need to resize matrix
      if (args.length > 0) {
        // resize it to correct size
        return m.resize(args, defaultValue);
      }
      return m;
    }
    // empty array
    var res = [];
    // check we need to resize array
    if (args.length > 0) {
      // resize array
      return array.resize(res, args, defaultValue);
    }
    return res;
  };
};
