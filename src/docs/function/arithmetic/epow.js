module.exports = {
  'name': 'epow',
  'category': 'Operators',
  'syntax': [
    'x .^ y',
    'epow(x, y)'
  ],
  'description':
      'Calculates the power of x to y element wise.',
  'examples': [
    'a = [1, 2, 3; 4, 5, 6]',
    'a .^ 2'
  ],
  'seealso': [
    'pow'
  ]
};
