/**
 * Check if a value is a BlockNode.
 *
 * Syntax:
 *
 *    math.isBlockNode(x)
 *
 * Examples:
 *
 *   math.isBlockNode(new math.BlockNode([])) // returns true
 *
 * See also:
 *
 *  isNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a BlockNode, false otherwise.
 *
 */
export const isBlockNodeDocs = {
  name: 'isBlockNode',
  category: 'Type Checks',
  syntax: ['isBlockNode(x)'],
  description: 'Test whether a value is a BlockNode.',
  examples: ['isBlockNode(new math.BlockNode([]))))'],
  seealso: ['isNode']
}
