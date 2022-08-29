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
})
