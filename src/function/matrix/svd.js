import { isMatrix } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'svd'
const dependencies = [
  'typed',
  'dotDivide',
  'matrixFromColumns',
  'transpose',
  'multiply',
  'eigs',
  'dot'
]

export const createSvd = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  dotDivide,
  matrixFromColumns,
  transpose,
  multiply,
  eigs,
  dot
}) => {
  /**
   * Compute the Singular Value Decomposition (SVD) of a matrix or value.
   * The SVD of a matrix A is a factorization of the form A = U * S * V^T,
   * where U and V are orthogonal matrices and S is a diagonal matrix with non-negative real numbers on the diagonal.
   * For a real number x, the SVD is its absolute value as the singular value and the sign of x as the right singular value.
   *
   * Syntax:
   *
   *     math.svd(x)
   *
   * Examples:
   *
   *     math.svd([[1, 2], [3, 4]])          // TODO: Implement SVD for matrices
   *     math.svd([[1, 0], [0, 1], [0, 1]])  // TODO: Implement SVD for matrices
   *     math.svd(4)                         // returns { U: [[1]], S: [[4]], V: [[1]] }
   *
   * See also:
   *
   *     inv
   *     pinv
   *
   * @param {number | Array | Matrix} x     Matrix to be decomposed
   * @return {{ U: Array, S: Array, V: Array } | { U: Matrix, S: Matrix, V: Matrix }} Object containing U, S, and V matrices
   */
  return typed(name, {
    'Array | Matrix': function (x) {
      const arr = isMatrix(x) ? x.valueOf() : x
      return _svd(arr)
    },

    any: function (x) {
      // scalar
      return {
        U: [[1]],
        S: [[Math.abs(x)]],
        V: [[x >= 0 ? 1 : -1]]
      }
    }
  })

  /**
   * Calculate the SVD of a matrix
   * @param {Array[]} A     A matrix
   * @return {{ U: Array, S: Array, V: Array }} { U: Array, S: Array, V: Array }    U, S, and V matrices
   * @private
   */
  function _svd (A) {
    const m = A.length
    const n = A[0].length

    // compute AtA
    const At = transpose(A)
    const AtA = multiply(At, A)

    const eigens = eigs(AtA)
    const eigVals = eigens.values
    const eigVecs = eigens.eigenvectors

    const singularValues = eigVals.map(val => Math.sqrt(Math.max(val, 0)))

    const zipped = singularValues.map((s, i) => ({ s, v: eigVecs[i].vector })).sort((a, b) => b.s - a.s)

    const V = matrixFromColumns(...zipped.map(obj => obj.v))
    const S = Array.from({ length: m },
      (_, i) => Array.from({ length: n }, (_, j) => (i === j && i < zipped.length ? zipped[i].s : 0))
    )

    // MxN : 3x2 -> U : 3x3 -> 3
    // MxN : 2x3 -> U : 2x2 -> 2
    const Ucols = zipped.slice(0, m).map(({ s, v }) => {
      if (s === 0) return Array(m).fill(0)
      const Av = multiply(A, v)
      return dotDivide(Av, s)
    })
    while (Ucols.length < m) {
      const next = _orthonormalTo(Ucols, m)
      Ucols.push(next)
    }
    const U = Array.from({ length: m }, (_, i) =>
      Ucols.map(col => col[i])
    )

    console.log(`Am: ${m}, An: ${n}`)
    console.log(`Um: ${U.length}, Un: ${U[0].length}`)
    console.log(`Sm: ${S.length}, Sn: ${S[0].length}`)
    console.log(`Vm: ${V.length}, Sn: ${V[0].length}`)

    return { U, S, V }
  }

  /**
    * Generates a new orthonormal vector that is orthogonal to all existing vectors.
    *
    * @param {Array[]} existingCols         An array of existing orthonormal column vectors (each vector is an array of numbers)
    * @param {number} dim                   Dimension (length) of the vector space
    * @return {Array<number>}               A new orthonormal vector of length `dim`, orthogonal to all vectors in `existingCols`
    * @private
    */
  function _orthonormalTo (existingCols, dim) {
    let vec
    do {
      // Create a random vector
      vec = Array.from({ length: dim }, () => Math.random() - 0.5)

      // Subtract projection onto existing columns
      for (const col of existingCols) {
        const proj = dot(vec, col) / dot(col, col)
        vec = vec.map((v, i) => v - proj * col[i])
      }

      const norm = Math.sqrt(dot(vec, vec))
      if (norm > 1e-10) return vec.map(v => v / norm)
    } while (true)
  }
})
