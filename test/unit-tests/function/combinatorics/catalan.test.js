import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const catalan = math.catalan

describe('catalan', function () {
  it('should calculate the nth catalan number', function () {
    assert.strictEqual(catalan(3), 5)
    assert.strictEqual(catalan(0), 1)
    assert.strictEqual(catalan(8), 1430)
  })

  it('should calculate the nth catalan number with BigNumbers', function () {
    assert.deepStrictEqual(catalan(math.bignumber(7)), math.bignumber(429))
    assert.deepStrictEqual(catalan(math.bignumber(13)), math.bignumber(742900))
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { catalan(0.5) }, TypeError)
    assert.throws(function () { catalan(-1) }, TypeError)
    assert.throws(function () { catalan(math.bignumber(-3)) }, TypeError)
    assert.throws(function () { catalan(math.bignumber(3.5)) }, TypeError)
  })

  it('should throw an error in case of non-integer input', function () {
    assert.throws(function () { catalan(5.2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of negative input', function () {
    assert.throws(function () { catalan(-2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of wrong number or type of arguments', function () {
    assert.throws(function () { catalan(5, 3, 2) })
    assert.throws(function () { catalan(true, 'hello world') })
  })

  it('should LaTeX catalan', function () {
    const expression = math.parse('catalan(3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{C}_{3}')
  })
})
