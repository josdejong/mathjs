/**
 * Test whether a value is a Collection.
 *
 * Syntax:
 *
 *     math.isCollection(x)
 *
 * Examples:
 *
 *    math.isCollection([1, 2, 3])  // returns true
 *    math.isCollection(42)         // returns false
 *
 * See also:
 *
 *    isArray, isMatrix
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a Collection, false otherwise.
 */
export const isCollectionDocs = {
  name: 'isCollection',
  category: 'Type Checks',
  syntax: ['isCollection(x)'],
  description: 'Test whether a value is a Collection.',
  examples: ['isCollection([1,2,3])', 'isCollection(42)'],
  seealso: ['isArray', 'isMatrix']
}
