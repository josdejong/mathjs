import { factory } from '../../../utils/factory.js'
import { DimensionError } from '../../../error/DimensionError.js'

const name = 'matAlgo07xSSf'
const dependencies = ['typed', 'SparseMatrix']

export const createMatAlgo07xSSf = /* #__PURE__ */ factory(name, dependencies, ({ typed, SparseMatrix }) => {
  /**
 * Iterates over SparseMatrix A and SparseMatrix B items (zero and nonzero) and invokes the callback function f(Aij, Bij).
 * Callback function invoked MxN times.
 *
 * C(i,j) = f(Aij, Bij)
 *
 * @param {Matrix}   a                 The SparseMatrix instance (A)
 * @param {Matrix}   b                 The SparseMatrix instance (B)
 * @param {Function} callback          The f(Aij,Bij) operation to invoke
 *
 * @return {Matrix}                    SparseMatrix (C)
 *
 * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
 */
  return function matAlgo07xSSf (a, b, callback) {
    // sparse matrix arrays
    const asize = a._size
    const adt = a._datatype || a._data === undefined ? a._datatype : a.getDataType()
    const bsize = b._size
    const bdt = b._datatype || b._data === undefined ? b._datatype : b.getDataType()

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }

    // rows & columns
    const rows = asize[0]
    const columns = asize[1]

    // datatype
    let dt
    let zero = 0
    let cf = callback

    // process data types
    if (typeof adt === 'string' && adt === bdt && adt !== 'mixed') {
      dt = adt
      zero = typed.convert(0, dt)
      cf = typed.find(callback, [dt, dt])
    }

    // result arrays for sparse format
    const cvalues = []
    const cindex = []
    const cptr = new Array(columns + 1).fill(0) // Start with column pointer array

    // workspaces
    const xa = []
    const xb = []
    const wa = []
    const wb = []

    // loop columns
    for (let j = 0; j < columns; j++) {
      const mark = j + 1
      let nonZeroCount = 0

      _scatter(a, j, wa, xa, mark)
      _scatter(b, j, wb, xb, mark)

      // loop rows
      for (let i = 0; i < rows; i++) {
        const va = wa[i] === mark ? xa[i] : zero
        const vb = wb[i] === mark ? xb[i] : zero

        // invoke callback
        const cij = cf(va, vb)
        // Store all non zero and true values
        if (cij !== 0 && cij !== false) {
          cindex.push(i) // row index
          cvalues.push(cij) // computed value
          nonZeroCount++
        }
      }

      // Update column pointer with cumulative count of non-zero values
      cptr[j + 1] = cptr[j] + nonZeroCount
    }

    // Return the result as a sparse matrix
    return new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: adt === a._datatype && bdt === b._datatype ? dt : undefined
    })
  }

  function _scatter (m, j, w, x, mark) {
    // a arrays
    const values = m._values
    const index = m._index
    const ptr = m._ptr
    // loop values in column j
    for (let k = ptr[j], k1 = ptr[j + 1]; k < k1; k++) {
      // row
      const i = index[k]
      // update workspace
      w[i] = mark
      x[i] = values[k]
    }
  }
})
