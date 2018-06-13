const approx = require('../../../../tools/approx')
const market = require('../../../../tools/matrixmarket')
const math = require('../../../../src/main').create()

math.import(require('../../../../src/function/algebra/sparse/csPermute'))
math.import(require('../../../../src/function/algebra/sparse/csLu'))
math.import(require('../../../../src/function/algebra/sparse/csSqr'))

const csPermute = math.algebra.sparse.csPermute
const csLu = math.algebra.sparse.csLu
const csSqr = math.algebra.sparse.csSqr

describe('csLu', function () {
  it('should decompose matrix, 48 x 48, natural ordering (order=0), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        const m = matrices[0]

        // symbolic ordering and analysis, order = 0
        const s = csSqr(0, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .fail(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A+A\') (order=1), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        const m = matrices[0]

        // symbolic ordering and analysis, order = 1
        const s = csSqr(1, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .fail(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=2), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        const m = matrices[0]

        // symbolic ordering and analysis, order = 2
        const s = csSqr(2, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .fail(function (error) {
        // indicate test has completed
        done(error)
      })
  })

  it('should decompose matrix, 48 x 48, amd(A\'*A) (order=3), full pivoting, matrix market', function (done) {
    // import matrix
    market.import('tools/matrices/bcsstk01.tar.gz', ['bcsstk01/bcsstk01.mtx'])
      .then(function (matrices) {
        // matrix
        const m = matrices[0]

        // symbolic ordering and analysis, order = 3
        const s = csSqr(3, m, false)

        // full pivoting
        const r = csLu(m, s, 0.001)

        // verify
        approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())

        // indicate test has completed
        done()
      })
      .fail(function (error) {
        // indicate test has completed
        done(error)
      })
  })
})
