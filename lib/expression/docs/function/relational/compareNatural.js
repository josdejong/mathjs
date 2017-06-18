module.exports = {
  'name': 'compareNatural',
  'category': 'Relational',
  'syntax': [
    'compareNatural(x, y)'
  ],
  'description':
      'Compare two values in a natural way. For numeric values, returns 1 if x is larger than y, -1 if x is smaller than y, and 0 if x and y are equal. Strings and complex numbers are compared in a natural way.',
  'examples': [
    'compare(2, 3)',
    'compare(3, 2)',
    'compare(2, 2)',
    'compare(5cm, 40mm)',
    'compare("2", "10")',
    'compare(2 + 3i, 2 + 4i)'
  ],
  'seealso': [
    'equal', 'unequal', 'smaller', 'smallerEq', 'largerEq', 'compare'
  ]
};
