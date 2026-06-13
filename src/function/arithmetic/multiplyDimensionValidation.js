// multiplyDimensionValidation.js — Extracted matrix dimension validation for multiply
//
// Decomposed from multiply.js (882 lines) to improve cohesion and single responsibility.
// This module validates that two matrix operands have compatible dimensions
// for multiplication (dot product, matrix-vector, vector-matrix, or matrix-matrix).

/**
 * Validate that two matrix operands have compatible dimensions for multiplication.
 *
 * Supported combinations:
 *   - Vector (N) × Vector (N)  → requires same length
 *   - Vector (M) × Matrix (M×N) → vector length must match matrix rows
 *   - Matrix (M×N) × Vector (N) → matrix columns must match vector length
 *   - Matrix (M×K) × Matrix (K×N) → A columns must match B rows
 *
 * @param {number[]} size1 - Shape of the first operand (1D or 2D)
 * @param {number[]} size2 - Shape of the second operand (1D or 2D)
 * @throws {RangeError} If dimensions are incompatible
 * @throws {Error} If either operand has more than 2 dimensions
 */
export function validateMatrixMultiplicationDimensions(size1, size2) {
  switch (size1.length) {
    case 1:
      validateLeftVectorDimensions(size1, size2)
      break
    case 2:
      validateLeftMatrixDimensions(size1, size2)
      break
    default:
      throw new Error(
        `Can only multiply a 1 or 2 dimensional matrix (Matrix A has ${size1.length} dimensions)`
      )
  }
}

/**
 * Validate dimensions when the left operand is a vector (1D).
 * @param {number[]} vectorSize - Shape of the vector [N]
 * @param {number[]} rightSize - Shape of the right operand
 */
function validateLeftVectorDimensions(vectorSize, rightSize) {
  switch (rightSize.length) {
    case 1:
      // Vector × Vector: lengths must match
      if (vectorSize[0] !== rightSize[0]) {
        throw new RangeError(
          'Dimension mismatch in multiplication. Vectors must have the same length'
        )
      }
      break
    case 2:
      // Vector × Matrix: vector length must match matrix rows
      if (vectorSize[0] !== rightSize[0]) {
        throw new RangeError(
          `Dimension mismatch in multiplication. Vector length (${vectorSize[0]}) must match Matrix rows (${rightSize[0]})`
        )
      }
      break
    default:
      throw new Error(
        `Can only multiply a 1 or 2 dimensional matrix (Matrix B has ${rightSize.length} dimensions)`
      )
  }
}

/**
 * Validate dimensions when the left operand is a matrix (2D).
 * @param {number[]} matrixSize - Shape of the matrix [M, K]
 * @param {number[]} rightSize - Shape of the right operand
 */
function validateLeftMatrixDimensions(matrixSize, rightSize) {
  switch (rightSize.length) {
    case 1:
      // Matrix × Vector: matrix columns must match vector length
      if (matrixSize[1] !== rightSize[0]) {
        throw new RangeError(
          `Dimension mismatch in multiplication. Matrix columns (${matrixSize[1]}) must match Vector length (${rightSize[0]})`
        )
      }
      break
    case 2:
      // Matrix × Matrix: A columns must match B rows
      if (matrixSize[1] !== rightSize[0]) {
        throw new RangeError(
          `Dimension mismatch in multiplication. Matrix A columns (${matrixSize[1]}) must match Matrix B rows (${rightSize[0]})`
        )
      }
      break
    default:
      throw new Error(
        `Can only multiply a 1 or 2 dimensional matrix (Matrix B has ${rightSize.length} dimensions)`
      )
  }
}
