/**
 * Test whether a value is a Matrix.
 *
 * Syntax:
 *
 *     math.isMatrix(x)
 *
 * Examples:
 *
 *    math.isMatrix(math.matrix([1, 2, 3]))  // returns true
 *    math.isMatrix([1, 2, 3])               // returns false
 *
 * See also:
 *
 *    isArray, isDenseMatrix, isSparseMatrix
 */
export const isMatrixDocs = {
  name: 'isMatrix',
  category: 'Type Checks',
  syntax: ['isMatrix(x)'],
  description: 'Test whether a value is a Matrix.',
  examples: ['isMatrix(math.matrix([1,2,3]))', 'isMatrix([1,2,3])'],
  seealso: ['isArray', 'isDenseMatrix', 'isSparseMatrix']
}
