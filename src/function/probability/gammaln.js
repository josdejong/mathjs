import { gammalnNumber } from '../../plain/number/index.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'gammaln'
const dependencies = ['typed']

export const createGammaln = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Logarithm of the gamma function for real, positive numbers.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   * Syntax:
   *
   *    math.gammaln(n)
   *
   * Examples:
   *
   *    math.gammaln(5)       // returns 3.178053830347945
   *    math.gammaln(0)       // returns Infinity
   *    math.gammaln(-0.5)    // returns NaN
   *
   * See also:
   *
   *    gamma
   *
   * @param {number | Array | Matrix} n   A real number > 0
   * @return {number | Array | Matrix}    The gammaln of `n`
   */

  return typed(name, {
    number: gammalnNumber,

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })
})
