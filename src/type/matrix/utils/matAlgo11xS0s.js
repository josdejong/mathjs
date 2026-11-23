import { factory } from '../../../utils/factory.js'

const name = 'matAlgo11xS0s'
const dependencies = ['typed']

export const createMatAlgo11xS0s = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b).
   * Callback function invoked NZ times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  0          ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  flip              A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  return function matAlgo11xS0s (s, b, callback, flip) {
    // sparse matrix arrays
    const avalues = s._values
    const aindex = s._index
    const aptr = s._ptr
    const asize = s._size
    const adt = s._datatype

    // sparse matrix cannot be a Pattern matrix
    if (!avalues) { throw new Error('Cannot perform operation on Pattern Sparse Matrix and Scalar value') }

    // rows & columns
    const rows = asize[0]
    const columns = asize[1]

    // datatype
    let dt
    // equal signature to use
    const isZ = s.isZero
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt
      // callback
      if (flip) {
        cf = typed.resolve(callback, [b, s.zero]).implementation
      } else {
        cf = typed.resolve(callback, [s.zero, b]).implementation
      }
    }

    // result arrays
    const cvalues = []
    const cindex = []
    const cptr = []

    // loop columns
    for (let j = 0; j < columns; j++) {
      // initialize ptr
      cptr[j] = cindex.length
      // values in j
      for (let k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        const i = aindex[k]
        // invoke callback
        const v = flip ? cf(b, avalues[k]) : cf(avalues[k], b)
        // check value is zero
        if (!isZ(v)) {
          // push index & value
          cindex.push(i)
          cvalues.push(v)
        }
      }
    }
    // update ptr
    cptr[columns] = cindex.length

    // return sparse matrix
    return s.createSparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    })
  }
})
