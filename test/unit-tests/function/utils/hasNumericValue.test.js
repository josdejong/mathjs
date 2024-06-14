import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const hasNumericValue = math.hasNumericValue
const bignumber = math.bignumber
const bigint = math.bigint
const fraction = math.fraction

describe('hasNumericValue', function () {
  it('should test whether a value is numeric', function () {
    assert.strictEqual(hasNumericValue(2), true)
    assert.strictEqual(hasNumericValue(true), true)
    assert.strictEqual(hasNumericValue(bignumber(2.3)), true)
    assert.strictEqual(hasNumericValue(bigint('42')), true)
    assert.strictEqual(hasNumericValue(42n), true)
    assert.strictEqual(hasNumericValue(fraction(1, 3)), true)

    assert.strictEqual(hasNumericValue('2'), true)
    assert.strictEqual(hasNumericValue(' 2'), true)
    assert.strictEqual(hasNumericValue('2.3'), true)
    assert.strictEqual(hasNumericValue(true), true)
    assert.strictEqual(hasNumericValue(false), true)
    assert.strictEqual(hasNumericValue('100a'), false)
    assert.strictEqual(hasNumericValue('0x11'), true)
    // The following two tests are not working on IE11
    // assert.strictEqual(hasNumericValue('0b11'), true)
    // assert.strictEqual(hasNumericValue('0o11'), true)
    assert.strictEqual(hasNumericValue('123e-1'), true)
    assert.strictEqual(hasNumericValue(''), false)
    assert.strictEqual(hasNumericValue('foo'), false)
    assert.strictEqual(hasNumericValue(math.complex(2, 3)), false)
    assert.strictEqual(hasNumericValue(math.unit('5 cm')), false)
    assert.strictEqual(hasNumericValue(null), false)
    assert.strictEqual(hasNumericValue(undefined), false)
    assert.strictEqual(hasNumericValue(math.parse('2+4')), false)
  })

  it('should test hasNumericValue element wise on an Array', function () {
    assert.deepStrictEqual(hasNumericValue([2, 'foo', true]), [true, false, true])
  })

  it('should test hasNumericValue element wise on a Matrix', function () {
    assert.deepStrictEqual(hasNumericValue(math.matrix([2, 'foo', true])), math.matrix([true, false, true]))
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () { hasNumericValue(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { hasNumericValue({}) }, /TypeError: Unexpected type of argument/)
  })
})
