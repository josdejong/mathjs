import { factory } from '../../utils/factory.js'
import { nandNumber } from '../../plain/number/logical.js'

const name = 'nand'
const dependencies = [
  'typed',
  'and',
  'not'
]

export const createNand = /* #__PURE__ */ factory(name, dependencies, ({ typed, and, not }) => {
  /**
   * Logical `nand`. Test if at least one of the inputs is zero.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.nand(x, y)
   *
   * Examples:
   *
   *    math.nand(2, 4)   // returns false
   *
   *    a = [2, 5, 0]
   *    b = [0, 22, 0]
   *    c = 0
   *
   *    math.nand(a, b)   // returns [true, false, true]
   *    math.nand(b, c)   // returns [true, true, true]
   *
   * See also:
   *
   *    and, or, not, xor
   *
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} x First value to check
   * @param  {number | BigNumber | bigint | Complex | Unit | Array | Matrix} y Second value to check
   * @return {boolean | Array | Matrix}
   *            Returns true when at least one of the inputs is zero
   */
  return typed(
    name,
    {
      'number, number': nandNumber,
      'bigint, bigint': nandNumber,

      'any, any': function (x, y) {
        return not(and(x, y))
      }
    }
  )
})
