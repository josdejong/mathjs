export const quantileSeqDocs = {
  name: 'quantileSeq',
  category: 'Statistics',
  syntax: [
    'quantileSeq(A, prob[, sorted][, dimension])',
    'quantileSeq(A, [prob1, prob2, ...][, sorted][, dimension])',
    'quantileSeq(A, N[, sorted][, dimension])'
  ],
  description: 'Compute the prob order quantile of a matrix or a list with values. Quantiles are computed by linear interpolation between adjacent values in the sorted sequence. Supported types of sequence values are: Number, BigNumber, Unit Supported types of probability are: Number, BigNumber. \n\nIn case of a (multi dimensional) array or matrix, the prob order quantile of all elements will be calculated by default. Specify a dimension to calculate quantiles along that dimension instead.',
  examples: [
    'quantileSeq([3, -1, 5, 7], 0.5)',
    'quantileSeq([3, -1, 5, 7], [1/3, 2/3])',
    'quantileSeq([3, -1, 5, 7], 2)',
    'quantileSeq([-1, 3, 5, 7], 0.5, true)',
    'quantileSeq([1, 2; 3, 4], 0.25, 1)'
  ],
  seealso: [
    'mean',
    'median',
    'min',
    'max',
    'prod',
    'std',
    'sum',
    'variance'
  ]
}
