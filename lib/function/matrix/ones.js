module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,

      isArray = Array.isArray;

  /**
   * Create a matrix filled with ones
   *
   *     ones(m)
   *     ones(m, n)
   *     ones([m, n])
   *     ones([m, n, p, ...])
   *
   * @param {...Number | Array} size
   * @return {Array | Matrix | Number} matrix
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
