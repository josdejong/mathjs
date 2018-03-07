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
      + 'This function returns a list of complex values in polar form.'
  ),
  'examples': [
    'nthRoots(1) == [ { r: 1, phi: 0 }, { r: 1, phi: 3.141592653589793 } ]',
    'nthRoots(1, 3) == [ { r: 1, phi: 0 }, { r: 1, phi: 2.0943951023931953 }, { r: 1, phi: 4.1887902047863905 } ]'
  ],
  'seealso': [
    'sqrt',
    'pow',
    'nthRoot'
  ]
};
