import { factory } from '../../utils/factory.js'

const name = 'zeta'
const dependencies = ['typed', 'multiply', 'pow', 'divide', 'factorial', 'equal', 'gamma', 'sin', 'subtract', 'add', '?Complex', '?BigNumber', 'pi']

export const createZeta = /* #__PURE__ */ factory(name, dependencies, ({ typed, multiply, pow, divide, factorial, equal, gamma, sin, subtract, add, Complex, BigNumber, pi }) => {
  /**
   * Compute the Riemann Zeta function of a value using an infinite series for
   * all of the complex plane using Riemann's Functional equation.
   *
   * Based off the paper by Xavier Gourdon and Pascal Sebah
   * ( http://numbers.computation.free.fr/Constants/Miscellaneous/zetaevaluations.pdf )
   *
   * Implementation and slight modification by Anik Patel
   *
   *
   * Syntax:
   *
   *    math.zeta(n)
   *
   * Examples:
   *
   *    math.zeta(5)       // returns 1.03692775514337 + 0i
   *    math.zeta(-0.5)    // returns -0.2078862249773449 + 0i
   *    math.zeta(math.i)  // returns 0.0033002236853253153 - 0.4181554491413212i
   *
   *
   * @param {number | Complex | BigNumber} s   A Real, Complex or BigNumber parameter to to the Riemann Zeta Function
   * @return {number | Complex | BigNumber}    The Riemann Zeta of `s`
   */
  function zeta (s) {
    if (s.re === 0 && s.im === 0) {
      return -0.5
    }
    if (s.re === 1) {
      return NaN
    }
    if (s.re === Infinity && s.im === 0) {
      return 1
    }
    if (s.im === Infinity || s.re === -Infinity) {
      return NaN
    }
    // The "15" is number of decimal places of accuracy (approx)
    const n = Math.round(1.3 * 15 + 0.9 * Math.abs(s.im))
    if (s.re > -(n - 1) / 2) { return f(s, n) }

    // Functional Equation for reflection to re(s) < -( n - 1) / 2
    let c = multiply(pow(2, s), pow(Math.PI, subtract(s, 1)))
    c = multiply(c, (sin(multiply(Math.PI / 2, s))))
    c = multiply(c, gamma(subtract(1, s)))
    return multiply(c, zeta(subtract(1, s)))
  }

  // Big Number alias
  function zetaBigNumber (x) {
    if (x === 0) {
      return -0.5
    }
    if (equal(x, 1)) {
      return NaN
    }
    if (!x.isFinite() && !x.isNegative()) {
      return 1
    }
    if (!x.isFinite() && x.isNegative()) {
      return NaN
    }
    // 15 decimals of accuracy
    const n = 20
    if (x > -(n - 1) / 2) { return fBigNumber(x, n) }

    // Function Equation for reflection to x < 1
    let c = multiply(pow(2, x), pow(new BigNumber(pi), subtract(x, 1)))
    c = multiply(c, (sin(multiply(new BigNumber(pi / 2), x))))
    c = multiply(c, gamma(subtract(1, x)))
    return multiply(c, zetaBigNumber(subtract(1, x)))
  }

  /**
   * Calculate a portion of the sum
   * @param {number} k   a positive integer
   * @param {number} n   a positive integer
   * @return {number}    the portion of the sum
   **/
  function d (k, n) {
    let S = 0
    for (let j = k; j <= n; j++) {
      S += factorial(n + j - 1) * (4 ** j) / (factorial(n - j) * factorial(2 * j))
    }

    return n * S
  }

  // Big Number alias
  function dBigNumber (k, n) {
    let S = new BigNumber(0)
    const bn = new BigNumber(n)
    for (let j = k; j <= n; j++) {
      const bj = new BigNumber(j)
      const factor = divide(multiply(factorial(add(bn, subtract(bj, 1))), pow(4, bj)), multiply(factorial(subtract(bn, bj)), factorial(multiply(2, bj))))
      S = add(S, factor)
    }

    return multiply(n, S)
  }

  /**
   * Calculate the positive Riemann Zeta function
   * @param {number} s   a real or complex number with s.re > 1
   * @param {number} n   a positive integer
   * @return {number}    Riemann Zeta of s
   **/
  function f (s, n) {
    const c = divide(1, multiply(d(0, n), subtract(1, pow(2, subtract(1, s)))))
    let S = new Complex(0, 0)
    for (let k = 1; k <= n; k++) {
      S = S.add(
        divide((-1) ** (k - 1) * d(k, n), pow(k, s))
      )
    }

    return multiply(c, S)
  }

  // Big Number alias
  function fBigNumber (s, n) {
    const c = divide(1, multiply(dBigNumber(0, n), subtract(1, pow(2, subtract(1, s)))))
    let S = new BigNumber(0)
    for (let k = 1; k <= n; k++) {
      S = S.add(
        divide(multiply((-1) ** (k - 1), dBigNumber(k, n)), pow(k, s))
      )
    }
    return multiply(c, S)
  }

  // Return the value of the function
  return typed(name, {
    number: s => zeta(new Complex(s)),
    Complex: zeta,
    BigNumber: zetaBigNumber
  })
})
