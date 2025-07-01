import { isMatrix } from '../../utils/is.js'
import { arraySize } from '../../utils/array.js'
import { format } from '../../utils/string.js'
import { factory } from '../../utils/factory.js'

const name = 'svd'
const dependencies = [
  'typed',
  'dotDivide',
  'identity',
  'zeros',
  'matrixFromColumns',
  'transpose',
  'diag',
  'resize',
  'multiply',
  'eigs',
  'dot'
]

export const createSvd = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  dotDivide,
  identity,
  zeros,
  matrixFromColumns,
  transpose,
  diag,
  resize,
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
   *     math.svd([[1, 2], [3, 4]])          // returns { U, S, V }
   *     math.svd([[1, 0], [0, 1], [0, 1]])  // returns { U, S, V }
   *     math.svd(4)                         // returns { U: [[1]], S: [[4]], V: [[1]] }
   *
   * See also:
   *
   *     inv
   *     pinv
   *
   * @param {number | Array | Matrix} x     Matrix to be decomposed. Real valued only.
   * @return {{ U: Array, S: Array, V: Array } | { U: Matrix, S: Matrix, V: Matrix }} Object containing U, S, and V matrices
   */
  return typed(name, {
    'Array | Matrix': function (x) {
      const size = isMatrix(x) ? x.size() : arraySize(x)
      const arr = isMatrix(x) ? x.valueOf() : x
      switch (size.length) {
        case 1:
          // vector
          return _svd([arr])
        case 2:
          // two dimensional
          return _svd(arr)
        default:
          throw new RangeError('Matrix must be one or two dimensional ' +
            '(size: ' + format(size) + ')')
      }
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
    console.log()
    console.log('Processing SVD of')
    console.table(A)

    const m = A.length
    const n = A[0].length

    if (A.every(row => row.every(x => x === 0))) {
      return {
        U: identity(m),
        S: zeros(m, n),
        V: identity(n)
      }
    }

    const useAtA = m <= n

    const M = useAtA
      ? multiply(transpose(A), A)
      : multiply(A, transpose(A))

    console.log('Matrix M:')
    console.table(M)

    const eigens = eigs(M).eigenvectors
    const singularVectors = eigens.map((ev) => {
      if (ev.value < 1e-10) {
        ev.value = 0
      } else {
        ev.value = Math.sqrt(Math.abs(ev.value))
      }
      return ev
    }).sort((a, b) => b.value - a.value)

    console.log('Singular Vectors:')
    console.table(transpose(singularVectors.map((ev) => ev.vector)))
    console.log('eigens:')
    console.table(eigens)

    let U, S, V

    if (useAtA) {
      // case 1: m <= n (M = AtA = R_nxm * R_mxn = R_nxn)
      V = transpose(singularVectors.map((ev) => ev.vector))

      const Ucols = singularVectors.map(
        ({ value, vector }) => {
          return value > 1e-10
            ? dotDivide(multiply(A, vector), value)
            : Array(n).fill(0)
        }
      )
      U = Ucols.slice(0, m)
      U = transpose(U)

      S = resize(diag(singularVectors.map((ev) => ev.value)), [m, n])
    } else {
      // case 2: m > n (M = AAt = R_mxn * R_nxm = R_mxm)
      U = transpose(singularVectors.map((ev) => ev.vector))

      const Vcols = singularVectors.map(
        ({ value, vector }) => {
          return value > 1e-10
            ? dotDivide(multiply(transpose(A), vector), -value)
            : Array(n).fill(0)
        }
      )
      V = Vcols.slice(0, n)

      S = resize(diag(singularVectors.map((ev) => ev.value)), [m, n])
    }

    console.table(U)
    console.table(S)
    console.table(V)

    const USVt = multiply(
      U,
      multiply(S, transpose(V))
    )
    console.log('USVt:')
    console.table(USVt)

    return { U, S, V }
  }
})
