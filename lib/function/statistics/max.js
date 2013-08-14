module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection;

  /**
   * Compute the maximum value of a list of values
   *
   *     max(a, b, c, ...)
   *     max([a, b, c, ...])
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.max = function max(args) {
    if (arguments.length == 0) {
      throw new Error('Function max requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      // max([a, b, c, d, ...]])
      if (arguments.length > 1) {
        throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
      }

      var size = math.size(args).valueOf();

      if (size.length == 1) {
        // vector
        if (args.length == 0) {
          throw new Error('Cannot calculate max of an empty vector');
        }

        return _max(args.valueOf());
      }
      else if (size.length == 2) {
        // 2 dimensional matrix
        if (size[0] == 0 || size[1] == 0) {
          throw new Error('Cannot calculate max of an empty matrix');
        }

        // TODO: make a generic collection method for this
        if (Matrix.isMatrix(args)) {
          return new Matrix(_max2(args.valueOf(), size[0], size[1]));
        }
        else {
          return _max2(args, size[0], size[1]);
        }
      }
      else {
        // TODO: implement max for n-dimensional matrices
        throw new RangeError('Cannot calculate max for multi dimensional matrix');
      }
    }
    else {
      // max(a, b, c, d, ...)
      return _max(arguments);
    }
  };

  /**
   * Calculate the max of a one dimensional array
   * @param {Array} array
   * @return {Number} max
   * @private
   */
  function _max(array) {
    var res = array[0];
    for (var i = 1, iMax = array.length; i < iMax; i++) {
      var value = array[i];
      if (math.larger(value, res)) {
        res = value;
      }
    }
    return res;
  }

  /**
   * Calculate the max of a two dimensional array
   * @param {Array} array
   * @param {Number} rows
   * @param {Number} cols
   * @return {Number[]} max
   * @private
   */
  function _max2(array, rows, cols) {
    var res = [];
    for (var c = 0; c < cols; c++) {
      var max = array[0][c];
      for (var r = 1; r < rows; r++) {
        var value = array[r][c];
        if (math.larger(value, max)) {
          max = value;
        }
      }
      res[c] = max;
    }
    return res;
  }
};
