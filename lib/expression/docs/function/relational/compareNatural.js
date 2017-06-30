module.exports = {
  'name': 'compareNatural',
  'category': 'Relational',
  'syntax': [
    'compareNatural(x, y)'
  ],
  'description': 'Compare two values of any type in a deterministic, natural way.',
  'examples': [
    'compare(2, 3)',
    'compare(3, 2)',
    'compare(2, 2)',
    'compare(5cm, 40mm)',
    'compare("2", "10")',
    'compare(2 + 3i, 2 + 4i)',
    'compare([1, 2, 4], [1, 2, 3])',
    'compare([1, 5], [1, 2, 3])',
    'compare([1, 2], [1, 2])',
    'compare({a: 2}, {a: 4})'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq', 'compare'
  ]
};
