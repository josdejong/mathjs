import assert from 'assert'
import { product } from '../../../src/utils/product.js'

describe('product', function () {
  it('should preserve empty, singleton and negative ranges', function () {
    assert.strictEqual(product(2, 1), 1)
    assert.strictEqual(product(7, 7), 7)
    assert.strictEqual(product(-3, -1), -6)
  })

  it('should multiply adjacent values without truncating them to 32 bits', function () {
    for (const n of [Number.MAX_SAFE_INTEGER, 2 ** 30, 2 ** 30 + 1, 2 ** 31, 2 ** 32]) {
      assert.strictEqual(product(n - 1, n), (n - 1) * n)
    }
  })

  it('should split adjacent values at the safe integer limit without rounding up', function () {
    const n = Number.MAX_SAFE_INTEGER
    assert.strictEqual(product(n - 1, n), (n - 1) * n)
  })
})
