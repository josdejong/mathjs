/**
 * Test whether a value is a boolean.
 *
 * Syntax:
 *
 *     math.isBoolean(x)
 *
 * Examples:
 *
 *    math.isBoolean(true)
 *
 * See also:
 *  isNumber, isString, isArray, isObject
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a boolean, false otherwise.
 */
export const isBooleanDocs = {
  name: 'isBoolean',
  category: 'Type Checks',
  syntax: ['isBoolean(x)'],
  description: 'Check if a value is a boolean.',
  examples: ['isBoolean(true)', 'isBoolean(false)'],
  seealso: ['isNumber', 'isString', 'isArray', 'isObject']
}
