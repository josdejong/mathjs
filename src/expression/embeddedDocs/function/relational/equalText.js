export const equalTextDocs = {
  name: 'equalText',
  category: 'Relational',
  syntax: [
    'equalText(x, y)'
  ],
  description:
      'Check equality of two strings. Comparison is case sensitive. Returns true if the values are equal, and false if not.',
  examples: [
    'equalText("Hello", "Hello")',
    'equalText("a", "A")',
    'equal("2e3", "2000")',
    'equalText("2e3", "2000")',
    'equalText("B", ["A", "B", "C"])'
  ],
  seealso: [
    'compare', 'compareNatural', 'compareText', 'equal'
  ]
}
