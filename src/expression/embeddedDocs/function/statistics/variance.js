export const varianceDocs = {
  name: 'variance',
  category: 'Statistics',
  syntax: [
    'variance(a, b, c, ...)',
    'variance(A)',
    'variance(A, normalization)'
  ],
  description: 'Compute the variance of all values. Optional parameter normalization can be "unbiased" (default), "uncorrected", or "biased".',
  examples: [
    'variance(2, 4, 6)',
    'variance([2, 4, 6, 8])',
    'variance([2, 4, 6, 8], "uncorrected")',
    'variance([2, 4, 6, 8], "biased")',
    'variance([1, 2, 3; 4, 5, 6])'
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
