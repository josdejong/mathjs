import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const multinomial = math.multinomial

describe('multinomial', function () {
  it('should calculate the multinomial of an array of numbers', function () {
    assert.strictEqual(multinomial([1, 2, 1]), 12)
    assert.strictEqual(multinomial([4, 2, 1]), 105)
    assert.strictEqual(multinomial([4, 4]), 70)
  })

  it('should calculate the multinomial of n items taken k at a time with BigNumbers', function () {
    assert.deepStrictEqual(multinomial([math.bignumber(3), math.bignumber(4), math.bignumber(5)]), math.bignumber(27720))
    assert.deepStrictEqual(multinomial([math.bignumber(10), math.bignumber(1), math.bignumber(2)]), math.bignumber(858))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { multinomial([0.5, 3]) }, TypeError)
    assert.throws(function () { multinomial([math.bignumber(3), math.bignumber(0.5)]) }, TypeError)
    assert.throws(function () { multinomial([math.bignumber(3.5), math.bignumber(-3)]) }, TypeError)
    assert.throws(function () { multinomial([math.bignumber(3.5), 1 / 3]) }, TypeError)
  })

  it('should not work with the wrong number or type of arguments', function () {
    assert.throws(function () { multinomial(5, 3, 2) })
    assert.throws(function () { multinomial(true, 'hello world') })
  })
})
