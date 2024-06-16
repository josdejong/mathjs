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
   * For each entry of the input, the callback is invoked with three arguments:
   * the value of the entry, the index at which that entry occurs, and the full
   * matrix/array being traversed. Note that because the matrix/array might be
   * multidimensional, the "index" argument is always an array of numbers giving
   * the index in each dimension. This is true even for vectors: the "index"
   * argument is an array of length 1, rather than simply a number.
   *
   * Syntax:
   *
   *    math.map(x, callback)
   *
   * Examples:
   *
   *    math.map([1, 2, 3], function(value) {
   *      return value * value
   *    })  // returns [1, 4, 9]
   *
   *    // The callback is normally called with three arguments:
   *    //    callback(value, index, Array)
   *    // If you want to call with only one argument, use:
   *    math.map([1, 2, 3], x => math.format(x)) // returns ['1', '2', '3']
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

    '...': _map
  })
  /** Map for multiple arrays or matrices */
  function _map (args) {
    const N = args.length - 1
    const arrays = args.slice(0, N)
    if (arrays.some(x => !isCollection(x))) {
      throw new Error('All arguments must be collections except for the last one which must be a callback function')
    }
    const callback = args[N]
    if (typeof callback !== 'function') {
      throw new Error('Last argument must be a callback function')
    }
    const newSize = broadcastSizes(...arrays.map(M => M.isMatrix ? M._size : arraySize(M)))
    const broadcastedArrays = arrays.map(M => M.isMatrix
      ? M.create(broadcastTo(M._data, newSize), M._datatype)
      : broadcastTo(M, newSize))
    const firstArray = broadcastedArrays[0]
    if (firstArray.isMatrix) {
      return firstArray.map(_multiCallback)
    } else {
      return _mapArray(firstArray, _multiCallback)
    }
    function _multiCallback (x, idx) {
      const values = [x, ...broadcastedArrays.slice(1).map(array => subset(array, index(...idx)))]
      return callback(...values, idx, ...broadcastedArrays)
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
