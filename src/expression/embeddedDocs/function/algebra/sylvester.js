export const sylvesterDocs = {
  name: 'sylvester',
  category: 'Algebra',
  syntax: [
    'sylvester(A,B,C)'
  ],
  description: 'Solves the real-valued Sylvester equation AX+XB=C for X',
  examples: [
    'sylvester([[-1, -2], [1, 1]], [[-2, 1], [-1, 2]], [[-3, 2], [3, 0]])',
    'A = [[-1, -2], [1, 1]]; B = [[2, -1], [1, -2]]; C = [[-3, 2], [3, 0]]',
    'sylvester(A, B, C)'
  ],
  seealso: [
    'schur', 'lyap'
  ]
}
