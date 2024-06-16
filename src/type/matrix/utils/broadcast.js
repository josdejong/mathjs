import { broadcastSizes, broadcastTo as _broadcastTo } from '../../../utils/array.js'
import { deepStrictEqual } from '../../../utils/object.js'

/**
* Broadcasts two matrices, and return both in an array
* It checks if it's possible with broadcasting rules
*
* @param {Matrix}   A      First Matrix
* @param {Matrix}   B      Second Matrix
*
* @return {Matrix[]}      [ broadcastedA, broadcastedB ]
*/

export function broadcast (A, B) {
  if (deepStrictEqual(A._size, B._size)) {
    // If matrices have the same size return them
    return [A, B]
  }

  // calculate the broadcasted sizes
  const newSize = broadcastSizes(A._size, B._size)

  // return the array with the two broadcasted matrices
  return [A, B].map((M) => broadcastTo(M, newSize))
}

/**
 * Broadcasts a matrix to the given size.
 *
 * @param {Matrix} M - The matrix to be broadcasted.
 * @param {number[]} size - The desired size of the broadcasted matrix.
 * @returns {Matrix} The broadcasted matrix.
 * @throws {Error} If the size parameter is not an array of numbers.
 */
export function broadcastTo (M, size) {
  // Broadcasts matrix A to the given size
  if (!Array.isArray(size)) {
    throw new Error('Size should be an array of numbers')
  }

  if (deepStrictEqual(M._size, size)) {
    return M
  }
  return M.create(_broadcastTo(M._data, size), M._datatype)
}
