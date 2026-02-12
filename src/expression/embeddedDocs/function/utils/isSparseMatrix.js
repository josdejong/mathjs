/**
 * Test whether a value is a Sparse Matrix.
 *
 * Syntax:
 *
 *     math.isSparseMatrix(x)
 *
 * Examples:
 *
 *    math.isSparseMatrix(new math.SparseMatrix([1,2,3])) // returns true
 *    math.isSparseMatrix(new math.DenseMatrix([1,2,3])) // returns false
 *
 * See also:
 *
 *    isMatrix, isDenseMatrix
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a Sparse Matrix, false otherwise.
 *
 */
export const isSparseMatrixDocs = {
  name: 'isSparseMatrix',
  category: 'Type Checks',
  syntax: ['isSparseMatrix(x)'],
  description: 'Test whether a value is a Sparse Matrix.',
  examples: [
    'isSparseMatrix(new math.SparseMatrix([1,2,3]))',
    'isSparseMatrix(new math.DenseMatrix([1,2,3]))'
  ],
  seealso: ['isMatrix', 'isDenseMatrix']
}
