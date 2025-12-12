import { factory } from '../../../utils/factory.js'

const name = 'matAlgo14xDs'
const dependencies = ['typed']

export const createMatAlgo14xDs = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, b).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} callback          The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  return function matAlgo14xDs (a, b, callback, inverse) {
    // a arrays
    const adt = a._datatype

    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // convert b to the same datatype
      b = typed.convert(b, adt)
      // callback
      cf = typed.find(callback, [adt, adt])
    }

    return inverse ? a.map(v => cf(b, v)) : a.map(v => cf(v, b))
  }
})
