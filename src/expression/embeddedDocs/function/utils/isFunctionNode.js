/**
 * Test whether a node is a function node.
 *
 * Syntax:
 *
 *     math.isFunctionNode(x)
 *
 * Examples:
 *
 *    math.isFunctionNode()
 *
 * See also:
 *  isFunction, isFunctionAssignmentNode
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is a function node, false otherwise.
 */
export const isFunctionNodeDocs = {
  name: 'isFunctionNode',
  category: 'Expression Nodes',
  syntax: ['isFunctionNode(x)'],
  description: 'Check if a node is a function node.',
  examples: ['isFunctionNode(n)'],
  seealso: ['isFunction', 'isFunctionAssignmentNode']
}
