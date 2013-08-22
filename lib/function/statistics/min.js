module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      isCollection = collection.isCollection;

  /**
   * Compute the minimum value of a list of values
   *
   *     min(a, b, c, ...)
   *     min([a, b, c, ...])
   *
   * @param {... *} args  A single matrix or multiple scalars
   * @return {*} res
   */
  math.min = function min(args) {
    if (arguments.length == 0) {
      throw new Error('Function min requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      // min([a, b, c, d, ...]])
      if (arguments.length > 1) {
        throw Error('Wrong number of parameters (1 matrix or multiple scalars expected)');
      }

      var size = math.size(args).valueOf();

      if (size.length == 1) {
        // vector
        if (args.length == 0) {
          throw new Error('Cannot calculate min of an empty vector');
        }

        return _min(args.valueOf());
      }
      else if (size.length == 2) {
        // 2 dimensional matrix
        if (size[0] == 0 || size[1] == 0) {
          throw new Error('Cannot calculate min of an empty matrix');
        }

        // TODO: make a generic collection method for this
        if (Matrix.isMatrix(args)) {
          return new Matrix(_min2(args.valueOf(), size[0], size[1]));
        }
        else {
          return _min2(args, size[0], size[1]);
        }
      }
      else {
        // TODO: implement min for n-dimensional matrices
        throw new RangeError('Cannot calculate min for multi dimensional matrix');
      }
    }
    else {
      // min(a, b, c, d, ...)
      return _min(arguments);
    }
  };

  /**
   * Calculate the min of a one dimensional array
   * @param {Array} array
   * @return {Number} min
   * @private
   */
  function _min(array) {
    var res = array[0];
    for (var i = 1, iMax = array.length; i < iMax; i++) {
      var value = array[i];
      if (math.smaller(value, res)) {
        res = value;
      }
    }
    return res;
  }

  /**
   * Calculate the min of a two dimensional array
   * @param {Array} array
   * @param {Number} rows
   * @param {Number} cols
   * @return {Number[]} min
   * @private
   */
  function _min2(array, rows, cols) {
    var res = [];
    for (var c = 0; c < cols; c++) {
      var min = array[0][c];
      for (var r = 1; r < rows; r++) {
        var value = array[r][c];
        if (math.smaller(value, min)) {
          min = value;
        }
      }
      res[c] = min;
    }
    return res;
  }
};
