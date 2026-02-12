/**
 * Test whether a value is a node.
 *
 * Syntax:
 *
 *     math.isNode(x)
 *
 * Examples:
 *
 *    math.isNode()
 *
 * See also:
 *  Node
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a node, false otherwise.
 */
export const isNodeDocs = {
  name: 'isNode',
  category: 'Expression Nodes',
  syntax: ['isNode(x)'],
  description: 'Check if a value is a node.',
  examples: ['isNode(/* example node */)'],
  seealso: ['Node']
}
