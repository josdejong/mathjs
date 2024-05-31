import assert from 'assert'
import { approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'
import { csPermute } from '../../../../../src/function/algebra/sparse/csPermute.js'
import { createCsLu } from '../../../../../src/function/algebra/sparse/csLu.js'
import { createCsSqr } from '../../../../../src/function/algebra/sparse/csSqr.js'

const { abs, add, divideScalar, multiply, subtract, larger, largerEq, transpose, SparseMatrix } = math

const csLu = createCsLu({ abs, divideScalar, multiply, subtract, larger, largerEq, SparseMatrix })
const csSqr = createCsSqr({ add, multiply, transpose })

describe('csLu', function () {
  it('should decompose matrix, 2 x 2, no symbolic ordering and analysis, partial pivoting', function () {
    const m = math.sparse([[2, 1], [1, 4]])

    // partial pivoting
    const r = csLu(m, null, 1)

    // L
    assert.deepStrictEqual(r.L.valueOf(), [[1, 0], [0.5, 1]])
    // U
    assert.deepStrictEqual(r.U.valueOf(), [[2, 1], [0, 3.5]])
    // P
    assert.deepStrictEqual(r.pinv, [0, 1])
    // verify
    approxDeepEqual(csPermute(m, r.pinv, null, true), math.multiply(r.L, r.U))
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
    approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
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
    approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
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
    approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
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
    approxDeepEqual(csPermute(m, r.pinv, s.q, true).valueOf(), math.multiply(r.L, r.U).valueOf())
  })
})
