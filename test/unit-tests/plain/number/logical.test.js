import assert from 'assert'
import { norNumber } from '../../../../src/plain/number/logical.js'

describe('nor', function () {
  it('should return true when both are 0', function () {
    assert.strictEqual(norNumber(0, 0), true)
  })

  it('should return false when one is 0 and the other is 1', function () {
    assert.strictEqual(norNumber(1, 0), false)
    assert.strictEqual(norNumber(0, 1), false)
  })

  it('should return false when both are 1', function () {
    assert.strictEqual(norNumber(1, 1), false)
  })
})
