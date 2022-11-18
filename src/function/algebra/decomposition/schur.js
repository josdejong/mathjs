import { factory } from '../../../utils/factory.js'

const name = 'schur'
const dependencies = [
  'typed',
  'matrix',
  'identity',
  'multiply',
  'qr',
  'norm',
  'subtract'
]

export const createSchur = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    matrix,
    identity,
    multiply,
    qr,
    norm,
    subtract
  }
) => {
  /**
   *
   * Performs a real Schur decomposition of the real matrix A = UTU' where U is orthogonal
   * and T is upper quasi-triangular.
   * https://en.wikipedia.org/wiki/Schur_decomposition
   *
   * Syntax:
   *
   *     math.schur(A)
   *
   * Examples:
   *
   *     const A = [[1, 0], [-4, 3]]
   *     math.schur(A) // returns {T: [[3, 4], [0, 1]], R: [[0, 1], [-1, 0]]}
   *
   * See also:
   *
   *     sylvester, lyap, qr
   *
   * @param {Array | Matrix} A  Matrix A
   * @return {{U: Array | Matrix, T: Array | Matrix}} Object containing both matrix U and T of the Schur Decomposition A=UTU'
   */
  return typed(name, {
    Array: function (X) {
      const r = _schur(matrix(X))
      return {
        U: r.U.valueOf(),
        T: r.T.valueOf()
      }
    },

    Matrix: function (X) {
      return _schur(X)
    }
  })
  function _schur (X) {
    const n = X.size()[0]
    let A = X
    let U = identity(n)
    let k = 0
    let A0
    do {
      A0 = A
      const QR = qr(A)
      const Q = QR.Q
      const R = QR.R
      A = multiply(R, Q)
      U = multiply(U, Q)
      if ((k++) > 100) { break }
    } while (norm(subtract(A, A0)) > 1e-4)
    return { U, T: A }
  }
})
