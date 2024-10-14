export const diffDocs = {
  name: 'diff',
  category: 'Matrix',
  syntax: [
    'diff(arr)',
    'diff(arr, dim)'
  ],
  description: [
    'Create a new matrix or array with the difference of the passed matrix or array.',
    'Dim parameter is optional and used to indicate the dimension of the array/matrix to apply the difference',
    'If no dimension parameter is passed it is assumed as dimension 0',
    'Dimension is zero-based in javascript and one-based in the parser',
    'Arrays must be \'rectangular\' meaning arrays like [1, 2]',
    'If something is passed as a matrix it will be returned as a matrix but other than that all matrices are converted to arrays'
  ],
  examples: [
    'A = [1, 2, 4, 7, 0]',
    'diff(A)',
    'diff(A, 1)',
    'B = [[1, 2], [3, 4]]',
    'diff(B)',
    'diff(B, 1)',
    'diff(B, 2)',
    'diff(B, bignumber(2))',
    'diff([[1, 2], matrix([3, 4])], 2)'
  ],
  seealso: ['subtract', 'partitionSelect']
}
