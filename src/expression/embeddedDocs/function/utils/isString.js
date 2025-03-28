/**
 * Test whether a value is a String.
 *
 * Syntax:
 *
 *     math.isString(x)
 *
 * Examples:
 *
 *    math.isString('hello')  // returns true
 *    math.isString(123)      // returns false
 *
 * See also:
 *
 *    isNumber, isArray
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a string, false otherwise.
 *
 */
export const isStringDocs = {
  name: 'isString',
  category: 'Type Checks',
  syntax: ['isString(x)'],
  description: 'Test whether a value is a String.',
  examples: ['isString("hello")', 'isString(123)'],
  seealso: ['isNumber', 'isArray']
}
