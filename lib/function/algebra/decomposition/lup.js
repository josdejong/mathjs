'use strict';

function factory (type, config, load, typed) {

  var matrix = load(require('../../construction/matrix'));
  
  /**
   * Calculate the Matrix LU decomposition with pivoting. Matrix A is decomposed in three matrices (L, U, P) where
   * A * P = L * U
   *
   * @param {Matrix | Array} A two dimensional matrix or array for which to get the LUP decomposition.
   *
   * @return {Array<Matrix>} The lower triangular matrix, the upper triangular matrix and the permutation matrix.
   */
  var lup = typed('lup', {
    'Matrix': function (m) {
      // delegate to optimized matrix LUP decomposition
      return m.lup();
    },
    'Array': function (a) {
      // create dense matrix from array
      var m = matrix(a);
      // lup
      var r = m.lup();
      // result
      return {
        L: r.L.valueOf(),
        U: r.U.valueOf(),
        P: r.P.valueOf()
      };
    }
  });

  return lup;
}

exports.name = 'lup';
exports.factory = factory;
