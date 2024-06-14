import { factory } from '../../utils/factory.js'
import { deepMap } from '../../utils/collection.js'
import { absNumber } from '../../plain/number/index.js'

const name = 'abs'
const dependencies = ['typed']

export const createAbs = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the absolute value of a number. For matrices, the function is
   * evaluated element wise.
   *
   * Syntax:
   *
   *    math.abs(x)
   *
   * Examples:
   *
   *    math.abs(3.5)                // returns number 3.5
   *    math.abs(-4.2)               // returns number 4.2
   *
   *    math.abs([3, -5, -1, 0, 2])  // returns Array [3, 5, 1, 0, 2]
   *
   * See also:
   *
   *    sign
   *
   * @param  {number | BigNumber | bigint | Fraction | Complex | Array | Matrix | Unit} x
   *            A number or matrix for which to get the absolute value
   * @return {number | BigNumber | bigint | Fraction | Complex | Array | Matrix | Unit}
   *            Absolute value of `x`
   */
  return typed(name, {
    number: absNumber,

    'Complex | BigNumber | Fraction | Unit': x => x.abs(),

    bigint: x => x < 0n ? -x : x,

    // deep map collection, skip zeros since abs(0) = 0
    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self, true))
  })
})
