/**
 * Test whether a node is a constant node.
 *
 * Syntax:
 *
 *     math.isConstantNode(x)
 *
 * Examples:
 *
 *    math.isConstantNode(new math.ConstantNode(1)) // returns true
 *
 * See also:
 *  isNode
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is a constant node, false otherwise.
 */
export const isConstantNodeDocs = {
  name: 'isConstantNode',
  category: 'Expression Nodes',
  syntax: ['isConstantNode(x)'],
  description: 'Check if a node is a constant node.',
  examples: ['isConstantNode(new math.ConstantNode(1))'],
  seealso: ['isNode']
}
