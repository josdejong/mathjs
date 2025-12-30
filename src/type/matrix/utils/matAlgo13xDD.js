import { factory } from '../../../utils/factory.js'
import { broadcast } from './broadcast.js'
import { isMatrix } from '../../../utils/is.js'
import { arraySize, validate } from '../../../utils/array.js'

const name = 'matAlgo13xDD'
const dependencies = ['typed']

export const createMatAlgo13xDD = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterates over DenseMatrix items and invokes the callback function f(Aij..z, Bij..z).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix|Array}   a                 The DenseMatrix instance (A)
   * @param {Matrix|Array}   b                 The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix|Array}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  return function matAlgo13xDD (a, b, callback) {
    // a arrays
    const aIsMatrix = isMatrix(a)
    const adata = aIsMatrix ? a._data : a
    const asize = aIsMatrix ? a._size : arraySize(a)
    if (!aIsMatrix) validate(adata, asize)
    const adt = aIsMatrix ? a._datatype : undefined

    // b arrays
    const bIsMatrix = isMatrix(b)
    const bdata = bIsMatrix ? b._data : b
    const bsize = bIsMatrix ? b._size : arraySize(b)
    if (!bIsMatrix) validate(bdata, bsize)
    const bdt = bIsMatrix ? b._datatype : undefined

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
    const cdata = broadcast(adata, bdata, asize, bsize, cf)

    if (aIsMatrix) {
      const cMatrix = a.createDenseMatrix()
      cMatrix._data = cdata.data
      cMatrix._size = cdata.size
      cMatrix._datatype = dt
      return cMatrix
    } else {
      return cdata.data
    }
  }
})
