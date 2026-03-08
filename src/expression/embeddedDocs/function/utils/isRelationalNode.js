/**
 * Test whether a value is a relationalNode.
 *
 * Syntax:
 *
 *     math.isRelationalNode(x)
 *
 * Examples:
 *
 *    math.isRelationalNode(new RelationalNode('<=', [new ConstantNode(2), new ConstantNode(3)]))
 *
 * See also:
 *
 *    isOperatorNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a RelationalNode, false otherwise.
 */
export const isRelationalNodeDocs = {
  name: 'isRelationalNode',
  category: 'Type Checks',
  syntax: ['isRelationalNode(x)'],
  description: 'Test whether a value is a RelationalNode.',
  examples: ['isRelationalNode(math.parse("2<3"))'],
  seealso: ['isOperatorNode']
}
