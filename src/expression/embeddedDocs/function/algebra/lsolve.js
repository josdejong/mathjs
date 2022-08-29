export const lsolveDocs = {
  name: 'lsolve',
  category: 'Algebra',
  syntax: [
    'x=lsolve(L, b)'
  ],
  description:
  'Finds one solution of the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  examples: [
    'a = [-2, 3; 2, 1]',
    'b = [11, 9]',
    'x = lsolve(a, b)'
  ],
  seealso: [
    'lsolveAll', 'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
}
