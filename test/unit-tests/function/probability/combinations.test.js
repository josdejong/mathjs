import assert from 'assert'
import { approxEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const combinations = math.combinations

describe('combinations', function () {
  it('should calculate the combinations of a number taking k at a time', function () {
    assert.strictEqual(combinations(0, 0), 1)
    assert.strictEqual(combinations(7, 5), 21)
    assert.strictEqual(combinations(20, 15), 15504)
    assert.strictEqual(combinations(63, 7), 553270671)
    assert.strictEqual(combinations(25, 6), 177100)
    assert.strictEqual(combinations(42, 21), 538257874440)
    assert.strictEqual(combinations(44, 21), 2012616400080)
  })

  const largeResults = [
    [280, 139, 9.189269586344626e82],
    [300, 150, 9.375970277282745e88],
    [876, 694, 8.286457300994857e192],
    [1000, 500, 2.7028824094543655e299],
    [1029, 514, 1.429820686498904e308]
  ]
  for (const [n, k, expected] of largeResults) {
    it(`should avoid intermediate overflow for combinations(${n}, ${k})`, function () {
      for (const count of [k, n - k]) {
        const actual = combinations(n, count)
        assert.ok(Number.isFinite(actual))
        approxEqual(actual / expected, 1, 1e-13)
      }
    })
  }

  it('should return Infinity when the result exceeds the number range', function () {
    assert.strictEqual(combinations(1030, 515), Infinity)
    assert.strictEqual(combinations(1100, 550), Infinity)
  })

  it('should keep boundary choices exact for large n', function () {
    assert.strictEqual(combinations(1000, 0), 1)
    assert.strictEqual(combinations(1000, 1), 1000)
    assert.strictEqual(combinations(1000, 999), 1000)
    assert.strictEqual(combinations(1000, 1000), 1)
  })

  it('should calculate the combinations of n items taken k at a time with BigNumbers', function () {
    assert.deepStrictEqual(combinations(math.bignumber(7), math.bignumber(5)), math.bignumber(21))
    assert.deepStrictEqual(combinations(math.bignumber(20), math.bignumber(15)), math.bignumber(15504))
    assert.deepStrictEqual(combinations(math.bignumber(63), math.bignumber(7)), math.bignumber(553270671))
    assert.deepStrictEqual(combinations(math.bignumber(25), math.bignumber(6)), math.bignumber(177100))
    assert.deepStrictEqual(combinations(math.bignumber(42), math.bignumber(21)), math.bignumber(538257874440))
    assert.deepStrictEqual(combinations(math.bignumber(44), math.bignumber(21)), math.bignumber(2012616400080))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { combinations(-12, 6) }, TypeError)
    assert.throws(function () { combinations(12, -6) }, TypeError)
    assert.throws(function () { combinations(0.5, 3) }, TypeError)
    assert.throws(function () { combinations(4, 0.5) }, TypeError)
    assert.throws(function () { combinations(3, 5) }, TypeError)
    assert.throws(function () { combinations(math.bignumber(3), math.bignumber(5)) }, TypeError)
    assert.throws(function () { combinations(math.bignumber(3.5), math.bignumber(-3)) }, TypeError)
    assert.throws(function () { combinations(math.bignumber(3.5), 1 / 3) }, TypeError)
  })

  it('should not work with the wrong number or type of arguments', function () {
    assert.throws(function () { combinations(5, 3, 2) })
    assert.throws(function () { combinations(true, 'hello world') })
  })

  it('should LaTeX combinations', function () {
    const expression = math.parse('combinations(3,2)')
    assert.strictEqual(expression.toTex(), '\\binom{3}{2}')
  })
})
