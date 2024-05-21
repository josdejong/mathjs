// Only use native node.js API's and references to ./lib here, this file is not transpiled!
import { create, all } from '../../../../../lib/esm/index.js'
import { approxDeepEqual } from '../../../../../tools/approx.js'
import { marketImport } from '../../../../../tools/matrixmarket.js'

const math = create(all)

describe('slu - matrix market', function () {
  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // full pivoting
        const r = math.slu(m, 0, 0.001)

        // verify M[p,q]=L*U
        approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A+A\') (order=1), full pivoting, matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // full pivoting
        const r = math.slu(m, 1, 0.001)

        // verify M[p,q]=L*U
        approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=2), full pivoting, matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // full pivoting
        const r = math.slu(m, 2, 0.001)

        // verify M[p,q]=L*U
        approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=3), full pivoting, matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // full pivoting
        const r = math.slu(m, 3, 0.001)

        // verify M[p,q]=L*U
        approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
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
