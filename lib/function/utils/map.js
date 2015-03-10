'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix;


  /**
   * Create a math.matrix or array with the results of the callback function executed on
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
    } else if (x instanceof Matrix) {
      return x.map(callback);
    } else {
      throw new math.error.UnsupportedTypeError('map', math['typeof'](x));
    }
  };

  function _mapArray (arrayIn, callback) {
    var recurse = function (value, index) {
      if (Array.isArray(value)) {
        return value.map(function (child, i) {
          // we create a copy of the index array and append the new index value
          return recurse(child, index.concat(i));
        });
      }
      else {
        return callback(value, index, arrayIn);
      }
    };

    return recurse(arrayIn, []);
  }
};
