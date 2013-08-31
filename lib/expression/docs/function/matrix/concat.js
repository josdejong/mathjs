module.exports = {
  'name': 'concat',
  'category': 'Matrix',
  'syntax': [
    'concat(a, b, c, ...)',
    'concat(a, b, c, ..., dim)'
  ],
  'description': 'Concatenate matrices. By default, the matrices are concatenated by the first dimension. The dimension on which to concatenate can be provided as last argument.',
  'examples': [
    'a = [1, 2; 5, 6]',
    'b = [3, 4; 7, 8]',
    'concat(a, b)',
    '[a, b]',
    'concat(a, b, 2)',
    '[a; b]'
  ],
  'seealso': [
    'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'subset', 'transpose', 'zeros'
  ]
};
