module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      array = util.array;

  /**
   * Create a matrix filled with ones
   *
   *     ones(n)
   *     ones(m, n)
   *     ones([m, n])
   *     ones([m, n, p, ...])
   *
   * @param {...Number | Array} size
   * @return {Array | Matrix | Number} matrix
   */
  math.ones = function ones (size) {
    var args = collection.argsToArray(arguments);
    var asMatrix = (size instanceof Matrix);

    if (args.length == 0) {
      // output a scalar
      return 1;
    }
    else {
      // output an array or matrix
      var res = [];
      var defaultValue = 1;
      array.resize(res, args, defaultValue);
      return asMatrix ? new Matrix(res) : res;
    }
  };
};
