/**
 * Test whether a value is a Chain (used for chained operations).
 *
 * Syntax:
 *
 *    math.isChain(x)
 *
 * Examples:
 *
 *   math.isChain(math.chain(3))
 *
 * See also:
 *  chain
 *
 * @param {*} x   Value to be tested
 * @return {boolean}  Returns true when `x` is a Chain, false otherwise.
 *
 */
export const isChainDocs = {
  name: 'isChain',
  category: 'Type Checks',
  syntax: ['isChain(x)'],
  description: 'Test whether a value is a Chain (used for chained operations).',
  examples: ['isChain(math.chain(3))', 'isChain(3)'],
  seealso: ['chain']
}
