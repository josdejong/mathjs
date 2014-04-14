module.exports = {
  'name': 'norm',
  'category': 'Arithmetic',
  'syntax': [
    'norm(x)',
    'norm(x, p)'
  ],
  'description': 'Calculate the norm of a number, vector or matrix.',
  'examples': [
    'norm([[1, 2], [3, 4]])',
    'norm([[1, 2, 3, 4]], 3.5)',
    'norm(-4.2)',
    'norm([[1, 2], [-3, -4]], \'fro\')'
  ]
};
