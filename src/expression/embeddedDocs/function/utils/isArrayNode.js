/**
 * Check if a value is an ArrayNode
 *
 * Syntax:
 *
 *    math.isArrayNode(x)
 *
 * Examples:
 *
 *   math.isArrayNode(math.parse("[1,2,3]")) // returns true
 *
 * See also:
 *
 *  isNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is an ArrayNode, false otherwise.
 */

export const isArrayNodeDocs = {
  name: 'isArrayNode',
  category: 'Type Checks',
  syntax: ['isArrayNode(x)'],
  description: 'Test whether a value is an ArrayNode.',
  examples: ['isArrayNode(math.parse("[1,2,3]"))'],
  seealso: ['isNode']
}
