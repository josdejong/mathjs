module.exports = {
  'name': 'lsolve',
  'category': 'Algebra',
  'syntax': [
    'x=lsolve(L, b)'
  ],
  'description':
  'Solves the linear system L * x = b where L is an [n x n] lower triangular matrix and b is a [n] column vector.',
  'examples': [
    'x=lsolve(sparse([1, 0, 0, 0; 1, 1, 0, 0; 1, 1, 1, 0; 1, 1, 1, 1]), [1; 2; 3; 4])',
  ],
  'seealso': [
    'lup', 'lusolve', 'usolve', 'matrix', 'sparse'
  ]
};
