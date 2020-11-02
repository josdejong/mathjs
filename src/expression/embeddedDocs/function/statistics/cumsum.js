export const cumSumDocs = {
  name: 'cumsum',
  category: 'Statistics',
  syntax: [
    'cumsum(a, b, c, ...)',
    'cumsum(A)'
  ],
  description: 'Compute the cumulative sum of all values.',
  examples: [
    'cumsum(2, 3, 4, 1)',
    'cumsum([2, 3, 4, 1])',
    'cumsum([1, 2; 3, 4])',
    'cumsum([1, 2; 3, 4], 1)',
    'cumsum([1, 2; 3, 4], 2)'
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
