import { applyCallback } from '../../utils/applyCallback.js'
import { arraySize, broadcastSizes, broadcastTo } from '../../utils/array.js'
import { factory } from '../../utils/factory.js'
import { isCollection } from '../../utils/is.js'

const name = 'map'
const dependencies = ['typed', 'subset', 'index']

export const createMap = /* #__PURE__ */ factory(name, dependencies, ({ typed, subset, index }) => {
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
    const arrays = args.slice(0, N)
    if (!arrays.every(x => isCollection(x))) {
      throw new Error('All arguments must be collections except for the last one which must be a callback function')
    }
    const multiCallback = args[N]
    if (typeof multiCallback !== 'function') {
      throw new Error('Last argument must be a callback function')
    }

    // skip multiple map logic
    if (N === 1) {
      if (multiCallback.isMatrix) {
        return arrays[0].map(multiCallback)
      } else {
        return _mapArray(arrays[0], multiCallback)
      }
    }

    const newSize = broadcastSizes(...arrays.map(M => M.isMatrix ? M._size : arraySize(M)))
    const broadcastedArrays = arrays.map(M => M.isMatrix
      ? M.create(broadcastTo(M.valueOf(), newSize), M.datatype())
      : broadcastTo(M, newSize))
    const firstArray = broadcastedArrays[0]
    if (firstArray.isMatrix) {
      return firstArray.map((x, idx) => _createCallback(x, idx, broadcastedArrays, multiCallback))
    } else {
      return _mapArray(firstArray, (x, idx) => _createCallback(x, idx, broadcastedArrays, multiCallback))
    }
    /** creates a callback function from a multiple callback function */
    function _createCallback (x, idx, broadcastedArrays, multiCallback) {
      const values = [x, ...broadcastedArrays.slice(1).map(array => subset(array, index(...idx)))]
      if (typed.isTypedFunction(multiCallback)) {
        const foundArguments = _findArguments(multiCallback, values, idx, broadcastedArrays)
        return multiCallback(...foundArguments)
      } else {
        return multiCallback(...values, idx, ...broadcastedArrays)
      }
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
