import { factory } from '../../../utils/factory.js'
import { createMatAlgo11xS0s } from './matAlgo11xS0s.js'
import { createMatAlgo12xSfs } from './matAlgo12xSfs.js'

const name = 'matAlgo16xSs'
const dependencies = ['typed', 'equalScalar', 'DenseMatrix']

export const createMatAlgo16xSs = /* #__PURE__ */ factory(name, dependencies, ({ typed, equalScalar, DenseMatrix }) => {
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })

  /**
   * Picks the algorithm for a SparseMatrix S and a scalar b from the value
   * of f(0, b). When that is zero, the zeros of S stay zero and only the
   * nonzero items are visited (matAlgo11xS0s). Otherwise the callback is
   * invoked for every item (matAlgo12xSfs).
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
   * @return {Matrix}                    SparseMatrix (C) when f(0, b) is zero, DenseMatrix (C) otherwise
   */
  return function matAlgo16xSs (s, b, callback, inverse) {
    const adt = s._datatype

    // zero value
    let zero = 0
    // scalar value
    let scalar = b
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // convert 0 to the same datatype
      zero = typed.convert(0, adt)
      // convert b to the same datatype
      scalar = typed.convert(b, adt)
      // callback
      cf = typed.find(callback, [adt, adt])
    }

    // the value that the zeros of S are mapped to
    const v = inverse ? cf(scalar, zero) : cf(zero, scalar)

    return equalScalar(v, zero)
      ? matAlgo11xS0s(s, b, callback, inverse)
      : matAlgo12xSfs(s, b, callback, inverse)
  }
})
