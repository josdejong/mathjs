import assert from 'assert'
import { ArgumentsError } from '../../../src/error/ArgumentsError.js'

describe('ArgumentsError', function () {
  it('should construct an ArgumentsError without max', function () {
    const err = new ArgumentsError('myfunction', 1, 2)
    assert(err instanceof Error)
    assert(err instanceof ArgumentsError)
    assert.strictEqual(err.fn, 'myfunction')
    assert.strictEqual(err.count, 1)
    assert.strictEqual(err.min, 2)
    assert.strictEqual(err.max, undefined)
    assert.strictEqual(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2 expected)')
  })

  it('should construct an ArgumentsError with max', function () {
    const err = new ArgumentsError('myfunction', 1, 2, 3)
    assert(err instanceof Error)
    assert(err instanceof ArgumentsError)
    assert.strictEqual(err.fn, 'myfunction')
    assert.strictEqual(err.count, 1)
    assert.strictEqual(err.min, 2)
    assert.strictEqual(err.max, 3)
    assert.strictEqual(err.toString(), 'ArgumentsError: Wrong number of arguments in function myfunction (1 provided, 2-3 expected)')
  })

  it('should throw an error when operator new is missing', function () {
    assert.throws(function () {
      ArgumentsError()
    }, SyntaxError)
  })
})
