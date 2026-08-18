/**
 * Test whether a value is a BigNumber.
 *
 * Syntax:
 *
 *     math.isBigNumber(x)
 *
 * Examples:
 *
 *    math.isBigNumber(math.bignumber(42))  // returns true
 *    math.isBigNumber(42)                  // returns false
 *
 * See also:
 *
 *    isNumber, isFraction
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a BigNumber, false otherwise.
 */
export const isBigNumberDocs = {
  name: 'isBigNumber',
  category: 'Type Checks',
  syntax: ['isBigNumber(x)'],
  description: 'Test whether a value is a BigNumber.',
  examples: ['isBigNumber(math.bignumber(42))', 'isBigNumber(42)'],
  seealso: ['isNumber', 'isFraction']
}
