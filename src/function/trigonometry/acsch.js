import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { acschNumber } from '../../plain/number'

const name = 'acsch'
const dependencies = ['typed', 'BigNumber']

export const createAcsch = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the hyperbolic arccosecant of a value,
   * defined as `acsch(x) = asinh(1/x) = ln(1/x + sqrt(1/x^2 + 1))`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.acsch(x)
   *
   * Examples:
   *
   *    math.acsch(0.5)       // returns 1.4436354751788103
   *
   * See also:
   *
   *    asech, acoth
   *
   * @param {number | Complex | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Hyperbolic arccosecant of x
   */
  const acsch = typed(name, {
    'number': acschNumber,

    'Complex': function (x) {
      return x.acsch()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x).asinh()
    },

    'Array | Matrix': function (x) {
      return deepMap(x, acsch)
    }
  })

  return acsch
})
