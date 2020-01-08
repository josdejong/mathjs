import { factory } from '../../../utils/factory'
import { DimensionError } from '../../../error/DimensionError'

const name = 'algorithm01'
const dependencies = ['typed']

export const createAlgorithm01 = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterates over SparseMatrix nonzero items and invokes the callback function f(Dij, Sij).
   * Callback function invoked NNZ times (number of nonzero items in SparseMatrix).
   *
   *
   *          ┌  f(Dij, Sij)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  Dij          ; otherwise
   *
   *
   * @param {Matrix}   denseMatrix       The DenseMatrix instance (D)
   * @param {Matrix}   sparseMatrix      The SparseMatrix instance (S)
   * @param {Function} callback          The f(Dij,Sij) operation to invoke, where Dij = DenseMatrix(i,j) and Sij = SparseMatrix(i,j)
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(Sij,Dij)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97477571
   */
  return function algorithm1 (denseMatrix, sparseMatrix, callback, inverse) {
    // dense matrix arrays
    const adata = denseMatrix._data
    const asize = denseMatrix._size
    const adt = denseMatrix._datatype
    // sparse matrix arrays
    const bvalues = sparseMatrix._values
    const bindex = sparseMatrix._index
    const bptr = sparseMatrix._ptr
    const bsize = sparseMatrix._size
    const bdt = sparseMatrix._datatype

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }

    // sparse matrix cannot be a Pattern matrix
    if (!bvalues) { throw new Error('Cannot perform operation on Dense Matrix and Pattern Sparse Matrix') }

    // rows & columns
    const rows = asize[0]
    const columns = asize[1]

    // process data types
    const dt = typeof adt === 'string' && adt === bdt ? adt : undefined
    // callback function
    const cf = dt ? typed.find(callback, [dt, dt]) : callback

    // vars
    let i, j

    // result (DenseMatrix)
    const cdata = []
    // initialize c
    for (i = 0; i < rows; i++) { cdata[i] = [] }

    // workspace
    const x = []
    // marks indicating we have a value in x for a given column
    const w = []

    // loop columns in b
    for (j = 0; j < columns; j++) {
      // column mark
      const mark = j + 1
      // values in column j
      for (let k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k]
        // update workspace
        x[i] = inverse ? cf(bvalues[k], adata[i][j]) : cf(adata[i][j], bvalues[k])
        // mark i as updated
        w[i] = mark
      }
      // loop rows
      for (i = 0; i < rows; i++) {
        // check row is in workspace
        if (w[i] === mark) {
          // c[i][j] was already calculated
          cdata[i][j] = x[i]
        } else {
          // item does not exist in S
          cdata[i][j] = adata[i][j]
        }
      }
    }

    // return dense matrix
    return denseMatrix.createDenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    })
  }
})
