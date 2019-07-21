import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { asechNumber } from '../../plain/number'

const name = 'asech'
const dependencies = ['typed', 'config', 'Complex', 'BigNumber']

export const createAsech = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex, BigNumber }) => {
  /**
   * Calculate the hyperbolic arcsecant of a value,
   * defined as `asech(x) = acosh(1/x) = ln(sqrt(1/x^2 - 1) + 1/x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.asech(x)
   *
   * Examples:
   *
   *    math.asech(0.5)       // returns 1.3169578969248166
   *
   * See also:
   *
   *    acsch, acoth
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arcsecant of x
   */
  const asech = typed(name, {
    number: function (x) {
      if ((x <= 1 && x >= -1) || config.predictable) {
        const xInv = 1 / x
        if (xInv > 0 || config.predictable) {
          return asechNumber(x)
        }

        const ret = Math.sqrt(xInv * xInv - 1)
        return new Complex(Math.log(ret - xInv), Math.PI)
      }

      return new Complex(x, 0).asech()
    },

    Complex: function (x) {
      return x.asech()
    },

    BigNumber: function (x) {
      return new BigNumber(1).div(x).acosh()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, asech)
    }
  })

  return asech
})
