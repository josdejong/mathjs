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
   * Solves the Continuous-time Lyapunov equation AP+PA'+Q=0 for P, where
   * Q is an input matrix. When Q is symmetric, P is also symmetric. Notice
   * that different equivalent definitions exist for the Continuous-time
   * Lyapunov equation.
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
      return sylvester(A, transpose(A), multiply(-1, Q))
    },
    'Array, Matrix': function (A, Q) {
      return sylvester(matrix(A), transpose(matrix(A)), multiply(-1, Q))
    },
    'Matrix, Array': function (A, Q) {
      return sylvester(A, transpose(matrix(A)), matrix(multiply(-1, Q)))
    },
    'Array, Array': function (A, Q) {
      return sylvester(matrix(A), transpose(matrix(A)), matrix(multiply(-1, Q))).toArray()
    }
  })
})
