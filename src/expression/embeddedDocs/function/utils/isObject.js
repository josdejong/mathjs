/**
 * Test whether a value is an object.
 *
 * Syntax:
 *
 *     math.isObject(x)
 *
 * Examples:
 *
 *    math.isObject({ a: 1 })
 *
 * See also:
 *  isArray
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is an object, false otherwise.
 */
export const isObjectDocs = {
  name: 'isObject',
  category: 'Type Checks',
  syntax: ['isObject(x)'],
  description: 'Check if a value is an object.',
  examples: ['isObject({ a: 1 })'],
  seealso: ['isArray']
}
