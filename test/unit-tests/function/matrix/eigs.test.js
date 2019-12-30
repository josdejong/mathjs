import assert from 'assert'
import math from '../../../../src/bundleAny'
import approx from '../../../../tools/approx'
const eigs = math.eigs

describe('eigs', function () {
  it('should only accept a square matrix', function () {
    assert.throws(function () { eigs(math.matrix([[1, 2, 3], [4, 5, 6]])) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2, 3], [4, 5, 6]]) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2], [4, 5, 6]]) }, /DimensionError: Dimension mismatch/)
    assert.throws(function () { eigs([4, 5, 6]) }, /Matrix must be square/)
    assert.throws(function () { eigs(1.0) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { eigs('random') }, /TypeError: Unexpected type of argument/)
  })
  it('eigenvalue check for diagonal matrix', function () {
    // trivial test
    approx.deepEqual(eigs(
      [[1, 0], [0, 1]])[0], [1, 1]
    )
    approx.deepEqual(eigs(
      [[2, 0, 0], [0, 1, 0], [0, 0, 5]])[0], [1, 2, 5]
    )
  })
  it('eigenvalue check for 2x2 simple matrix', function () {
    // 2x2 test
    approx.deepEqual(eigs(
      [[1, 0.1], [0.1, 1]])[0], [0.9, 1.1]
    )
    approx.deepEqual(eigs(
      math.matrix([[1, 0.1], [0.1, 1]]))[0], [0.9, 1.1]
    )
    approx.deepEqual(eigs(
      [[5, 2.3], [2.3, 1]])[0], [-0.04795013082563382, 6.047950130825635]
    )
  })
})
