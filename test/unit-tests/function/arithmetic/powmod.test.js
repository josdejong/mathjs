// test powmod
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const { powmod, bignumber, complex, fraction, matrix } = math

// Reference: full power then remainder, with the sign convention of mod
function refPowmod (b, e, m) {
  const am = m < 0n ? -m : m
  let r = (b ** e) % am
  if (r < 0n) r += am
  return (m < 0n && r !== 0n) ? r - am : r
}

// Small deterministic PRNG so failures are reproducible
function makeRandom (seed) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// bigint() converts numbers and BigNumbers exactly only below this
const BIGINT_LIMIT = 10n ** 21n

function abs (x) {
  return x < 0n ? -x : x
}

function randomBigint (rand, bits) {
  let x = 0n
  for (let i = 0; i < bits; i += 16) {
    x = (x << 16n) | BigInt(Math.floor(rand() * 65536))
  }
  return x & ((1n << BigInt(bits)) - 1n)
}

describe('powmod', function () {
  it('should compute modular powers of numbers', function () {
    assert.strictEqual(powmod(10, 58, 531), 1)
    assert.strictEqual(powmod(10, 16, 3), 1)
    assert.strictEqual(powmod(2, 10, 1000), 24)
    assert.strictEqual(powmod(3, 200, 50), 1)
    assert.strictEqual(powmod(7, 1, 13), 7)
    assert.strictEqual(powmod(4, 13, 497), 445)
  })

  it('should handle a zero exponent and a modulus of one', function () {
    assert.strictEqual(powmod(5, 0, 7), 1)
    assert.strictEqual(powmod(0, 0, 7), 1)
    assert.strictEqual(powmod(5, 0, 1), 0)
    assert.strictEqual(powmod(5, 3, 1), 0)
    assert.strictEqual(powmod(5, 3, -1), 0)
    assert.strictEqual(powmod(0, 5, 7), 0)
    assert.strictEqual(powmod(5n, 0n, 1n), 0n)
    assert.deepStrictEqual(powmod(bignumber(5), bignumber(0), bignumber(1)), bignumber(0))
  })

  it('should never return negative zero', function () {
    assert(Object.is(powmod(-5, 3, 5), 0))
    assert(Object.is(powmod(-0, 3, 5), 0))
    assert(Object.is(powmod(10, 2, -5), 0))
    assert(Object.is(powmod(-3, 2, 1), 0))
  })

  it('should reduce negative bases', function () {
    assert.strictEqual(powmod(-2, 3, 7), 6)
    assert.strictEqual(powmod(-2, 2, 7), 4)
    assert.strictEqual(powmod(-2n, 3n, 7n), 6n)
  })

  it('should follow the sign convention of mod for a negative modulus', function () {
    assert.strictEqual(powmod(2, 10, -1000), -976)
    assert.strictEqual(powmod(2, 10, -1000), math.mod(1024, -1000))
    assert.strictEqual(powmod(3, 3, -7), -1)
    assert.strictEqual(powmod(3n, 3n, -7n), -1n)
    assert.deepStrictEqual(powmod(bignumber(3), bignumber(3), bignumber(-7)), bignumber(-1))
  })

  it('should use the modular inverse for negative exponents', function () {
    assert.strictEqual(powmod(3, -1, 7), 5)
    assert.strictEqual(powmod(3, -1, 7), math.invmod(3, 7))
    assert.strictEqual(powmod(3, -2, 7), 4)
    assert.strictEqual(powmod(3, -1, -7), -2)
    assert.strictEqual(powmod(-3, -1, 7), 2)
    assert.strictEqual(powmod(3n, -3n, 1000000007n), 370370373n)
    assert.deepStrictEqual(powmod(bignumber(3), bignumber(-1), bignumber(7)), bignumber(5))
    assert.strictEqual(powmod(4, -1, 1), 0)
  })

  it('should throw for a negative exponent when the base has no inverse', function () {
    assert.throws(function () { powmod(2, -1, 8) }, /no inverse modulo 8/)
    assert.throws(function () { powmod(0, -1, 7) }, /no inverse/)
    assert.throws(function () { powmod(6n, -2n, 9n) }, /no inverse/)
    assert.throws(function () { powmod(bignumber(6), bignumber(-2), bignumber(9)) }, /no inverse/)
  })

  it('should throw for a zero modulus', function () {
    assert.throws(function () { powmod(2, 3, 0) }, /modulus must be non-zero/)
    assert.throws(function () { powmod(2, 3, -0) }, /modulus must be non-zero/)
    assert.throws(function () { powmod(2, -3, 0) }, /modulus must be non-zero/)
    assert.throws(function () { powmod(2n, 3n, 0n) }, /modulus must be non-zero/)
    assert.throws(function () { powmod(bignumber(2), bignumber(3), bignumber(0)) }, /modulus must be non-zero/)
  })

  it('should throw for non-integer arguments', function () {
    assert.throws(function () { powmod(2.5, 3, 7) }, /powmod must be integers.*2.5/)
    assert.throws(function () { powmod(2, 3.5, 7) }, /powmod must be integers.*3.5/)
    assert.throws(function () { powmod(2, 3, 7.5) }, /powmod must be integers.*7.5/)
    assert.throws(function () { powmod(2, 3, NaN) }, /powmod must be integers/)
    assert.throws(function () { powmod(2, Infinity, 7) }, /powmod must be integers/)
    assert.throws(function () { powmod(2.5, 3n, 7n) }, /powmod must be integers/)
    assert.throws(function () { powmod(bignumber(2.5), bignumber(3), bignumber(7)) }, /powmod must be integers/)
    assert.throws(function () { powmod(bignumber(NaN), bignumber(3), bignumber(7)) }, /powmod must be integers/)
  })

  it('should stay exact for number moduli up to the safe integer limit', function () {
    // (m - 1)^2 exceeds 2^53 for these moduli, so naive float products would round
    const moduli = [94906265, 94906266, 94906267, 2 ** 32 + 15, 2 ** 52 + 3, Number.MAX_SAFE_INTEGER]
    const rand = makeRandom(1)
    for (const m of moduli) {
      for (let i = 0; i < 50; i++) {
        const b = Math.floor(rand() * m)
        const e = Math.floor(rand() * 200)
        assert.strictEqual(powmod(b, e, m), Number(refPowmod(BigInt(b), BigInt(e), BigInt(m))), `powmod(${b}, ${e}, ${m})`)
        assert.strictEqual(powmod(b, e, -m), Number(refPowmod(BigInt(b), BigInt(e), BigInt(-m))), `powmod(${b}, ${e}, ${-m})`)
      }
    }
    assert.strictEqual(powmod(Number.MAX_SAFE_INTEGER - 1, 2, Number.MAX_SAFE_INTEGER), 1)
  })

  it('should match a naive reference on random numbers', function () {
    const rand = makeRandom(2)
    for (let i = 0; i < 2000; i++) {
      const b = Math.floor((rand() - 0.5) * 2e6)
      const e = Math.floor(rand() * 60)
      let m = Math.floor((rand() - 0.5) * 2 * 2 ** (1 + Math.floor(rand() * 52)))
      if (m === 0) m = 1
      const expected = Number(refPowmod(BigInt(b), BigInt(e), BigInt(m)))
      assert.strictEqual(powmod(b, e, m), expected, `powmod(${b}, ${e}, ${m})`)
    }
  })

  it('should match a naive reference on random bigints and BigNumbers', function () {
    const rand = makeRandom(3)
    const big = math.create({ precision: 200 })
    for (let i = 0; i < 500; i++) {
      let b = randomBigint(rand, 1 + Math.floor(rand() * 200))
      if (rand() < 0.5) b = -b
      const e = BigInt(Math.floor(rand() * 40))
      let m = randomBigint(rand, 1 + Math.floor(rand() * 200))
      if (m === 0n) m = 1n
      if (rand() < 0.5) m = -m
      const expected = refPowmod(b, e, m)
      assert.strictEqual(powmod(b, e, m), expected, `powmod(${b}n, ${e}n, ${m}n)`)
      if (abs(b) >= BIGINT_LIMIT || abs(m) >= BIGINT_LIMIT) continue
      assert.strictEqual(
        big.powmod(big.bignumber(b.toString()), big.bignumber(e.toString()), big.bignumber(m.toString())).toFixed(),
        expected.toString(),
        `powmod(bignumber(${b}), ${e}, ${m})`
      )
    }
  })

  it('should handle huge exponents', function () {
    // Fermat: a^(p-1) = 1 mod p for prime p
    const p = 2n ** 127n - 1n
    assert.strictEqual(powmod(3n, p - 1n, p), 1n)
    assert.strictEqual(powmod(2n, 2n ** 1000n, 65537n), refPowmodByTotient(2n, 2n ** 1000n, 65537n))
    assert.strictEqual(powmod(3n, 10n ** 50n + 7n, 65537n), refPowmodByTotient(3n, 10n ** 50n + 7n, 65537n))
    assert.strictEqual(powmod(3, 2 ** 60, 65537), Number(refPowmodByTotient(3n, 2n ** 60n, 65537n)))
    // 2^53 - 111 is prime and its products exceed 2^53
    assert.strictEqual(powmod(5, 9007199254740880, 9007199254740881), 1)
  })

  it('should compute modular powers of BigNumbers', function () {
    assert.deepStrictEqual(powmod(bignumber(10), bignumber(58), bignumber(531)), bignumber(1))
    assert.deepStrictEqual(
      powmod(bignumber('123456789012'), bignumber(65537), bignumber('987654321098765432109')),
      bignumber(refPowmod(123456789012n, 65537n, 987654321098765432109n).toString())
    )
  })

  it('should handle mixed argument types', function () {
    assert.strictEqual(powmod(2, 10n, 1000), 24n)
    assert.strictEqual(powmod(2n, 10, 1000), 24n)
    assert.strictEqual(powmod(2, 10, 1000n), 24n)
    assert.deepStrictEqual(powmod(bignumber(2), 10, 1000), bignumber(24))
    assert.deepStrictEqual(powmod(2, bignumber(10), 1000n), bignumber(24))
  })

  it('should convert strings and booleans to numbers', function () {
    assert.strictEqual(powmod('10', '58', '531'), 1)
    assert.strictEqual(powmod(true, 5, 3), 1)
    assert.throws(function () { powmod('a', 2, 3) }, /Cannot convert "a" to a number/)
  })

  it('should throw for unsupported types and wrong argument counts', function () {
    assert.throws(function () { powmod(complex(1, 3), 2, 5) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { powmod(fraction(1, 3), 2, 5) }, /TypeError/)
    assert.throws(function () { powmod(matrix([2, 3]), 2, 5) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { powmod(2, 3) }, /TypeError: Too few arguments/)
    assert.throws(function () { powmod(2, 3, 4, 5) }, /TypeError: Too many arguments/)
  })

  it('should evaluate powmod in expressions', function () {
    assert.strictEqual(math.evaluate('powmod(10, 58, 531)'), 1)
    const big = math.create({ number: 'BigNumber' })
    assert.deepStrictEqual(big.evaluate('powmod(10, 58, 531)'), big.bignumber(1))
  })

  it('should LaTeX powmod', function () {
    const expression = math.parse('powmod(2,3,5)')
    assert.strictEqual(expression.toTex(), '\\mathrm{powmod}\\left(2,3,5\\right)')
  })
})

// Reduce the exponent with Fermat's little theorem (m prime, b coprime to m)
// so the reference does not need the full power
function refPowmodByTotient (b, e, p) {
  return refPowmod(b, e % (p - 1n), p)
}
