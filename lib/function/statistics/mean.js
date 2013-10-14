module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection;

  /**
   * Compute the mean value of a list of values
   *
   *     mean(a, b, c, ...)
   *     mean([a, b, c, ...])
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} res
   */
  math.mean = function mean(args) {
    if (arguments.length == 0) {
      throw new Error('Function mean requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      // mean([a, b, c, d, ...]])
      if (arguments.length > 1) {
        throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
      }

      var size = math.size(args).valueOf();

      if (size.length == 1) {
        // vector
        if (args.length == 0) {
          throw new Error('Cannot calculate mean of an empty vector');
        }

        return _mean(args.valueOf());
      }
      else if (size.length == 2) {
        // 2 dimensional matrix
        if (size[0] == 0 || size[1] == 0) {
          throw new Error('Cannot calculate mean of an empty matrix');
        }

        // TODO: make a generic collection method for this
        if (Matrix.isMatrix(args)) {
          return new Matrix(_mean2(args.valueOf(), size[0], size[1]));
        }
        else {
          return _mean2(args, size[0], size[1]);
        }
      }
      else {
        // TODO: implement mean for n-dimensional matrices
        throw new RangeError('Cannot calculate mean for multi dimensional matrix');
      }
    }
    else {
      // mean(a, b, c, d, ...)
      return _mean(arguments);
    }
  };

  /**
   * Calculate the mean of a one dimensional array
   * @param {Array} array
   * @return {Number} mean value
   * @private
   */
  function _mean(array) {
    var res = 0.0;
    for (var i = 0, iMax = array.length; i < iMax; i++) {
      res = math.add(res, array[i]);
    }
    return math.divide(res, array.length);
  }

  /**
   * Calculate the mean of a two dimensional array
   * @param {Array} array
   * @param {Number} rows
   * @param {Number} cols
   * @return {Number[]} array with mean values
   * @private
   */
  function _mean2(array, rows, cols) {
    var res = [];
    for (var c = 0; c < cols; c++) {
      var value = 0.0;
      for (var r = 0; r < rows; r++) {
        value = math.add(value, array[r][c]);
      }
      res[c] = math.divide(value, rows);
    }
    return res;
  }
};
