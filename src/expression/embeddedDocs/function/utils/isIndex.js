/**
 * Test whether a value is an index.
 *
 * Syntax:
 *
 *     math.isIndex(x)
 *
 * Examples:
 *
 *    math.isIndex(math.index(1)) // returns true
 *
 * See also:
 *  index
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is an index, false otherwise.
 */
export const isIndexDocs = {
  name: 'isIndex',
  category: 'Type Checks',
  syntax: ['isIndex(x)'],
  description: 'Check if a value is an index.',
  examples: ['isIndex(math.index(1))'],
  seealso: ['index']
}
