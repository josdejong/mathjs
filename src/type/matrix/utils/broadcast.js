import { broadcastSizes, broadcastTo } from '../../../utils/array.js'
import { deepStrictEqual } from '../../../utils/object.js'

/**
* Broadcasts two matrices, and return both in an array
* It checks if it's possible with broadcasting rules
*
* @param {Matrix|Array}   A      First Matrix
* @param {Matrix|Array}   B      Second Matrix
*
* @return {Matrix|Array}      [ broadcastedA, broadcastedB ]
*/

export function broadcastMatrices (A, B) {
  if (deepStrictEqual(A.size(), B.size())) {
    // If matrices have the same size return them as such
    return [A, B]
  }

  // calculate the broadcasted sizes
  const newSize = broadcastSizes(A.size(), B.size())

  // return the array with the two broadcasted matrices
  return [A, B].map(M => _broadcastTo(M, newSize))
}

/**
 * Broadcasts a matrix to the given size.
 *
 * @param {Matrix} M - The matrix to be broadcasted.
 * @param {number[]} size - The desired size of the broadcasted matrix.
 * @returns {Matrix} The broadcasted matrix.
 * @throws {Error} If the size parameter is not an array of numbers.
 */
function _broadcastTo (M, size) {
  if (deepStrictEqual(M.size(), size)) {
    return M
  }
  return M.create(broadcastTo(M.valueOf(), size), M.datatype())
}

/**
 * Recursively maps two arrays assuming they are rectangular, if a size is provided it's assumed
 * to be validated already. No index is provided to the callback.
 *
 * @param {Array} array1   First array to broadcast
 * @param {Array} array2   Second array to broadcast
 * @param {number[]} [size1]   Size of the first array
 * @param {number[]} [size2]   Size of the second array
 * @param {function} callback  The callback function to apply to each pair of elements
 * @returns {Array} The resulting array after applying the callback to each pair of elements
 */
export function broadcast (array1, array2, size1, size2, callback) {
  if (![array1, array2, size1, size2].every(Array.isArray)) {
    throw new Error('Arrays and their sizes must be provided')
  }
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function')
  }

  if (size1.length <= 0 || size2.length <= 0) {
    return { data: [], size: [0] }
  }

  const finalSize = broadcastSizes(size1, size2)
  const offset1 = finalSize.length - size1.length
  const offset2 = finalSize.length - size2.length
  const maxDepth = finalSize.length - 1
  return { data: iterate(array1, array2), size: finalSize }

  function iterate (array1, array2, depth = 0) {
    const currentDimensionSize = finalSize[depth]
    const result = Array(currentDimensionSize)
    if (depth < maxDepth) {
      for (let i = 0; i < currentDimensionSize; i++) {
        const nextArray1 = offset1 > depth
          ? array1
          : (array1.length === 1 ? array1[0] : array1[i])
        const nextArray2 = offset2 > depth
          ? array2
          : (array2.length === 1 ? array2[0] : array2[i])
        result[i] = iterate(
          nextArray1,
          nextArray2,
          depth + 1
        )
      }
    } else {
      for (let i = 0; i < currentDimensionSize; i++) {
        result[i] = callback(
          array1.length === 1 ? array1[0] : array1[i],
          array2.length === 1 ? array2[0] : array2[i]
        )
      }
    }

    return result
  }
}
