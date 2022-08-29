import { factory } from '../../utils/factory.js'
import { expNumber } from '../../plain/number/index.js'

const name = 'exp'
const dependencies = ['typed']

export const createExp = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Calculate the exponential of a value.
   * For matrices, if you want the matrix exponential of square matrix, use
   * the `expm` function; if you want to take the exponential of each element,
   * see the examples.
   *
   * Syntax:
   *
   *    math.exp(x)
   *
   * Examples:
   *
   *    math.exp(2)                  // returns number 7.3890560989306495
   *    math.pow(math.e, 2)          // returns number 7.3890560989306495
   *    math.log(math.exp(2))        // returns number 2
   *
   *    math.map([1, 2, 3], math.exp)
   *    // returns Array [
   *    //   2.718281828459045,
   *    //   7.3890560989306495,
   *    //   20.085536923187668
   *    // ]
   *
   * See also:
   *
   *    expm1, expm, log, pow
   *
   * @param {number | BigNumber | Complex} x  A number to exponentiate
   * @return {number | BigNumber | Complex} Exponential of `x`
   */
  return typed(name, {
    number: expNumber,

    Complex: function (x) {
      return x.exp()
    },

    BigNumber: function (x) {
      return x.exp()
    }
  })
})
