module.exports = {
  'name': 'linspace',
  'category': 'Type',
  'syntax': [
    'linspace(start, end)',
    'linspace(start, end, n)',
  ],
  'description':
      'Create an array of linearly n equally spaced points from start to end.',
  'examples': [
    'linspace(2, 200)',
    'linspace(0, 100, 11)',
    'linspace(10, 0, 5)',
  ],
  'seealso': [
    'logspace', 'range', 'zeros', 'ones'
  ]
}
