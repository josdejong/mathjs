module.exports = function (math) {
  var util = require('../../util/index'),

      Matrix = require('../../type/Matrix'),
      collection = require('../../type/collection'),

      array = util.array,
      isArray = Array.isArray;

  /**
   * create a matrix filled with zeros
   *
   *     zeros(n)
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
        (isArray(size) ? false : (math.options.matrix.defaultType === 'matrix'));

    if (args.length == 0) {
      // output a scalar
      return 0;
    }
    else {
      // output an array or matrix
      var res = [];
      var defaultValue = 0;
      array.resize(res, args, defaultValue);

      return asMatrix ? new Matrix(res) : res;
    }
  };
};
