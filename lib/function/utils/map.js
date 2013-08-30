module.exports = function (math) {
  var error = require('../../util/error.js'),
      isMatrix = require('../../type/Matrix').isMatrix;

  /**
   * Create a new matrix or array with the results of the callback function executed on
   * each entry of the matrix/array.
   * @param {Matrix/array} x      The container to iterate on.
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix being traversed.
   * @return {Matrix/array} container
   */
  math.map = function (x, callback) {
    if (arguments.length != 2) {
      throw new error.ArgumentsError('map', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _mapArray(x, callback);
    } else if (isMatrix(x)) {
      return x.map(callback);
    } else {
      throw new error.UnsupportedTypeError('map', x);
    }
  };

  function _mapArray (arrayIn, callback) {
    var index = [];
    var recurse = function (value, dim) {
      if (Array.isArray(value)) {
        return value.map(function (child, i) {
          index[dim] = i;
          return recurse(child, dim + 1);
        });
      }
      else {
        return callback(value, index, arrayIn);
      }
    };

    return recurse(arrayIn, 0);
  };
};
