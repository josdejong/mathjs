module.exports = function (math) {
  var error = require('../../util/error.js'),
      isMatrix = require('../../type/Matrix').isMatrix;

  /**
   * Execute a callback method on each entry of the matrix or the array.
   * @param {Matrix/array} x      The container to iterate on.
   * @param {function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  math.forEach = function (x, callback) {
    if (arguments.length != 2) {
      throw new error.ArgumentsError('forEach', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _forEachArray(x, callback);
    } else if (isMatrix(x)) {
      return x.forEach(callback);
    } else {
      throw new error.UnsupportedTypeError('forEach', x);
    }
  };

  function _forEachArray (array, callback) {
    var index = [];
    var recurse = function (value, dim) {
      if (Array.isArray(value)) {
        value.forEach(function (child, i) {
          index[dim] = i; // zero-based index
          recurse(child, dim + 1);
        });
      }
      else {
        callback(value, index, array);
      }
    };
    recurse(array, 0);
  };

};