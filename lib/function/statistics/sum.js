'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix,
      collection = math.collection,

      isCollection = collection.isCollection;

  /**
   * Compute the sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the sum of all
   * elements will be calculated.
   *
   * Syntax:
   *
   *     math.sum(a, b, c, ...)
   *     math.sum(A)
   *
   * Examples:
   *
   *     math.sum(2, 1, 4, 3);               // returns 10
   *     math.sum([2, 1, 4, 3]);             // returns 10
   *     math.sum([[2, 5], [4, 3], [1, 7]]); // returns 22
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The sum of all values
   */
  math.sum = function sum(args) {
    if (arguments.length == 0) {
      throw new SyntaxError('Function sum requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length == 1) {
        // sum([a, b, c, d, ...])
        return _sum(args);
      }
      else if (arguments.length == 2) {
        // sum([a, b, c, d, ...], dim)
        // TODO: implement sum(A, dim)
        throw new Error('sum(A, dim) is not yet supported');
        //return collection.reduce(arguments[0], arguments[1], math.add);
      }
      else {
        throw new SyntaxError('Wrong number of parameters');
      }
    }
    else {
      // sum(a, b, c, d, ...)
      return _sum(arguments);
    }
  };

  /**
   * Recursively calculate the sum of an n-dimensional array
   * @param {Array} array
   * @return {Number} sum
   * @private
   */
  function _sum(array) {
    var sum = undefined;

    collection.deepForEach(array, function (value) {
      sum = (sum === undefined) ? value : math.add(sum, value);
    });

    if (sum === undefined) {
      throw new Error('Cannot calculate sum of an empty array');
    }

    return sum;
  }
};
