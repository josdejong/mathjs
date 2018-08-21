'use strict'

const flatten = require('../../utils/array').flatten

function factory (type, config, load, typed) {
  const isNaN = load(require('../utils/isNaN'))
  const isNumeric = load(require('../utils/isNumeric'))

  /**
  * Computes the mode of a set of numbers or a list with values(numbers or characters).
  * If there are more than one modes, it returns a list of those values.
  *
  * Syntax:
  *
  *     math.mode(a, b, c, ...)
  *     math.mode(A)
  *
  * Examples:
  *
  *     math.mode(2, 1, 4, 3, 1)                            // returns [1]
  *     math.mode([1, 2.7, 3.2, 4, 2.7])                    // returns [2.7]
  *     math.mode(1, 4, 6, 1, 6)                             // returns [1, 6]
  *     math.mode('a','a','b','c')                           // returns ["a"]
  *     math.mode(1, 1.5, 'abc')                             // returns [1, 1.5, "abc"]
  *
  * See also:
  *
  *     median,
  *     mean
  *
  * @param {... *} args  A single matrix
  * @return {*} The mode of all values
  */

  const mode = typed('mode', {
    'Array | Matrix': _mode,

    '...': function (args) {
      return _mode(args)
    }
  })

  return mode

  /**
   * Calculates the mode in an 1-dimensional array
   * @param {Array} values
   * @return {Array} mode
   * @private
   */
  function _mode (values) {
    values = flatten(values.valueOf())
    const num = values.length
    if (num === 0) {
      throw new Error('Cannot calculate mode of an empty array')
    }

    const count = {}
    let mode = []
    let max = 0
    for (let i = 0; i < values.length; i++) {
      const value = values[i]

      if (isNumeric(value) && isNaN(value)) {
        throw new Error('Cannot calculate mode of an array containing NaN values')
      }

      if (!(value in count)) {
        count[value] = 0
      }

      count[value]++

      if (count[value] === max) {
        mode.push(value)
      } else if (count[value] > max) {
        max = count[value]
        mode = [value]
      }
    }
    return mode
  }
}

exports.name = 'mode'
exports.factory = factory
