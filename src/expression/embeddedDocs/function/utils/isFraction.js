/**
 * Test whether a value is a Fraction.
 *
 * Syntax:
 *
 *     math.isFraction(x)
 *
 * Examples:
 *
 *    math.isFraction(math.fraction(1, 2))  // returns true
 *    math.isFraction(0.5)                  // returns false
 *
 * See also:
 *
 *    isNumber, isBigNumber, isBigInt
 */
export const isFractionDocs = {
  name: 'isFraction',
  category: 'Type Checks',
  syntax: ['isFraction(x)'],
  description: 'Test whether a value is a Fraction.',
  examples: ['isFraction(math.fraction(1, 2))', 'isFraction(0.5)'],
  seealso: ['isNumber', 'isBigNumber', 'isBigInt']
}
