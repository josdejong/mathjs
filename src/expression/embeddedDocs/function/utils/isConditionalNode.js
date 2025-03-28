/**
 * Check if the given value is a ConditionalNode.
 *
 * Syntax:
 *
 *   math.isConditionalNode(x)
 *
 * Examples:
 *
 *  math.isConditionalNode() // returns false
 *
 * See also:
 *
 * isNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a ConditionalNode, false otherwise.
 *
 */
export const isConditionalNodeDocs = {
  name: 'isConditionalNode',
  category: 'Type Checks',
  syntax: ['isConditionalNode(x)'],
  description: 'Test whether a value is a ConditionalNode.',
  examples: [
    'isConditionalNode(new math.ConditionalNode())',
    'isConditionalNode(new math.FunctionNode())'
  ],
  seealso: ['isNode']
}
