import { factory } from '../../../utils/factory'
import { createSolveValidation } from './utils/solveValidation'

const name = 'usolve'
const dependencies = [
  'typed',
  'matrix',
  'divideScalar',
  'multiplyScalar',
  'subtract',
  'equalScalar',
  'DenseMatrix'
]

export const createUsolve = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix }) => {
  const solveValidation = createSolveValidation({ DenseMatrix })

  /**
   * Finds one solution of a linear equation system by backward substitution. Matrix must be an upper triangular matrix. Throws an error if there's no solution.
   *
   * `U * x = b`
   *
   * Syntax:
   *
   *    math.usolve(U, b)
   *
   * Examples:
   *
   *    const a = [[-2, 3], [2, 1]]
   *    const b = [11, 9]
   *    const x = usolve(a, b)  // [[8], [9]]
   *
   * See also:
   *
   *    usolveAll, lup, slu, usolve, lusolve
   *
   * @param {Matrix, Array} U       A N x N matrix or array (U)
   * @param {Matrix, Array} b       A column vector with the b values
   *
   * @return {DenseMatrix | Array}  A column vector with the linear system solution (x)
   */
  return typed(name, {

    'SparseMatrix, Array | Matrix': function (m, b) {
      return _sparseBackwardSubstitution(m, b)
    },

    'DenseMatrix, Array | Matrix': function (m, b) {
      return _denseBackwardSubstitution(m, b)
    },

    'Array, Array | Matrix': function (a, b) {
      const m = matrix(a)
      const r = _denseBackwardSubstitution(m, b)
      return r.valueOf()
    }
  })

  function _denseBackwardSubstitution (m, b) {
    // make b into a column vector
    b = solveValidation(m, b, true)

    const bdata = b._data

    const rows = m._size[0]
    const columns = m._size[1]

    // result
    const x = []

    const mdata = m._data
    // loop columns backwards
    for (let j = columns - 1; j >= 0; j--) {
      // b[j]
      const bj = bdata[j][0] || 0
      // x[j]
      let xj

      if (!equalScalar(bj, 0)) {
        // value at [j, j]
        const vjj = mdata[j][j]

        if (equalScalar(vjj, 0)) {
          // system cannot be solved
          throw new Error('Linear system cannot be solved since matrix is singular')
        }

        xj = divideScalar(bj, vjj)

        // loop rows
        for (let i = j - 1; i >= 0; i--) {
          // update copy of b
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, mdata[i][j]))]
        }
      } else {
        // zero value at j
        xj = 0
      }
      // update x
      x[j] = [xj]
    }

    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }

  function _sparseBackwardSubstitution (m, b) {
    // make b into a column vector
    b = solveValidation(m, b, true)

    const bdata = b._data

    const rows = m._size[0]
    const columns = m._size[1]

    const values = m._values
    const index = m._index
    const ptr = m._ptr

    // result
    const x = []

    // loop columns backwards
    for (let j = columns - 1; j >= 0; j--) {
      const bj = bdata[j][0] || 0

      if (!equalScalar(bj, 0)) {
        // non-degenerate row, find solution

        let vjj = 0

        // upper triangular matrix values & index (column j)
        const jValues = []
        const jIndices = []

        // first & last indeces in column
        const firstIndex = ptr[j]
        const lastIndex = ptr[j + 1]

        // values in column, find value at [j, j], loop backwards
        for (let k = lastIndex - 1; k >= firstIndex; k--) {
          const i = index[k]

          // check row (rows are not sorted!)
          if (i === j) {
            vjj = values[k]
          } else if (i < j) {
            // store upper triangular
            jValues.push(values[k])
            jIndices.push(i)
          }
        }

        // at this point we must have a value in vjj
        if (equalScalar(vjj, 0)) {
          throw new Error('Linear system cannot be solved since matrix is singular')
        }

        const xj = divideScalar(bj, vjj)

        for (let k = 0, lastIndex = jIndices.length; k < lastIndex; k++) {
          const i = jIndices[k]
          bdata[i] = [subtract(bdata[i][0], multiplyScalar(xj, jValues[k]))]
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
