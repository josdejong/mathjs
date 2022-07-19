import { factory } from '../../utils/factory.js'
import { tanh as _tanh } from '../../utils/number.js'

const name = 'tanh'
const dependencies = ['typed']

export const createTanh = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the hyperbolic tangent of a value,
   * defined as `tanh(x) = (exp(2 * x) - 1) / (exp(2 * x) + 1)`.
   *
   * To avoid confusion with matrix hyperbolic tangent, this function does
   * not apply to matrices.
   *
   * Syntax:
   *
   *    math.tanh(x)
   *
   * Examples:
   *
   *    // tanh(x) = sinh(x) / cosh(x) = 1 / coth(x)
   *    math.tanh(0.5)                   // returns 0.46211715726000974
   *    math.sinh(0.5) / math.cosh(0.5)  // returns 0.46211715726000974
   *    1 / math.coth(0.5)               // returns 0.46211715726000974
   *
   * See also:
   *
   *    sinh, cosh, coth
   *
   * @param {number | BigNumber | Complex} x  Function input
   * @return {number | BigNumber | Complex} Hyperbolic tangent of x
   */
  return typed('tanh', {
    number: _tanh,
    'Complex | BigNumber': x => x.tanh()
  })
})
