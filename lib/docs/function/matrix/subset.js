module.exports = {
  'name': 'subset',
  'category': 'Matrix',
  'syntax': [
    'value(index)',
    'value(index) = replacement',
    'subset(value, [index])',
    'subset(value, [index], replacement)'
  ],
  'description': 'Get or set a subset of a matrix or string. ' +
      'Indexes are zero-based. ' +
      'The lower bound of ranges is included, and the upper bound is excluded.',
  'examples': [
    'd = [1, 2; 3, 4]',
    'e = []',
    'e[0, 0:2] = [5, 6]',
    'e[1, :] = [7, 8]',
    'f = d * e',
    'f[1, 0]',
    'f[:, 0]'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
  ]
};
