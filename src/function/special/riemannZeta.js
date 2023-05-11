import { factory } from '../../utils/factory.js'

const name = 'riemannZeta'
const dependencies = ['typed', 'config', 'multiply', 'pow', 'divide', 'factorial', 'gamma', 'sin', 'subtract', 'add', 'Complex']

export const createRiemannZeta = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, multiply, pow, divide, factorial, gamma, sin, subtract, add, Complex }) => {
  /**
   * Compute the Riemann Zeta function of a value using an infinite series for
   * all of the complex plane using Riemann's Functional equation.
   *
   *
   * Syntax:
   *
   *    math.riemannZeta(n)
   *
   * Examples:
   *  FIX::
   *    math.riemannZeta(5)       // returns 1.0369277551433699...
   *    math.riemannZeta(-0.5)    // returns -0.2078862249773...
   *    math.riemannZeta(math.i)  // returns 0.0033002..., -0.4181554491...i
   *
   *
   * @param {number | Complex} z   A real or complex number
   * @return {number | Complex}    The zeta of `z`
   */
  function zeta (s) {
    s = Complex(s)
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

    // Function Equation for reflection to re(s) < 1
    let c = multiply(pow(2, s), pow(Math.PI, subtract(s, 1)))
    c = multiply(c, (sin(multiply(Math.PI / 2, s))))
    c = multiply(c, gamma(subtract(1, s)))
    return multiply(c, zeta(subtract(1, s)))
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
  /**
   * Calculate the positive Riemann Zeta function
   * @param {number} s   a real or complex number with s.re > 1
   * @param {number} n   a positive integer
   * @return {number}    Zeta of s
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

  return typed(name, {
    number: zeta,
    Complex: zeta
  })
})
