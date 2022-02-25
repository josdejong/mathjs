import { lgammaNumber } from '../../plain/number/index.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'lgamma'
const dependencies = ['typed']

export const createLgamma = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Logarithm of the gamma function for real, positive numbers.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   * Syntax:
   *
   *    math.lgamma(n)
   *
   * Examples:
   *
   *    math.lgamma(5)       // returns 3.178053830347945
   *    math.lgamma(0)       // returns Infinity
   *    math.lgamma(-0.5)    // returns NaN
   *
   * See also:
   *
   *    gamma
   *
   * @param {number | Array | Matrix} n   A real number
   * @return {number | Array | Matrix}    The log gamma of `n`
   */

  return typed(name, {
    number: lgammaNumber,

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })
})
