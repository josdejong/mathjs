import { factory } from '../../utils/factory'
import { deepMap } from '../../utils/collection'

const name = 'fix'
const dependencies = ['typed', 'Complex', 'ceil', 'floor']

export const createFix = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex, ceil, floor }) => {
  /**
   * Round a value towards zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.fix(x)
   *
   * Examples:
   *
   *    math.fix(3.2)                // returns number 3
   *    math.fix(3.8)                // returns number 3
   *    math.fix(-4.2)               // returns number -4
   *    math.fix(-4.7)               // returns number -4
   *
   *    const c = math.complex(3.2, -2.7)
   *    math.fix(c)                  // returns Complex 3 - 2i
   *
   *    math.fix([3.2, 3.8, -4.7])   // returns Array [3, 3, -4]
   *
   * See also:
   *
   *    ceil, floor, round
   *
   * @param {number | BigNumber | Fraction | Complex | Array | Matrix} x Number to be rounded
   * @return {number | BigNumber | Fraction | Complex | Array | Matrix}            Rounded value
   */
  const fix = typed('fix', {
    'number': function (x) {
      return (x > 0) ? floor(x) : ceil(x)
    },

    'Complex': function (x) {
      return new Complex(
        (x.re > 0) ? Math.floor(x.re) : Math.ceil(x.re),
        (x.im > 0) ? Math.floor(x.im) : Math.ceil(x.im)
      )
    },

    'BigNumber': function (x) {
      return x.isNegative() ? ceil(x) : floor(x)
    },

    'Fraction': function (x) {
      return x.s < 0 ? x.ceil() : x.floor()
    },

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since fix(0) = 0
      return deepMap(x, fix, true)
    }
  })

  return fix
})
