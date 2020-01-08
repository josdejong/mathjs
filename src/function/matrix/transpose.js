import { clone } from '../../utils/object'
import { format } from '../../utils/string'
import { factory } from '../../utils/factory'

const name = 'transpose'
const dependencies = ['typed', 'matrix']

export const createTranspose = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Transpose a matrix. All values of the matrix are reflected over its
   * main diagonal. Only applicable to two dimensional matrices containing
   * a vector (i.e. having size `[1,n]` or `[n,1]`). One dimensional
   * vectors and scalars return the input unchanged.
   *
   * Syntax:
   *
   *     math.transpose(x)
   *
   * Examples:
   *
   *     const A = [[1, 2, 3], [4, 5, 6]]
   *     math.transpose(A)               // returns [[1, 4], [2, 5], [3, 6]]
   *
   * See also:
   *
   *     diag, inv, subset, squeeze
   *
   * @param {Array | Matrix} x  Matrix to be transposed
   * @return {Array | Matrix}   The transposed matrix
   */
  const transpose = typed('transpose', {

    Array: function (x) {
      // use dense matrix implementation
      return transpose(matrix(x)).valueOf()
    },

    Matrix: function (x) {
      // matrix size
      const size = x.size()

      // result
      let c

      // process dimensions
      switch (size.length) {
        case 1:
          // vector
          c = x.clone()
          break

        case 2:
          {
            // rows and columns
            const rows = size[0]
            const columns = size[1]

            // check columns
            if (columns === 0) {
              // throw exception
              throw new RangeError('Cannot transpose a 2D matrix with no columns (size: ' + format(size) + ')')
            }

            // process storage format
            switch (x.storage()) {
              case 'dense':
                c = _denseTranspose(x, rows, columns)
                break
              case 'sparse':
                c = _sparseTranspose(x, rows, columns)
                break
            }
          }
          break

        default:
          // multi dimensional
          throw new RangeError('Matrix must be a vector or two dimensional (size: ' + format(this._size) + ')')
      }
      return c
    },

    // scalars
    any: function (x) {
      return clone(x)
    }
  })

  function _denseTranspose (m, rows, columns) {
    // matrix array
    const data = m._data
    // transposed matrix data
    const transposed = []
    let transposedRow
    // loop columns
    for (let j = 0; j < columns; j++) {
      // initialize row
      transposedRow = transposed[j] = []
      // loop rows
      for (let i = 0; i < rows; i++) {
        // set data
        transposedRow[i] = clone(data[i][j])
      }
    }
    // return matrix
    return m.createDenseMatrix({
      data: transposed,
      size: [columns, rows],
      datatype: m._datatype
    })
  }

  function _sparseTranspose (m, rows, columns) {
    // matrix arrays
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    // result matrices
    const cvalues = values ? [] : undefined
    const cindex = []
    const cptr = []
    // row counts
    const w = []
    for (let x = 0; x < rows; x++) { w[x] = 0 }
    // vars
    let p, l, j
    // loop values in matrix
    for (p = 0, l = index.length; p < l; p++) {
      // number of values in row
      w[index[p]]++
    }
    // cumulative sum
    let sum = 0
    // initialize cptr with the cummulative sum of row counts
    for (let i = 0; i < rows; i++) {
      // update cptr
      cptr.push(sum)
      // update sum
      sum += w[i]
      // update w
      w[i] = cptr[i]
    }
    // update cptr
    cptr.push(sum)
    // loop columns
    for (j = 0; j < columns; j++) {
      // values & index in column
      for (let k0 = ptr[j], k1 = ptr[j + 1], k = k0; k < k1; k++) {
        // C values & index
        const q = w[index[k]]++
        // C[j, i] = A[i, j]
        cindex[q] = j
        // check we need to process values (pattern matrix)
        if (values) { cvalues[q] = clone(values[k]) }
      }
    }
    // return matrix
    return m.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [columns, rows],
      datatype: m._datatype
    })
  }

  return transpose
})
