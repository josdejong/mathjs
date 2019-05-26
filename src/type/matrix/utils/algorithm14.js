import { factory } from '../../../utils/factory'
import { clone } from '../../../utils/object'

const name = 'algorithm14'
const dependencies = ['typed']

export const createAlgorithm14 = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
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
  return function algorithm14 (a, b, callback, inverse) {
    // a arrays
    const adata = a._data
    const asize = a._size
    const adt = a._datatype

    // datatype
    let dt
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string') {
      // datatype
      dt = adt
      // convert b to the same datatype
      b = typed.convert(b, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // populate cdata, iterate through dimensions
    const cdata = asize.length > 0 ? _iterate(cf, 0, asize, asize[0], adata, b, inverse) : []

    // c matrix
    return a.createDenseMatrix({
      data: cdata,
      size: clone(asize),
      datatype: dt
    })
  }

  // recursive function
  function _iterate (f, level, s, n, av, bv, inverse) {
    // initialize array for this level
    const cv = []
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (let i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = inverse ? f(bv, av[i]) : f(av[i], bv)
      }
    } else {
      // iterate current level
      for (let j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv, inverse)
      }
    }
    return cv
  }
})
