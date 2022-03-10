export const fractionDocs = {
  name: 'fraction',
  category: 'Construction',
  syntax: [
    'fraction(num)',
    'fraction(matrix)',
    'fraction(num,den)',
    'fraction({n: num, d: den})'
  ],
  description:
    'Create a fraction from a number or from integer numerator and denominator.',
  examples: [
    'fraction(0.125)',
    'fraction(1, 3) + fraction(2, 5)',
    'fraction({n: 333, d: 53})',
    'fraction([sqrt(9), sqrt(10), sqrt(11)])'
  ],
  seealso: [
    'bignumber', 'boolean', 'complex', 'index', 'matrix', 'string', 'unit'
  ]
}
