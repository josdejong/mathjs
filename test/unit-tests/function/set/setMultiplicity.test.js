// test setMultiplicity
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('setMultiplicity', function () {
  it('should return the multiplicity on an element of a set', function () {
    assert.deepStrictEqual(math.setMultiplicity(1, [1, 2]), 1)
    assert.deepStrictEqual(math.setMultiplicity(1, []), 0)
  })

  it('should return the multiplicity on an element of a multiset', function () {
    assert.deepStrictEqual(math.setMultiplicity(1, [1, 1, 2]), 2)
    assert.deepStrictEqual(math.setMultiplicity(1, [1, 2, 1]), 2)
  })

  it('should return a number', function () {
    assert.strictEqual(math.typeOf(math.setMultiplicity(3, [3, 4, 5])), 'number')
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.setMultiplicity() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.setMultiplicity(1, [], []) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid order of arguments', function () {
    assert.throws(function () { math.setMultiplicity([], 1) }, /TypeError: Unexpected type of argument/)
  })
})
