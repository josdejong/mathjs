export const corrDocs = {
  name: 'corr',
  category: 'Statistics',
  syntax: [
    'corr(A,B)'
  ],
  description: 'Compute the correlation coefficient of a two list with values, For matrices, the matrix correlation coefficient is calculated.',
  examples: [
    'corr([2, 4, 6, 8],[1, 2, 3, 6])',
    'corr(matrix([[1, 2.2, 3, 4.8, 5], [1, 2, 3, 4, 5]]), matrix([[4, 5.3, 6.6, 7, 8], [1, 2, 3, 4, 5]]))'
  ],
  seealso: [
    'max',
    'mean',
    'min',
    'median',
    'min',
    'prod',
    'std',
    'sum'
  ]
}
