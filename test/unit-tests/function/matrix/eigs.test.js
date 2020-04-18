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
    assert.throws(function () { eigs(math.matrix([[1, 2], [2.1, 3]])) }, /Input matrix is not symmetric/)
  })
  it('should only accept a matrix with valid element type', function () {
    assert.throws(function () { eigs([['x', 2], [4, 5]]) }, /Mixed matrix element type is not supported/)
    assert.throws(function () { eigs([[1, 2], [2, '5']]) }, /Mixed matrix element type is not supported/)
    assert.throws(function () { eigs([['1', '2'], ['2', '5']]) }, /Matrix element type not supported/)
  })
  it('eigenvalue check for diagonal matrix', function () {
    // trivial test
    approx.deepEqual(eigs(
      [[1, 0], [0, 1]]).values, [1, 1]
    )
    approx.deepEqual(eigs(
      [[2, 0, 0], [0, 1, 0], [0, 0, 5]]).values, [1, 2, 5]
    )
  })
  it('eigenvalue check for 2x2 simple matrix', function () {
    // 2x2 test
    approx.deepEqual(eigs(
      [[1, 0.1], [0.1, 1]]).values, [0.9, 1.1]
    )
    approx.deepEqual(eigs(
      math.matrix([[1, 0.1], [0.1, 1]])).values, math.matrix([0.9, 1.1])
    )
    approx.deepEqual(eigs(
      [[5, 2.3], [2.3, 1]]).values, [-0.04795013082563382, 6.047950130825635]
    )
  })
  it('eigenvalue check for 3x3 and 4x4 matrix', function () {
    // 3x3 test and 4x4
    approx.deepEqual(eigs(
      [[1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0]]).values,
    [0, 0, 3]
    )
    approx.deepEqual(eigs(
      [[0.6163396801190624, -3.8571699139231796, 2.852995822026198, 4.1957619745869845],
        [-3.8571699139231796, 0.7047577966772156, 0.9122549659760404, 0.9232933211541949],
        [2.852995822026198, 0.9122549659760404, 1.6598316026960402, -1.2931270747054358],
        [4.1957619745869845, 0.9232933211541949, -1.2931270747054358, -4.665994662426116]]).values,
    [-8.687249803623432, -0.9135495807127523, 2.26552473288741, 5.6502090685149735]
    )
  })
  it('eigenvector check', function () {
    var H = [[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]]
    const ans = eigs(H)
    const E = ans.values
    const V = ans.vectors
    var VtHV = math.multiply(math.transpose(V), H, V)
    var Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = VtHV[i][i]
    }
    approx.deepEqual(Ei, E)
  })
  it('fractions are supported', function () {
    const aij = math.fraction('1/2')
    approx.deepEqual(eigs(
      [[aij, aij, aij],
        [aij, aij, aij],
        [aij, aij, aij]]).values,
    [0, 0, 1.5]
    )
  })
  it('bigNumber diagonalization is supported', function () {
    var x = [[math.bignumber(1), math.bignumber(0)], [math.bignumber(0), math.bignumber(1)]]
    approx.deepEqual(eigs(x).values, [math.bignumber(1), math.bignumber(1)])
    var y = [[math.bignumber(1), math.bignumber(1.0)], [math.bignumber(1.0), math.bignumber(1)]]
    var E1 = eigs(y).values
    approx.equal(E1[0].toNumber(), 0.0)
    approx.equal(E1[1].toNumber(), 2.0)
    var H = [[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]]
    H = math.bignumber(H)
    const ans = eigs(H)
    const E = ans.values
    const V = ans.vectors
    const VtHV = math.multiply(math.transpose(V), H, V)
    var Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = math.bignumber(VtHV[i][i])
    }
    approx.deepEqual(Ei, E)
  })

  it('make sure BigNumbers input is actually calculated with BigNumber precision', function () {
    const B = math.bignumber([
      [0, 1],
      [1, 0]
    ])
    const eig = math.eigs(B)

    assert.strictEqual(eig.values[0].toString(),
      '-0.9999999999999999999999999999999999999999999999999999999999999999')
    assert.strictEqual(eig.values[1].toString(),
      '0.9999999999999999999999999999999999999999999999999999999999999999')
  })
})
