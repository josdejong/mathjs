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
   *     math.broadcastSizes([1, 2, 3], [1, 2, 1])  // returns [1, 2, 3]
   *
   * See also:
   *
   *     size, reshape, squeeze, broadcastTo
   *
   * History:
   * 
   *     v15.1.1 created
   * @param {...(Array|Matrix)} x  One or more matrices or arrays
   * @return {Array} A vector with the broadcasted size.
   */
  return typed(name, {
    '...Array|Matrix': collections => {
      const areMatrices = collections.map(isMatrix)
      if (areMatrices.includes(true)) {
        const arrays = collections.map((c, i) => areMatrices[i] ? c.valueOf() : c)
        return broadcastSizes(...arrays)
      }
      return broadcastSizes(...collections)
    }
  })
})
