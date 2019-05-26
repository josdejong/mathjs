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
   * Solves the linear equation system by forwards substitution. Matrix must be a lower triangular matrix.
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
   *    lup, slu, usolve, lusolve
   *
   * @param {Matrix, Array} L       A N x N matrix or array (L)
   * @param {Matrix, Array} b       A column vector with the b values
   *
   * @return {DenseMatrix | Array}  A column vector with the linear system solution (x)
   */
  return typed(name, {

    'SparseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _sparseForwardSubstitution(m, b)
    },

    'DenseMatrix, Array | Matrix': function (m, b) {
      // process matrix
      return _denseForwardSubstitution(m, b)
    },

    'Array, Array | Matrix': function (a, b) {
      // create dense matrix from array
      const m = matrix(a)
      // use matrix implementation
      const r = _denseForwardSubstitution(m, b)
      // result
      return r.valueOf()
    }
  })

  function _denseForwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)
    // column vector data
    const bdata = b._data
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // result
    const x = []
    // data
    const data = m._data
    // forward solve m * x = b, loop columns
    for (let j = 0; j < columns; j++) {
      // b[j]
      const bj = bdata[j][0] || 0
      // x[j]
      let xj
      // forward substitution (outer product) avoids inner looping when bj === 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        const vjj = data[j][j]
        // check vjj
        if (equalScalar(vjj, 0)) {
          // system cannot be solved
          throw new Error('Linear system cannot be solved since matrix is singular')
        }
        // calculate xj
        xj = divideScalar(bj, vjj)
        // loop rows
        for (let i = j + 1; i < rows; i++) {
          // update copy of b
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, data[i][j]))]
        }
      } else {
        // zero @ j
        xj = 0
      }
      // update x
      x[j] = [xj]
    }
    // return vector
    return new DenseMatrix({
      data: x,
      size: [rows, 1]
    })
  }

  function _sparseForwardSubstitution (m, b) {
    // validate matrix and vector, return copy of column vector b
    b = solveValidation(m, b, true)
    // column vector data
    const bdata = b._data
    // rows & columns
    const rows = m._size[0]
    const columns = m._size[1]
    // matrix arrays
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    // vars
    let i, k
    // result
    const x = []
    // forward solve m * x = b, loop columns
    for (let j = 0; j < columns; j++) {
      // b[j]
      const bj = bdata[j][0] || 0
      // forward substitution (outer product) avoids inner looping when bj === 0
      if (!equalScalar(bj, 0)) {
        // value @ [j, j]
        let vjj = 0
        // lower triangular matrix values & index (column j)
        const jvalues = []
        const jindex = []
        // last index in column
        let l = ptr[j + 1]
        // values in column, find value @ [j, j]
        for (k = ptr[j]; k < l; k++) {
          // row
          i = index[k]
          // check row (rows are not sorted!)
          if (i === j) {
            // update vjj
            vjj = values[k]
          } else if (i > j) {
            // store lower triangular
            jvalues.push(values[k])
            jindex.push(i)
          }
        }
        // at this point we must have a value @ [j, j]
        if (equalScalar(vjj, 0)) {
          // system cannot be solved, there is no value @ [j, j]
          throw new Error('Linear system cannot be solved since matrix is singular')
        }
        // calculate xj
        const xj = divideScalar(bj, vjj)
        // loop lower triangular
        for (k = 0, l = jindex.length; k < l; k++) {
          // row
          i = jindex[k]
          // update copy of b
          bdata[i] = [subtract(bdata[i][0] || 0, multiplyScalar(xj, jvalues[k]))]
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
