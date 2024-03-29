import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 'arg'
const dependencies = ['typed']

export const createArg = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Compute the argument of a complex value.
   * For a complex number `a + bi`, the argument is computed as `atan2(b, a)`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.arg(x)
   *
   * Examples:
   *
   *    const a = math.complex(2, 2)
   *    math.arg(a) / math.pi          // returns number 0.25
   *
   *    const b = math.complex('2 + 3i')
   *    math.arg(b)                    // returns number 0.982793723247329
   *    math.atan2(3, 2)               // returns number 0.982793723247329
   *
   * See also:
   *
   *    re, im, conj, abs
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Array | Matrix} The argument of x
   */
  return typed(name, {
    number: function (x) {
      return Math.atan2(0, x)
    },

    BigNumber: function (x) {
      return x.constructor.atan2(0, x)
    },

    Complex: function (x) {
      return x.arg()
    },

    // TODO: implement BigNumber support for function arg

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
