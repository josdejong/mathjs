import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'digamma'
const dependencies = ['typed', 'Complex']

export const createDigamma = /* #__PURE__ */ factory(name, dependencies, ({ typed, Complex }) => {
  /**
   * Compute the digamma function of a value using Asymptotic expansion and recurrence formula
   *
   * For matrices, the function is evaluated element wise.
   *
   * Note:
   *    It might not have perfect precision - last digits might differ
   *    The precision could be improved by increasing number in recursive formula
   *    Or adding more terms in asymptotic expansion
   *
   * Syntax:
   *
   *    math.digamma(n)
   *
   * Examples:
   *
   *    math.digamma(5)       // returns 1.5061176684318004727
   *    math.digamma(1)       // returns -0.5772156649015328606
   *    math.digamma(math.i)  // returns 0.09465032062247697727 + 2.0766740474685811i
   *
   * See also:
   *
   *    combinations, gamma, factorial, permutations
   *
   * @param {number | Array | Matrix} n   A real or complex number
   * @return {number | Array | Matrix}    The digamma of `n`
   */

  return typed(name, {

    number: function (n) {
      return this(new Complex(n, 0)).re
    },

    Complex: function (n) {
      if (n.re === 0 && n.im === 0) {
        return new Complex(-Infinity)
      }

      if (n.re < 0) { // Reflection formula
        // digamma(1-z) - digamma(z) = PI * cot(PI * z)
        const t = new Complex(1 - n.re, -n.im)
        const r = new Complex(Math.PI * n.re, Math.PI * n.im)

        return this(t).sub(r.cot().mul(Math.PI))
      }

      // Recurrence formula, until Re(n) >= 30
      // digamma(z) = digamma(z + 1) - 1 / z
      let result = new Complex(0, 0)
      while (n.re < 30) {
        result = result.add(new Complex(1).div(n))
        n.re += 1
      }

      // Asymptotic expansion
      const term1 = n.log()
      const term2 = new Complex(1).div(n.add(n)) // 1 / 2z
      const term3 = term2.mul(term2).mul(1 / 3) // 1 / 12z^2 -> (1/2z)*(1/2z)*1/3
      const n2 = n.mul(n) // z^2
      const n4 = n2.mul(n2) // z^4
      const term4 = new Complex(1).div(n4.mul(120)) // 1 / 120z^4
      const term5 = new Complex(1).div(n4.mul(n2).mul(252)) // 1 / 252z^6
      const term6 = new Complex(1).div(n4.mul(n4).mul(240)) // 1 / 240z^8

      return term1.sub(term2).sub(term3).sub(result).add(term4).sub(term5).add(term6)
    },

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })
})
