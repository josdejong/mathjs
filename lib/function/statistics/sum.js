'use strict';

module.exports = function (math) {
  var Matrix = math.type.Matrix,
      collection = math.collection,

      isCollection = collection.isCollection;

  /**
   * Compute the sum of a matrix or a list with values.
   * In case of a (multi dimensional) array or matrix, the sum of all
   * elements will be calculated. If dim is provided, sums along the dimension DIM. 
   *
   * Syntax:
   *
   *     math.sum(a, b, c, ...)
   *     math.sum(A, dim)
   *
   * Examples:
   *
   *     math.sum(2, 1, 4, 3);               // returns 10
   *     math.sum([2, 1, 4, 3]);             // returns 10
   *     math.sum([[2, 5], [4, 3], [1, 7]]); // returns 22
   *
   *     math.sum([[2, 5], [4, 3], [1, 7]], 1); // returns [ [7, 15] ]
   *     math.sum([[2, 5], [4, 3], [1, 7]], 2); // returns [ [7], [7], [8] ]
   *
   * See also:
   *
   *    mean, median, min, max, prod, std, var
   *
   * @param {... *} args  A single matrix or or multiple scalar values
   * @return {*} The sum of all values
   */
  math.sum = function sum(args, dim) {
    if (arguments.length === 0) {
      throw new SyntaxError('Function sum requires one or more parameters (0 provided)');
    }

    if (isCollection(args)) {
      if (arguments.length === 1) {
        // sum([a, b, c, d, ...])
        return _sum(args);
      }
      else if (arguments.length === 2) {
        // sum([a, b, c, d, ...], dim)
        return _sum(args, dim);
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
   * @param {Array, Number} array, number
   * @return {Number} sum
   * @private
   */
  function _sum(array, dim) {
    var sum = undefined;

    if (typeof dim === 'undefined'){
      collection.deepForEach(array, function (value) {
        sum = (sum === undefined) ? value : math.add(sum, value);
      });
    }
    // implement sum(A, dim)
    else if (dim === 1 || dim === 2){
      var arr = (array instanceof Matrix) ? array.valueOf() : array;
      var size = math.size(arr), A;
      
      if (dim === 1) {
        A = math.zeros([1, size[1]]);
  
        for(var i=0; i<size[0]; i++){
          for(var j=0; j<size[1]; j++){
            A[0][j] = math.add(A[0][j], arr[i][j]);
          }
        }
      }
      else/* if (dim === 2) */{
        A = math.zeros([size[0], 1]);
        for(var i=0; i<size[0]; i++){
          for(var j=0; j<size[1]; j++){
            A[i][0] = math.add(A[i][0], arr[i][j]);
          }
        }
      }
      
      return (array instanceof Matrix) ? new Matrix(A) : A;
    }

    if (sum === undefined) {
      throw new Error('Cannot calculate sum of an empty array');
    }

    return sum;
  }
  
};
