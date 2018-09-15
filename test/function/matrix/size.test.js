// test size
const assert = require('assert')
const math = require('../../../src/main')
const size = math.size
const matrix = math.matrix

describe('size', function () {
  it('should calculate the size of an array', function () {
    assert.deepStrictEqual(size([[1, 2, 3], [4, 5, 6]]), [2, 3])
    assert.deepStrictEqual(size([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]), [2, 2, 2])
    assert.deepStrictEqual(size([1, 2, 3]), [3])
    assert.deepStrictEqual(size([[1], [2], [3]]), [3, 1])
    assert.deepStrictEqual(size([100]), [1])
    assert.deepStrictEqual(size([[100]]), [1, 1])
    assert.deepStrictEqual(size([[[100]]]), [1, 1, 1])
    assert.deepStrictEqual(size([]), [0])
    assert.deepStrictEqual(size([[]]), [1, 0])
    assert.deepStrictEqual(size([[[]]]), [1, 1, 0])
    assert.deepStrictEqual(size([[[], []]]), [1, 2, 0])
  })

  it('should calculate the size of a matrix', function () {
    assert.deepStrictEqual(size(matrix()), matrix([0]))
    assert.deepStrictEqual(size(matrix([[1, 2, 3], [4, 5, 6]])), matrix([2, 3]))
    assert.deepStrictEqual(size(matrix([[], []])), matrix([2, 0]))
  })

  it('should calculate the size of a range', function () {
    assert.deepStrictEqual(size(math.range(2, 6)), matrix([4]))
  })

  it('should calculate the size of a scalar', function () {
    assert.deepStrictEqual(size(2), matrix([]))
    assert.deepStrictEqual(size(math.bignumber(2)), matrix([]))
    assert.deepStrictEqual(size(math.complex(2, 3)), matrix([]))
    assert.deepStrictEqual(size(true), matrix([]))
    assert.deepStrictEqual(size(null), matrix([]))
  })

  it('should calculate the size of a scalar with setting matrix=="array"', function () {
    const math2 = math.create({ matrix: 'Array' })
    assert.deepStrictEqual(math2.size(2), [])
    assert.deepStrictEqual(math2.size(math2.bignumber(2)), [])
    assert.deepStrictEqual(math2.size(math2.complex(2, 3)), [])
    assert.deepStrictEqual(math2.size('string'), [6])
  })

  it('should calculate the size of a string', function () {
    assert.deepStrictEqual(size('hello'), matrix([5]))
    assert.deepStrictEqual(size(''), matrix([0]))
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { size() }, /TypeError: Too few arguments/)
    assert.throws(function () { size(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error if called with invalid type of arguments', function () {
    assert.throws(function () { size(new Date()) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX size', function () {
    const expression = math.parse('size(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{size}\\left(1\\right)')
  })
})
