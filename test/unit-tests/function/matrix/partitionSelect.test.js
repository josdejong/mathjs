import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const partitionSelect = math.partitionSelect

describe('partitionSelect', function () {
  it('should sort an array with numbers', function () {
    assert.strictEqual(partitionSelect([5, 10, 1], 0), 1)
    assert.strictEqual(partitionSelect([5, 10, 1], 1), 5)
    assert.strictEqual(partitionSelect([5, 10, 1], 2), 10)
  })

  it('should sort a Matrix', function () {
    assert.strictEqual(partitionSelect(matrix([5, 10, 1]), 0), 1)
    assert.strictEqual(partitionSelect(matrix([5, 10, 1]), 1), 5)
    assert.strictEqual(partitionSelect(matrix([5, 10, 1]), 2), 10)
  })

  it('should sort an array in ascending order', function () {
    assert.strictEqual(partitionSelect([5, 10, 1], 0, 'asc'), 1)
    assert.strictEqual(partitionSelect([5, 10, 1], 1, 'asc'), 5)
    assert.strictEqual(partitionSelect([5, 10, 1], 2, 'asc'), 10)
  })

  it('should sort an array in descending order', function () {
    assert.strictEqual(partitionSelect([5, 10, 1], 0, 'desc'), 10)
    assert.strictEqual(partitionSelect([5, 10, 1], 1, 'desc'), 5)
    assert.strictEqual(partitionSelect([5, 10, 1], 2, 'desc'), 1)
  })

  it('should sort an array with a custom compare function', function () {
    function sortByLength (a, b) {
      return a.length - b.length
    }
    assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], 0, sortByLength), 'Tom')
    assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], 1, sortByLength), 'Sara')
    assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], 2, sortByLength), 'Langdon')
  })

  it('should mutate the input array, leaving it partitioned at k', function () {
    const arr = [3, 2, 4, 6, -2, 5]
    partitionSelect(arr, 3)

    for (let i = 0; i < 3; ++i) {
      assert.ok(arr[i] <= arr[3])
    }
    assert.ok(arr[3] === 4)
    for (let i = 4; i < arr.length; ++i) {
      assert.ok(arr[3] <= arr[i])
    }
  })

  it('should mutate the input matrix, leaving it partitioned at k', function () {
    const m = matrix([3, 2, 4, 6, -2, 5])
    partitionSelect(m, 3)

    m.forEach(function (value, index, matrix) {
      if (index[0] < 3) {
        assert.ok(value <= 4)
      } else if (index[0] === 3) {
        assert.ok(value === 4)
      } else {
        assert.ok(value >= 4)
      }
    })
  })

  it('should return NaN if any of the inputs contains NaN', function () {
    assert(isNaN(partitionSelect([NaN], 0)))
    assert(isNaN(partitionSelect([1, NaN], 0)))
    assert(isNaN(partitionSelect([NaN, 1], 0)))
    assert(isNaN(partitionSelect([1, 3, NaN], 1)))
    assert(isNaN(partitionSelect([NaN, NaN, NaN], 1)))
  })

  it('should throw an error if called with a multi dimensional matrix', function () {
    assert.throws(function () { partitionSelect(matrix([[1, 2], [3, 4]]), 2) }, /Only one dimensional matrices supported/)
  })

  it('should throw an error if called with a non-negative k, within the bounds of the array', function () {
    assert.throws(function () { partitionSelect([1], -2) }, /k must be a non-negative integer/)
    assert.throws(function () { partitionSelect([3, 2, 1], 1.2) }, /k must be a non-negative integer/)
    assert.throws(function () { partitionSelect([3, 2, 1], 3) }, /k out of bounds/)
    assert.throws(function () { partitionSelect([], 0) }, /k out of bounds/)
  })

  it('should throw an error if called with unsupported type', function () {
    assert.throws(function () { partitionSelect(2, 2) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { partitionSelect('string', 2) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { partitionSelect([1], new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { partitionSelect([1], 1, 'function') }, /Error: Compare string must be "asc" or "desc"/)
    assert.throws(function () { partitionSelect([1], 1, {}) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(function () { partitionSelect() }, /TypeError: Too few arguments/)
    assert.throws(function () { partitionSelect([]) }, /TypeError: Too few arguments/)
    assert.throws(function () { partitionSelect([], 2, 'foo', 3) }, /TypeError: Too many arguments/)
  })

  /*
  it('should LaTeX sort', function () {
    const expression = math.parse('sort([3,2,1])')
    assert.strictEqual(expression.toTex(), '\\mathrm{sort}\\left(\\begin{bmatrix}3\\\\2\\\\1\\\\\\end{bmatrix}\\right)')
  })
  */
})
