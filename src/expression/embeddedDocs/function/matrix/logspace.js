module.exports = {
  'name': 'logspace',
  'category': 'Type',
  'syntax': [
    'logspace(start, end)',
    'logspace(start, end, n)',
  ],
  'description':
      'Create an array of logarithmically n equally spaced points from 10^start to 10^end.',
  'examples': [
    'logspace(-1,2)',
    'logspace(-1,2,4)',
    'logspace(-1,math.pi,3)',
  ],
  'seealso': [
    'linspace', 'range', 'zeros', 'ones'
  ]
}
