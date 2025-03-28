/**
 * Test whether a value is of type number.
 *
 * Syntax:
 *
 *     math.isNumber(x)
 *
 * Examples:
 *
 *    math.isNumber(42)        // returns true
 *    math.isNumber("42")      // returns false
 *
 * See also:
 *
 *    isBigNumber, isBigInt, isFraction
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a number, false otherwise.
 */
export const isNumberDocs = {
  name: 'isNumber',
  category: 'Type Checks',
  syntax: ['isNumber(x)'],
  description: 'Check if a value is of type number.',
  examples: ['isNumber(42)', 'isNumber("42")'],
  seealso: ['isBigNumber', 'isBigInt', 'isFraction']
}
