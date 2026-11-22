import { factory } from '../../utils/factory.js'

const name = 'powmod'
const dependencies = ['typed', 'isInteger', 'mod', 'invmod', 'bigint', 'number', 'bignumber']

export const createPowmod = /* #__PURE__ */ factory(name, dependencies, ({ typed, isInteger, mod, invmod, bigint, number, bignumber }) => {
  /**
   * Calculate the modular exponentiation `b^e mod m`, without computing the
   * full power `b^e`. Uses square-and-multiply, reducing modulo `m` after
   * every step, so it is fast even for very large exponents.
   *
   * All arguments must be integers. The result follows the same sign
   * convention as `mod`: it lies in `[0, m)` for a positive modulus and in
   * `(m, 0]` for a negative modulus. A negative exponent uses the modular
   * inverse of `b` (see `invmod`) and throws an error when `b` has no inverse
   * modulo `m`. A zero modulus throws an error.
   *
   * The computation is carried out in `bigint`, so the result is exact, and
   * then converted back to the type of the arguments.
   *
   * Syntax:
   *
   *    math.powmod(b, e, m)
   *
   * Examples:
   *
   *    math.powmod(10, 58, 531)        // returns 1
   *    math.powmod(2, 10, 1000)        // returns 24
   *    math.powmod(3, -1, 7)           // returns 5
   *    math.powmod(2, 10, -1000)       // returns -976
   *    math.powmod(2n, 127n, 2n ** 127n - 1n) // returns 1n
   *
   * See also:
   *
   *    pow, mod, invmod, gcd, xgcd
   *
   * History:
   *
   *    v15.3  Created
   *
   * @param {number | BigNumber | bigint} b  The base, an integer
   * @param {number | BigNumber | bigint} e  The exponent, an integer
   * @param {number | BigNumber | bigint} m  The modulus, a non-zero integer
   * @return {number | BigNumber | bigint}   Returns `b^e mod m`
   */
  return typed(name, {
    'number, number, number': (b, e, m) => number(powmodChecked(b, e, m)),
    'BigNumber, BigNumber, BigNumber': (b, e, m) => bignumber(powmodChecked(b, e, m)),
    // Any bigint argument gives a bigint result, as in mod
    'bigint, number | bigint, number | bigint': powmodChecked,
    'number, bigint, number | bigint': powmodChecked,
    'number, number, bigint': powmodChecked
  })

  function powmodChecked (b, e, m) {
    if (!isInteger(b) || !isInteger(e) || !isInteger(m)) {
      throw new Error(`Arguments of powmod must be integers, not ${b}, ${e} and ${m}`)
    }
    return powmodBigint(bigint(b), bigint(e), bigint(m))
  }

  function powmodBigint (b, e, m) {
    if (m === 0n) {
      throw new Error('powmod: modulus must be non-zero')
    }
    if (e < 0n) {
      const inv = invmod(b, m)
      if (Number.isNaN(inv)) {
        throw new Error(`powmod: ${b} has no inverse modulo ${m}, so the exponent cannot be negative`)
      }
      b = inv
      e = -e
    }
    // % keeps every value congruent and below |m|; mod fixes the sign at the end
    let result = 1n
    b %= m
    while (e > 0n) {
      if (e & 1n) result = (result * b) % m
      e >>= 1n
      b = (b * b) % m
    }
    return mod(result, m)
  }
})
