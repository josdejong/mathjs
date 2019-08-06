import assert from 'assert'
import math from '../../../../src/bundleAny'
const multicombinations = math.multicombinations

describe('combinations', function () {
  it('should calculate the combinations of a number taking k at a time', function () {
    assert.strictEqual(multicombinations(7, 5), 462)
    assert.strictEqual(multicombinations(8, 33), 18643560)
    assert.strictEqual(multicombinations(63, 7), 1078897248)
    assert.strictEqual(multicombinations(25, 6), 593775)
  })

  it('should calculate the combinations of n items taken k at a time with BigNumbers', function () {
    assert.deepStrictEqual(multicombinations(math.bignumber(7), math.bignumber(5)), math.bignumber(462))
    assert.deepStrictEqual(multicombinations(math.bignumber(8), math.bignumber(33)), math.bignumber(18643560))
    assert.deepStrictEqual(multicombinations(math.bignumber(63), math.bignumber(7)), math.bignumber(1078897248))
    assert.deepStrictEqual(multicombinations(math.bignumber(25), math.bignumber(6)), math.bignumber(593775))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { multicombinations(-12, 6) }, TypeError)
    assert.throws(function () { multicombinations(12, -6) }, TypeError)
    assert.throws(function () { multicombinations(0.5, 3) }, TypeError)
    assert.throws(function () { multicombinations(4, 0.5) }, TypeError)
    assert.throws(function () { multicombinations(math.bignumber(3.5), math.bignumber(-3)) }, TypeError)
    assert.throws(function () { multicombinations(math.bignumber(3.5), 1 / 3) }, TypeError)
  })

  it('should fail loudly when k is larger than n + k - 1', function () {
    assert.throws(function () { multicombinations(0, 0) }, TypeError)
    assert.throws(function () { multicombinations(0, 3) }, TypeError)
  })

  it('should not work with the wrong number or type of arguments', function () {
    assert.throws(function () { multicombinations(5, 3, 2) })
    assert.throws(function () { multicombinations(true, 'hello world') })
  })

  it('should LaTeX combinations', function () {
    const expression = math.parse('multicombinations(3, 2)')
    assert.strictEqual(expression.toTex(), '\\left(\\!\\!{\\binom{3}{2}}\\!\\!\\right)')
  })
})
