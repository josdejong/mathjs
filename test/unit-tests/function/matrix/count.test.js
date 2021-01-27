// test count
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('count', function () {
  function assertCount (count) {
    assert.strictEqual(count([[1, 2, 3], [4, 5, 6]]), 6)
    assert.strictEqual(count([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), 8)
    assert.strictEqual(count([]), 0)
    assert.strictEqual(count([[]]), 0)

    assert.strictEqual(count('123456'), 6)
    assert.strictEqual(count(''), 0)
  }

  it('should count something with a size as Matrix', function () {
    assertCount(math.count)
  })

  it('should count something with a size as Array', function () {
    const math2 = math.create({ matrix: 'Array' })
    assertCount(math2.count)
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { math.count() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.count(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { math.count(new Date()) }, /TypeError: Unexpected type of argument/)
  })
})
