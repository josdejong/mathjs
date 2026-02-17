import { factory } from '../../utils/factory.js'
import { norNumber } from '../../plain/number/logical.js'

const name = 'nor'
const dependencies = [
  'typed',
  'or',
  'not'
]

export const createNor = /* #__PURE__ */ factory(name, dependencies, ({ typed, or, not }) => {
  /**
   * Logical `nor`. Test if both of values are defined with zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.nor(x, y)
   *
   * Examples:
   *
   *    math.nor(2, 4)   // returns false
   *
   *    a = [2, 5, 0]
   *    b = [0, 22, 0]
   *    c = 0
   *
   *    math.nor(a, b)   // returns [false, false, true]
   *    math.nor(b, c)   // returns [true, false, true]
   *
   * See also:
   *
   *    and, or, not, xor
   *
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when both inputs are zero
   */
  return typed(
    name,
    {
      'number, number': norNumber,
      'bigint, bigint': norNumber,

      'any, any': function (x, y) {
        return not(or(x, y))
      }
    }
  )
})
