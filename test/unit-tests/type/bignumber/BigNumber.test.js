import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import Decimal from 'decimal.js'

describe('BigNumber', function () {
  it('should have a property isBigNumber', function () {
    const a = new math.BigNumber(5)
    assert.strictEqual(a.isBigNumber, true)
  })

  it('should have a property type', function () {
    const a = new math.BigNumber(5)
    assert.strictEqual(a.type, 'BigNumber')
  })

  it('toJSON', function () {
    assert.deepStrictEqual(new math.BigNumber(5).toJSON(), { mathjs: 'BigNumber', value: '5' })
  })

  it('fromJSON', function () {
    const b = math.BigNumber.fromJSON({ value: '5' })
    assert.ok(b instanceof math.BigNumber)
    assert.strictEqual(b.toString(), '5')
    assert.deepStrictEqual(b, new math.BigNumber(5))
  })

  it('should not pollute the prototype of Decimal', function () {
    const a = new Decimal(2)
    assert.ok(a instanceof math.BigNumber === false)
    assert.ok(a.isBigNumber === undefined)
    assert.ok(Decimal.prototype.isBigNumber === undefined)

    assert.strictEqual(a.toJSON(), '2')
  })

  it('should restore precision and rounding when a trigonometric method throws', function () {
    const bigmath = math.create({ number: 'BigNumber', precision: 509 })
    const BigNumber = bigmath.BigNumber

    assert.throws(
      () => bigmath.pi.div(2).tangent(),
      error => {
        assert.ok(error instanceof Error)
        assert.match(error.message, /decimal\.js trigonometric functions are limited/)
        assert.match(error.message, /configured precision is 509/)
        return true
      }
    )
    assert.strictEqual(BigNumber.precision, 509)
    assert.strictEqual(BigNumber.rounding, Decimal.ROUND_HALF_UP)

    bigmath.config({ precision: 100 })

    const UnwrappedBigNumber = Decimal.clone({ precision: 100, modulo: Decimal.EUCLID })
    const value = bigmath.pi.div(2)
    const expected = new UnwrappedBigNumber(value.toString()).tan()

    assert.strictEqual(BigNumber.precision, 100)
    assert.strictEqual(bigmath.tan(value).toString(), expected.toString())

    bigmath.config({ precision: 509 })
  })
})
