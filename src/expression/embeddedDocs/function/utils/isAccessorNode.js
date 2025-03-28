/**
 * Test whether a node is a AccessorNode.
 *
 * Syntax:
 *
 *     math.isAccessorNode(x)
 *
 * Examples:
 *
 *    math.isAccessorNode()
 *
 * See also:
 *  isNode
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is a accessor node, false otherwise.
 */
export const isAccessorNodeDocs = {
  name: 'isAccessorNode',
  category: 'Type Checks',
  syntax: ['isAccessorNode(x)'],
  description: 'Test whether a value is an AccessorNode.',
  examples: ['isAccessorNode(math.parse("a[0]"))'],
  seealso: ['isNode']
}
