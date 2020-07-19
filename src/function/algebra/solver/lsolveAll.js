import { factory } from '../../../utils/factory'
import { createSolveValidation } from './utils/solveValidation'

const name = 'lsolveAll'
const dependencies = [
  'typed',
  'matrix',
  'divideScalar',
  'multiplyScalar',
  'subtract',
  'equalScalar',
  'DenseMatrix'
]

export const createLsolveAll = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, divideScalar, multiplyScalar, subtract, equalScalar, DenseMatrix }) => {
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
   *    const x = lsolve(a, b)  // [ [[-5.5], [20]] ]
   *
   * See also:
   *
   *    lup, slu, usolve, lusolve
   *
   * @param {Matrix, Array} L       A N x N matrix or array (L)
   * @param {Matrix, Array} b       A column vector with the b values
   *
   * @return {DenseMatrix[] | Array[]}  An array of affine-independent column vectors (x) that solve the linear system
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
      const R = _denseForwardSubstitution(m, b)
      return R.map(r => r.valueOf())
    }
  })

  function _denseForwardSubstitution (m, b_) {
    // the algorithm is derived from
    // https://www.overleaf.com/project/5e6c87c554a3190001a3fc93

    // array of right-hand sides
    const B = [solveValidation(m, b_, true)._data.map(e => e[0])]

    const M = m._data
    const rows = m._size[0]
    const columns = m._size[1]

    // loop columns
    for (let i = 0; i < columns; i++) {
      let L = B.length

      // loop right-hand sides
      for (let k = 0; k < L; k++) {
        const b = B[k]

        if (!equalScalar(M[i][i], 0)) {
          // non-singular row

          b[i] = divideScalar(b[i], M[i][i])

          for (let j = i + 1; j < columns; j++) {
            // b[j] -= b[i] * M[j,i]
            b[j] = subtract(b[j], multiplyScalar(b[i], M[j][i]))
          }
        } else if (!equalScalar(b[i], 0)) {
          // singular row, nonzero RHS

          if (k === 0) {
            // There is no valid solution
            throw new Error('Linear system cannot be solved since matrix is singular')
          } else {
            // This RHS is invalid but other solutions may still exist
            B.splice(k, 1)
            k -= 1
            L -= 1
          }
        } else if (k === 0) {
          // singular row, RHS is zero

          const bNew = [...b]
          bNew[i] = 1

          for (let j = i + 1; j < columns; j++) {
            bNew[j] = subtract(bNew[j], M[j][i])
          }

          B.push(bNew)
        }
      }
    }

    return B.map(x => new DenseMatrix({ data: x.map(e => [e]), size: [rows, 1] }))
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
    return [new DenseMatrix({
      data: x,
      size: [rows, 1]
    })]
  }
})
