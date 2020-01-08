import { clone } from '../../utils/object'
import { format } from '../../utils/string'
import { factory } from '../../utils/factory'

const name = 'trace'
const dependencies = ['typed', 'matrix', 'add']

export const createTrace = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, add }) => {
  /**
   * Calculate the trace of a matrix: the sum of the elements on the main
   * diagonal of a square matrix.
   *
   * Syntax:
   *
   *    math.trace(x)
   *
   * Examples:
   *
   *    math.trace([[1, 2], [3, 4]]) // returns 5
   *
   *    const A = [
   *      [1, 2, 3],
   *      [-1, 2, 3],
   *      [2, 0, 3]
   *    ]
   *    math.trace(A) // returns 6
   *
   * See also:
   *
   *    diag
   *
   * @param {Array | Matrix} x  A matrix
   *
   * @return {number} The trace of `x`
   */
  return typed('trace', {
    Array: function _arrayTrace (x) {
      // use dense matrix implementation
      return _denseTrace(matrix(x))
    },

    SparseMatrix: _sparseTrace,

    DenseMatrix: _denseTrace,

    any: clone
  })

  function _denseTrace (m) {
    // matrix size & data
    const size = m._size
    const data = m._data

    // process dimensions
    switch (size.length) {
      case 1:
        // vector
        if (size[0] === 1) {
          // return data[0]
          return clone(data[0])
        }
        throw new RangeError('Matrix must be square (size: ' + format(size) + ')')
      case 2:
      {
        // two dimensional
        const rows = size[0]
        const cols = size[1]
        if (rows === cols) {
          // calulate sum
          let sum = 0
          // loop diagonal
          for (let i = 0; i < rows; i++) { sum = add(sum, data[i][i]) }
          // return trace
          return sum
        } else {
          throw new RangeError('Matrix must be square (size: ' + format(size) + ')')
        }
      }
      default:
        // multi dimensional
        throw new RangeError('Matrix must be two dimensional (size: ' + format(size) + ')')
    }
  }

  function _sparseTrace (m) {
    // matrix arrays
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    const size = m._size
    // check dimensions
    const rows = size[0]
    const columns = size[1]
    // matrix must be square
    if (rows === columns) {
      // calulate sum
      let sum = 0
      // check we have data (avoid looping columns)
      if (values.length > 0) {
        // loop columns
        for (let j = 0; j < columns; j++) {
          // k0 <= k < k1 where k0 = _ptr[j] && k1 = _ptr[j+1]
          const k0 = ptr[j]
          const k1 = ptr[j + 1]
          // loop k within [k0, k1[
          for (let k = k0; k < k1; k++) {
            // row index
            const i = index[k]
            // check row
            if (i === j) {
              // accumulate value
              sum = add(sum, values[k])
              // exit loop
              break
            }
            if (i > j) {
              // exit loop, no value on the diagonal for column j
              break
            }
          }
        }
      }
      // return trace
      return sum
    }
    throw new RangeError('Matrix must be square (size: ' + format(size) + ')')
  }
})
