import { factory } from '../../utils/factory.js'
import { expm1Number } from '../../plain/number/index.js'

const name = 'expm1'
const dependencies = ['typed', 'Complex']

export const createExpm1 = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex }) => {
  /**
   * Calculate the value of subtracting 1 from the exponential value.
   * This function is more accurate than `math.exp(x)-1` when `x` is near 0
   * To avoid ambiguity with the matrix exponential `expm`, this function
   * does not operate on matrices; if you wish to apply it elementwise, see
   * the examples.
   *
   * Syntax:
   *
   *    math.expm1(x)
   *
   * Examples:
   *
   *    math.expm1(2)                      // returns number 6.38905609893065
   *    math.pow(math.e, 2) - 1            // returns number 6.3890560989306495
   *    math.expm1(1e-8)                   // returns number 1.0000000050000001e-8
   *    math.exp(1e-8) - 1                 // returns number 9.9999999392253e-9
   *    math.log(math.expm1(2) + 1)        // returns number 2
   *
   *    math.map([1, 2, 3], math.expm1)
   *    // returns Array [
   *    //   1.718281828459045,
   *    //   6.3890560989306495,
   *    //   19.085536923187668
   *    // ]
   *
   * See also:
   *
   *    exp, expm, log, pow
   *
   * @param {number | BigNumber | Complex} x  The number to exponentiate
   * @return {number | BigNumber | Complex} Exponential of `x`, minus one
   */
  return typed(name, {
    number: expm1Number,

    Complex: function (x) {
      const r = Math.exp(x.re)
      return new Complex(
        r * Math.cos(x.im) - 1,
        r * Math.sin(x.im)
      )
    },

    BigNumber: function (x) {
      return x.exp().minus(1)
    }
  })
})
