export const compareTextDocs = {
  'name': 'compareText',
  'category': 'Relational',
  'syntax': [
    'compareText(x, y)'
  ],
  'description':
      'Compare two strings lexically. Comparison is case sensitive. ' +
      'Returns 1 when x > y, -1 when x < y, and 0 when x == y.',
  'examples': [
    'compareText("B", "A")',
    'compareText("A", "B")',
    'compareText("A", "A")',
    'compareText("2", "10")',
    'compare("2", "10")',
    'compare(2, 10)',
    'compareNatural("2", "10")',
    'compareText("B", ["A", "B", "C"])'
  ],
  'seealso': [
    'compare', 'compareNatural'
  ]
}
