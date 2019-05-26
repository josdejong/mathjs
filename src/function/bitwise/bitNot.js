import { bitNotBigNumber } from '../../utils/bignumber/bitwise'
import { deepMap } from '../../utils/collection'
import { factory } from '../../utils/factory'
import { bitNotNumber } from '../../plain/number'

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
   *    math.bitNot([2, -3, 4])      // returns Array [-3, 2, 5]
   *
   * See also:
   *
   *    bitAnd, bitOr, bitXor, leftShift, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x Value to not
   * @return {number | BigNumber | Array | Matrix} NOT of `x`
   */
  const bitNot = typed(name, {
    'number': bitNotNumber,

    'BigNumber': bitNotBigNumber,

    'Array | Matrix': function (x) {
      return deepMap(x, bitNot)
    }
  })

  return bitNot
})
