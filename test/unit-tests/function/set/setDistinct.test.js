// test setDistinct
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('setDistinct', function () {
  it('should return the elements of a set', function () {
    assert.deepStrictEqual(math.setDistinct([1, 2]), [1, 2])
    assert.deepStrictEqual(math.setDistinct([]), [])
  })

  it('should return the distinct elements of a multiset', function () {
    assert.deepStrictEqual(math.setDistinct([1, 1, 2, 2]), [1, 2])
    assert.deepStrictEqual(math.setDistinct([1, 2, 1, 2]), [1, 2])
    assert.deepStrictEqual(math.setDistinct([1, 2, math.complex(3, 3), 2, math.complex(3, 3)]), [math.complex(3, 3), 1, 2])
  })

  it('should return the same type of output as the inputs', function () {
    assert.strictEqual(math.typeOf(math.setDistinct([1, 2, 3])), 'Array')
    assert.strictEqual(
      math.typeOf(math.setDistinct(math.matrix([1, 2, 3]))),
      'DenseMatrix')
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.setDistinct() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.setDistinct([], []) }, /TypeError: Too many arguments/)
  })
})
