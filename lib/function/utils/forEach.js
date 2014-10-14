'use strict';

module.exports = function (math) {
  var Matrix = require('../../type/Matrix');

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
    } else if (x instanceof Matrix) {
      return x.forEach(callback);
    } else {
      throw new math.error.UnsupportedTypeError('forEach', math['typeof'](x));
    }
  };

  function _forEachArray (array, callback) {
    var recurse = function (value, index) {
      if (Array.isArray(value)) {
        value.forEach(function (child, i) {
          // we create a copy of the index array and append the new index value
          recurse(child, index.concat(i));
        });
      }
      else {
        callback(value, index, array);
      }
    };
    recurse(array, []);
  }
};