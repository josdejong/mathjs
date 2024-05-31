import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const isNumeric = math.isNumeric
const bignumber = math.bignumber
const bigint = math.bigint
const fraction = math.fraction

describe('isNumeric', function () {
  it('should test whether a value is numeric', function () {
    assert.strictEqual(isNumeric(2), true)
    assert.strictEqual(isNumeric(true), true)
    assert.strictEqual(isNumeric(bignumber(2.3)), true)
    assert.strictEqual(isNumeric(bigint('42')), true)
    assert.strictEqual(isNumeric(42n), true)
    assert.strictEqual(isNumeric(fraction(1, 3)), true)

    assert.strictEqual(isNumeric('2'), false)
    assert.strictEqual(isNumeric('foo'), false)
    assert.strictEqual(isNumeric(math.complex(2, 3)), false)
    assert.strictEqual(isNumeric(math.unit('5 cm')), false)
    assert.strictEqual(isNumeric(null), false)
    assert.strictEqual(isNumeric(undefined), false)
    assert.strictEqual(isNumeric(math.parse('2+4')), false)
  })

  it('should test isNumeric element wise on an Array', function () {
    assert.deepStrictEqual(isNumeric([2, 'foo', true]), [true, false, true])
  })

  it('should test isNumeric element wise on a Matrix', function () {
    assert.deepStrictEqual(isNumeric(math.matrix([2, 'foo', true])), math.matrix([true, false, true]))
  })

  it('should throw an error in case of unsupported data types', function () {
    assert.throws(function () { isNumeric(new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { isNumeric({}) }, /TypeError: Unexpected type of argument/)
  })
})
