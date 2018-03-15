module.exports = {
  'name': 'nthRoots',
  'category': 'Arithmetic',
  'syntax': [
    'nthRoots(A)',
    'nthRoots(A, root)'
  ],
  'description': (''
      + 'Calculate the nth roots of a value. '
      + 'An nth root of a positive real number A, '
      + 'is a positive real solution of the equation "x^root = A". '
      + 'This function returns an array of complex values.'
  ),
  'examples': [
    'nthRoots(1) == [ { re: 1, im: 0 }, { re: -1, im: 0 } ]',
    'nthRoots(1, 3) == [ { re: 1, im: 0 }, { re: -0.4999999999999998, im: 0.8660254037844387 }, { re: -0.5000000000000004, im: -0.8660254037844385 } ] ]'
  ],
  'seealso': [
    'sqrt',
    'pow',
    'nthRoot'
  ]
};
