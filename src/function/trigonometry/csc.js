import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'
import { cscNumber } from '../../plain/number'

const name = 'csc'
const dependencies = ['typed', 'BigNumber']

export const createCsc = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  /**
   * Calculate the cosecant of a value, defined as `csc(x) = 1/sin(x)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.csc(x)
   *
   * Examples:
   *
   *    math.csc(2)      // returns number 1.099750170294617
   *    1 / math.sin(2)  // returns number 1.099750170294617
   *
   * See also:
   *
   *    sin, sec, cot
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cosecant of x
   */
  const csc = typed(name, {
    'number': cscNumber,

    'Complex': function (x) {
      return x.csc()
    },

    'BigNumber': function (x) {
      return new BigNumber(1).div(x.sin())
    },

    'Unit': function (x) {
      if (!x.hasBase(x.constructor.BASE_UNITS.ANGLE)) {
        throw new TypeError('Unit in function csc is no angle')
      }
      return csc(x.value)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, csc)
    }
  })

  return csc
})
