import { factory } from '../../../utils/factory'
import { createSolveValidation } from './utils/solveValidation'

const name = 'lsolve'
const dependencies = [
  'typed',
  'matrix',
  'divideScalar',
  'multiplyScalar',
  'subtract',
  'equalScalar',
  'DenseMatrix'
]

export const createLsolve = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix }) => {
  const solveValidation = createSolveValidation({ DenseMatrix })

  /**
   * Finds one solution of a linear equation system by forwards substitution. Matrix must be a lower triangular matrix. Throws an error if there's no solution.
   *
   * `L * x = b`
   *
   * Syntax:
   *
   *    math.lsolve(L, b)
   *
   * Examples:
   *
   *    const a = [[-2, 3], [2, 1]]
   *    const b = [11, 9]
   *    const x = lsolve(a, b)  // [[-5.5], [20]]
   *
   * See also:
   *
   *    lsolveAll, lup, slu, usolve, lusolve
   *
   * @param {Matrix, Array} L       A N x N matrix or array (L)
   * @param {Matrix, Array} b       A column vector with the b values
   *
   * @return {DenseMatrix | Array}  A column vector with the linear system solution (x)
   */
  return typed(name, {

    'SparseMatrix, Array | Matrix': function (m, b) {
      return _sparseForwardSubstitution(m, b)
    },

    'DenseMatrix, Array | Matrix': function (m, b) {
      return _denseForwardSubstitution(m, b)
    },

    'Array, Array | Matrix': function (a, b) {
      const m = matrix(a)
      const r = _denseForwardSubstitution(m, b)
      return r.valueOf()
    }
  })

  function _denseForwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)
    const bdata = b._data

    const rows = m._size[0]
    const columns = m._size[1]

    // result
    const x = []

    const mdata = m._data

    // loop columns
    for (let j = 0; j < columns; j++) {
      const bj = bdata[j][0] || 0
      let xj

      if (!equalScalar(bj, 0)) {
        // non-degenerate row, find solution

        const vjj = mdata[j][j]

        if (equalScalar(vjj, 0)) {
          throw new Error('Linear system cannot be solved since matrix is singular')
        }

        xj = divideScalar(bj, vjj)

        // loop rows
        for (let i = j + 1; i < rows; i++) {
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, mdata[i][j]))]
        }
      } else {
        // degenerate row, we can choose any value
        xj = 0
      }

      x[j] = [xj]
    }

    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }

  function _sparseForwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)

    const bdata = b._data

    const rows = m._size[0]
    const columns = m._size[1]

    const values = m._values
    const index = m._index
    const ptr = m._ptr

    // result
    const x = []

    // loop columns
    for (let j = 0; j < columns; j++) {
      const bj = bdata[j][0] || 0

      if (!equalScalar(bj, 0)) {
        // non-degenerate row, find solution

        let vjj = 0
        // matrix values & indices (column j)
        const jValues = []
        const jIndices = []

        // first and last index in the column
        const firstIndex = ptr[j]
        const lastIndex = ptr[j + 1]

        // values in column, find value at [j, j]
        for (let k = firstIndex; k < lastIndex; k++) {
          const i = index[k]

          // check row (rows are not sorted!)
          if (i === j) {
            vjj = values[k]
          } else if (i > j) {
            // store lower triangular
            jValues.push(values[k])
            jIndices.push(i)
          }
        }

        // at this point we must have a value in vjj
        if (equalScalar(vjj, 0)) {
          throw new Error('Linear system cannot be solved since matrix is singular')
        }

        const xj = divideScalar(bj, vjj)

        for (let k = 0, l = jIndices.length; k < l; k++) {
          const i = jIndices[k]
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, jValues[k]))]
        }

        x[j] = [xj]
      } else {
        // degenerate row, we can choose any value
        x[j] = [0]
      }
    }

    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }
})
