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

  it('should convert a complex into a boolean', function () {
    assert.strictEqual(bool(math.complex(0, 0)), false)
    assert.strictEqual(bool(math.complex(0, 3)), true)
    assert.strictEqual(bool(math.complex(2, 0)), true)
    assert.strictEqual(bool(math.complex(2, 3)), true)
  })

  it('should convert a fraction into a boolean', function () {
    assert.strictEqual(bool(math.fraction(0)), false)
    assert.strictEqual(bool(math.fraction(1, 3)), true)
    assert.strictEqual(bool(math.fraction(-1, 3)), true)
    assert.strictEqual(bool(math.fraction(1n, 10n ** 400n)), true)
  })

  it('should convert a unit value into a boolean', function () {
    assert.strictEqual(bool(math.unit('m')), false)
    for (const makeValue of [x => x, math.bignumber, math.fraction, math.complex]) {
      assert.strictEqual(bool(math.unit(makeValue(0), 'm')), false)
      assert.strictEqual(bool(math.unit(makeValue(1), 'm')), true)
    }
  })

  it('should preserve BigNumber NaN conversion', function () {
    assert.strictEqual(bool(math.bignumber(NaN)), true)
  })

  it('should convert units constructed without a value to false', function () {
    assert.strictEqual(bool(new math.Unit(undefined, 'm')), false)
    assert.strictEqual(bool(new math.Unit()), false)
    assert.throws(() => bool(undefined), TypeError)
  })

  it('should convert complex, fraction and unit collections', function () {
    const values = [math.complex(0, 1), math.fraction(0), math.unit('1m')]
    assert.deepStrictEqual(bool(values), [true, false, true])
    assert.deepStrictEqual(bool(math.matrix(values)), math.matrix([true, false, true]))
  })

  it('should LaTeX boolean', function () {
    const expression = math.parse('boolean(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{boolean}\\left(1\\right)')
  })
})
