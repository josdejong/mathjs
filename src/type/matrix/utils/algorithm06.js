'use strict'

const scatter = require('./../../../utils/collection/scatter')
const DimensionError = require('../../../error/DimensionError')

function factory (type, config, load, typed) {
  const equalScalar = load(require('../../../function/relational/equalScalar'))

  const SparseMatrix = type.SparseMatrix

  /**
   * Iterates over SparseMatrix A and SparseMatrix B nonzero items and invokes the callback function f(Aij, Bij).
   * Callback function invoked (Anz U Bnz) times, where Anz and Bnz are the nonzero elements in both matrices.
   *
   *
   *          ┌  f(Aij, Bij)  ; A(i,j) !== 0 && B(i,j) !== 0
   * C(i,j) = ┤
   *          └  0            ; otherwise
   *
   *
   * @param {Matrix}   a                 The SparseMatrix instance (A)
   * @param {Matrix}   b                 The SparseMatrix instance (B)
   * @param {Function} callback          The f(Aij,Bij) operation to invoke
   *
   * @return {Matrix}                    SparseMatrix (C)
   *
   * see https://github.com/josdejong/mathjs/pull/346#issuecomment-97620294
   */
  const algorithm06 = function (a, b, callback) {
    // sparse matrix arrays
    const avalues = a._values
    const asize = a._size
    const adt = a._datatype
    // sparse matrix arrays
    const bvalues = b._values
    const bsize = b._size
    const bdt = b._datatype

    // validate dimensions
    if (asize.length !== bsize.length) { throw new DimensionError(asize.length, bsize.length) }

    // check rows & columns
    if (asize[0] !== bsize[0] || asize[1] !== bsize[1]) { throw new RangeError('Dimension mismatch. Matrix A (' + asize + ') must match Matrix B (' + bsize + ')') }

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
    if (typeof adt === 'string' && adt === bdt) {
      // datatype
      dt = adt
      // find signature that matches (dt, dt)
      eq = typed.find(equalScalar, [dt, dt])
      // convert 0 to the same datatype
      zero = typed.convert(0, dt)
      // callback
      cf = typed.find(callback, [dt, dt])
    }

    // result arrays
    const cvalues = avalues && bvalues ? [] : undefined
    const cindex = []
    const cptr = []
    // matrix
    const c = new SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size: [rows, columns],
      datatype: dt
    })

    // workspaces
    const x = cvalues ? [] : undefined
    // marks indicating we have a value in x for a given column
    const w = []
    // marks indicating value in a given row has been updated
    const u = []

    // loop columns
    for (let j = 0; j < columns; j++) {
      // update cptr
      cptr[j] = cindex.length
      // columns mark
      const mark = j + 1
      // scatter the values of A(:,j) into workspace
      scatter(a, j, w, x, u, mark, c, cf)
      // scatter the values of B(:,j) into workspace
      scatter(b, j, w, x, u, mark, c, cf)
      // check we need to process values (non pattern matrix)
      if (x) {
        // initialize first index in j
        let k = cptr[j]
        // loop index in j
        while (k < cindex.length) {
          // row
          const i = cindex[k]
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[i] === mark) {
            // value @ i
            const v = x[i]
            // check for zero value
            if (!eq(v, zero)) {
              // push value
              cvalues.push(v)
              // increment pointer
              k++
            } else {
              // remove value @ i, do not increment pointer
              cindex.splice(k, 1)
            }
          } else {
            // remove value @ i, do not increment pointer
            cindex.splice(k, 1)
          }
        }
      } else {
        // initialize first index in j
        let p = cptr[j]
        // loop index in j
        while (p < cindex.length) {
          // row
          const r = cindex[p]
          // check function was invoked on current row (Aij !=0 && Bij != 0)
          if (u[r] !== mark) {
            // remove value @ i, do not increment pointer
            cindex.splice(p, 1)
          } else {
            // increment pointer
            p++
          }
        }
      }
    }
    // update cptr
    cptr[columns] = cindex.length

    // return sparse matrix
    return c
  }

  return algorithm06
}

exports.name = 'algorithm06'
exports.factory = factory
