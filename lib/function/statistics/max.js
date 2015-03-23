'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix,
      collection = math.collection,

      isCollection = collection.isCollection;

  /**
   * Compute the maximum value of a matrix or a  list with values.
   * In case of a multi dimensional array, the maximum of the flattened array
   * will be calculated. When `dim` is provided, the maximum over the selected
   * dimension will be calculated. Parameter `dim` is zero-based.
   *
   * Syntax:
   *
   *     math.max(a, b, c, ...)
   *     math.max(A)
   *     math.max(A, dim)
   *
   * Examples:
   *
   *     math.max(2, 1, 4, 3);                  // returns 4
   *     math.max([2, 1, 4, 3]);                // returns 4
   *
   *     // maximum over a specified dimension (zero-based)
   *     math.max([[2, 5], [4, 3], [1, 7]], 0); // returns [4, 7]
   *     math.max([[2, 5], [4, 3]], [1, 7], 1); // returns [5, 4, 7]
   *
   *     math.max(2.7, 7.1, -4.5, 2.0, 4.1);    // returns 7.1
   *     math.min(2.7, 7.1, -4.5, 2.0, 4.1);    // returns -4.5
   *
   * See also:
   *
   *    mean, median, min, prod, std, sum, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The maximum value
   */
  math.max = function max(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function max requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // max([a, b, c, d, ...])
        return _max(args);
      }
      else if (arguments.length == 2) {
        // max([a, b, c, d, ...], dim)
        return collection.reduce(arguments[0], arguments[1], _getLarger);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // max(a, b, c, d, ...)
      return _max(arguments);
    }
  };

  function _getLarger(x, y){
	  return math.larger(x, y) ? x : y;
  }

  /**
   * Recursively calculate the maximum value in an n-dimensional array
   * @param {Array} array
   * @return {Number} max
   * @private
   */
  function _max(array) {
    var max = undefined;

    collection.deepForEach(array, function (value) {
      if (max === undefined || math.larger(value, max)) {
        max = value;
      }
    });

    if (max === undefined) {
      throw new Error('Cannot calculate max of an empty array');
    }

    return max;
  }
};
