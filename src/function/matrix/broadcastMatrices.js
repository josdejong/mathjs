import { broadcastArrays } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isMatrix } from '../../utils/is.js'

const name = 'broadcastMatrices'
const dependencies = ['typed']

export const createBroadcastMatrices = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Broadcast multiple matrices together.
   * Return and array of matrices with the broadcasted sizes.
   *
   * Syntax:
   *
  *     math.broadcastMatrices(x, y)
  *     math.broadcastMatrices(x, y, ...)
   *
   * Examples:
   *
   *     math.broadcastMatrices([1, 2], [[3], [4]])  // returns [[[1, 2], [1, 2]], [[3, 3], [4, 4]]]
  *     math.broadcastMatrices([2, 3])               // returns [[2, 3]]
  *     math.broadcastMatrices([2, 3], [3, 1])       // returns [[2, 3], [3, 1]]
   *
   * See also:
   *
   *     size, reshape, broadcastSizes, broadcastTo
   *
   * @param {...(Array|Matrix)} x  One or more matrices or arrays
   * @return {Array[Array|Matrix]} An array of matrices with the broadcasted sizes.
   */
  return typed(name, {
    '...Array': broadcastArrays,
    '...Matrix': matrices => broadcastArrays(...matrices.map(m => m.toArray())),
    '...Array|Matrix': collections => broadcastArrays(...collections.map(c => isMatrix(c) ? c.toArray() : c))
  })
})
