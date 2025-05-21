/**
 * Test whether a value is null.
 *
 * Syntax:
 *
 *     math.isNull(x)
 *
 * Examples:
 *
 *    math.isNull(null)
 *
 * See also:
 *  isUndefined
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is null, false otherwise.
 */
export const isNullDocs = {
  name: 'isNull',
  category: 'Type Checks',
  syntax: ['isNull(x)'],
  description: 'Check if a value is null.',
  examples: ['isNull(null)'],
  seealso: ['isUndefined']
}
