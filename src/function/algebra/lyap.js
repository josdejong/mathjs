import { factory } from '../../utils/factory.js'

const name = 'lyap'
const dependencies = [
  'typed',
  'matrix',
  'sylvester',
  'multiply',
  'transpose'
]

export const createLyap = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    matrix,
    sylvester,
    multiply,
    transpose
  }
) => {
  /**
   *
   * Solves the Continuous-time Lyapunov equation AP+PA'=Q for P, where Q is a positive semidefinite
   * matrix.
   * https://en.wikipedia.org/wiki/Lyapunov_equation
   *
   * Syntax:
   *
   *     math.lyap(A, Q)
   *
   * Examples:
   *
   *     const A = [[-2, 0], [1, -4]]
   *     const Q = [[3, 1], [1, 3]]
   *     const P = math.lyap(A, Q)
   *
   * See also:
   *
   *     sylvester, schur
   *
   * @param {Matrix | Array} A  Matrix A
   * @param {Matrix | Array} Q  Matrix Q
   * @return {Matrix | Array} Matrix P solution to the Continuous-time Lyapunov equation AP+PA'=Q
   */
  return typed(name, {
    'Matrix, Matrix': function (A, Q) {
      const B = multiply(-1, transpose(A))
      return sylvester(A, B, Q)
    },
    'Array, Matrix': function (A, Q) {
      const B = multiply(-1, transpose(matrix(A)))
      return sylvester(matrix(A), B, Q)
    },
    'Matrix, Array': function (A, Q) {
      const B = multiply(-1, transpose(A))
      return sylvester(A, B, matrix(Q))
    },
    'Array, Array': function (A, Q) {
      const B = multiply(-1, transpose(matrix(A)))
      return sylvester(matrix(A), B, matrix(Q)).toArray()
    }
  })
})
