import { factory } from '../../../utils/factory.js'
import { DimensionError } from '../../../error/DimensionError.js'

const name = 'algorithm13'
const dependencies = ['typed']

export const createAlgorithm13 = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix}   a                 The DenseMatrix instance (A)
   * @param {Matrix}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  return function algorithm13 (a, b, callback) {
    // a arrays
    const adata = a._data
    const asize = a._size
    const adt = a._datatype
    // b arrays
    const bdata = b._data
    const bsize = b._size
    const bdt = b._datatype
    // c arrays
    const csize = []

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // validate each one of the dimension sizes
    for (let s = 0; s < asize.length; s++) {
      // must match
      if (asize[s] !== bsize[s]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }
      // update dimension in c
      csize[s] = asize[s]
    }

    // datatype
    let dt
    // callback signature to use
    let cf = callback

    // process data types
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // populate cdata, iterate through dimensions
    const cdata = csize.length > 0 ? _iterate(cf, 0, csize, csize[0], adata, bdata) : []

    // c matrix
    return a.createDenseMatrix({
      data: cdata,
      size: csize,
      datatype: dt
    })
  }

  // recursive function
  function _iterate (f, level, s, n, av, bv) {
    // initialize array for this level
    const cv = []
    // check we reach the last level
    if (level === s.length - 1) {
      // loop arrays in last level
      for (let i = 0; i < n; i++) {
        // invoke callback and store value
        cv[i] = f(av[i], bv[i])
      }
    } else {
      // iterate current level
      for (let j = 0; j < n; j++) {
        // iterate next level
        cv[j] = _iterate(f, level + 1, s, s[level + 1], av[j], bv[j])
      }
    }
    return cv
  }
})
