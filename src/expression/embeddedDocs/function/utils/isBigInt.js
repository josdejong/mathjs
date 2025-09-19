/**
 * Test whether a value is a BigInt.
 *
 * Syntax:
 *
 *     math.isBigInt(x)
 *
 * Examples:
 *
 *    math.isBigInt(10n)    // returns true
 *    math.isBigInt(42)     // returns false
 *
 * See also:
 *
 *    isNumber, isBigNumber
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a BigInt, false otherwise.
 */
export const isBigIntDocs = {
  name: 'isBigInt',
  category: 'Type Checks',
  syntax: ['isBigInt(x)'],
  description: 'Test whether a value is a BigInt.',
  examples: ['isBigInt(10n)', 'isBigInt(42)'],
  seealso: ['isNumber', 'isBigNumber']
}
