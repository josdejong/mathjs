export const schurDocs = {
  name: 'schur',
  category: 'Matrix',
  syntax: [
    'schur(A)'
  ],
  description: 'Performs a real Schur decomposition of the real matrix A = UTU\'',
  examples: [
    'schur([[1, 2], [2, 1]])',
    'schur(A)'
  ],
  seealso: [
    'lyap', 'sylvester'
  ]
}
