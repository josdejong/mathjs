/**
 * Test whether a value is a SymbolNode.
 *
 * Syntax:
 *
 *     math.isSymbolNode(x)
 *
 * Examples:
 *
 *    math.isSymbolNode(math.parse("x")) // returns true
 *
 * See also:
 *
 *   isNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a SymbolNode, false otherwise.
 */
export const isSymbolNodeDocs = {
  name: 'isSymbolNode',
  category: 'Type Checks',
  syntax: ['isSymbolNode(x)'],
  description: 'Test whether a value is a SymbolNode.',
  examples: ['isSymbolNode(math.parse("x"))'],
  seealso: ['isNode']
}
