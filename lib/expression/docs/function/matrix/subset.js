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
    'e(1, 1:2) = [5, 6]',
    'e(2, :) = [7, 8]',
    'f = d * e',
    'f(2, 1)',
    'f(:, 1)'
  ],
  'seealso': [
    'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
  ]
};
