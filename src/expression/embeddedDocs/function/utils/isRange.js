/**
 * Test whether a value is a range.
 *
 * Syntax:
 *
 *     math.isRange(x)
 *
 * Examples:
 *
 *    math.isRange(new math.Range(1, 10)) // returns true
 *
 * See also:
 *  Range
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a range, false otherwise.
 */
export const isRangeDocs = {
  name: 'isRange',
  category: 'Type Checks',
  syntax: ['isRange(x)'],
  description: 'Check if a value is a range.',
  examples: ['isRange(new math.Range(1, 10))'],
  seealso: ['Range']
}
