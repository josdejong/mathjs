import { factory } from '../../utils/factory.js'
import { gammaG, gammaNumber, gammaP } from '../../plain/number/index.js'

const name = 'gamma'
const dependencies = [
  'typed', 'config', 'BigNumber', 'Complex',
  'isInteger', 'bernoulli', 'equal'
]

export const createGamma = /* #__PURE__ */ factory(name, dependencies, ({
  typed, config, BigNumber, Complex,
  isInteger, bernoulli, equal
}) => {
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

  const piB = BigNumber.acos(-1)
  const halflog2piB = piB.times(2).ln().div(2)
  const sqrtpiB = piB.sqrt()
  const zeroB = new BigNumber(0)
  const twoB = new BigNumber(2)
  const neg2B = new BigNumber(-2)

  return typed(name, {
    number: gammaNumber,
    Complex: gammaComplex,
    BigNumber: function (n) {
      // Handle special values here
      if (!n.isFinite()) {
        return new BigNumber(n.isNegative() ? NaN : Infinity)
      }
      if (isInteger(n)) {
        return (n.isNegative() || n.isZero())
          ? new BigNumber(Infinity)
          : bigFactorial(n.round().minus(1))
      }
      let nhalf = n.minus(0.5)
      if (equal(nhalf, zeroB)) return sqrtpiB
      if (isInteger(nhalf)) {
        nhalf = nhalf.round() // in case there was roundoff error coming in
        let doubleFactorial = nhalf.abs().times(2).minus(1)
        // todo: replace following when factorial implementation finalized
        let factor = doubleFactorial.minus(2)
        while (factor.greaterThan(1)) {
          doubleFactorial = doubleFactorial.times(factor)
          factor = factor.minus(2)
        }
        if (nhalf.lessThan(0)) {
          return neg2B.pow(nhalf.abs()).times(sqrtpiB).div(doubleFactorial)
        }
        return doubleFactorial.times(sqrtpiB).div(twoB.pow(nhalf))
      }

      return gammaBig(n)
    }
  })

  function gammaBig (n) {
    // We follow https://ar5iv.labs.arxiv.org/html/2109.08392,
    // but adapted to work only for real inputs.
    // Note for future the same core algorithm can be used for 1/gamma
    // or log-gamma, see details in the paper.
    // Our goal is to compute relTol digits of gamma
    let digits = Math.abs(Math.log10(config.relTol))
    const bits = Math.min(digits * 10 / 3, 3)
    const beta = 0.2 // tuning parameter prescribed by reference
    const reflect = n.lessThan(-5)
    const z = reflect ? n.neg().plus(1) : n
    let r = Math.max(0, Math.ceil(z.neg().plus(beta * bits).toNumber()))
    // In the real case, the error is less than the first omitted term.
    // Therefore, our strategy is just to start computing. When we reach
    // a term smaller than 10^-digits, we return what we have so far. However,
    // we need to watch out: if the terms _increase_ in size before we
    // reach such a term, we need to restart with a larger r.
    let inaccurate = true
    let mainsum = new BigNumber(0)
    let shifted = z.plus(r)
    // console.trace('Trying for', digits, 'with shift', r)
    while (inaccurate) {
      const needPrec = digits + 3 + Math.floor(
        shifted.ln().times(shifted).log().toNumber())
      if (needPrec > config.precision) {
        digits -= needPrec - config.precision
        if (digits < 3) {
          throw new Error(`Cannot compute gamma(${n}) with useful accuracy`)
        }
        let message = `Insufficient bignumber precision for gamma(${n}), `
        message += `limiting to ${digits} digits.`
        console.warning(message)
      }
      const threshold = new BigNumber(0.1).pow(digits)
      let lastTerm = new BigNumber(Infinity)
      let index = 1
      let powShifted = shifted
      const shiftedSq = shifted.times(shifted)
      while (true) {
        const double = 2 * index
        const term = bernoulli(new BigNumber(double))
          .div(powShifted.times(double * (double - 1)))
        // See if we already converged
        const absTerm = term.abs()
        if (absTerm.lessThan(threshold)) {
          inaccurate = false
          break
        }
        if (lastTerm.lessThan(absTerm)) {
          // oops, diverging
          mainsum = new BigNumber(0)
          r = 2 * r
          shifted = z.plus(r)
          break
        }
        lastTerm = absTerm
        mainsum = mainsum.plus(term)
        index += 1
        powShifted = powShifted.times(shiftedSq)
      }
    }
    // OK, we should have an accurate mainsum
    const shiftGamma = mainsum
      .plus(halflog2piB)
      .minus(shifted)
      .plus(shifted.ln().times(shifted.minus(0.5)))
    // TODO: when implementation of rising factorial settled,
    // use that here, will be better
    let rising = new BigNumber(1)
    let factor = z
    for (let i = 0; i < r; ++i) {
      rising = rising.times(factor)
      factor = factor.plus(1)
    }
    let gamma
    if (reflect) {
      const angleFactor = n.mod(2).times(piB).sin()
      gamma = shiftGamma.neg().exp().times(piB).times(rising).div(angleFactor)
    } else gamma = shiftGamma.exp().div(rising)
    return gamma.toDecimalPlaces(digits)
  }

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
