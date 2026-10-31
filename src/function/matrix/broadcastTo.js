import { broadcastTo } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'broadcastTo'
const dependencies = ['typed']

export const createBroadcastTo = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
     * Broadcast an array to a specified size.
     * The broadcasting rules can be found in [Matrices#Broadcasting](./datatype/matrices#Broadcasting).
  *
     * Syntax:
     *
     *     math.broadcastTo(x, size)
     *
     * Examples:
     *
     *     math.broadcastTo([1, 2, 3], [2, 3])          // returns [[1, 2, 3], [1, 2, 3]]
     *     math.broadcastTo([2, 3], [2, 2])             // returns [[2, 3], [2, 3]]
     *
     * See also:
     *
     *     size, reshape, squeeze, broadcastSizes
     *
     * History:
     *
     *     v15.1.1 created
     *
     * @param {Array|Matrix} x  The array or matrix to broadcast
     * @param {Array|Matrix} size  The target size
     * @return {Array} The broadcasted array
     */
  return typed(name, {
    'Array, Array': broadcastTo,
    'Array, Matrix': (arr, size) => broadcastTo(arr, size.valueOf()),
    'Matrix, Array|Matrix': function (M, size) {
      return M.create({
        data: broadcastTo(M.valueOf(), size.valueOf()),
        size: size.valueOf()
      },
      M.datatype())
    }
  })
})
