import { broadcastSizes } from '../../../utils/array.js'
import { factory } from '../../../utils/factory.js'
import { deepStrictEqual } from '../../../utils/object.js'

const name = 'broadcast'

const dependancies = []

export const createBroadcast = /* #__PURE__ */ factory(
  name, dependancies,
  () => {
    /**
   * Broadcasts two matrices, and return both in an array
   * It checks if it's possible with broadcasting rules
   *
   * @param {Matrix}   A      First Matrix
   * @param {Matrix}   B      Second Matrix
   *
   * @return {Matrix[]}      [ broadcastedA, broadcastedB ]
   */
    return function (A, B) {
      if (deepStrictEqual(A._size, B._size)) {
        // If matrices have the same size return them
        return [A, B]
      }

      // calculate the broadcasted size
      const broadcastedSize = broadcastSizes(A._size, B._size)

      // return the array with the two broadcasted matrices
      return [A.broadcastTo(broadcastedSize), B.broadcastTo(broadcastedSize)]
    }
  }
)
