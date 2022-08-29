// test setIntersect
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'

describe('setIntersect', function () {
  it('should return the intersection of two sets', function () {
    assert.deepStrictEqual(math.setIntersect([1, 2, 3], [3, 4]), [3])
    assert.deepStrictEqual(math.setIntersect([1, 2], [3, 4]), [])
    assert.deepStrictEqual(math.setIntersect(['a', 'b', 'c'], ['c', 'd']), ['c'])
    assert.deepStrictEqual(math.setIntersect([1, math.complex(2, 2), math.complex(3, 3)],
      [math.complex(3, 3), 1]), [math.complex(3, 3), 1])
    assert.deepStrictEqual(math.setIntersect([], [3, 4]), [])
    assert.deepStrictEqual(math.setIntersect([], []), [])
  })

  it('should return the intersection of two multisets', function () {
    assert.deepStrictEqual(math.setIntersect([1, 1, 2, 3, 4, 4], [1, 2, 3, 4, 4, 4]), [1, 2, 3, 4, 4])
    assert.deepStrictEqual(math.setIntersect([1, 2, 1, 3, 4, 4], [1, 2, 4, 3, 4, 4]), [1, 2, 3, 4, 4])
  })

  it('should return the same type of output as the inputs', function () {
    assert.strictEqual(math.typeOf(math.setIntersect([1, 2, 3], [3, 4, 5])), 'Array')
    assert.strictEqual(
      math.typeOf(
        math.setIntersect(math.matrix([1, 2, 3]), math.matrix([3, 4, 5]))),
      'DenseMatrix')
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.setIntersect() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.setIntersect([], [], []) }, /TypeError: Too many arguments/)
  })
})
