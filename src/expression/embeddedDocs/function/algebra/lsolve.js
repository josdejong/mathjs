export const lsolveDocs = {
  name: 'lsolve',
  category: 'Algebra',
  syntax: [
    'x=lsolve(L, b)'
  ],
  description:
  'Finds one solution of the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  examples: [
    'L = [-2, 0; 2, 1]',
    'b = [-4; 9]',
    'x = lsolve(L, b)'
  ],
  seealso: [
    'lsolveAll', 'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
}
