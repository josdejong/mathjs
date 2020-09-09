// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const approx = require('../../../../../tools/approx')
const math = require('../../../../../lib/cjs/defaultInstance').default
const { csPermute } = require('../../../../../lib/cjs/function/algebra/sparse/csPermute')
const { createCsLu } = require('../../../../../lib/cjs/function/algebra/sparse/csLu')
const { createCsSqr } = require('../../../../../lib/cjs/function/algebra/sparse/csSqr')
const market = require('../../../../../tools/matrixmarket')

const { abs, add, divideScalar, multiply, subtract, larger, largerEq, transpose, SparseMatrix } = math

const csLu = createCsLu({ abs, divideScalar, multiply, subtract, larger, largerEq, SparseMatrix })
const csSqr = createCsSqr({ add, multiply, transpose })

describe('csLu', function () {
  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 0
        const s = csSqr(0, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
    market.import('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 1
        const s = csSqr(1, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
    market.import('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 2
        const s = csSqr(2, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

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
    market.import('tools/matrices/bcsstk01.mtx')
      .then(function (m) {
        // symbolic ordering and analysis, order = 3
        const s = csSqr(3, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .catch(function (error) {
        // indicate test has completed
        done(error)
      })
  })
})
