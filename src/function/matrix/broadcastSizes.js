import { broadcastSizes } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isMatrix } from '../../utils/is.js'

const name = 'broadcastSizes'
const dependencies = ['typed']

export const createBroadcastSizes = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the broadcasted size of one or more matrices or arrays.
   * Always returns an Array containing numbers.
   *
   * Syntax:
   *
   *     math.broadcastSizes(x, y)
   *     math.broadcastSizes(x, y, ...)
   *
   * Examples:
   *
   *     math.broadcastSizes([2, 3])          // returns [2, 3]
   *     math.broadcastSizes([2, 3], [3])     // returns [2, 3]
   *     math.broadcastSizes([1, 2, 3], [[1, 2, 3]])  // returns [[1, 2, 3]]
   *
   * See also:
   *
   *     size, reshape, squeeze, broadcastTo
   *
   * @param {...(Array|Matrix)} x  One or more matrices or arrays
   * @return {Array} A vector with the broadcasted size.
   */
  return typed(name, {
    '...Array': broadcastSizes,
    '...Matrix': matrices => broadcastSizes(...matrices.map(m => m.toArray())),
    '...Array|Matrix': collections => broadcastSizes(...collections.map(c => isMatrix(c) ? c.toArray() : c))
  })
})
