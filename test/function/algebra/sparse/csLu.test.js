const assert = require('assert')
const approx = require('../../../../tools/approx')
const math = require('../../../../src/main').create()

math.import(require('../../../../src/function/algebra/sparse/csPermute'))
math.import(require('../../../../src/function/algebra/sparse/csLu'))
math.import(require('../../../../src/function/algebra/sparse/csSqr'))

const csPermute = math.algebra.sparse.csPermute
const csLu = math.algebra.sparse.csLu
const csSqr = math.algebra.sparse.csSqr

describe('csLu', function () {
  it('should decompose matrix, 2 x 2, no symbolic ordering and analysis, partial pivoting', function () {
    const m = math.sparse([[2, 1], [1, 4]])

    // partial pivoting
    const r = csLu(m, null, 1)

    // L
    assert.deepEqual(r.L.valueOf(), [[1, 0], [0.5, 1]])
    // U
    assert.deepEqual(r.U.valueOf(), [[2, 1], [0, 3.5]])
    // P
    assert.deepEqual(r.pinv, [0, 1])
    // verify
    approx.deepEqual(csPermute(m, r.pinv, null, true), math.multiply(r.L, r.U))
  })

  it('should decompose matrix, 4 x 4, natural ordering (order=0), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // symbolic ordering and analysis, order = 0
    const s = csSqr(0, m, false)

    // partial pivoting
    const r = csLu(m, s, 1)

    // verify
    approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A+A\') (order=1), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // symbolic ordering and analysis, order = 1
    const s = csSqr(1, m, false)

    // partial pivoting
    const r = csLu(m, s, 1)

    // verify
    approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=2), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // symbolic ordering and analysis, order = 2
    const s = csSqr(2, m, false)

    // partial pivoting
    const r = csLu(m, s, 1)

    // verify
    approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=3), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // symbolic ordering and analysis, order = 3
    const s = csSqr(3, m, false)

    // partial pivoting
    const r = csLu(m, s, 1)

    // verify
    approx.deepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
  })
})
