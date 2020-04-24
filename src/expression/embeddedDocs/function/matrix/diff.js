export const diffDocs = {
  name: 'diff',
  category: 'Matrix',
  syntax: [
    'diff(arr)',
    'diff(arr, dim)'
  ],
  description: [
    'Create a new matrix or array with the difference of the passed matrix or array.',
    'Dim parameter is optional and used to indicant the dimension of the array/matrix to apply the diffrence (if not used it is assumed as 0)'
  ],
  examples: [
    'diff([1, 2, 4, 7, 0])',
    'diff([1, 2, 4, 7, 0], 0)',
    'diff(matrix([1, 2, 4, 7, 0]))'
  ],
  seealso: ['subtract']
}
