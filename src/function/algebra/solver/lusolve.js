import { isArray, isMatrix } from '../../../utils/is.js'
import { factory } from '../../../utils/factory.js'
import { createSolveValidation } from './utils/solveValidation.js'
import { csIpvec } from '../sparse/csIpvec.js'

const name = 'lusolve'
const dependencies = [
  'typed',
  'matrix',
  'lup',
  'slu',
  'usolve',
  'lsolve',
  'DenseMatrix'
]

export const createLusolve = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, lup, slu, usolve, lsolve, DenseMatrix }) => {
  const solveValidation = createSolveValidation({ DenseMatrix })

  /**
   * Solves the linear system `A * x = b` where `A` is an [n x n] matrix and `b` is a [n] column vector.
   *
   * Syntax:
   *
   *    math.lusolve(A, b)     // returns column vector with the solution to the linear system A * x = b
   *    math.lusolve(lup, b)   // returns column vector with the solution to the linear system A * x = b, lup = math.lup(A)
   *
   * Examples:
   *
   *    const m = [[1, 0, 0, 0], [0, 2, 0, 0], [0, 0, 3, 0], [0, 0, 0, 4]]
   *
   *    const x = math.lusolve(m, [-1, -1, -1, -1])        // x = [[-1], [-0.5], [-1/3], [-0.25]]
   *
   *    const f = math.lup(m)
   *    const x1 = math.lusolve(f, [-1, -1, -1, -1])       // x1 = [[-1], [-0.5], [-1/3], [-0.25]]
   *    const x2 = math.lusolve(f, [1, 2, 1, -1])          // x2 = [[1], [1], [1/3], [-0.25]]
   *
   *    const a = [[-2, 3], [2, 1]]
   *    const b = [11, 9]
   *    const x = math.lusolve(a, b)  // [[2], [5]]
   *
   * See also:
   *
   *    lup, slu, lsolve, usolve
   *
   * @param {Matrix | Array | Object} A      Invertible Matrix or the Matrix LU decomposition
   * @param {Matrix | Array} b               Column Vector
   * @param {number} [order]                 The Symbolic Ordering and Analysis order, see slu for details. Matrix must be a SparseMatrix
   * @param {Number} [threshold]             Partial pivoting threshold (1 for partial pivoting), see slu for details. Matrix must be a SparseMatrix.
   *
   * @return {DenseMatrix | Array}           Column vector with the solution to the linear system A * x = b
   */
  return typed(name, {

    'Array, Array | Matrix': function (a, b) {
      a = matrix(a)
      const d = lup(a)
      const x = _lusolve(d.L, d.U, d.p, null, b)
      return x.valueOf()
    },

    'DenseMatrix, Array | Matrix': function (a, b) {
      const d = lup(a)
      return _lusolve(d.L, d.U, d.p, null, b)
    },

    'SparseMatrix, Array | Matrix': function (a, b) {
      const d = lup(a)
      return _lusolve(d.L, d.U, d.p, null, b)
    },

    'SparseMatrix, Array | Matrix, number, number': function (a, b, order, threshold) {
      const d = slu(a, order, threshold)
      return _lusolve(d.L, d.U, d.p, d.q, b)
    },

    'Object, Array | Matrix': function (d, b) {
      return _lusolve(d.L, d.U, d.p, d.q, b)
    }
  })

  function _toMatrix (a) {
    if (isMatrix(a)) { return a }
    if (isArray(a)) { return matrix(a) }
    throw new TypeError('Invalid Matrix LU decomposition')
  }

  function _lusolve (l, u, p, q, b) {
    // verify decomposition
    l = _toMatrix(l)
    u = _toMatrix(u)

    // apply row permutations if needed (b is a DenseMatrix)
    if (p) {
      b = solveValidation(l, b, true)
      b._data = csIpvec(p, b._data)
    }

    // use forward substitution to resolve L * y = b
    const y = lsolve(l, b)
    // use backward substitution to resolve U * x = y
    const x = usolve(u, y)

    // apply column permutations if needed (x is a DenseMatrix)
    if (q) { x._data = csIpvec(q, x._data) }

    return x
  }
})
