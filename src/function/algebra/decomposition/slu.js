'use strict'

const util = require('../../../utils/index')

const number = util.number
const isInteger = number.isInteger

function factory (type, config, load, typed) {
  const csSqr = load(require('../../algebra/sparse/csSqr'))
  const csLu = load(require('../../algebra/sparse/csLu'))

  /**
   * Calculate the Sparse Matrix LU decomposition with full pivoting. Sparse Matrix `A` is decomposed in two matrices (`L`, `U`) and two permutation vectors (`pinv`, `q`) where
   *
   * `P * A * Q = L * U`
   *
   * Syntax:
   *
   *    math.slu(A, order, threshold)
   *
   * Examples:
   *
   *    const A = math.sparse([[4,3], [6, 3]])
   *    math.slu(A, 1, 0.001)
   *    // returns:
   *    // {
   *    //   L: [[1, 0], [1.5, 1]]
   *    //   U: [[4, 3], [0, -1.5]]
   *    //   p: [0, 1]
   *    //   q: [0, 1]
   *    // }
   *
   * See also:
   *
   *    lup, lsolve, usolve, lusolve
   *
   * @param {SparseMatrix} A              A two dimensional sparse matrix for which to get the LU decomposition.
   * @param {Number}       order          The Symbolic Ordering and Analysis order:
   *                                       0 - Natural ordering, no permutation vector q is returned
   *                                       1 - Matrix must be square, symbolic ordering and analisis is performed on M = A + A'
   *                                       2 - Symbolic ordering and analisis is performed on M = A' * A. Dense columns from A' are dropped, A recreated from A'.
   *                                           This is appropriatefor LU factorization of unsymmetric matrices.
   *                                       3 - Symbolic ordering and analisis is performed on M = A' * A. This is best used for LU factorization is matrix M has no dense rows.
   *                                           A dense row is a row with more than 10*sqr(columns) entries.
   * @param {Number}       threshold       Partial pivoting threshold (1 for partial pivoting)
   *
   * @return {Object} The lower triangular matrix, the upper triangular matrix and the permutation vectors.
   */
  const slu = typed('slu', {

    'SparseMatrix, number, number': function (a, order, threshold) {
      // verify order
      if (!isInteger(order) || order < 0 || order > 3) { throw new Error('Symbolic Ordering and Analysis order must be an integer number in the interval [0, 3]') }
      // verify threshold
      if (threshold < 0 || threshold > 1) { throw new Error('Partial pivoting threshold must be a number from 0 to 1') }

      // perform symbolic ordering and analysis
      const s = csSqr(order, a, false)

      // perform lu decomposition
      const f = csLu(a, s, threshold)

      // return decomposition
      return {
        L: f.L,
        U: f.U,
        p: f.pinv,
        q: s.q,
        toString: function () {
          return 'L: ' + this.L.toString() + '\nU: ' + this.U.toString() + '\np: ' + this.p.toString() + (this.q ? '\nq: ' + this.q.toString() : '') + '\n'
        }
      }
    }
  })

  return slu
}

exports.name = 'slu'
exports.factory = factory
