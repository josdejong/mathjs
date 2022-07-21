// test setCartesian
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('setCartesian', function () {
  it('should return the cartesian product of two sets', function () {
    assert.deepStrictEqual(math.setCartesian([1], [3]), [[1, 3]])
    assert.deepStrictEqual(math.setCartesian([1, 2], [3]), [[1, 3], [2, 3]])
    assert.deepStrictEqual(math.setCartesian([1, 2], [3, 4]), [[1, 3], [1, 4], [2, 3], [2, 4]])
    assert.deepStrictEqual(math.setCartesian([], [3, 4]), [])
    assert.deepStrictEqual(math.setCartesian([], []), [])
  })

  it('should return the cartesian product of two sets with mixed content', function () {
    assert.deepStrictEqual(math.setCartesian([1, math.complex(2, 3)], [3]), [[math.complex(2, 3), 3], [1, 3]])
  })

  it('should return the cartesian product of two multisets', function () {
    assert.deepStrictEqual(math.setCartesian([1, 1], [3, 3]), [[1, 3], [1, 3], [1, 3], [1, 3]])
  })

  it('should return the same type of output as the inputs', function () {
    assert.strictEqual(math.typeOf(math.setCartesian([1, 2, 3], [3, 4, 5])), 'Array')
    assert.strictEqual(
      math.typeOf(
        math.setCartesian(math.matrix([1, 2, 3]), math.matrix([3, 4, 5]))),
      'DenseMatrix')
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.setCartesian() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.setCartesian([], [], []) }, /TypeError: Too many arguments/)
  })
})
