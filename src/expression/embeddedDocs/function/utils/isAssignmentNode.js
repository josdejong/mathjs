/**
 * Check if a value is an AssignmentNode.
 *
 * Syntax:
 *
 *    math.isAssignmentNode(x)
 *
 * Examples:
 *
 *   math.isAssignmentNode(math.parse("a=3")) // returns true
 *
 * See also:
 *
 *  isNode
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is an AssignmentNode, false otherwise.
 */
export const isAssignmentNodeDocs = {
  name: 'isAssignmentNode',
  category: 'Type Checks',
  syntax: ['isAssignmentNode(x)'],
  description: 'Test whether a value is an AssignmentNode.',
  examples: ['isAssignmentNode(math.parse("a=3"))'],
  seealso: ['isNode']
}
