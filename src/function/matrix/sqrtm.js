import { isMatrix } from '../../utils/is'
import { format } from '../../utils/string'
import { arraySize } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'sqrtm'
const dependencies = ['typed', 'abs', 'add', 'multiply', 'sqrt', 'subtract', 'inv', 'size', 'max', 'identity']

export const createSqrtm = /* #__PURE__ */ factory(name, dependencies, ({ typed, abs, add, multiply, sqrt, subtract, inv, size, max, identity }) => {
  /**
   * Calculate the principal square root of a square matrix.
   * The principal square root matrix `X` of another matrix `A` is such that `X * X = A`.
   *
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix
   *
   * Syntax:
   *
   *     X = math.sqrtm(A)
   *
   * Examples:
   *
   *     math.sqrtm([[1, 2], [3, 4]]) // returns [[-2, 1], [1.5, -0.5]]
   *
   * See also:
   *
   *     sqrt, pow
   *
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   */
  const sqrtm = typed(name, {
    'Array | Matrix': function (A) {
      const size = isMatrix(A) ? A.size() : arraySize(A)
      switch (size.length) {
        case 1:
          // Single element Array | Matrix
          if (size[0] === 1) {
            return sqrt(A)
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + format(size) + ')')
          }

        case 2:
          // Two-dimensional Array | Matrix
          const rows = size[0]
          const cols = size[1]
          if (rows === cols) {
            return _denmanBeavers(A)
          } else {
            throw new RangeError('Matrix must be square ' +
            '(size: ' + format(size) + ')')
          }
      }
    }
  })

  const _maxIterations = 1e3
  const _tolerance = 1e-6

  /**
   * Calculate the principal square root matrix using the Denman–Beavers iterative method
   *
   * https://en.wikipedia.org/wiki/Square_root_of_a_matrix#By_Denman–Beavers_iteration
   *
   * @param  {Array | Matrix} A   The square matrix `A`
   * @return {Array | Matrix}     The principal square root of matrix `A`
   * @private
   */
  function _denmanBeavers (A) {
    let error
    let iterations = 0

    let Y = A
    let Z = identity(size(A))

    do {
      const Yk = Y
      Y = multiply(0.5, add(Yk, inv(Z)))
      Z = multiply(0.5, add(Z, inv(Yk)))

      error = max(abs(subtract(Y, Yk)))

      if (error > _tolerance && ++iterations > _maxIterations) {
        throw new Error('computing square root of matrix: iterative method could not converge')
      }
    } while (error > _tolerance)

    return Y
  }

  return sqrtm
})
