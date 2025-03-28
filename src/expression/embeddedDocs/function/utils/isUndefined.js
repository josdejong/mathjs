/**
 * Test whether a value is undefined.
 *
 * Syntax:
 *
 *     math.isUndefined(x)
 *
 * Examples:
 *
 *    math.isUndefined(undefined)
 *
 * See also:
 *  isNull
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is undefined, false otherwise.
 */
export const isUndefinedDocs = {
  name: 'isUndefined',
  category: 'Type Checks',
  syntax: ['isUndefined(x)'],
  description: 'Check if a value is undefined.',
  examples: ['isUndefined(undefined)'],
  seealso: ['isNull']
}
