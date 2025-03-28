/**
 * Test whether a value is a Dense Matrix.
 *
 * Syntax:
 *
 *     math.isDenseMatrix(x)
 *
 * Examples:
 *
 *    math.isDenseMatrix(new math.DenseMatrix([1,2,3]))
 *    math.isDenseMatrix(new math.SparseMatrix([1,2,3]))
 *
 * See also:
 *
 *    isMatrix, isSparseMatrix
 */
export const isDenseMatrixDocs = {
  name: 'isDenseMatrix',
  category: 'Type Checks',
  syntax: ['isDenseMatrix(x)'],
  description: 'Test whether a value is a Dense Matrix.',
  examples: [
    'isDenseMatrix(new math.DenseMatrix([1,2,3]))',
    'isDenseMatrix(new math.SparseMatrix([1,2,3]))'
  ],
  seealso: ['isMatrix', 'isSparseMatrix']
}
