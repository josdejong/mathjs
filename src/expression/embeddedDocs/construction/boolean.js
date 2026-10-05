export const booleanDocs = {
  name: 'boolean',
  category: 'Construction',
  syntax: [
    'x',
    'boolean(x)'
  ],
  description:
      'Convert a string, number, BigNumber, Fraction, Complex, or Unit into a boolean.',
  examples: [
    'boolean(0)',
    'boolean(1)',
    'boolean(3)',
    'boolean("true")',
    'boolean("false")',
    'boolean([1, 0, 1, 1])'
  ],
  seealso: [
    'bignumber', 'complex', 'index', 'matrix', 'number', 'string', 'unit'
  ]
}
