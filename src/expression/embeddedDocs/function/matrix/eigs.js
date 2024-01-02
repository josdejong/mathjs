export const eigsDocs = {
  name: 'eigs',
  category: 'Matrix',
  syntax: [
    'eigs(x)'
  ],
  description: 'Calculate the eigenvalues and optionally eigenvectors of a square matrix',
  examples: [
    'eigs([[5, 2.3], [2.3, 1]])',
    'eigs([[1, 2, 3], [4, 5, 6], [7, 8, 9]], { precision: 1e-6, eigenvectors: false })'
  ],
  seealso: [
    'inv'
  ]
}
