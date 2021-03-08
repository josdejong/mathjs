import assert from 'assert'
import math from '../../../src/defaultInstance.js'
const bool = math.boolean

describe('boolean', function () {
  it('should convert a boolean to a boolean', function () {
    assert.strictEqual(bool(true), true)
    assert.strictEqual(bool(false), false)
  })

  it('should convert null to a boolean', function () {
    assert.strictEqual(bool(null), false)
  })

  it('should convert a number into a boolean', function () {
    assert.strictEqual(bool(-2), true)
    assert.strictEqual(bool(-1), true)
    assert.strictEqual(bool(0), false)
    assert.strictEqual(bool(1), true)
    assert.strictEqual(bool(2), true)
  })

  it('should convert a bignumber into a boolean', function () {
    assert.strictEqual(bool(math.bignumber(-2)), true)
    assert.strictEqual(bool(math.bignumber(-1)), true)
    assert.strictEqual(bool(math.bignumber(0)), false)
    assert.strictEqual(bool(math.bignumber(1)), true)
    assert.strictEqual(bool(math.bignumber(2)), true)
  })

  it('should convert the elements of a matrix or array to booleans', function () {
    assert.deepStrictEqual(bool(math.matrix([1, 0, 1, 1])), math.matrix([true, false, true, true]))
    assert.deepStrictEqual(bool([1, 0, 1, 1]), [true, false, true, true])
  })

  it('should convert a string into a boolean', function () {
    assert.strictEqual(bool('true'), true)
    assert.strictEqual(bool('false'), false)

    assert.strictEqual(bool('True'), true)
    assert.strictEqual(bool('False'), false)

    assert.strictEqual(bool('1'), true)
    assert.strictEqual(bool('0'), false)
    assert.strictEqual(bool(' 0 '), false)

    assert.strictEqual(bool('2'), true)
    assert.strictEqual(bool(' 4e2 '), true)
    assert.strictEqual(bool(' -4e2 '), true)
  })

  it('should throw an error if the string is not a valid number', function () {
    assert.throws(function () { bool('') }, /Error: Cannot convert/)
    assert.throws(function () { bool('23a') }, /Error: Cannot convert/)
  })

  it('should throw an error if there\'s a wrong number of arguments', function () {
    assert.throws(function () { bool(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if used with a complex', function () {
    assert.throws(function () { bool(math.complex(2, 3)) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error if used with a unit', function () {
    assert.throws(function () { bool(math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX boolean', function () {
    const expression = math.parse('boolean(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{boolean}\\left(1\\right)')
  })
})
