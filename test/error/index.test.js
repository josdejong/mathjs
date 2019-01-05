import assert from 'assert'
import error from '../../src/error/index'

describe('index.js', function () {
  it('should contain error factory functions', function () {
    assert(Array.isArray(error))
    assert(error[0].fn, 'ArgumentsError')
    assert(error[1].fn, 'DimensionError')
    assert(error[2].fn, 'IndexError')
  })
})
