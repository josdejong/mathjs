export const svdDocs = {
  name: 'svd',
  category: 'Matrix',
  syntax: [
    'svd(x)'
  ],
  description: 'Compute the Singular Value Decomposition (SVD) of a matrix or value',
  examples: [
    'svd([[1, 2], [3, 4]])',
    'svd([[1, 0], [0, 1], [0, 1]])',
    'svd(4)'
  ],
  seealso: [
    'inv',
    'pinv'
  ]
}
