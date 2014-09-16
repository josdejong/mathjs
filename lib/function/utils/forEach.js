'use strict';

module.exports = function (math) {
  var isMatrix = require('../../type/Matrix').isMatrix;

  /**
   * Iterate over all elements of a matrix/array, and executes the given callback function.
   *
   * Syntax:
   *
   *    math.forEach(x, callback)
   *
   * Examples:
   *
   *    math.forEach([1, 2, 3], function(value) {
   *      console.log(value);
   *    });
   *    // outputs 1, 2, 3
   *
   * See also:
   *
   *    filter, map, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  math.forEach = function (x, callback) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('forEach', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _forEachArray(x, callback);
    } else if (isMatrix(x)) {
      return x.forEach(callback);
    } else {
      throw new math.error.UnsupportedTypeError('forEach', math['typeof'](x));
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
  }

};