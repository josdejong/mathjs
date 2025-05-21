/**
 * Test whether a node is an object node.
 *
 * Syntax:
 *
 *     math.isObjectNode(x)
 *
 * Examples:
 *
 *    math.isObjectNode()
 *
 * See also:
 *  ObjectNode
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is an object node, false otherwise.
 */
export const isObjectNodeDocs = {
  name: 'isObjectNode',
  category: 'Expression Nodes',
  syntax: ['isObjectNode(x)'],
  description: 'Check if a node is an object node.',
  examples: ['isObjectNode(/* example node */)'],
  seealso: ['ObjectNode']
}
