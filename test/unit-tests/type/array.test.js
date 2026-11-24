import assert from 'assert'
import math from '../../../src/defaultInstance.js'

const array = math.array

describe('array', function () {
  it('should be empty array for trivial inputs', function () {
    assert.deepStrictEqual(array(), [])
    assert.deepStrictEqual(array(null), [])
  })

  it('should convert a string to an array of characters', function () {
    assert.deepStrictEqual(array('tau'), ['t', 'a', 'u'])
    assert.deepStrictEqual(array('𝟙𝟚𝟛'), ['𝟙', '𝟚', '𝟛'])
  })

  it('should convert matrices', function () {
    assert.deepStrictEqual(array(math.matrix([1, 2, 3])), [1, 2, 3])
    assert.deepStrictEqual(array(math.matrix([[1], [2], [3]])), [[1], [2], [3]])
    assert.deepStrictEqual(array(math.matrix([[[1]], [[2]]])), [[[1]], [[2]]])
    assert.deepStrictEqual(array(math.matrix()), [])
    assert.deepStrictEqual(
      array(math.sparse([[0, 0], [0, 2]])), [[0, 0], [0, 2]])
  })

  it('should clone matrices', function () {
    const a = [3, 0n, 'frog']
    const b = array(a)
    assert.deepStrictEqual(a, b)
    assert.notStrictEqual(a, b)
  })

  it('should decompose Complex numbers', function () {
    assert.deepStrictEqual(array(math.complex(2, -3)), [2, -3])
  })

  it('should allocate arrays of numeric length', function () {
    assert.deepStrictEqual(array(3).length, 3)
    assert.deepStrictEqual(array(2n).length, 2)
    assert.deepStrictEqual(array(math.fraction(7 / 7)).length, 1)
    assert.deepStrictEqual(array(math.bignumber(4)).length, 4)
    assert.deepStrictEqual(array(true).length, 1)
    assert.deepStrictEqual(array(false), [])
  })

  it('should throw on noninteger numeric argument', function () {
    assert.throws(() => array(6.283185), /length must be.*integer/)
  })
})
