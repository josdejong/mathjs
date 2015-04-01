'use strict';

var array     = require('../../util/array');
var clone     = require('../../util/object').clone;
var isNumber  = require('../../util/number').isNumber;
var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
  var matrix = load(require('../construction/matrix'));
  
  /**
   * Create a diagonal matrix or retrieve the diagonal of a matrix
   *
   * When `x` is a vector, a matrix with vector `x` on the diagonal will be returned.
   * When `x` is a two dimensional matrix, the matrixes `k`th diagonal will be returned as vector.
   * When k is positive, the values are placed on the super diagonal.
   * When k is negative, the values are placed on the sub diagonal.
   *
   * Syntax:
   *
   *     math.diag(X)
   *     math.diag(X, format)
   *     math.diag(X, k)
   *     math.diag(X, k, format)
   *
   * Examples:
   *
   *     // create a diagonal matrix
   *     math.diag([1, 2, 3]);      // returns [[1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *     math.diag([1, 2, 3], 1);   // returns [[0, 1, 0, 0], [0, 0, 2, 0], [0, 0, 0, 3]]
   *     math.diag([1, 2, 3], -1);  // returns [[0, 0, 0], [1, 0, 0], [0, 2, 0], [0, 0, 3]]
   *
   *    // retrieve the diagonal from a matrix
   *    var a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
   *    math.diag(a);   // returns [1, 5, 9]
   *
   * See also:
   *
   *     ones, zeros, eye
   *
   * @param {Matrix | Array} x          A two dimensional matrix or a vector
   * @param {Number | BigNumber} [k=0]  The diagonal where the vector will be filled
   *                                    in or retrieved.
   * @param {string} [format='dense']   The matrix storage format.
   *
   * @returns {Matrix | Array} Diagonal matrix from input vector, or diagonal from input matrix.
   */
  return typed('diag', {
    // FIXME: simplify this huge amount of signatures as soon as typed-function supports optional arguments

    'Array': function (x) {
      return _diag(x, 0, array.size(x), null);
    },

    'Array, number': function (x, k) {
      return _diag(x, k, array.size(x), null);
    },
    
    'Array, BigNumber': function (x, k) {
      return _diag(x, k.toNumber(), array.size(x), null);
    },

    'Array, string': function (x, format) {
      return _diag(x, 0, array.size(x), format);
    },

    'Array, number, string': function (x, k, format) {
      return _diag(x, k, array.size(x), format);
    },

    'Array, BigNumber, string': function (x, k, format) {
      return _diag(x, k.toNumber(), array.size(x), format);
    },

    'Matrix': function (x) {
      return _diag(x, 0, x.size(), x.storage());
    },

    'Matrix, number': function (x, k) {
      return _diag(x, k, x.size(), x.storage());
    },

    'Matrix, BigNumber': function (x, k) {
      return _diag(x, k.toNumber(), x.size(), x.storage());
    },

    'Matrix, string': function (x, format) {
      return _diag(x, 0, x.size(), format);
    },

    'Matrix, number, string': function (x, k, format) {
      return _diag(x, k, x.size(), format);
    },

    'Matrix, BigNumber, string': function (x, k, format) {
      return _diag(x, k.toNumber(), x.size(), format);
    }
  });

  /**
   * Creeate diagonal matrix from a vector or vice versa
   * @param {Array} x
   * @param {number} k
   * @param {Array} size
   * @param {string} [format] Storage format for matrix. If undefined,
   *                          an Array is returned
   * @returns {Array | Matrix}
   * @private
   */
  function _diag (x, k, size, format) {
    var vector, i, iMax;

    if (!isNumber(k) || !isInteger(k)) {
      throw new TypeError ('Second parameter in function diag must be an integer');
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;
    
    // FIXME: reimplement optimization for sparse matrices
    
    switch (size.length) {
      case 1:
        // x is a vector. create diagonal matrix
        var defaultValue = (x[0] instanceof type.BigNumber) ? new type.BigNumber(0) : 0;
        var mat = array.resize([], [x.length + kSub, x.length + kSuper], defaultValue);
        for (i = 0; i < x.length; i++) {
          mat[i + kSub][i + kSuper] = clone(x[i]);
        }
        return format ? matrix(mat, format) : mat;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        iMax = Math.min(size[0] - kSub, size[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = clone(x[i + kSub][i + kSuper]);
        }
        return format ? matrix(vector, format) : vector;

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  }
}

exports.name = 'diag';
exports.factory = factory;
