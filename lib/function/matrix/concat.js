'use strict';

module.exports = function (math) {
  var util = require('../../util/index');

  var BigNumber = require('../../type/BigNumber');
  var Matrix = math.type.Matrix;
  var collection = math.collection;

  var object = util.object;
  var array = util.array;
  var isNumber = util.number.isNumber;
  var isInteger = util.number.isInteger;
  var isCollection = collection.isCollection;

  /**
   * Concatenate two or more matrices.
   *
   * Syntax:
   *
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where:
   *
   * - `dim: number` is a zero-based dimension over which to concatenate the matrices.
   *   By default the last dimension of the matrices.
   *
   * Examples:
   *
   *    var A = [[1, 2], [5, 6]];
   *    var B = [[3, 4], [7, 8]];
   *
   *    math.concat(A, B);      // returns [[1, 2, 3, 4], [5, 6, 7, 8]]
   *    math.concat(A, B, 0);   // returns [[1, 2], [5, 6], [3, 4], [7, 8]]
   *
   * See also:
   *
   *    size, squeeze, subset, transpose
   *
   * @param {... Array | Matrix} args     Two or more matrices
   * @return {Array | Matrix} Concatenated matrix
   */
  math.concat = function concat (args) {
    var i,
        len = arguments.length,
        dim = -1,  // zero-based dimension
        prevDim,
        asMatrix = false,
        matrices = [];  // contains multi dimensional arrays

    for (i = 0; i < len; i++) {
      var arg = arguments[i];

      // test whether we need to return a Matrix (if not we return an Array)
      if (arg instanceof Matrix) {
        asMatrix = true;
      }

      if ((i == len - 1) && (isNumber(arg) || arg instanceof BigNumber)) {
        // last argument contains the dimension on which to concatenate
        prevDim = dim;
        dim = arg.valueOf(); // change bignumber to number

        if (!isInteger(dim)) {
          throw new TypeError('Integer number expected for dimension');
        }

        if (dim < 0) {
          // TODO: would be more clear when throwing a DimensionError here
          throw new math.error.IndexError(dim);
        }
        if (i > 0 && dim > prevDim) {
          // TODO: would be more clear when throwing a DimensionError here
          throw new math.error.IndexError(dim, prevDim + 1);
        }
      }
      else if (isCollection(arg)) {
        // this is a matrix or array
        var matrix = object.clone(arg).valueOf();
        var size = array.size(arg.valueOf());
        matrices[i] = matrix;
        prevDim = dim;
        dim = size.length - 1;

        // verify whether each of the matrices has the same number of dimensions
        if (i > 0 && dim != prevDim) {
          throw new math.error.DimensionError(prevDim + 1, dim + 1);
        }
      }
      else {
        throw new math.error.UnsupportedTypeError('concat', math['typeof'](arg));
      }
    }

    if (matrices.length == 0) {
      throw new SyntaxError('At least one matrix expected');
    }

    var res = matrices.shift();
    while (matrices.length) {
      res = _concat(res, matrices.shift(), dim, 0);
    }

    return asMatrix ? math.matrix(res) : res;
  };

  /**
   * Recursively concatenate two matrices.
   * The contents of the matrices is not cloned.
   * @param {Array} a             Multi dimensional array
   * @param {Array} b             Multi dimensional array
   * @param {Number} concatDim    The dimension on which to concatenate (zero-based)
   * @param {Number} dim          The current dim (zero-based)
   * @return {Array} c            The concatenated matrix
   * @private
   */
  function _concat(a, b, concatDim, dim) {
    if (dim < concatDim) {
      // recurse into next dimension
      if (a.length != b.length) {
        throw new math.error.DimensionError(a.length, b.length);
      }

      var c = [];
      for (var i = 0; i < a.length; i++) {
        c[i] = _concat(a[i], b[i], concatDim, dim + 1);
      }
      return c;
    }
    else {
      // concatenate this dimension
      return a.concat(b);
    }
  }
};
