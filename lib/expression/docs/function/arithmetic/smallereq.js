module.exports = {
  'name': 'smallereq',
  'category': 'Operators',
  'syntax': [
    'x <= y',
    'smallereq(x, y)'
  ],
  'description':
      'Check if value x is smaller or equal to value y. Returns 1 if x is smaller than y, and 0 if not.',
  'examples': [
    '2 < 1+1',
    '2 <= 1+1',
    'a = 3.2',
    'b = 6-2.8',
    '(a < b)'
  ],
  'seealso': [
    'equal', 'unequal', 'larger', 'smaller', 'largereq'
  ]
};
