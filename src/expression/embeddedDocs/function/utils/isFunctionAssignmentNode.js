/**
 * Test whether a node is a function assignment node.
 *
 * Syntax:
 *
 *     math.isFunctionAssignmentNode(x)
 *
 * Examples:
 *
 *    math.isFunctionAssignmentNode()
 *
 * See also:
 *  isFunction
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is a function assignment node, false otherwise.
 */
export const isFunctionAssignmentNodeDocs = {
  name: 'isFunctionAssignmentNode',
  category: 'Expression Nodes',
  syntax: ['isFunctionAssignmentNode(x)'],
  description: 'Check if a node is a function assignment node.',
  examples: ['isFunctionAssignmentNode(/* example node */)'],
  seealso: ['isFunction']
}
