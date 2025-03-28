/**
 * Test whether a value is a Date.
 *
 * Syntax:
 *
 *     math.isDate(x)
 *
 * Examples:
 *
 *    math.isDate(new Date())
 *
 * See also:
 *  isNumber
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a Date, false otherwise.
 */
export const isDateDocs = {
  name: 'isDate',
  category: 'Type Checks',
  syntax: ['isDate(x)'],
  description: 'Check if a value is a Date object.',
  examples: ['isDate(new Date())'],
  seealso: ['isNumber']
}
