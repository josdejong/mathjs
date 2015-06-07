module.exports = {
  'name': 'randInt',
  'category': 'Probability',
  'syntax': [
    'randInt(max)',
    'randInt(min, max)',
    'randInt(size)',
    'randInt(size, max)',
    'randInt(size, min, max)'
  ],
  'description':
      'Return a random integer number',
  'examples': [
    'randInt(10, 20)',
    'randInt([2, 3], 10)'
  ],
  'seealso': ['pickRandom', 'random']
};