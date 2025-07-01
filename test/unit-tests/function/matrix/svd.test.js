// test svd
import assert from 'assert'
import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const svd = math.svd

/**
 * Check if a matrix is orthonormal: QᵗQ = I
 *
 * @param {number[][]} matrix - A 2D array representing a matrix
 * @returns {boolean} true if matrix is orthonormal
 */
function isOrthonormal (matrix) {
  const QtQ = math.multiply(math.transpose(matrix), matrix)
  const I = math.identity(QtQ.length)
  return math.deepEqual(math.round(QtQ, 6), I)
}

describe('svd', function () {
  /**
   * Validates SVD output by checking:
   * - Reconstruction: A ≈ U * S * Vᵗ
   * - Orthonormality of U and V
   * - Correct dimensions
   *
   * @param {number[][]} A - Input matrix
   */
  function validateSVD (A) {
    const { U, S, V } = svd(A)

    if (!Array.isArray(A[0])) {
      A = [A]
    }

    const m = A.length
    const n = A[0].length

    const actualUdims = `${U.length}x${U[0].length}`
    const actualSdims = `${S.length}x${S[0].length}`
    const actualVdims = `${V.length}x${V[0].length}`

    const expectedUdims = `${m}x${m}`
    const expectedSdims = `${m}x${n}`
    const expectedVdims = `${n}x${n}`

    assert.strictEqual(actualUdims, expectedUdims,
      `dimensions of U are not valid. actual: ${actualUdims}, expected: ${expectedUdims}`
    )
    assert.strictEqual(actualSdims, expectedSdims,
      `dimensions of S are not valid. actual: ${actualSdims}, expected: ${expectedSdims}`
    )
    assert.strictEqual(actualVdims, expectedVdims,
      `dimensions of V are not valid. actual: ${actualVdims}, expected: ${expectedVdims}`
    )

    const US = math.multiply(U, S)
    const USVt = math.multiply(US, math.transpose(V))
    approxDeepEqual(USVt, A)

    assert.ok(isOrthonormal(U), 'U is not orthonormal')
    assert.ok(isOrthonormal(V), 'V is not orthonormal')
  }

  it('should compute SVD of a 2x3 easy wide matrix', function () {
    const A = [
      [1, 0, -1],
      [1, 1, 1]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a 2x3 wide matrix', function () {
    const A = [
      [1, 2, 3],
      [4, 5, 6]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a 3x2 easy tall matrix', function () {
    const A = [
      [1, 1],
      [0, 1],
      [-1, 1]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a 3x2 tall matrix', function () {
    const A = [
      [1, 4],
      [2, 5],
      [3, 6]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a square 3x3 identity matrix', function () {
    const A = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a rank-deficient 3x2 matrix', function () {
    const A = [
      [1, 2],
      [2, 4],
      [3, 6]
    ]
    validateSVD(A)
  })

  it('should compute SVD of a 1x5 matrix', function () {
    const A = [1, 2, 3, 4, 5]
    validateSVD(A)
  })

  it('should throw error for invalid input (3D array)', function () {
    assert.throws(() => svd([[[1, 2], [3, 4]]]), /Matrix must be one or two dimensional/)
  })
})
