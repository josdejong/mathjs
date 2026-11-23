// test setSize
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('setSize', function () {
  it('should return the number of elements of a set', function () {
    assert.strictEqual(math.setSize([]), 0)
    assert.strictEqual(math.setSize([1]), 1)
    assert.strictEqual(math.setSize([1, 2]), 2)
    assert.strictEqual(math.setSize([1, math.complex(2, 2)]), 2)
  })

  it('should return the number of elements of a multiset', function () {
    assert.strictEqual(math.setSize([1, 1]), 2)
    assert.strictEqual(math.setSize([1, 1], true), 1)
    assert.strictEqual(math.setSize([1, 2, 1], true), 2)
  })

  it('should count no unique elements in empty collections', function () {
    const emptyCollections = [[], [[]], [[], []], math.matrix([]), math.matrix([[]]), math.sparse([])]
    for (const collection of emptyCollections) {
      assert.strictEqual(math.setSize(collection, true), 0)
      assert.strictEqual(math.setSize(collection, false), 0)
      assert.strictEqual(math.setSize(collection), 0)
    }
  })

  it('should count unique elements after flattening arrays and matrices', function () {
    const values = [[1, 2], [2, 1]]
    for (const collection of [values, math.matrix(values), math.sparse(values)]) {
      assert.strictEqual(math.setSize(collection, true), 2)
      assert.strictEqual(math.setSize(collection, false), 4)
    }
  })

  it('should return a number', function () {
    assert.strictEqual(math.typeOf(math.setSize([1, 2, 3])), 'number')
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { math.setSize([], []) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.setSize() }, /TypeError: Too few arguments/)
  })
})
