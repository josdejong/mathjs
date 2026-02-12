/**
 * Test whether a value is a RangeNode.
 *
 * Syntax:
 *
 *     math.isRangeNode(x)
 *
 * Examples:
 *
 *    math.isRangeNode(math.parse("1:10"))      // returns true
 *
 * See also:
 *
 *    isFunctionNode, isOperatorNode, isNode, isSymbolNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a RangeNode, false otherwise.
 */
export const isRangeNodeDocs = {
  name: 'isRangeNode',
  category: 'Type Checks',
  syntax: ['isRangeNode(x)'],
  description: 'Test whether a value is a RangeNode.',
  examples: ['isRangeNode(math.parse("1:10"))'],
  seealso: ['isNode']
}
