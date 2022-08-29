import { factory } from '../../utils/factory.js'
import { gammaG, gammaNumber, gammaP } from '../../plain/number/index.js'

const name = 'gamma'
const dependencies = ['typed', 'config', 'multiplyScalar', 'pow', 'BigNumber', 'Complex']

export const createGamma = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, multiplyScalar, pow, BigNumber, Complex }) => {
  /**
   * Compute the gamma function of a value using Lanczos approximation for
   * small values, and an extended Stirling approximation for large values.
   *
   * To avoid confusion with the matrix Gamma function, this function does
   * not apply to matrices.
   *
   * Syntax:
   *
   *    math.gamma(n)
   *
   * Examples:
   *
   *    math.gamma(5)       // returns 24
   *    math.gamma(-0.5)    // returns -3.5449077018110335
   *    math.gamma(math.i)  // returns -0.15494982830180973 - 0.49801566811835596i
   *
   * See also:
   *
   *    combinations, factorial, permutations
   *
   * @param {number | BigNumber | Complex} n   A real or complex number
   * @return {number | BigNumber | Complex}    The gamma of `n`
   */

  function gammaComplex (n) {
    if (n.im === 0) {
      return gammaNumber(n.re)
    }

    // Lanczos approximation doesn't work well with real part lower than 0.5
    // So reflection formula is required
    if (n.re < 0.5) { // Euler's reflection formula
      // gamma(1-z) * gamma(z) = PI / sin(PI * z)
      // real part of Z should not be integer [sin(PI) == 0 -> 1/0 - undefined]
      // thanks to imperfect sin implementation sin(PI * n) != 0
      // we can safely use it anyway
      const t = new Complex(1 - n.re, -n.im)
      const r = new Complex(Math.PI * n.re, Math.PI * n.im)

      return new Complex(Math.PI).div(r.sin()).div(gammaComplex(t))
    }

    // Lanczos approximation
    // z -= 1
    n = new Complex(n.re - 1, n.im)

    // x = gammaPval[0]
    let x = new Complex(gammaP[0], 0)
    // for (i, gammaPval) in enumerate(gammaP):
    for (let i = 1; i < gammaP.length; ++i) {
      // x += gammaPval / (z + i)
      const gammaPval = new Complex(gammaP[i], 0)
      x = x.add(gammaPval.div(n.add(i)))
    }
    // t = z + gammaG + 0.5
    const t = new Complex(n.re + gammaG + 0.5, n.im)

    // y = sqrt(2 * pi) * t ** (z + 0.5) * exp(-t) * x
    const twoPiSqrt = Math.sqrt(2 * Math.PI)
    const tpow = t.pow(n.add(0.5))
    const expt = t.neg().exp()

    // y = [x] * [sqrt(2 * pi)] * [t ** (z + 0.5)] * [exp(-t)]
    return x.mul(twoPiSqrt).mul(tpow).mul(expt)
  }

  return typed(name, {
    number: gammaNumber,
    Complex: gammaComplex,
    BigNumber: function (n) {
      if (n.isInteger()) {
        return (n.isNegative() || n.isZero())
          ? new BigNumber(Infinity)
          : bigFactorial(n.minus(1))
      }

      if (!n.isFinite()) {
        return new BigNumber(n.isNegative() ? NaN : Infinity)
      }

      throw new Error('Integer BigNumber expected')
    }
  })

  /**
   * Calculate factorial for a BigNumber
   * @param {BigNumber} n
   * @returns {BigNumber} Returns the factorial of n
   */
  function bigFactorial (n) {
    if (n < 8) {
      return new BigNumber([1, 1, 2, 6, 24, 120, 720, 5040][n])
    }

    const precision = config.precision + (Math.log(n.toNumber()) | 0)
    const Big = BigNumber.clone({ precision })

    if (n % 2 === 1) {
      return n.times(bigFactorial(new BigNumber(n - 1)))
    }

    let p = n
    let prod = new Big(n)
    let sum = n.toNumber()

    while (p > 2) {
      p -= 2
      sum += p
      prod = prod.times(sum)
    }

    return new BigNumber(prod.toPrecision(BigNumber.precision))
  }
})
