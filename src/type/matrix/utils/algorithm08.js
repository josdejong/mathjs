import { factory } from '../../../utils/factory'
import { DimensionError } from '../../../error/DimensionError'

const name = 'algorithm08'
const dependencies = ['typed', 'equalScalar']

export const createAlgorithm08 = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij).
   * Callback function invoked MAX(NNZA, NNZB) times
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤  A(i,j)       ; A(i,j) !== 0
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  return function algorithm08 (a, b, callback) {
    // sparse matrix arrays
    const avalues = a._values
    const aindex = a._index
    const aptr = a._ptr
    const asize = a._size
    const adt = a._datatype
    // sparse matrix arrays
    const bvalues = b._values
    const bindex = b._index
    const bptr = b._ptr
    const bsize = b._size
    const bdt = b._datatype

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }

    // sparse matrix cannot be a Pattern matrix
    if (!avalues || !bvalues) { throw new Error('Cannot perform operation on Pattern Sparse Matrices') }

    // rows & columns
    const rows = asize[0]
    const columns = asize[1]

    // datatype
    let dt
    // equal signature to use
    let eq = equalScalar
    // zero value
    let zero = 0
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // result arrays
    const cvalues = []
    const cindex = []
    const cptr = []
    // matrix
    const c = a.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    })

    // workspace
    const x = []
    // marks indicating we have a value in x for a given column
    const w = []

    // vars
    let k, k0, k1, i

    // loop columns
    for (let j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length
      // columns mark
      const mark = j + 1
      // loop values in a
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k]
        // mark workspace
        w[i] = mark
        // set value
        x[i] = avalues[k]
        // add index
        cindex.push(i)
      }
      // loop values in b
      for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = bindex[k]
        // check value exists in workspace
        if (w[i] === mark) {
          // evaluate callback
          x[i] = cf(x[i], bvalues[k])
        }
      }
      // initialize first index in j
      k = cptr[j]
      // loop index in j
      while (k < cindex.length) {
        // row
        i = cindex[k]
        // value @ i
        const v = x[i]
        // check for zero value
        if (!eq(v, zero)) {
          // push value
          cvalues.push(v)
          // increment pointer
          k++
        } else {
          // remove value @ i, do not increment pointer
          cindex.splice(k, 1)
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length

    // return sparse matrix
    return c
  }
})
