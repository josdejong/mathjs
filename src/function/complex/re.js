import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'

const name = 're'
const dependencies = ['typed']

export const createRe = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Get the real part of a complex number.
   * For a complex number `a + bi`, the function returns `a`.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.re(x)
   *
   * Examples:
   *
   *    const a = math.complex(2, 3)
   *    math.re(a)                     // returns number 2
   *    math.im(a)                     // returns number 3
   *
   *    math.re(math.complex('-5.2i')) // returns number 0
   *    math.re(math.complex(2.4))     // returns number 2.4
   *
   * See also:
   *
   *    im, conj, abs, arg
   *
   * @param {number | BigNumber | Complex | Array | Matrix} x
   *            A complex number or array with complex numbers
   * @return {number | BigNumber | Array | Matrix} The real part of x
   */
  return typed(name, {
    'number | BigNumber | Fraction': x => x,
    Complex: x => x.re,
    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
