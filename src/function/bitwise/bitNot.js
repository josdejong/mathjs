import { bitNotBigNumber } from '../../utils/bignumber/bitwise.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'
import { bitNotNumber } from '../../plain/number/index.js'

const name = 'bitNot'
const dependencies = ['typed']

export const createBitNot = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Bitwise NOT value, `~x`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.bitNot(x)
   *
   * Examples:
   *
   *    math.bitNot(1)               // returns number -2
   *
   *    math.bitNot([2, -3, 4])      // returns Array [-3, 2, -5]
   *
   * See also:
   *
   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | bigint | Array | Matrix} x Value to not
   * @return {number | BigNumber | bigint | Array | Matrix} NOT of `x`
   */
  return typed(name, {
    number: bitNotNumber,
    BigNumber: bitNotBigNumber,
    bigint: x => ~x,
    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
