module.exports = {
  'name': 'lusolve',
  'category': 'Algebra',
  'syntax': [
    'x=lusolve(A, b)'
  ],
  'description':
  'Solves the linear system A * x = b where A is an [n x n] matrix and b is a [n] column vector.',
  'examples': [
    'x=lusolve([1,2,3;4,0,6;-7,8,9], [1;2;-3])',
  ],
  'seealso': [
    'lup', 'lsolve', 'usolve', 'matrix', 'sparse'
  ]
};
