import { maxArgumentCount } from '../../utils/function.js'
import { factory } from '../../utils/factory.js'

const name = 'map'
const dependencies = ['typed']

export const createMap = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
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
   *    // The calling convention for the callback can cause subtleties:
   *    math.map([1, 2, 3], math.format)
   *    // throws TypeError: map attempted to call 'format(1,[0])' but argument 2 of type Array does not match expected type number or function or Object or string or boolean
   *    // [This happens because `format` _can_ take a second argument,
   *    // but its semantics don't match that of the 2nd argument `map` provides]
   *
   *    // To avoid this error, use a function that takes exactly the
   *    // desired arguments:
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
    'Array, function': _map,

    'Matrix, function': function (x, callback) {
      return x.map(callback)
    }
  })
})

/**
 * Map for a multi dimensional array
 * @param {Array} array
 * @param {Function} callback
 * @return {Array}
 * @private
 */
function _map (array, callback) {
  // figure out what number of arguments the callback function expects
  const args = maxArgumentCount(callback)

  const recurse = function (value, index) {
    if (Array.isArray(value)) {
      return value.map(function (child, i) {
        // we create a copy of the index array and append the new index value
        return recurse(child, index.concat(i))
      })
    } else {
      try {
        // invoke the callback function with the right number of arguments
        if (args === 1) {
          return callback(value)
        } else if (args === 2) {
          return callback(value, index)
        } else { // 3 or -1
          return callback(value, index, array)
        }
      } catch (err) {
        // But maybe the arguments still weren't right
        if (err instanceof TypeError &&
            'data' in err &&
            err.data.category === 'wrongType') {
          let newmsg = `map attempted to call '${err.data.fn}(${value}`
          const indexString = JSON.stringify(index)
          if (args === 2) {
            newmsg += ',' + indexString
          } else if (args !== 1) {
            newmsg += `,${indexString},${array}`
          }
          newmsg += `)' but argument ${err.data.index + 1} of type `
          newmsg += `${err.data.actual} does not match expected type `
          newmsg += err.data.expected.join(' or ')
          throw new TypeError(newmsg)
        }
        throw err
      }
    }
  }

  return recurse(array, [])
}
