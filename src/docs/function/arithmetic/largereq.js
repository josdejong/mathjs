module.exports = {
  'name': 'largereq',
  'category': 'Operators',
  'syntax': [
    'x >= y',
    'largereq(x, y)'
  ],
  'description':
      'Check if value x is larger or equal to y. Returns 1 if x is larger or equal to y, and 0 if not.',
  'examples': [
    '2 > 1+1',
    '2 >= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a > b)'
  ],
  'seealso': [
    'equal', 'unequal', 'smallereq', 'smaller', 'largereq'
  ]
};
