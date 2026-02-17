import assert from 'assert'
import { nandNumber, norNumber } from '../../../../src/plain/number/logical.js'

describe('nor/nand', function () {
  it('nor should return true when both are 0', function () {
    assert.strictEqual(norNumber(0, 0), true)
  })

  it('nor should return false when one is 0 and the other is 1', function () {
    assert.strictEqual(norNumber(1, 0), false)
    assert.strictEqual(norNumber(0, 1), false)
  })

  it('nor should return false when both are 1', function () {
    assert.strictEqual(norNumber(1, 1), false)
  })

  it('nand should return true when both are 0', function () {
    assert.strictEqual(nandNumber(0, 0), true)
  })

  it('nand should return true when one is 0 and the other is 1', function () {
    assert.strictEqual(nandNumber(1, 0), true)
    assert.strictEqual(nandNumber(0, 1), true)
  })

  it('nand should return false when both are 1', function () {
    assert.strictEqual(nandNumber(1, 1), false)
  })
})
