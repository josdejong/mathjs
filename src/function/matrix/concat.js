module.exports = function (math) {
  var util = require('../../util/index.js'),

      Matrix = require('../../type/Matrix.js'),
      collection = require('../../type/collection.js'),

      object = util.object,
      array = util.array,
      isNumber = util.number.isNumber,
      isInteger = util.number.isInteger,
      isCollection = collection.isCollection;

  /**
   * Concatenate two or more matrices
   * Usage:
   *     math.concat(A, B, C, ...)
   *     math.concat(A, B, C, ..., dim)
   *
   * Where the optional dim is the zero-based number of the dimension to be
   * concatenated.
   *
   * @param {... Array | Matrix} args
   * @return {Array | Matrix} res
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

      if ((i == len - 1) && isNumber(arg)) {
        // last argument contains the dimension on which to concatenate
        prevDim = dim;
        dim = arg;

        if (!isInteger(dim) || dim < 0) {
          throw new TypeError('Dimension number must be a positive integer ' +
              '(dim = ' + dim + ')');
        }

        if (i > 0 && dim > prevDim) {
          throw new RangeError('Dimension out of range ' +
              '(' + dim + ' > ' + prevDim + ')');
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
          throw new RangeError('Dimension mismatch ' +
              '(' + prevDim + ' != ' + dim + ')');
        }
      }
      else {
        throw new util.error.UnsupportedTypeError('concat', arg);
      }
    }

    if (matrices.length == 0) {
      throw new SyntaxError('At least one matrix expected');
    }

    var res = matrices.shift();
    while (matrices.length) {
      res = _concat(res, matrices.shift(), dim, 0);
    }

    return asMatrix ? new Matrix(res) : res;
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
        throw new Error('Dimensions mismatch (' + a.length + ' != ' + b.length + ')');
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
