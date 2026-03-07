// test schur decomposition
import assert from 'assert'

import math from '../../../../../src/defaultInstance.js'

/**
 * Helper function to verify Schur decomposition properties:
 * 1. A = U*T*U' (decomposition is accurate)
 * 2. U is orthogonal (U*U' = I)
 * 3. T is quasi-upper-triangular (lower triangular elements are zero, except
 *    for 2x2 blocks on diagonal which represent complex conjugate eigenvalues)
 */
function verifySchurDecomposition (A, result, tolerance = 1e-10) {
  const { U, T } = result
  const n = Array.isArray(A) ? A.length : A.size()[0]

  // Verify A = U*T*U'
  const reconstructed = math.multiply(math.multiply(U, T), math.transpose(U))
  const errorNorm = math.norm(math.subtract(A, reconstructed))
  assert.ok(errorNorm < tolerance, `Decomposition error too large: ${errorNorm}`)

  // Verify U is orthogonal: U*U' = I
  const UUT = math.multiply(U, math.transpose(U))
  const orthogonalError = math.norm(math.subtract(UUT, math.identity(n)))
  assert.ok(orthogonalError < tolerance, `U is not orthogonal: ${orthogonalError}`)

  // Verify T is quasi-upper-triangular
  // Elements below the first subdiagonal must be zero
  // Elements on the first subdiagonal may be non-zero only for 2x2 blocks
  const Tarr = Array.isArray(T) ? T : T.valueOf()
  for (let i = 2; i < n; i++) {
    for (let j = 0; j < i - 1; j++) {
      assert.ok(
        Math.abs(Tarr[i][j]) < tolerance,
        `T[${i}][${j}] = ${Tarr[i][j]} should be zero (quasi-upper-triangular)`
      )
    }
  }
}

describe('schur', function () {
  it('should calculate schur decomposition of order 5 Array with numbers', function () {
    const A = [
      [-5.3, -1.4, -0.2, 0.7, 1.0],
      [-0.4, -1.0, -0.1, -1.2, 0.7],
      [0.3, 0.7, -2.5, 0.7, -0.3],
      [3.6, -0.1, 1.4, -2.4, 0.3],
      [2.8, 0.7, 1.4, 0.5, -4.8]
    ]
    const result = math.schur(A)

    // Verify decomposition properties
    verifySchurDecomposition(A, result)

    // Verify result types
    assert.ok(Array.isArray(result.T))
    assert.ok(Array.isArray(result.U))
  })

  it('should calculate schur decomposition of order 5 Matrix with numbers', function () {
    const A = math.matrix([
      [-5.3, -1.4, -0.2, 0.7, 1.0],
      [-0.4, -1.0, -0.1, -1.2, 0.7],
      [0.3, 0.7, -2.5, 0.7, -0.3],
      [3.6, -0.1, 1.4, -2.4, 0.3],
      [2.8, 0.7, 1.4, 0.5, -4.8]
    ])
    const result = math.schur(A)

    // Verify decomposition properties
    verifySchurDecomposition(A, result)

    // Verify result types are matrices
    assert.ok(math.isMatrix(result.T))
    assert.ok(math.isMatrix(result.U))
  })

  it('should handle 2x2 matrix', function () {
    const A = [[1, 2], [3, 4]]
    const result = math.schur(A)
    verifySchurDecomposition(A, result)
  })

  it('should handle 1x1 matrix', function () {
    const A = [[5]]
    const result = math.schur(A)
    assert.deepStrictEqual(result.T, [[5]])
    assert.deepStrictEqual(result.U, [[1]])
  })

  it('should handle identity matrix', function () {
    const A = math.identity(3)
    const result = math.schur(A)
    verifySchurDecomposition(A, result)
  })

  it('should handle orthogonal/rotation matrix with complex eigenvalues', function () {
    // This matrix has complex eigenvalues and was previously problematic
    const A = math.matrix([
      [-0.03591206220229135, -0.09100469507870354, 0.9952027277203429],
      [-0.3802068171617618, -0.9197139315803332, -0.09782157349362577],
      [0.9242040358990549, -0.38189583596928406, -0.0015717815434243287]
    ])
    const result = math.schur(A)

    // Verify decomposition properties
    verifySchurDecomposition(A, result)

    // Verify T has a 2x2 block for complex eigenvalue pair
    const T = result.T.valueOf()
    // T should have form:
    // [real eigenvalue,  *,  *]
    // [0,                2x2 block]
    // [0,                2x2 block]
    // The 2x2 block will have a non-zero T[2][1] element
    assert.ok(Math.abs(T[1][0]) < 1e-10, 'T[1][0] should be zero')
    assert.ok(Math.abs(T[2][0]) < 1e-10, 'T[2][0] should be zero')
    // T[2][1] should be non-zero (complex eigenvalue 2x2 block)
    // The magnitude should be significant relative to the matrix norm
    const matrixNorm = math.norm(A)
    assert.ok(Math.abs(T[2][1]) > 1e-10 * matrixNorm, 'T[2][1] should be non-zero for complex eigenvalue block')
  })

  it('should handle symmetric matrix', function () {
    const A = [
      [4, 2, 2],
      [2, 5, 1],
      [2, 1, 6]
    ]
    const result = math.schur(A)
    verifySchurDecomposition(A, result)
  })

  it('should handle diagonal matrix', function () {
    const A = [
      [1, 0, 0],
      [0, 2, 0],
      [0, 0, 3]
    ]
    const result = math.schur(A)
    verifySchurDecomposition(A, result)
  })

  it('should throw error for non-square matrix', function () {
    assert.throws(function () {
      math.schur([[1, 2, 3], [4, 5, 6]])
    }, /Matrix must be square/)
  })
})
