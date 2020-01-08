import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { acscNumber } from '../../plain/number'

const name = 'acsc'
const dependencies = ['typed', 'config', 'Complex', 'BigNumber']

export const createAcsc = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex, BigNumber }) => {
  /**
   * Calculate the inverse cosecant of a value, defined as `acsc(x) = asin(1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsc(x)
   *
   * Examples:
   *
   *    math.acsc(0.5)           // returns number 0.5235987755982989
   *    math.acsc(math.csc(1.5)) // returns number ~1.5
   *
   *    math.acsc(2)             // returns Complex 1.5707963267948966 -1.3169578969248166 i
   *
   * See also:
   *
   *    csc, asin, asec
   *
   * @param {number | Complex | Array | Matrix} x   Function input
   * @return {number | Complex | Array | Matrix} The arc cosecant of x
   */
  const acsc = typed(name, {
    number: function (x) {
      if (x <= -1 || x >= 1 || config.predictable) {
        return acscNumber(x)
      }
      return new Complex(x, 0).acsc()
    },

    Complex: function (x) {
      return x.acsc()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x).asin()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acsc)
    }
  })

  return acsc
})
