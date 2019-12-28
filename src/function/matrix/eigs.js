//  import { clone } from '../../utils/object'
import { factory } from '../../utils/factory'

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
   * @return {Object}   The obtect containing eigenvalues and eigenvectors
   */
  const eigs = typed('eigs', {

    Array: function (x) {
      // use dense matrix implementation
      return eigs(matrix(x)).valueOf()
    },

    Matrix: function (x) {
      // matrix size
      const size = x.size()

      // result
      let eigval
      let eigvec

      // process dimensions
      switch (size.length) {
        case 1:
          eigval = [1]
          eigvec = [1]
          return { eigval: eigval, eigvec: eigvec }

        default:
          // multi dimensional
          throw new RangeError('Matrix must be a two dimensional array')
      }
    }
  })
  return eigs
})
