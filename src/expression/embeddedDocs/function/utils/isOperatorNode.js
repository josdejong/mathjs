/**
 * Test whether a node is an operator node.
 *
 * Syntax:
 *
 *     math.isOperatorNode(x)
 *
 * Examples:
 *
 *    math.isOperatorNode()
 *
 * See also:
 *  OperatorNode
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is an operator node, false otherwise.
 */
export const isOperatorNodeDocs = {
  name: 'isOperatorNode',
  category: 'Expression Nodes',
  syntax: ['isOperatorNode(x)'],
  description: 'Check if a node is an operator node.',
  examples: ['isOperatorNode(/* example node */)'],
  seealso: ['OperatorNode']
}
