export const lsolveAllDocs = {
  name: 'lsolveAll',
  category: 'Algebra',
  syntax: [
    'x=lsolveAll(L, b)'
  ],
  description:
  'Finds all solutions of the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  examples: [
    'a = [-2, 3; 2, 1]',
    'b = [11, 9]',
    'x = lsolve(a, b)'
  ],
  seealso: [
    'lsolve', 'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
}
