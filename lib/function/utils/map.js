'use strict';

module.exports = function (math) {
  var isMatrix = require('../../type/Matrix').isMatrix;


  /**
   * Create a new matrix or array with the results of the callback function executed on
   * each entry of the matrix/array.
   *
   * Syntax:
   *
   *    math.map(x, callback)
   *
   * Examples:
   *
   *    math.map([1, 2, 3], function(value) {
   *      return value * value;
   *    });  // returns [1, 4, 9]
   *
   * See also:
   *
   *    filter, forEach, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback method is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the matrix being traversed.
   * @return {Matrix | array}     Transformed map of x
   */
  math.map = function (x, callback) {
    if (arguments.length != 2) {
      throw new math.error.ArgumentsError('map', arguments.length, 2);
    }

    if (Array.isArray(x)) {
      return _mapArray(x, callback);
    } else if (isMatrix(x)) {
      return x.map(callback);
    } else {
      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
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
  }
};
