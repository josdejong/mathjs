import { factory } from '../../utils/factory.js'
import { secNumber } from '../../plain/number/index.js'
import { createTrigUnit } from './trigUnit.js'

const name = 'sec'
const dependencies = ['typed', 'BigNumber']

export const createSec = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
  const trigUnit = createTrigUnit({ typed })

  /**
   * Calculate the secant of a value, defined as `sec(x) = 1/cos(x)`.
   *
   * To avoid confusion with the matrix secant, this function does not
   * apply to matrices.
   *
   * Syntax:
   *
   *    math.sec(x)
   *
   * Examples:
   *
   *    math.sec(2)      // returns number -2.4029979617223822
   *    1 / math.cos(2)  // returns number -2.4029979617223822
   *
   * See also:
   *
   *    cos, csc, cot
   *
   * @param {number | BigNumber | Complex | Unit} x  Function input
   * @return {number | BigNumber | Complex} Secant of x
   */
  return typed(name, {
    number: secNumber,
    Complex: x => x.sec(),
    BigNumber: x => new BigNumber(1).div(x.cos())
  }, trigUnit)
})
