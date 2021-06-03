import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const { eigs, complex, divide, dot, matrix, multiply, norm, size, subtract, bignumber: bignum, zeros, Matrix, Complex } = math

describe('eigs', function () {
  it('only accepts a square matrix', function () {
    assert.throws(function () { eigs(math.matrix([[1, 2, 3], [4, 5, 6]])) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2, 3], [4, 5, 6]]) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2], [4, 5, 6]]) }, /DimensionError: Dimension mismatch/)
    assert.throws(function () { eigs([4, 5, 6]) }, /Matrix must be square/)
    assert.throws(function () { eigs(1.0) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { eigs('random') }, /TypeError: Unexpected type of argument/)
  })

  it('follows aiao-mimo', function () {
    const realSymArray = eigs([[1, 0], [0, 1]])
    assert(Array.isArray(realSymArray.values) && typeof realSymArray.values[0] === 'number')
    assert(Array.isArray(realSymArray.vectors) && typeof realSymArray.vectors[0][0] === 'number')

    const genericArray = eigs([[0, 1], [-1, 0]])
    assert(Array.isArray(genericArray.values) && genericArray.values[0] instanceof Complex)
    assert(Array.isArray(genericArray.vectors) && genericArray.vectors[0][0] instanceof Complex)

    const realSymMatrix = eigs(matrix([[1, 0], [0, 1]]))
    assert(realSymMatrix.values instanceof Matrix)
    assert.deepStrictEqual(size(realSymMatrix.values), matrix([2]))
    assert(realSymMatrix.vectors instanceof Matrix)
    assert.deepStrictEqual(size(realSymMatrix.vectors), matrix([2, 2]))

    const genericMatrix = eigs(matrix([[0, 1], [-1, 0]]))
    assert(genericMatrix.values instanceof Matrix)
    assert.deepStrictEqual(size(genericMatrix.values), matrix([2]))
    assert(genericMatrix.vectors instanceof Matrix)
    assert.deepStrictEqual(size(genericMatrix.vectors), matrix([2, 2]))
  })

  it('only accepts a matrix with valid element type', function () {
    assert.throws(function () { eigs([['x', 2], [4, 5]]) }, /Cannot convert "x" to a number/)
  })

  it('eigenvalue check for diagonal matrix', function () {
    // trivial test
    approx.deepEqual(eigs(
      [[1, 0], [0, 1]]).values, [1, 1]
    )
    approx.deepEqual(eigs(
      [[2, 0, 0], [0, 1, 0], [0, 0, 5]]).values, [1, 2, 5]
    )
    approx.deepEqual(eigs(
      [[complex(2, 1), 0, 0], [0, 1, 0], [0, 0, complex(0, 5)]]).values, [complex(1, 0), complex(2, 1), complex(0, 5)]
    )
  })

  it('calculates eigenvalues for 2x2 simple matrix', function () {
    // 2x2 test
    approx.deepEqual(eigs(
      [[1, 0.1], [0.1, 1]]).values, [0.9, 1.1]
    )
    approx.deepEqual(eigs(
      matrix([[1, 0.1], [0.1, 1]])).values, matrix([0.9, 1.1])
    )
    approx.deepEqual(eigs(
      [[5, 2.3], [2.3, 1]]).values, [-0.04795013082563382, 6.047950130825635]
    )
  })

  it('calculates eigenvalues for 3x3 and 4x4 matrix', function () {
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
    [-0.9135495807127523, 2.26552473288741, 5.6502090685149735, -8.687249803623432]
    )
  })

  it('calculates eigenvalues and eigenvectors for 5x5 matrix', function () {
    const m = zeros([5, 5])
    m[4][3] = m[3][4] = m[3][2] = m[2][4] = 1

    approx.deepEqual(eigs(m).values, [
      0, 0,
      complex(-0.6623589786223121, 0.5622795120622232),
      complex(-0.6623589786223121, -0.5622795120622232),
      1.3247179572446257
    ])

    const expectedVecs = [
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, complex(0.11830597156369933, -0.031220615673570772), complex(-0.1200245154270954, -0.023772787955108215), complex(-0.9202478355596486, 0.3913360718714568)],
      [0, 0, complex(0.595491754174446, -0.7939890055659293), complex(-1.9907357758894604e-15, -7.492144846834677e-16), 0],
      [0, 0, complex(1.4367985194861642e-30, 1.7021784687445796e-45), complex(0.6439057179284668, 0.7552578345627129), 0]
    ]

    const orthogonalSize = (v, w) => norm(subtract(v, multiply(divide(dot(w, v), dot(w, w)), w)))

    // inverse iteration is stochastic, check it multiple times
    for (let i = 0; i < 5; i++) {
      const { vectors } = eigs(m)

      for (let j = 0; j < 5; j++) {
        assert(orthogonalSize(vectors[j], expectedVecs[j]) < 0.5) // this is poor precision, what's wrong?
      }
    }
  })

  it('eigenvector check', function () {
    const H = [[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]]
    const ans = eigs(H)
    const E = ans.values
    const V = ans.vectors
    const VtHV = math.multiply(math.transpose(V), H, V)
    const Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = VtHV[i][i]
    }
    approx.deepEqual(Ei, E)
  })

  it('supports fractions', function () {
    const aij = math.fraction('1/2')
    approx.deepEqual(eigs(
      [[aij, aij, aij],
        [aij, aij, aij],
        [aij, aij, aij]]).values,
    [0, 0, 1.5]
    )
  })

  it('diagonalizes matrix with bigNumber', function () {
    const x = [[bignum(1), bignum(0)], [bignum(0), bignum(1)]]
    approx.deepEqual(eigs(x).values, [bignum(1), bignum(1)])
    const y = [[bignum(1), bignum(1.0)], [bignum(1.0), bignum(1)]]
    const E1 = eigs(y).values
    approx.equal(E1[0].toNumber(), 0.0)
    approx.equal(E1[1].toNumber(), 2.0)
    const H = bignum([[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]])
    const ans = eigs(H)
    const E = ans.values
    const V = ans.vectors
    const VtHV = math.multiply(math.transpose(V), H, V)
    const Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = bignum(VtHV[i][i])
    }
    approx.deepEqual(Ei, E)
  })

  it('actually calculates BigNumbers input with BigNumber precision', function () {
    const B = bignum([
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
