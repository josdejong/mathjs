import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

const summation = math.summation

describe('summation', function () {
  it('should produce the sum of a function over a range from start to end', function () {
    assert.deepEqual(summation(1, 5, x => x ** 2), 55)
    assert.deepEqual(summation(1, 4, x => x ** 3, 100))
  })

  it('should throw an error if start or end are not integers', function () {
    assert.throws(function () { summation(1.1, 2.2, x => x ** 2) })
    assert.throws(function () { summation(1.1, 2, x => x ** 2) })
    assert.throws(function () { summation(1, 2.4, x => x ** 2) })
  })

  it('should throw an error if end is less than start', function () {
    assert.throws(function () { summation(2, 1, x => x ** 2) })
  })
})
