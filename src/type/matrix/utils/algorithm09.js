import { factory } from '../../../utils/factory'
import { DimensionError } from '../../../error/DimensionError'

const name = 'algorithm09'
const dependencies = ['typed', 'equalScalar']

export const createAlgorithm09 = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
  /**
   * Iterates over SparseMatrix A and invokes the callback function f(Aij, Bij).
   * Callback function invoked NZA times, number of nonzero elements in A.
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0
   * C(i,j) = ┤
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
  return function algorithm09 (a, b, callback) {
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
    const cvalues = avalues && bvalues ? [] : undefined
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

    // workspaces
    const x = cvalues ? [] : undefined
    // marks indicating we have a value in x for a given column
    const w = []

    // vars
    let i, j, k, k0, k1

    // loop columns
    for (j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length
      // column mark
      const mark = j + 1
      // check we need to process values
      if (x) {
        // loop B(:,j)
        for (k0 = bptr[j], k1 = bptr[j + 1], k = k0; k < k1; k++) {
          // row
          i = bindex[k]
          // update workspace
          w[i] = mark
          x[i] = bvalues[k]
        }
      }
      // loop A(:,j)
      for (k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        i = aindex[k]
        // check we need to process values
        if (x) {
          // b value @ i,j
          const vb = w[i] === mark ? x[i] : zero
          // invoke f
          const vc = cf(avalues[k], vb)
          // check zero value
          if (!eq(vc, zero)) {
            // push index
            cindex.push(i)
            // push value
            cvalues.push(vc)
          }
        } else {
          // push index
          cindex.push(i)
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length

    // return sparse matrix
    return c
  }
})
