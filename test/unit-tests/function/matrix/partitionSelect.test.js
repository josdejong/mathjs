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

  describe('with a numeric index of any type', function () {
    it('should accept a bigint index', function () {
      assert.strictEqual(partitionSelect([5, 10, 1], 1n), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], 0n), 1)
      assert.strictEqual(partitionSelect([5, 10, 1], 2n), 10)
    })

    it('should accept a BigNumber index', function () {
      assert.strictEqual(partitionSelect([5, 10, 1], math.bignumber(1)), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], math.bignumber(0)), 1)
      assert.strictEqual(partitionSelect([5, 10, 1], math.bignumber(2)), 10)
    })

    it('should accept a Fraction index', function () {
      assert.strictEqual(partitionSelect([5, 10, 1], math.fraction(1, 1)), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], math.fraction(2, 2)), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], math.fraction(4, 2)), 10)
    })

    it('should accept a Matrix together with a BigNumber index', function () {
      assert.strictEqual(partitionSelect(matrix([5, 10, 1]), math.bignumber(1)), 5)
    })

    it('should accept a numeric index together with a compare string', function () {
      assert.strictEqual(partitionSelect([5, 10, 1], math.bignumber(0), 'asc'), 1)
      assert.strictEqual(partitionSelect([5, 10, 1], math.bignumber(1), 'desc'), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], 1n, 'desc'), 5)
      assert.strictEqual(partitionSelect([5, 10, 1], math.fraction(1, 1), 'asc'), 5)
    })

    it('should accept a numeric index together with a custom compare function', function () {
      function sortByLength (a, b) {
        return a.length - b.length
      }
      assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], math.bignumber(0), sortByLength), 'Tom')
      assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], 1n, sortByLength), 'Sara')
      assert.strictEqual(partitionSelect(['Langdon', 'Tom', 'Sara'], math.fraction(2, 1), sortByLength), 'Langdon')
    })

    it('should validate a numeric index that is not a non-negative integer', function () {
      assert.throws(function () { partitionSelect([1], math.bignumber(-2)) }, /k must be a non-negative integer/)
      assert.throws(function () { partitionSelect([1], -2n) }, /k must be a non-negative integer/)
      assert.throws(function () { partitionSelect([3, 2, 1], math.bignumber(3)) }, /k out of bounds/)
      assert.throws(function () { partitionSelect([], 0n) }, /k out of bounds/)
    })
  })

  describe('error messages', function () {
    it('should report the offending index in the non-negative integer error', function () {
      assert.throws(function () { partitionSelect([1], -2) }, /k must be a non-negative integer, but got -2/)
      assert.throws(function () { partitionSelect([3, 2, 1], 1.5) }, /k must be a non-negative integer, but got 1.5/)
      assert.throws(function () { partitionSelect([3, 2, 1], math.bignumber(-4)) }, /k must be a non-negative integer, but got -4/)
    })

    it('should report the offending index and the number of elements in the out of bounds error', function () {
      assert.throws(function () { partitionSelect([3, 2, 1], 3) }, /k out of bounds: index 3 is larger than the number of elements \(3\)/)
      assert.throws(function () { partitionSelect([3, 2, 1], 7) }, /k out of bounds: index 7 is larger than the number of elements \(3\)/)
      assert.throws(function () { partitionSelect([], 0) }, /k out of bounds: index 0 is larger than the number of elements \(0\)/)
      assert.throws(function () { partitionSelect([1], math.bignumber(5)) }, /k out of bounds: index 5 is larger than the number of elements \(1\)/)
    })
  })

  describe('with NaN and a custom compare function', function () {
    it('should not short-circuit on NaN when a custom compare function is given', function () {
      // a custom comparator that puts NaN last
      function nanLast (a, b) {
        if (isNaN(a)) return 1
        if (isNaN(b)) return -1
        return a - b
      }

      const result = partitionSelect([3, NaN, 1, 2], 1, nanLast)
      assert.strictEqual(result, 2)
    })

    it('should still short-circuit on NaN for the default, asc and desc comparators', function () {
      assert(isNaN(partitionSelect([1, NaN, 3], 1)))
      assert(isNaN(partitionSelect([1, NaN, 3], 1, 'asc')))
      assert(isNaN(partitionSelect([1, NaN, 3], 1, 'desc')))
    })
  })
})
