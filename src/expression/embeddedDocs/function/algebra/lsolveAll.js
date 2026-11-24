export const lsolveAllDocs = {
  name: 'lsolveAll',
  category: 'Algebra',
  syntax: [
    'x=lsolveAll(L, b)'
  ],
  description:
  'Finds all solutions of the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  examples: [
    'L = [-2, 0; 2, 1]',
    'b = [-4; 9]',
    'x = lsolveAll(L, b)'
  ],
  seealso: [
    'lsolve', 'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
}
