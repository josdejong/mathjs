/**
 * Test whether a node is an index node.
 *
 * Syntax:
 *
 *     math.isIndexNode(x)
 *
 * Examples:
 *
 *    math.isIndexNode()
 *
 * See also:
 *  isIndex
 *
 * @param {*} x   Node to be tested
 * @return {boolean}  Returns true when `x` is an index node, false otherwise.
 */
export const isIndexNodeDocs = {
  name: 'isIndexNode',
  category: 'Expression Nodes',
  syntax: ['isIndexNode(x)'],
  description: 'Check if a node is an index node.',
  examples: ['isIndexNode(/* example node */)'],
  seealso: ['isIndex']
}
