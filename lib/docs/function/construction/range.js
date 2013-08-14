module.exports = {
  'name': 'range',
  'category': 'Type',
  'syntax': [
    'start:end',
    'start:step:end',
    'range(start, end)',
    'range(start, end, step)',
    'range(string)'
  ],
  'description':
      'Create a range. Lower bound of the range is included, upper bound is excluded.',
  'examples': [
    '1:5',
    '3:-1:-4',
    'range(3, 7)',
    'range(0, 12, 2)',
    'range("4:11")',
    'a = [0, 1, 2, 3; 4, 5, 6]',
    'a(1:2)'
  ],
  'seealso': [
    'boolean', 'complex', 'matrix', 'number', 'string', 'unit'
  ]
};
