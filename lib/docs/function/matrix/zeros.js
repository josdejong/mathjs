module.exports = {
  'name': 'zeros',
  'category': 'Matrix',
  'syntax': [
    'zeros(n)',
    'zeros(m, n)',
    'zeros(m, n, p, ...)',
    'zeros([m, n])',
    'zeros([m, n, p, ...])',
    'zeros'
  ],
  'description': 'Create a matrix containing zeros.',
  'examples': [
    'zeros(3)',
    'zeros(3, 5)',
    'a = [1, 2, 3; 4, 5, 6]',
    'zeros(size(a))'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'size', 'squeeze', 'subset', 'transpose'
  ]
};
