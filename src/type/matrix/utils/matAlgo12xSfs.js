import { factory } from '../../../utils/factory.js'
import { createMatAlgo11xS0s } from './matAlgo11xS0s.js'

const name = 'matAlgo12xSfs'
const dependencies = ['typed', 'DenseMatrix', 'equalScalar']

export const createMatAlgo12xSfs = /* #__PURE__ */ factory(name, dependencies, ({ typed, DenseMatrix, equalScalar }) => {
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })

  /**
   * Iterates over SparseMatrix S nonzero items and invokes the callback function f(Sij, b).
   * The value f(0, b) for the zero items of S is calculated once. When that value is zero,
   * the result is sparse and the operation is handed over to matAlgo11xS0s. A boolean result
   * is always dense, since a SparseMatrix would turn false into 0.
   * Callback function invoked NZ + 1 times (number of nonzero items in S).
   *
   *
   *          ┌  f(Sij, b)  ; S(i,j) !== 0
   * C(i,j) = ┤
   *          └  f(0, b)    ; otherwise
   *
   *
   * @param {Matrix}   s                 The SparseMatrix instance (S)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Sij)
   *
   * @return {Matrix}                    DenseMatrix (C), or SparseMatrix (C) when f(0, b) is zero
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97626813
   */
  return function matAlgo12xSfs (s, b, callback, inverse) {
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
    // zero value
    let zero = 0
    // scalar value
    let scalar = b
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
      // convert b to the same datatype
      scalar = typed.convert(b, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // the value for all zero items of S
    const fzero = inverse ? cf(scalar, zero) : cf(zero, scalar)

    // the zero items stay zero, so the result is sparse. A boolean result
    // stays dense, since false would become 0 in a sparse matrix
    if (typeof fzero !== 'boolean' && equalScalar(fzero, zero)) {
      return matAlgo11xS0s(s, b, callback, inverse)
    }

    // result arrays
    const cdata = []

    // workspaces
    const x = []
    // marks indicating we have a value in x for a given column
    const w = []

    // loop columns
    for (let j = 0; j < columns; j++) {
      // columns mark
      const mark = j + 1
      // values in j
      for (let k0 = aptr[j], k1 = aptr[j + 1], k = k0; k < k1; k++) {
        // row
        const r = aindex[k]
        // update workspace
        x[r] = avalues[k]
        w[r] = mark
      }
      // loop rows
      for (let i = 0; i < rows; i++) {
        // initialize C on first column
        if (j === 0) {
          // create row array
          cdata[i] = []
        }
        // check sparse matrix has a value @ i,j
        if (w[i] === mark) {
          // invoke callback, update C
          cdata[i][j] = inverse ? cf(scalar, x[i]) : cf(x[i], scalar)
        } else {
          // dense matrix value @ i, j
          cdata[i][j] = fzero
        }
      }
    }

    // return dense matrix
    return new DenseMatrix({
      data: cdata,
      size: [rows, columns],
      datatype: dt
    })
  }
})
