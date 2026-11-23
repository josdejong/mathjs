export const usolveAllDocs = {
  name: 'usolveAll',
  category: 'Algebra',
  syntax: [
    'x=usolveAll(U, b)'
  ],
  description:
  'Finds all solutions of the linear system U * x = b where U is an [n x n] upper triangular matrix and b is a [n] column vector.',
  examples: [
    'x=usolveAll(sparse([1, 1, 1, 1; 0, 1, 1, 1; 0, 0, 1, 1; 0, 0, 0, 1]), [1; 2; 3; 4])'
  ],
  seealso: [
    'usolve', 'lup', 'lusolve', 'lsolve', 'matrix', 'sparse'
  ]
}
