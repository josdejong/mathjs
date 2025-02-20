import { optimizeCallback } from '../../utils/optimizeCallback.js'
import { arraySize, broadcastSizes, broadcastTo, get, recurse } from '../../utils/array.js'
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
   *        // It can also be called with 2N + 1 arguments: for N arrays
   *        //    callback(value1, value2, index, BroadcastedArray1, BroadcastedArray2)
   *
   * See also:
   *
   *    filter, forEach, sort
   *
   * History:
   *
   *    v0.13  Created
   *    v1.1   Clone the indices on each callback in case callback mutates
   *    v13.1  Support multiple inputs to the callback
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

    const newSize = broadcastSizes(...Arrays.map(M => M.isMatrix ? M.size() : arraySize(M)))

    const _get = firstArrayIsMatrix
      ? (matrix, idx) => matrix.get(idx)
      : get

    const broadcastedArrays = firstArrayIsMatrix
      ? Arrays.map(M => M.isMatrix
        ? M.create(broadcastTo(M.toArray(), newSize), M.datatype())
        : Arrays[0].create(broadcastTo(M.valueOf(), newSize)))
      : Arrays.map(M => M.isMatrix
        ? broadcastTo(M.toArray(), newSize)
        : broadcastTo(M, newSize))

    let callback

    if (typed.isTypedFunction(multiCallback)) {
      const firstIndex = newSize.map(() => 0)
      const firstValues = broadcastedArrays.map(array => _get(array, firstIndex))
      const callbackCase = _getTypedCallbackCase(multiCallback, firstValues, firstIndex, broadcastedArrays)
      callback = _getLimitedCallback(callbackCase)
    } else {
      const numberOfArrays = Arrays.length
      const callbackCase = _getCallbackCase(multiCallback, numberOfArrays)
      callback = _getLimitedCallback(callbackCase)
    }

    const broadcastedArraysCallback = (x, idx) =>
      callback(
        [x, ...broadcastedArrays.slice(1).map(Array => _get(Array, idx))],
        idx)

    if (firstArrayIsMatrix) {
      return broadcastedArrays[0].map(broadcastedArraysCallback)
    } else {
      return _mapArray(broadcastedArrays[0], broadcastedArraysCallback)
    }

    function _getLimitedCallback (callbackCase) {
      switch (callbackCase) {
        case 0:
          return x => multiCallback(...x)
        case 1:
          return (x, idx) => multiCallback(...x, idx)
        case 2:
          return (x, idx) => multiCallback(...x, idx, ...broadcastedArrays)
      }
    }

    function _getCallbackCase (callback, numberOfArrays) {
      if (callback.length > numberOfArrays + 1) { return 2 }
      if (callback.length === numberOfArrays + 1) { return 1 }
      return 0
    }

    function _getTypedCallbackCase (callback, values, idx, arrays) {
      if (typed.resolve(callback, [...values, idx, ...arrays]) !== null) { return 2 }
      if (typed.resolve(callback, [...values, idx]) !== null) { return 1 }
      if (typed.resolve(callback, values) !== null) { return 0 }
      // this should never happen
      return 0
    }
  }
  /**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
  function _mapArray (array, callback) {
    return recurse(array, [], array, optimizeCallback(callback, array, name))
  }
})
