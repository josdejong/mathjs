module.exports = function (math, config) {
  var util = require('../../util/index'),

      BigNumber = math.type.BigNumber,
      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,
      isArray = Array.isArray;

  /**
   * create a matrix filled with zeros
   *
   *     zeros(m)
   *     zeros(m, n)
   *     zeros([m, n])
   *     zeros([m, n, p, ...])
   *
   * @param {...Number | Array} size
   * @return {Array | Matrix | Number} matrix
   */
  math.zeros = function zeros (size) {
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
      var defaultValue = asBigNumber ? new BigNumber(0) : 0;
      res = array.resize(res, args, defaultValue);

      return asMatrix ? new Matrix(res) : res;
    }
  };
};
