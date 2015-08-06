module.exports = {
  'name': 'mode',
  'category': 'Statistics',
  'syntax': [
    'mode(a, b, c, ...)',
    'mode(A)',
    'mode(A, a, b, B, c, ...)'
  ],
  'description': 'Computes the mode of all values as an array. In case mode being more than one, multiple values are returned in an array.',
  'examples': [
    'mode(5, 2, 7)',
    'mode([3, -1, 5, 7])'
  ],
  'seealso': [
    'max',
    'mean',
    'min',
    'median',
    'prod',
    'std',
    'sum',
    'var'
  ]
};
