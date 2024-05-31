import { approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'

describe('slu', function () {
  it('should decompose matrix, 4 x 4, natural ordering (order=0), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 0, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A+A\') (order=1)', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 1, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=2), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 2, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=3), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 3, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  /**
   * C = A(p,q) where p is the row permutation vector and q the column permutation vector.
   */
  function _permute (A, pinv, q) {
    // matrix arrays
    const values = A._values
    const index = A._index
    const ptr = A._ptr
    const size = A._size
    // columns
    const n = size[1]
    // c arrays
    const cvalues = []
    const cindex = []
    const cptr = []
    // loop columns
    for (let k = 0; k < n; k++) {
      cptr[k] = cindex.length
      // column in C
      const j = q ? (q[k]) : k
      // values in column j
      for (let t = ptr[j]; t < ptr[j + 1]; t++) {
        cvalues.push(values[t])
        cindex.push(pinv ? (pinv[index[t]]) : index[t])
      }
    }
    cptr[n] = cindex.length
    // return matrix
    return new math.SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size,
      datatype: A._datatype
    })
  }
})
