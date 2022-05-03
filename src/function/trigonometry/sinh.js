import { factory } from '../../utils/factory.js'
import { sinhNumber } from '../../plain/number/index.js'

const name = 'sinh'
const dependencies = ['typed']

export const createSinh = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the hyperbolic sine of a value,
   * defined as `sinh(x) = 1/2 * (exp(x) - exp(-x))`.
   *
   * To avoid confusion with the matrix hyperbolic sine, this function does
   * not apply to matrices.
   *
   * Syntax:
   *
   *    math.sinh(x)
   *
   * Examples:
   *
   *    math.sinh(0.5)       // returns number 0.5210953054937474
   *
   * See also:
   *
   *    cosh, tanh
   *
   * @param {number | BigNumber | Complex} x  Function input
   * @return {number | BigNumber | Complex} Hyperbolic sine of x
   */
  return typed(name, {
    number: sinhNumber,
    'Complex | BigNumber': x => x.sinh()
  })
})
