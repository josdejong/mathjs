export const sumDocs = {
  name: 'sum',
  category: 'Statistics',
  syntax: [
    'sum(a, b, c, ...)',
    'sum(A)',
    'sum(A, dimension)'
  ],
  description: 'Compute the sum of all values.',
  examples: [
    'sum(2, 3, 4, 1)',
    'sum([2, 3, 4, 1])',
    'sum([2, 5; 4, 3])'
  ],
  seealso: [
    'max',
    'mean',
    'median',
    'min',
    'prod',
    'std',
    'sum',
    'variance'
  ]
}
