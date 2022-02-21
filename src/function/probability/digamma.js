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
   * Syntax:
   *
   *    math.digamma(n)
   *
   * Examples:
   *
   *    math.digamma(5)       // returns 1.5061176684318004727
   *    math.digamma(1)       // returns -0.5772156649015328606
   *    math.digamma(math.i)  // returns -0.15494982830180973 - 0.49801566811835596i
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

      return term1.sub(term2).sub(term3).sub(result)
    },

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })
})
