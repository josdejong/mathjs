/* eslint-disable no-loss-of-precision */

import { lgammaG, lgammaN, lgammaNumber, lgammaSeries } from '../../plain/number/index.js'
import { deepMap } from '../../utils/collection.js'
import { factory } from '../../utils/factory.js'

const name = 'lgamma'
const dependencies = ['Complex', 'typed']

export const createLgamma = /* #__PURE__ */ factory(name, dependencies, ({ Complex, typed }) => {
  /**
   * Logarithm of the gamma function for real, positive numbers.
   * Based off of Tom Minka's lightspeed toolbox.
   *
   * Syntax:
   *
   *    math.lgamma(n)
   *
   * Examples:
   *
   *    math.lgamma(5)       // returns 3.178053830347945
   *    math.lgamma(0)       // returns Infinity
   *    math.lgamma(-0.5)    // returns NaN
   *
   * See also:
   *
   *    gamma
   *
   * @param {number | Array | Matrix} n   A real or complex number
   * @return {number | Array | Matrix}    The log gamma of `n`
   */

  return typed(name, {
    number: lgammaNumber,

    Complex: function (n) {
      if (n.im === 0) {
        return this(n.re)
      }

      if (n.re < 0.5) {
        // Use Euler's reflection formula:
        // gamma(z) = PI / (sin(PI * z) * gamma(1 - z))
        const t = new Complex(1 - n.re, -n.im)
        const r = new Complex(Math.PI * n.re, Math.PI * n.im)

        return new Complex(Math.PI, 0).div(r.sin()).log().sub(this(t))
      }

      // Compute the logarithm of the Gamma function using the Lanczos method

      const lnSqrt2PI = new Complex(0.91893853320467274178, 0)

      // n = n - 1
      n = new Complex(n.re - 1, n.im)
      // base = n + lgammaG + 0.5
      const base = new Complex(n.re + lgammaG + 0.5, n.im) // Base of the Lanczos exponential
      let sum = new Complex(lgammaSeries[0], 0)

      // We start with the terms that have the smallest coefficients and largest denominator
      for (let i = lgammaN - 1; i >= 1; i--) {
        // sum += lgammaSeries[i] / (n + i)
        sum = sum.add(new Complex(lgammaSeries[i], 0).div(new Complex(n.re + i, n.im)))
      }

      // lnSqrt2PI + (n + 0.5) * Math.log(base) - base + Math.log(sum)
      const baseLog = new Complex(n.re + 0.5, n.im).mul(base.log())
      const sumLog = sum.log()
      return lnSqrt2PI.add(baseLog).sub(base).add(sumLog)
    },

    'Array | Matrix': function (n) {
      return deepMap(n, this)
    }
  })
})
