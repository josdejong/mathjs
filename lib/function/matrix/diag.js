'use strict';

var array     = require('../../util/array');
var clone     = require('../../util/object').clone;
var isNumber  = require('../../util/number').isNumber;
var isInteger = require('../../util/number').isInteger;

function factory (type, config, load, typed) {
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
   *     math.diag(X, k)
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
   * @returns {Matrix | Array} Diagonal matrix from input vector, or diagonal from input matrix.
   */
  return typed('diag', {
    'Array': function (x) {
      return _diag(x, 0, array.size(x));
    },
    'Array, number': function (x, k) {
      return _diag(x, k, array.size(x));
    },
    'Array, BigNumber': function (x, k) {
      return _diag(x, k.toNumber(), array.size(x));
    },

    'Matrix': function (x) {
      return new type.Matrix(_diag(x.toArray(), 0, x.size()));
    },
    'Matrix, number': function (x, k) {
      return new type.Matrix(_diag(x.toArray(), k, x.size()));
    },
    'Matrix, BigNumber': function (x, k) {
      return new type.Matrix(_diag(x.toArray(), k.toNumber(), x.size()));
    }
  });

  /**
   * Creeate diagonal matrix from a vector or vice versa
   * @param {Array} x
   * @param {number} k
   * @param {Array} size
   * @returns {Array}
   * @private
   */
  function _diag (x, k, size) {
    var vector, i, iMax;

    if (!isNumber(k) || !isInteger(k)) {
      throw new TypeError ('Second parameter in function diag must be an integer');
    }

    var kSuper = k > 0 ? k : 0;
    var kSub = k < 0 ? -k : 0;

    switch (size.length) {
      case 1:
        // x is a vector. create diagonal matrix
        var defaultValue = (x[0] instanceof type.BigNumber) ? new type.BigNumber(0) : 0;
        var matrix = array.resize([], [x.length + kSub, x.length + kSuper], defaultValue);
        for (i = 0; i < x.length; i++) {
          matrix[i + kSub][i + kSuper] = clone(x[i]);
        }
        return matrix;

      case 2:
        // x is a matrix get diagonal from matrix
        vector = [];
        iMax = Math.min(size[0] - kSub, size[1] - kSuper);
        for (i = 0; i < iMax; i++) {
          vector[i] = clone(x[i + kSub][i + kSuper]);
        }
        return vector;

      default:
        throw new RangeError('Matrix for function diag must be 2 dimensional');
    }
  }
}

exports.type = 'function';
exports.name = 'diag';
exports.factory = factory;
