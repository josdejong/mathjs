import { factory } from '../../utils/factory.js'
import { cotNumber } from '../../plain/number/index.js'
import { createTrigUnit } from './trigUnit.js'

const name = 'cot'
const dependencies = ['typed', 'BigNumber']

export const createCot = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  const trigUnit = createTrigUnit({ typed })

  /**
   * Calculate the cotangent of a value. Defined as `cot(x) = 1 / tan(x)`.
   *
   * To avoid confusion with the matrix cotangent, this function does not
   * apply to matrices.
   *
   * Syntax:
   *
   *    math.cot(x)
   *
   * Examples:
   *
   *    math.cot(2)      // returns number -0.45765755436028577
   *    1 / math.tan(2)  // returns number -0.45765755436028577
   *
   * See also:
   *
   *    tan, sec, csc
   *
   * @param {number | Complex | Unit | Array | Matrix} x  Function input
   * @return {number | Complex | Array | Matrix} Cotangent of x
   */
  return typed(name, {
    number: cotNumber,
    Complex: x => x.cot(),
    BigNumber: x => new BigNumber(1).div(x.tan())
  }, trigUnit)
})
