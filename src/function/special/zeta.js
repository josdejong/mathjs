import { factory } from '../../utils/factory.js'

const name = 'zeta'
const dependencies = ['typed', 'config', 'multiply', 'pow', 'divide', 'factorial', 'equal', 'smallerEq', 'isBounded', 'isNegative', 'gamma', 'sin', 'subtract', 'add', '?Complex', '?BigNumber', 'pi']

export const createZeta = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, multiply, pow, divide, factorial, equal, smallerEq, isBounded, isNegative, gamma, sin, subtract, add, Complex, BigNumber, pi }) => {
  /**
   * Compute the Riemann Zeta function of a value using an infinite series for
   * all of the complex plane using Riemann's Functional equation.
   *
   * Based off the paper by Xavier Gourdon and Pascal Sebah
   * ( http://numbers.computation.free.fr/Constants/Miscellaneous/zetaevaluations.pdf )
   *
   * Implementation and slight modification by Anik Patel
   *
   * Note: the implementation is accurate up to about 6 digits.
   *
   * Syntax:
   *
   *    math.zeta(n)
   *
   * Examples:
   *
   *    math.zeta(5)       // returns 1.0369277551433895
   *    math.zeta(-0.5)    // returns -0.2078862249773449
   *    math.zeta(math.i)  // returns 0.0033002236853253153 - 0.4181554491413212i
   *
   * See also:
   *    erf
   *
   * @param {number | Complex | BigNumber} s   A Real, Complex or BigNumber parameter to the Riemann Zeta Function
   * @return {number | Complex | BigNumber}    The Riemann Zeta of `s`
   */
  return typed(name, {
    number: (s) => zetaNumeric(s, value => value, () => 20),
    BigNumber: (s) => zetaNumeric(
      s,
      value => new BigNumber(value),
      () => {
        // relTol is for example 1e-12. Extract the positive exponent 12 from that
        return Math.abs(Math.log10(config.relTol))
      }
    ),
    Complex: zetaComplex
  })

  /**
   * @param {number | BigNumber} s
   * @param {(value: number) => number | BigNumber} createValue
   * @param {(value: number | BigNumber | Complex) => number} determineDigits
   * @returns {number | BigNumber}
   */
  function zetaNumeric (s, createValue, determineDigits) {
    if (equal(s, 0)) {
      return createValue(-0.5)
    }
    if (equal(s, 1)) {
      return createValue(NaN)
    }
    if (!isBounded(s)) {
      return isNegative(s) ? createValue(NaN) : createValue(1)
    }

    return zeta(s, createValue, determineDigits, s => s)
  }

  /**
   * @param {Complex} s
   * @returns {Complex}
   */
  function zetaComplex (s) {
    if (s.re === 0 && s.im === 0) {
      return new Complex(-0.5)
    }
    if (s.re === 1) {
      return new Complex(NaN, NaN)
    }
    if (s.re === Infinity && s.im === 0) {
      return new Complex(1)
    }
    if (s.im === Infinity || s.re === -Infinity) {
      return new Complex(NaN, NaN)
    }

    return zeta(s, value => value, s => Math.round(1.3 * 15 + 0.9 * Math.abs(s.im)), s => s.re)
  }

  /**
   * @param {number | BigNumber | Complex} s
   * @param {(value: number) => number | BigNumber | Complex} createValue
   * @param {(value: number | BigNumber | Complex) => number} determineDigits
   * @param {(value: number | BigNumber | Complex) => number} getRe
   * @returns {*|number}
   */
  function zeta (s, createValue, determineDigits, getRe) {
    const n = determineDigits(s)
    if (getRe(s) > -(n - 1) / 2) {
      return f(s, createValue(n), createValue)
    } else {
      // Function Equation for reflection to x < 1
      let c = multiply(pow(2, s), pow(createValue(pi), subtract(s, 1)))
      c = multiply(c, (sin(multiply(divide(createValue(pi), 2), s))))
      c = multiply(c, gamma(subtract(1, s)))
      return multiply(c, zeta(subtract(1, s), createValue, determineDigits, getRe))
    }
  }

  /**
   * Calculate a portion of the sum
   * @param {number | BigNumber} k   a positive integer
   * @param {number | BigNumber} n   a positive integer
   * @return {number}    the portion of the sum
   **/
  function d (k, n) {
    let S = k
    for (let j = k; smallerEq(j, n); j = add(j, 1)) {
      const factor = divide(
        multiply(factorial(add(n, subtract(j, 1))), pow(4, j)),
        multiply(factorial(subtract(n, j)), factorial(multiply(2, j)))
      )
      S = add(S, factor)
    }

    return multiply(n, S)
  }

  /**
   * Calculate the positive Riemann Zeta function
   * @param {number} s   a real or complex number with s.re > 1
   * @param {number} n   a positive integer
   * @param {(number) => number | BigNumber | Complex} createValue
   * @return {number}    Riemann Zeta of s
   **/
  function f (s, n, createValue) {
    const c = divide(1, multiply(d(createValue(0), n), subtract(1, pow(2, subtract(1, s)))))
    let S = createValue(0)
    for (let k = createValue(1); smallerEq(k, n); k = add(k, 1)) {
      S = add(S, divide(multiply((-1) ** (k - 1), d(k, n)), pow(k, s)))
    }
    return multiply(c, S)
  }
})
