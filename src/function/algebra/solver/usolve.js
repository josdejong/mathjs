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
   * Solves the linear equation system by backward substitution. Matrix must be an upper triangular matrix.
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
   *    lup, slu, usolve, lusolve
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

    let i, k

    // result
    const x = []

    // loop columns backwards
    for (let j = columns - 1; j >= 0; j--) {
      // b[j]
      const bj = bdata[j][0] || 0

      if (!equalScalar(bj, 0)) {
        // value at [j, j]
        let vjj = 0

        // upper triangular matrix values & index (column j)
        const jValues = []
        const jIndices = []

        // first & last indeces in column
        const firstIndex = ptr[j]
        let lastIndex = ptr[j + 1]

        // values in column, find value at [j, j], loop backwards
        for (k = lastIndex - 1; k >= firstIndex; k--) {
          // row
          i = index[k]
          // check row
          if (i === j) {
            // update vjj
            vjj = values[k]
          } else if (i < j) {
            // store upper triangular
            jValues.push(values[k])
            jIndices.push(i)
          }
        }
        // at this point we must have a value at [j, j]
        if (equalScalar(vjj, 0)) {
          // system cannot be solved, there is no value at [j, j]
          throw new Error('Linear system cannot be solved since matrix is singular')
        }
        // calculate xj
        const xj = divideScalar(bj, vjj)
        // loop upper triangular
        for (k = 0, lastIndex = jIndices.length; k < lastIndex; k++) {
          // row
          i = jIndices[k]
          // update copy of b
          bdata[i] = [subtract(bdata[i][0], multiplyScalar(xj, jValues[k]))]
        }
        // update x
        x[j] = [xj]
      } else {
        // update x
        x[j] = [0]
      }
    }
    // return vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }
})
