import { maxArgumentCount } from '../../utils/function'
import { forEach as forEachArray } from '../../utils/array'
import { factory } from '../../utils/factory'

const name = 'forEach'
const dependencies = ['typed']

export const createForEach = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Iterate over all elements of a matrix/array, and executes the given callback function.
   *
   * Syntax:
   *
   *    math.forEach(x, callback)
   *
   * Examples:
   *
   *    math.forEach([1, 2, 3], function(value) {
   *      console.log(value)
   *    })
   *    // outputs 1, 2, 3
   *
   * See also:
   *
   *    filter, map, sort
   *
   * @param {Matrix | Array} x    The matrix to iterate on.
   * @param {Function} callback   The callback function is invoked with three
   *                              parameters: the value of the element, the index
   *                              of the element, and the Matrix/array being traversed.
   */
  return typed(name, {
    'Array, function': _forEach,

    'Matrix, function': function (x, callback) {
      return x.forEach(callback)
    }
  })
})

/**
 * forEach for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @private
 */
function _forEach (array, callback) {
  // figure out what number of arguments the callback function expects
  const args = maxArgumentCount(callback)

  const recurse = function (value, index) {
    if (Array.isArray(value)) {
      forEachArray(value, function (child, i) {
        // we create a copy of the index array and append the new index value
        recurse(child, index.concat(i))
      })
    } else {
      // invoke the callback function with the right number of arguments
      if (args === 1) {
        callback(value)
      } else if (args === 2) {
        callback(value, index)
      } else { // 3 or -1
        callback(value, index, array)
      }
    }
  }
  recurse(array, [])
}
