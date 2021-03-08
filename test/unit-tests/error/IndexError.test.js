import assert from 'assert'
import { IndexError } from '../../../src/error/IndexError.js'

describe('IndexError', function () {
  it('should construct an IndexError without min and max', function () {
    const err = new IndexError(5)
    assert(err instanceof Error)
    assert(err instanceof RangeError)
    assert(err instanceof IndexError)
    assert.strictEqual(err.index, 5)
    assert.strictEqual(err.min, 0)
    assert.strictEqual(err.max, undefined)
    assert.strictEqual(err.toString(), 'IndexError: Index out of range (5)')
  })

  it('should construct an IndexError without min and max (2)', function () {
    const err = new IndexError(-5)
    assert(err instanceof Error)
    assert(err instanceof RangeError)
    assert(err instanceof IndexError)
    assert.strictEqual(err.index, -5)
    assert.strictEqual(err.min, 0)
    assert.strictEqual(err.max, undefined)
    assert.strictEqual(err.toString(), 'IndexError: Index out of range (-5 < 0)')
  })

  it('should construct an IndexError with max', function () {
    const err = new IndexError(5, 3)
    assert(err instanceof Error)
    assert(err instanceof RangeError)
    assert(err instanceof IndexError)
    assert.strictEqual(err.index, 5)
    assert.strictEqual(err.min, 0)
    assert.strictEqual(err.max, 3)
    assert.strictEqual(err.toString(), 'IndexError: Index out of range (5 > 2)')
  })

  it('should construct an IndexError with min and max', function () {
    const err = new IndexError(0, 2, 5)
    assert(err instanceof Error)
    assert(err instanceof RangeError)
    assert(err instanceof IndexError)
    assert.strictEqual(err.index, 0)
    assert.strictEqual(err.min, 2)
    assert.strictEqual(err.max, 5)
    assert.strictEqual(err.toString(), 'IndexError: Index out of range (0 < 2)')
  })

  it('should construct an IndexError with min and max', function () {
    const err = new IndexError(6, 1, 4)
    assert(err instanceof Error)
    assert(err instanceof RangeError)
    assert(err instanceof IndexError)
    assert.strictEqual(err.index, 6)
    assert.strictEqual(err.min, 1)
    assert.strictEqual(err.max, 4)
    assert.strictEqual(err.toString(), 'IndexError: Index out of range (6 > 3)')
  })

  it('should throw an error when constructed without new operator', function () {
    assert.throws(function () {
      IndexError(5)
    })
  })
})
