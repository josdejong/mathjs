'use strict';

module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = math.type.Matrix,
      collection = math.collection,

      array = util.array,
      isString = util.string.isString,
      isArray = Array.isArray;

  /**
   * Create a matrix filled with zeros. The created matrix can have one or
   * multiple dimensions.
   *
   * Syntax:
   *
   *    math.zeros(m)
   *    math.zeros(m, format)
   *    math.zeros(m, n)
   *    math.zeros(m, n, format)
   *    math.zeros([m, n])
   *    math.zeros([m, n], format)
   *    math.zeros([m, n, p, ...])
   *    math.zeros([m, n, p, ...], format)
   *
   * Examples:
   *
   *    math.zeros(3);                  // returns [0, 0, 0]
   *    math.zeros(3, 2);               // returns [[0, 0], [0, 0], [0, 0]]
   *    math.zeros(3, 'dense');         // returns [0, 0, 0]
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
   *
   * @return {Array | Matrix}           A matrix filled with zeros
   */
  math.zeros = function zeros (size) {
    // process arguments
    var args = collection.argsToArray(arguments);    
    // check format was provided
    var f = arguments.length > 0 && isString(arguments[arguments.length - 1]) ? arguments[arguments.length - 1] : undefined;
    if (f) {
      // re-process arguments, ignore last one
      args = collection.argsToArray(args.slice(0, args.length - 1));
    }
    else if ((size instanceof Matrix) || (!isArray(size) && config.matrix === 'matrix')) {
      // use default matrix format
      f = 'default';
    }

    // convert arguments from bignumber to numbers if needed
    var asBigNumber = false;
    args = args.map(function (value) {
      if (value instanceof BigNumber) {
        asBigNumber = true;
        return value.toNumber();
      } 
      else {
        return value;
      }
    });
    
    // default value
    var defaultValue = asBigNumber ? new BigNumber(0) : 0;
    
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
