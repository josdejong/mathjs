import { applyCallback } from '../../utils/applyCallback.js'
import { arraySize, broadcastSizes, broadcastTo } from '../../utils/array.js'
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
   *    math.map(x, y, callback)
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

    'Array|Matrix, Array|Matrix, ...Array|Matrix|function': (A, B, rest) => _map(A, B, ...rest)
  })

  /**
 * Maps over multiple arrays or matrices.
 *
 * @param  {...any} args - The arrays or matrices to map over, followed by a callback function.
 * @throws {Error} If any argument except the last one is not a collection.
 * @throws {Error} If the last argument is not a callback function.
 * @returns {Array|Matrix} A new array or matrix with each element being the result of the callback function.
 *
 * @example
 * _map([1, 2, 3], [4, 5, 6], (a, b) => a + b); // Returns [5, 7, 9]
 */
  function _map (...args) {
    const N = args.length - 1
    // const arrays = args.slice(0, N)
    const multiCallback = args[N]
    if (typeof multiCallback !== 'function') {
      throw new Error('Last argument must be a callback function')
    }
    //const firstArray = args[0]
    const firstArrayIsMatrix = args[0].isMatrix

    const newSize = broadcastSizes(...args.slice(0, N).map(M => M.isMatrix ? M.size() : arraySize(M)))

    const _get = firstArrayIsMatrix
      ? (matrix, idx) => matrix.get(idx)
      : (array, idx) => _getFromArray(array, idx)

    const broadcastedArrays = firstArrayIsMatrix
      ? args.slice(0, N).map(M => M.isMatrix
        ? M.create(broadcastTo(M.valueOf(), newSize), M.datatype())
        : args[0].create(broadcastTo(M.valueOf(), newSize)))
      : args.slice(0, N).map(M => M.isMatrix
        ? broadcastTo(M.valueOf(), newSize)
        : broadcastTo(M, newSize))

    // this is only to avoid mapping
    const bcArraysObject = createBCarraysObject(broadcastedArrays)

    function createBCarraysObject (broadcastedArrays) {
      const cb = (x, idx) => {
        return { v: [x, ...broadcastedArrays.slice(1).map(array => _get(array, idx))] }
      }
      if (broadcastedArrays[0].isMatrix) {
        return broadcastedArrays[0].map(cb)
      } else {
        return _mapArray(broadcastedArrays[0], cb)
      }
    }

    const callback = typed.isTypedFunction(multiCallback)
      ? (x, idx) => multiCallback(..._findArguments(multiCallback, x.v, idx, broadcastedArrays))
      : (x, idx) => multiCallback(...x.v, idx, ...broadcastedArrays)

    if (firstArrayIsMatrix) {
      return bcArraysObject.map(callback)
    } else {
      return _mapArray(bcArraysObject, callback)
    }

    function _findArguments (typedCallback, values, idx, arrays) {
      if (typed.resolve(typedCallback, [...values, idx, ...arrays]) !== null) {
        return [...values, idx, ...arrays]
      }
      if (typed.resolve(typedCallback, [...values, idx]) !== null) {
        return [...values, idx]
      }
      if (typed.resolve(typedCallback, values) !== null) {
        return values
      }
      // this should never happen
      return values
    }
  }
})

/**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
function _mapArray (array, callback) {
  return _recurse(array, [], array, callback)
}

/**
 * Recursive function to map a multi-dimensional array.
 *
 * @param {*} value - The current value being processed in the array.
 * @param {Array} index - The index of the current value being processed in the array.
 * @param {Array} array - The array being processed.
 * @param {Function} callback - Function that produces the element of the new Array, taking three arguments: the value of the element, the index of the element, and the Array being processed.
 * @returns {*} The new array with each element being the result of the callback function.
 */
function _recurse (value, index, array, callback) {
  if (Array.isArray(value)) {
    return value.map(function (child, i) {
      // we create a copy of the index array and append the new index value
      return _recurse(child, index.concat(i), array, callback)
    })
  } else {
    // invoke the callback function with the right number of arguments
    return applyCallback(callback, value, index, array, 'map')
  }
}

/**
 * Retrieves a single element from an array given an index.
 *
 * @param {Array} array - The array from which to retrieve the value.
 * @param {Array<number>} idx - An array of indices specifying the position of the desired element in each dimension.
 * @returns {*} - The value at the specified position in the collection.
 * @throws {Error} - Throws an error if the input is not a collection.
 *
 * @example
 * const arr = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
 * const idx = [1, 0, 1];
 * console.log(_getFromArray(arr, idx)); // 6
 */
function _getFromArray (array, idx) {
  return idx.reduce((acc, curr) => acc[curr], array)
}
