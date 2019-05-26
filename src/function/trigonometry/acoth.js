import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { acothNumber } from '../../plain/number'

const name = 'acoth'
const dependencies = ['typed', 'config', 'Complex', 'BigNumber']

export const createAcoth = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, Complex, BigNumber }) => {
  /**
   * Calculate the hyperbolic arccotangent of a value,
   * defined as `acoth(x) = atanh(1/x) = (ln((x+1)/x) + ln(x/(x-1))) / 2`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acoth(x)
   *
   * Examples:
   *
   *    math.acoth(0.5)       // returns 0.8047189562170503
   *
   * See also:
   *
   *    acsch, asech
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccotangent of x
   */
  const acoth = typed(name, {
    'number': function (x) {
      if (x >= 1 || x <= -1 || config.predictable) {
        return acothNumber(x)
      }
      return new Complex(x, 0).acoth()
    },

    'Complex': function (x) {
      return x.acoth()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x).atanh()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acoth)
    }
  })

  return acoth
})
