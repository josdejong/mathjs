/**
 * Test whether a value is a function.
 *
 * Syntax:
 *
 *     math.isFunction(x)
 *
 * Examples:
 *
 *    math.isFunction(sin)
 *
 * See also:
 *
 *   isNode, isObject, isBoolean, isString, isArray
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a function, false otherwise.
 */
export const isFunctionDocs = {
  name: 'isFunction',
  category: 'Type Checks',
  syntax: ['isFunction(x)'],
  description: 'Check if a value is a function.',
  examples: ['isFunction(sin)'],
  seealso: ['isNode', 'isObject', 'isBoolean', 'isString', 'isArray']
}
