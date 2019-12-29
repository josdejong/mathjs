//  import { clone } from '../../utils/object'
import { factory } from '../../utils/factory'
import { format } from '../../utils/string'

const name = 'eigs'
const dependencies = ['typed', 'matrix']

export const createEigs = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Compute eigenvalue and eigenvector of a real symmetric matrix.
   * Only applicable to two dimensional symmetric matrices. Uses Jacobi
   * Algorithm.
   *
   * Syntax:
   *
   *     math.eigs(x)
   *
   * Examples:
   *
   *     const A = [[1, 1], [1, 1]]
   *     math.eigs(A)               // returns {eigval: [0, 2],eigvec:[[0.5, -0.5],[0.5, 0.5]]}
   *
   * See also:
   *
   *     inv
   *
   * @param {Array | Matrix} x  Matrix to be diagonalized
   * @return {Array | Matrix}   The obtect containing eigenvalues and eigenvectors
   */
  const eigs = typed('eigs', {

    Array: function (x) {
      // check array size
      const mat = matrix(x)
      const size = mat.size()
      if (size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')')
      }

      // use dense 2D matrix implementation
      return diag(x)
    },

    Matrix: function (x) {
      // use dense 2D array implementation
      // dense matrix
      const size = x.size()
      if (size.length !== 2 || size[0] !== size[1]) {
        throw new RangeError('Matrix must be square ' +
          '(size: ' + format(size) + ')')
      }

      return diag(x.toArray())
    }
  })

  // dense matrix implementation
  function diag (x, precision = 1E-12) {
    return x
  }

  return eigs
})
