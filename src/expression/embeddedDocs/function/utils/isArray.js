/**
 * Test whether a value is an array.
 *
 * Syntax:
 *
 *     math.isArray(x)
 *
 * Examples:
 *
 *    math.isArray([1, 2, 3])  // returns true
 *    math.isArray('123')      // returns false
 *
 * See also:
 *
 *    isMatrix, isCollection
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is an array, false otherwise.
 */
export const isArrayDocs = {
  name: 'isArray',
  category: 'Type Checks',
  syntax: ['isArray(x)'],
  description: 'Test whether a value is an array.',
  examples: ['isArray([1, 2, 3])', 'isArray("123")'],
  seealso: ['isMatrix', 'isCollection']
}
