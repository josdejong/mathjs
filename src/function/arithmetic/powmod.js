import { factory } from '../../utils/factory.js'
import { isInteger } from '../../utils/number.js'

const name = 'powmod'
const dependencies = ['typed', '?BigNumber']

// Largest modulus for which (m - 1)^2 is still a safe integer, so the number
// path can multiply natively without losing precision.
const MAX_NATIVE_MODULUS = 94906266

export const createPowmod = /* #__PURE__ */ factory(name, dependencies, ({ typed, BigNumber }) => {
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
   * For `number` arguments, the result is exact as long as the modulus is a
   * safe integer. Use `bigint` (or `BigNumber`) for larger moduli.
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
    'number, number, number': _powmodNumber,
    // Any bigint argument: compute in bigint, preferring bigint output as `mod` does
    'bigint, number | bigint, number | bigint': _powmodMixed,
    'number, bigint, number | bigint': _powmodMixed,
    'number, number, bigint': _powmodMixed,
    'BigNumber, BigNumber, BigNumber': function (b, e, m) {
      if (!b.isInteger() || !e.isInteger() || !m.isInteger()) {
        throw new Error(`Arguments of powmod must be integers, not ${b}, ${e} and ${m}`)
      }
      const r = _powmodBigint(_toBigint(b), _toBigint(e), _toBigint(m))
      return new BigNumber(r.toString())
    }
  })

  function _checkIntegers (b, e, m) {
    if (!_isInt(b) || !_isInt(e) || !_isInt(m)) {
      throw new Error(`Arguments of powmod must be integers, not ${b}, ${e} and ${m}`)
    }
  }

  function _powmodMixed (b, e, m) {
    _checkIntegers(b, e, m)
    return _powmodBigint(BigInt(b), BigInt(e), BigInt(m))
  }

  function _powmodNumber (b, e, m) {
    _checkIntegers(b, e, m)
    const am = Math.abs(m)
    if (am > MAX_NATIVE_MODULUS || e < 0) {
      // Products could exceed 2^53 (or we need an inverse): go exact via bigint
      return Number(_powmodBigint(BigInt(b), BigInt(e), BigInt(m)))
    }
    if (am === 0) {
      throw new Error('powmod: modulus must be non-zero')
    }
    // Also maps -0 to 0
    let base = ((b % am) + am) % am
    let result = 1 % am
    while (e > 0) {
      if (e % 2 === 1) result = (result * base) % am
      e = Math.floor(e / 2)
      if (e > 0) base = (base * base) % am
    }
    return (m < 0 && result !== 0) ? result - am : result
  }
})

function _isInt (x) {
  return typeof x === 'bigint' || isInteger(x)
}

function _toBigint (x) {
  return BigInt(x.toFixed())
}

function _powmodBigint (b, e, m) {
  if (m === 0n) {
    throw new Error('powmod: modulus must be non-zero')
  }
  const am = m < 0n ? -m : m
  let base = b % am
  if (base < 0n) base += am
  if (e < 0n) {
    base = _invmodBigint(base, am)
    e = -e
  }
  let result = 1n % am
  while (e > 0n) {
    if (e & 1n) result = (result * base) % am
    e >>= 1n
    if (e > 0n) base = (base * base) % am
  }
  return (m < 0n && result !== 0n) ? result - am : result
}

// Inverse of a modulo m, for 0 <= a < m, via the extended Euclidean algorithm
function _invmodBigint (a, m) {
  let [r0, r1] = [m, a]
  let [t0, t1] = [0n, 1n]
  while (r1 !== 0n) {
    const q = r0 / r1;
    [r0, r1] = [r1, r0 - q * r1];
    [t0, t1] = [t1, t0 - q * t1]
  }
  if (r0 !== 1n) {
    throw new Error(`powmod: base has no inverse modulo ${m}, so the exponent cannot be negative`)
  }
  return t0 < 0n ? t0 + m : t0
}
