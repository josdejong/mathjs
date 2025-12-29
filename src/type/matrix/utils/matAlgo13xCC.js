import { factory } from '../../../utils/factory.js'
import { broadcastTwo } from './broadcast.js'
import { isMatrix } from '../../../utils/is.js'
import { arraySize, validate } from '../../../utils/array.js'

const name = 'matAlgo13xCC'
const dependencies = ['typed']

export const createMatAlgo13xCC = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterates over Array or DenseMatrix items and invokes the callback function f(Aij..z, Bij..z).
   * Callback function invoked MxN times.
   *
   * C(i,j,...z) = f(Aij..z, Bij..z)
   *
   * @param {Matrix|Array}   a           The DenseMatrix instance (A)
   * @param {Matrix|Array}   b           The DenseMatrix instance (B)
   * @param {Function} callback          The f(Aij..z,Bij..z) operation to invoke
   *
   * @return {Matrix}                    DenseMatrix (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97658658
   */
  return function matAlgo13xCC (a, b, callback) {
    const aIsMatrix = isMatrix(a)
    const bIsMatrix = isMatrix(b)

    // a arrays
    const adata = aIsMatrix ? a._data : a
    const asize = aIsMatrix ? a._size : arraySize(a)
    const adt = aIsMatrix ? a._datatype : undefined
    // b arrays
    const bdata = bIsMatrix ? b._data : b
    const bsize = bIsMatrix ? b._size : arraySize(b)
    const bdt = bIsMatrix ? b._datatype : undefined

    if (!aIsMatrix) validate(adata, asize)
    if (!bIsMatrix) validate(bdata, bsize)

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

    const cdata = broadcastTwo(adata, bdata, asize, bsize, cf)

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
