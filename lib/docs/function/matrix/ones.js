module.exports = {
  'name': 'ones',
  'category': 'Matrix',
  'syntax': [
    'ones(n)',
    'ones(m, n)',
    'ones(m, n, p, ...)',
    'ones([m, n])',
    'ones([m, n, p, ...])',
    'ones'
  ],
  'description': 'Create a matrix containing ones.',
  'examples': [
    'ones(3)',
    'ones(3, 5)',
    'ones([2,3]) * 4.5',
    'a = [1, 2, 3; 4, 5, 6]',
    'ones(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};
