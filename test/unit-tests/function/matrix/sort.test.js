import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('sort', function () {
  it('should sort an array with numbers', function () {
    assert.deepStrictEqual(math.sort([5, 10, 1]), [1, 5, 10])
  })

  it('should sort an array with strings', function () {
    assert.deepStrictEqual(math.sort(['C', 'B', 'A', 'D'], 'natural'), ['A', 'B', 'C', 'D'])
    assert.deepStrictEqual(math.sort(['1', '2', '10'], 'asc'), ['1', '2', '10'])
    assert.deepStrictEqual(math.sort(['1', '2', '10'], 'natural'), ['1', '2', '10'])
  })

  it('should sort a Matrix', function () {
    assert.deepStrictEqual(math.sort(math.matrix([5, 10, 1])), math.matrix([1, 5, 10]))
  })

  it('should sort an array in ascending order', function () {
    assert.deepStrictEqual(math.sort([5, 10, 1], 'asc'), [1, 5, 10])
  })

  it('should sort an array in descending order', function () {
    assert.deepStrictEqual(math.sort([5, 10, 1], 'desc'), [10, 5, 1])
  })

  it('should sort an array naturally', function () {
    assert.deepStrictEqual(math.sort([{ a: 4 }, { a: 2 }, { a: 3 }], 'natural'), [{ a: 2 }, { a: 3 }, { a: 4 }])
  })

  it('should sort an array with a custom compare function', function () {
    function sortByLength (a, b) {
      return a.length - b.length
    }
    assert.deepStrictEqual(math.sort(['Langdon', 'Tom', 'Sara'], sortByLength),
      ['Tom', 'Sara', 'Langdon'])
  })

  it('should throw an error if called with a multi dimensional matrix', function () {
    assert.throws(function () { math.sort(math.matrix([[1, 2], [3, 4]])) }, /One dimensional matrix expected/)
  })

  it('should throw an error if called with unsupported type', function () {
    assert.throws(function () { math.sort(2) })
    assert.throws(function () { math.sort('string') })
    assert.throws(function () { math.sort([], 'string') }, /String "asc", "desc", or "natural" expected/)
    assert.throws(function () { math.sort([], {}) })
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { math.sort([], 'asc', 'foo') })
    assert.throws(function () { math.sort() })
  })

  it('should LaTeX sort', function () {
    const expression = math.parse('sort([3,2,1])')
    assert.strictEqual(expression.toTex(), '\\mathrm{sort}\\left(\\begin{bmatrix}3\\\\2\\\\1\\end{bmatrix}\\right)')
  })
})
