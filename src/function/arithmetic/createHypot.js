'use strict'

import assertDependencies from '../../utils/assertDependencies'
import { flatten } from '../../utils/array'

export function createHypot (math) {
  assertDependencies(math, createHypot.dependencies, createHypot.name)

  /**
   * Calculate the hypotenusa of a list with values. The hypotenusa is defined as:
   *
   *     hypot(a, b, c, ...) = sqrt(a^2 + b^2 + c^2 + ...)
   *
   * For matrix input, the hypotenusa is calculated for all values in the matrix.
   *
   * Syntax:
   *
   *     math.hypot(a, b, ...)
   *     math.hypot([a, b, c, ...])
   *
   * Examples:
   *
   *     math.hypot(3, 4)      // 5
   *     math.hypot(3, 4, 5)   // 7.0710678118654755
   *     math.hypot([3, 4, 5]) // 7.0710678118654755
   *     math.hypot(-2)        // 2
   *
   * See also:
   *
   *     abs, norm
   *
   * @param {... number | BigNumber | Array | Matrix} args    A list with numeric values or an Array or Matrix.
   *                                                          Matrix and Array input is flattened and returns a
   *                                                          single number for the whole matrix.
   * @return {number | BigNumber} Returns the hypothenusa of the input values.
   */
  const hypot = math.typed('hypot', {
    '... number | BigNumber': _hypot,

    'Array': function (x) {
      return hypot.apply(hypot, flatten(x))
    },

    'Matrix': function (x) {
      return hypot.apply(hypot, flatten(x.toArray()))
    }
  })

  /**
   * Calculate the hypotenusa for an Array with values
   * @param {Array.<number | BigNumber>} args
   * @return {number | BigNumber} Returns the result
   * @private
   */
  function _hypot (args) {
    // code based on `hypot` from es6-shim:
    // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1619-L1633
    let result = 0
    let largest = 0

    for (let i = 0; i < args.length; i++) {
      const value = math.abs(args[i])
      if (math.smaller(largest, value)) {
        result = math.multiplyScalar(result,
          math.multiplyScalar(math.divideScalar(largest, value), math.divideScalar(largest, value)))
        result = math.addScalar(result, 1)
        largest = value
      } else {
        result = math.addScalar(result, math.isPositive(value)
          ? math.multiplyScalar(math.divideScalar(value, largest), math.divideScalar(value, largest))
          : value)
      }
    }

    return math.multiplyScalar(largest, math.sqrt(result))
  }

  hypot.toTex = `\\hypot\\left(\${args}\\right)`

  return hypot
}

createHypot.dependencies = [
  'abs',
  'addScalar',
  'divideScalar',
  'multiplyScalar',
  'sqrt',
  'smaller',
  'isPositive'
]
