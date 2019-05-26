import { flatten } from '../../utils/array'
import { factory } from '../../utils/factory'
import { improveErrorMessage } from './utils/improveErrorMessage'

const name = 'mad'
const dependencies = ['typed', 'abs', 'map', 'median', 'subtract']

export const createMad = /* #__PURE__ */ factory(name, dependencies, ({ typed, abs, map, median, subtract }) => {
  /**
   * Compute the median absolute deviation of a matrix or a list with values.
   * The median absolute deviation is defined as the median of the absolute
   * deviations from the median.
   *
   * Syntax:
   *
   *     math.mad(a, b, c, ...)
   *     math.mad(A)
   *
   * Examples:
   *
   *     math.mad(10, 20, 30)             // returns 10
   *     math.mad([1, 2, 3])              // returns 1
   *     math.mad([[1, 2, 3], [4, 5, 6]]) // returns 1.5
   *
   * See also:
   *
   *     median, mean, std, abs
   *
   * @param {Array | Matrix} array
   *                        A single matrix or multiple scalar values.
   * @return {*} The median absolute deviation.
   */
  return typed(name, {
    // mad([a, b, c, d, ...])
    'Array | Matrix': _mad,

    // mad(a, b, c, d, ...)
    '...': function (args) {
      return _mad(args)
    }
  })

  function _mad (array) {
    array = flatten(array.valueOf())

    if (array.length === 0) {
      throw new Error('Cannot calculate median absolute deviation (mad) of an empty array')
    }

    try {
      const med = median(array)
      return median(map(array, function (value) {
        return abs(subtract(value, med))
      }))
    } catch (err) {
      if (err instanceof TypeError && err.message.indexOf('median') !== -1) {
        throw new TypeError(err.message.replace('median', 'mad'))
      } else {
        throw improveErrorMessage(err, 'mad')
      }
    }
  }
})
