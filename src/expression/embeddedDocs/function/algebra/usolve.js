export const usolveDocs = {
  name: 'usolve',
  category: 'Algebra',
  syntax: [
    'x=usolve(U, b)'
  ],
  description:
  'Finds one solution of the linear system U * x = b where U is an [n x n] upper triangular matrix and b is a [n] column vector.',
  examples: [
    'x=usolve(sparse([1, 1, 1, 1; 0, 1, 1, 1; 0, 0, 1, 1; 0, 0, 0, 1]), [1; 2; 3; 4])'
  ],
  seealso: [
    'usolveAll', 'lup', 'lusolve', 'lsolve', 'matrix', 'sparse'
  ]
}
