import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const bellNumbers = math.bellNumbers

describe('bellNumbers', function () {
  it('should calculate the number of partitions of a set', function () {
    assert.strictEqual(bellNumbers(3), 5)
    assert.strictEqual(bellNumbers(0), 1)
    assert.strictEqual(bellNumbers(8), 4140)
    assert.strictEqual(bellNumbers(17), 82864869804)
    assert.strictEqual(bellNumbers(22), 4506715738447323)
    // That's as large as we can go with number representation
  })

  it('should calculate the bellNumbers of n items with BigNumbers', function () {
    const bn = math.bignumber
    assert.deepStrictEqual(bellNumbers(bn(2)), bn(2))
    assert.deepStrictEqual(bellNumbers(bn(3)), bn(5))
    assert.deepStrictEqual(bellNumbers(bn(17)), bn(82864869804))
    assert.deepStrictEqual(bellNumbers(bn(22)), bn(4506715738447323))
    // and now we can go farther
    assert.deepStrictEqual(bellNumbers(bn(26)), bn('49631246523618756274'))
    assert.deepStrictEqual(bellNumbers(bn(50)),
      bn('185724268771078270438257767181908917499221852770'))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { bellNumbers(0.5) }, TypeError)
    assert.throws(function () { bellNumbers(-1) }, TypeError)
    assert.throws(function () { bellNumbers(math.bignumber(-3)) }, TypeError)
    assert.throws(function () { bellNumbers(math.bignumber(3.5)) }, TypeError)
  })

  it('should throw an error in case of non-integer input', function () {
    assert.throws(function () { bellNumbers(5.2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of negative input', function () {
    assert.throws(function () { bellNumbers(-2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of wrong number or type of arguments', function () {
    assert.throws(function () { bellNumbers(5, 3, 2) })
    assert.throws(function () { bellNumbers(true, 'hello world') })
  })

  it('should LaTeX bellNumbers', function () {
    const expression = math.parse('bellNumbers(3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{B}_{3}')
  })
})
