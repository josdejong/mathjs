import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

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
})
