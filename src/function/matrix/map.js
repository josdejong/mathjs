import { optimizeCallback } from '../../utils/optimizeCallback.js'
import { arraySize, broadcastSizes, broadcastTo, get, deepMap } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'

const name = 'map'
const dependencies = ['typed']

export const createMap = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Create a new matrix or array with the results of a callback function executed on
   * each entry of a given matrix/array.
   *
   * For each entry of the input,
   *
   * the callback is invoked with 2N + 1 arguments:
   * the N values of the entry, the index at which that entry occurs, and the N full
   * broadcasted matrix/array being traversed where N is the number of matrices being traversed.
   * Note that because the matrix/array might be
   * multidimensional, the "index" argument is always an array of numbers giving
   * the index in each dimension. This is true even for vectors: the "index"
   * argument is an array of length 1, rather than simply a number.
   *
   * Syntax:
   *
   *    math.map(x, callback)
   *    math.map(x, y, ..., callback)
   *
   * Examples:
   *
   *    math.map([1, 2, 3], function(value) {
   *      return value * value
   *    })  // returns [1, 4, 9]
   *    math.map([1, 2], [3, 4], function(a, b) {
   *     return a + b
   *    })  // returns [4, 6]
   *
   *    // The callback is normally called with three arguments:
   *    //    callback(value, index, Array)
   *    // If you want to call with only one argument, use:
   *    math.map([1, 2, 3], x => math.format(x)) // returns ['1', '2', '3']
   *    // It can also be called with 2N + 1 arguments: for N arrays
   *    //    callback(value1, value2, index, BroadcastedArray1, BroadcastedArray2)
   *
   * See also:
   *
   *    filter, forEach, sort
   *
   * @param {Matrix | Array} x    The input to iterate on.
   * @param {Function} callback
   *     The function to call (as described above) on each entry of the input
   * @return {Matrix | array}
   *     Transformed map of x; always has the same type and shape as x
   */
  return typed(name, {
    'Array, function': _mapArray,

    'Matrix, function': function (x, callback) {
      return x.map(callback)
    },

    'Array|Matrix, Array|Matrix, ...Array|Matrix|function': (A, B, rest) =>
      _mapMultiple([A, B, ...rest.slice(0, rest.length - 1)], rest[rest.length - 1])
  })

  /**
 * Maps over multiple arrays or matrices.
 *
 * @param {Array<Array|Matrix>} Arrays - An array of arrays or matrices to map over.
 * @param {function} multiCallback - The callback function to apply to each element.
 * @throws {Error} If the last argument is not a callback function.
 * @returns {Array|Matrix} A new array or matrix with each element being the result of the callback function.
 *
 * @example
 * _mapMultiple([[1, 2, 3], [4, 5, 6]], (a, b) => a + b); // Returns [5, 7, 9]
 */
  function _mapMultiple (Arrays, multiCallback) {
    if (typeof multiCallback !== 'function') {
      throw new Error('Last argument must be a callback function')
    }

    const firstArrayIsMatrix = Arrays[0].isMatrix
    const sizes = Arrays.map(M => M.isMatrix ? M.size() : arraySize(M))
    const newSize = broadcastSizes(...sizes)
    const numberOfArrays = Arrays.length

    const _get = firstArrayIsMatrix
      ? (matrix, idx) => matrix.get(idx)
      : get

    const firstValues = Arrays.map((collection, i) => {
      const firstIndex = sizes[i].map(() => 0)
      return collection.isMatrix ? collection.get(firstIndex) : get(collection, firstIndex)
    }
    )

    const callbackArgCount = typed.isTypedFunction(multiCallback)
      ? _getTypedCallbackArgCount(multiCallback, firstValues, newSize.map(() => 0), Arrays)
      : _getCallbackArgCount(multiCallback, numberOfArrays)

    if (callbackArgCount < 2) {
      const callback = _getLimitedCallback(callbackArgCount, multiCallback, null)
      return mapMultiple(Arrays, callback)
    }

    const broadcastedArrays = firstArrayIsMatrix
      ? Arrays.map(M => M.isMatrix
        ? M.create(broadcastTo(M.toArray(), newSize), M.datatype())
        : Arrays[0].create(broadcastTo(M.valueOf(), newSize)))
      : Arrays.map(M => M.isMatrix
        ? broadcastTo(M.toArray(), newSize)
        : broadcastTo(M, newSize))

    const callback = _getLimitedCallback(callbackArgCount, multiCallback, broadcastedArrays)

    const broadcastedArraysCallback = (x, idx) =>
      callback(
        [x, ...broadcastedArrays.slice(1).map(array => _get(array, idx))],
        idx)

    if (firstArrayIsMatrix) {
      return broadcastedArrays[0].map(broadcastedArraysCallback)
    } else {
      return _mapArray(broadcastedArrays[0], broadcastedArraysCallback)
    }
  }

  function mapMultiple (collections, callback) {
    // collections can be matrices or arrays
    // callback must be a function of the form (collections, [index])
    const firstCollection = collections[0]
    const arrays = collections.map((collection) =>
      collection.isMatrix ? collection.valueOf() : collection
    )
    const sizes = collections.map((collection) =>
      collection.isMatrix ? collection.size() : arraySize(collection)
    )
    const finalSize = broadcastSizes(...sizes)
    // the offset means for each initial array, how much smaller is it than the final size
    const offsets = sizes.map((size) => finalSize.length - size.length)
    const maxDepth = finalSize.length - 1
    const callbackUsesIndex = callback.length > 1
    const index = callbackUsesIndex ? [] : null
    const resultsArray = iterate(arrays, 0)
    if (firstCollection.isMatrix) {
      const resultsMatrix = firstCollection.create()
      resultsMatrix._data = resultsArray
      resultsMatrix._size = finalSize
      return resultsMatrix
    } else {
      return resultsArray
    }

    function iterate (arrays, depth = 0) {
      // each array can have different sizes
      const currentDimensionSize = finalSize[depth]
      const result = Array(currentDimensionSize)
      if (depth < maxDepth) {
        for (let i = 0; i < currentDimensionSize; i++) {
          if (index) index[depth] = i
          // if there is an offset greater than the current dimension
          // pass the array, if the size of the array is 1 pass the first
          // element of the array
          result[i] = iterate(
            arrays.map((array, arrayIndex) =>
              offsets[arrayIndex] > depth
                ? array
                : array.length === 1
                  ? array[0]
                  : array[i]
            ),
            depth + 1
          )
        }
      } else {
        for (let i = 0; i < currentDimensionSize; i++) {
          if (index) index[depth] = i
          result[i] = callback(
            arrays.map((a) => (a.length === 1 ? a[0] : a[i])),
            index ? index.slice() : undefined
          )
        }
      }
      return result
    }
  }

  /**
    * Creates a limited callback based on the argument pattern.
    * @param {number} callbackArgCount - The argument pattern (0, 1, or 2)
    * @param {Function} multiCallback - The original callback function
    * @param {Array} broadcastedArrays - The broadcasted arrays (for case 2)
    * @returns {Function} The limited callback function
    */
  function _getLimitedCallback (callbackArgCount, multiCallback, broadcastedArrays) {
    switch (callbackArgCount) {
      case 0:
        return x => multiCallback(...x)
      case 1:
        return (x, idx) => multiCallback(...x, idx)
      case 2:
        return (x, idx) => multiCallback(...x, idx, ...broadcastedArrays)
    }
  }

  /**
     * Determines the argument pattern of a regular callback function.
     * @param {Function} callback - The callback function to analyze
     * @param {number} numberOfArrays - Number of arrays being processed
     * @returns {number} 0 = values only, 1 = values + index, 2 = values + index + arrays
     */
  function _getCallbackArgCount (callback, numberOfArrays) {
    const callbackStr = callback.toString()
    // Check if the callback function uses `arguments`
    if (/arguments/.test(callbackStr)) return 2

    // Extract the parameters of the callback function
    const paramsStr = callbackStr.match(/\(.*?\)/)
    // Check if the callback function uses rest parameters
    if (/\.\.\./.test(paramsStr)) return 2
    if (callback.length > numberOfArrays + 1) { return 2 }
    if (callback.length === numberOfArrays + 1) { return 1 }
    return 0
  }

  /**
 * Determines the argument pattern of a typed callback function.
 * @param {Function} callback - The typed callback function to analyze
 * @param {Array} values - Sample values for signature resolution
 * @param {Array} idx - Sample index for signature resolution
 * @param {Array} arrays - Sample arrays for signature resolution
 * @returns {number} 0 = values only, 1 = values + index, 2 = values + index + arrays
 */

  function _getTypedCallbackArgCount (callback, values, idx, arrays) {
    if (typed.resolve(callback, [...values, idx, ...arrays]) !== null) { return 2 }
    if (typed.resolve(callback, [...values, idx]) !== null) { return 1 }
    if (typed.resolve(callback, values) !== null) { return 0 }
    // this should never happen
    return 0
  }
  /**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
  function _mapArray (array, callback) {
    const fastCallback = optimizeCallback(callback, array, name)
    return deepMap(array, fastCallback.fn, fastCallback.isUnary)
  }
})
