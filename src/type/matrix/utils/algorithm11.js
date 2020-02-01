import { factory } from '../../../utils/factory'

const name = 'algorithm11'
const dependencies = ['typed', 'equalScalar']

export const createAlgorithm11 = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar }) => {
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
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  return function algorithm11 (s, b, callback, inverse) {
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
    let eq = equalScalar
    // zero value
    let zero = 0
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
      // convert b to the same datatype
      b = typed.convert(b, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
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
        const v = inverse ? cf(b, avalues[k]) : cf(avalues[k], b)
        // check value is zero
        if (!eq(v, zero)) {
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
