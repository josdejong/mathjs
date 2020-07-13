import { isArray, isMatrix, isDenseMatrix, isSparseMatrix } from '../../../../utils/is'
import { arraySize } from '../../../../utils/array'
import { format } from '../../../../utils/string'

export function createSolveValidation ({ DenseMatrix }) {
  /**
   * Validates matrix and column vector b for backward/forward substitution algorithms.
   *
   * @param {Matrix} m            An N x N matrix
   * @param {Array | Matrix} b    A column vector
   * @param {Boolean} copy        Return a copy of vector b
   *
   * @return {DenseMatrix}        Dense column vector b
   */
  return function solveValidation (m, b, copy) {
    const mSize = m.size()

    if (mSize.length !== 2) {
      throw new RangeError('Matrix must be two dimensional (size: ' + format(mSize) + ')')
    }

    const rows = mSize[0]
    const columns = mSize[1]

    if (rows !== columns) {
      throw new RangeError('Matrix must be square (size: ' + format(mSize) + ')')
    }

    let data = []

    if (isMatrix(b)) {
      const bSize = b.size()
      const bdata = b._data

      // 1-dim vector
      if (bSize.length === 1) {
        if (bSize[0] !== rows) {
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.')
        }

        for (let i = 0; i < rows; i++) {
          data[i] = [bdata[i]]
        }

        return new DenseMatrix({
          data: data,
          size: [rows, 1],
          datatype: b._datatype
        })
      }

      // 2-dim column
      if (bSize.length === 2) {
        if (bSize[0] !== rows || bSize[1] !== 1) {
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.')
        }

        if (isDenseMatrix(b)) {
          if (copy) {
            data = []

            for (let i = 0; i < rows; i++) {
              data[i] = [bdata[i][0]]
            }

            return new DenseMatrix({
              data: data,
              size: [rows, 1],
              datatype: b._datatype
            })
          }

          return b
        }

        if (isSparseMatrix(b)) {
          for (let i = 0; i < rows; i++) { data[i] = [0] }

          const values = b._values
          const index = b._index
          const ptr = b._ptr

          for (let k1 = ptr[1], k = ptr[0]; k < k1; k++) {
            const i = index[k]
            data[i][0] = values[k]
          }

          return new DenseMatrix({
            data: data,
            size: [rows, 1],
            datatype: b._datatype
          })
        }
      }

      throw new RangeError('Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.')
    }

    if (isArray(b)) {
      const bsize = arraySize(b)

      if (bsize.length === 1) {
        if (bsize[0] !== rows) {
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.')
        }

        for (let i = 0; i < rows; i++) {
          data[i] = [b[i]]
        }

        return new DenseMatrix({
          data: data,
          size: [rows, 1]
        })
      }

      if (bsize.length === 2) {
        if (bsize[0] !== rows || bsize[1] !== 1) {
          throw new RangeError('Dimension mismatch. Matrix columns must match vector length.')
        }

        for (let i = 0; i < rows; i++) {
          data[i] = [b[i][0]]
        }

        return new DenseMatrix({
          data: data,
          size: [rows, 1]
        })
      }

      throw new RangeError('Dimension mismatch. The right side has to be either 1- or 2-dimensional vector.')
    }
  }
}
