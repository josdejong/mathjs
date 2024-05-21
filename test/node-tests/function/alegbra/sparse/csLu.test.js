// Only use native node.js API's and references to ./lib here, this file is not transpiled!
import { create, all } from '../../../../../lib/esm/index.js'
import { approxDeepEqual } from '../../../../../tools/approx.js'
import { marketImport } from '../../../../../tools/matrixmarket.js'
import { csPermute } from '../../../../../lib/esm/function/algebra/sparse/csPermute.js'
import { createCsLu } from '../../../../../lib/esm/function/algebra/sparse/csLu.js'
import { createCsSqr } from '../../../../../lib/esm/function/algebra/sparse/csSqr.js'

const math = create(all)
const { abs, add, divideScalar, multiply, subtract, larger, largerEq, transpose, SparseMatrix } = math

const csLu = createCsLu({ abs, divideScalar, multiply, subtract, larger, largerEq, SparseMatrix })
const csSqr = createCsSqr({ add, multiply, transpose })

describe('csLu', function () {
  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    marketImport('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 0
        const s = csSqr(0, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
        // symbolic ordering and analysis, order = 1
        const s = csSqr(1, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
        // symbolic ordering and analysis, order = 2
        const s = csSqr(2, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
        // symbolic ordering and analysis, order = 3
        const s = csSqr(3, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })
})
