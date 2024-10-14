import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const sparse = math.sparse
const lcm = math.lcm

describe('lcm', function () {
  it('should find the lowest common multiple of two or more numbers', function () {
    assert.strictEqual(lcm(4, 6), 12)
    assert.strictEqual(lcm(4, -6), 12)
    assert.strictEqual(lcm(6, 4), 12)
    assert.strictEqual(lcm(-6, 4), 12)
    assert.strictEqual(lcm(-6, -4), 12)
    assert.strictEqual(lcm(21, 6), 42)
    assert.strictEqual(lcm(3, -4, 24), 24)

    assert.throws(function () { lcm(1) }, /TypeError: Too few arguments/)
  })

  it('should calculate lcm for edge cases around zero', function () {
    assert.strictEqual(lcm(3, 0), 0)
    assert.strictEqual(lcm(-3, 0), 0)
    assert.strictEqual(lcm(0, 3), 0)
    assert.strictEqual(lcm(0, -3), 0)
    assert.strictEqual(lcm(0, 0), 0)

    assert.strictEqual(lcm(1, 1), 1)
    assert.strictEqual(lcm(1, 0), 0)
    assert.strictEqual(lcm(1, -1), 1)
    assert.strictEqual(lcm(-1, 1), 1)
    assert.strictEqual(lcm(-1, 0), 0)
    assert.strictEqual(lcm(-1, -1), 1)
    assert.strictEqual(lcm(0, 1), 0)
    assert.strictEqual(lcm(0, -1), 0)
    assert.strictEqual(lcm(0, 0), 0)
  })

  it('should calculate lcm for BigNumbers', function () {
    assert.deepStrictEqual(lcm(math.bignumber(4), math.bignumber(6)), math.bignumber(12))
    assert.deepStrictEqual(lcm(math.bignumber(4), math.bignumber(6)), math.bignumber(12))
  })

  it('should calculate lcm for mixed BigNumbers and Numbers', function () {
    assert.deepStrictEqual(lcm(math.bignumber(4), 6), math.bignumber(12))
    assert.deepStrictEqual(lcm(4, math.bignumber(6)), math.bignumber(12))
  })

  it('should find the lowest common multiple of booleans', function () {
    assert.strictEqual(lcm(true, true), 1)
    assert.strictEqual(lcm(true, false), 0)
    assert.strictEqual(lcm(false, true), 0)
    assert.strictEqual(lcm(false, false), 0)
  })

  it('should throw an error for non-integer numbers', function () {
    assert.throws(function () { lcm(2, 4.1) }, /Parameters in function lcm must be integer numbers/)
    assert.throws(function () { lcm(2.3, 4) }, /Parameters in function lcm must be integer numbers/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { lcm(null, 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error with complex numbers', function () {
    assert.throws(function () { lcm(math.complex(1, 3), 2) }, TypeError, 'Function lcm(complex, number) not supported')
  })

  it('should convert strings to numbers', function () {
    assert.strictEqual(lcm('4', '6'), 12)
    assert.strictEqual(lcm('4', 6), 12)
    assert.strictEqual(lcm(4, '6'), 12)

    assert.throws(function () { lcm('a', 2) }, /Cannot convert "a" to a number/)
  })

  it('should find the least common multiple of fractions', function () {
    const a = math.fraction(5, 8)
    assert.strictEqual(lcm(a, math.fraction(3, 7)).toString(), '15')
    assert.strictEqual(a.toString(), '0.625')
  })

  it('should find the least common multiple of mixed numbers and fractions', function () {
    assert.deepStrictEqual(lcm(math.fraction(12), 8), math.fraction(24))
    assert.deepStrictEqual(lcm(12, math.fraction(8)), math.fraction(24))
  })

  it('should find the least common even for edge cases', function () {
    assert.deepStrictEqual(lcm(math.fraction(-3), math.fraction(3)), math.fraction(3))
    assert.deepStrictEqual(lcm(math.fraction(3), math.fraction(-3)), math.fraction(3))
    assert.deepStrictEqual(lcm(math.fraction(0), math.fraction(3)), math.fraction(0))
    assert.deepStrictEqual(lcm(math.fraction(3), math.fraction(0)), math.fraction(0))
    assert.deepStrictEqual(lcm(math.fraction(0), math.fraction(0)), math.fraction(0))
    assert.deepStrictEqual(lcm(math.fraction(200), math.fraction(333)), math.fraction(66600))
    assert.deepStrictEqual(lcm(math.fraction(9999), math.fraction(8888)), math.fraction(79992))
  })

  it('should throw an error with units', function () {
    assert.throws(function () { lcm(math.unit('5cm'), 2) }, TypeError, 'Function lcm(unit, number) not supported')
  })

  describe('Array', function () {
    it('should find the greatest common divisor array - scalar', function () {
      assert.deepStrictEqual(lcm([5, 18, 3], 3), [15, 18, 3])
      assert.deepStrictEqual(lcm(3, [5, 18, 3]), [15, 18, 3])
    })

    it('should find the greatest common divisor array - scalar', function () {
      assert.deepStrictEqual(lcm([5, 18, 3], [[3], [2], [1]]), [[15, 18, 3], [10, 18, 6], [5, 18, 3]])
      assert.deepStrictEqual(lcm([3, 2, 1], [[5], [18], [3]]), [[15, 10, 5], [18, 18, 18], [3, 6, 3]])
    })

    it('should find the greatest common divisor array - array', function () {
      assert.deepStrictEqual(lcm([5, 2, 3], [25, 3, 6]), [25, 6, 6])
    })

    it('should find the greatest common divisor array - dense matrix', function () {
      assert.deepStrictEqual(lcm([5, 2, 3], matrix([25, 3, 6])), matrix([25, 6, 6]))
    })

    it('should find the greatest common divisor array - sparse matrix', function () {
      assert.deepStrictEqual(lcm([[5, 2, 3], [3, 2, 5]], sparse([[0, 3, 6], [6, 0, 25]])), sparse([[0, 6, 6], [6, 0, 25]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should find the greatest common divisor dense matrix - scalar', function () {
      assert.deepStrictEqual(lcm(matrix([5, 18, 3]), 3), matrix([15, 18, 3]))
      assert.deepStrictEqual(lcm(3, matrix([5, 18, 3])), matrix([15, 18, 3]))
    })

    it('should find the greatest common divisor dense matrix - array', function () {
      assert.deepStrictEqual(lcm(matrix([5, 2, 3]), [25, 3, 6]), matrix([25, 6, 6]))
    })

    it('should find the greatest common divisor dense matrix - dense matrix', function () {
      assert.deepStrictEqual(lcm(matrix([5, 2, 3]), matrix([25, 3, 6])), matrix([25, 6, 6]))
    })

    it('should find the greatest common divisor dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(lcm(matrix([[5, 2, 3], [3, 2, 5]]), sparse([[0, 3, 6], [6, 0, 25]])), sparse([[0, 6, 6], [6, 0, 25]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should find the greatest common divisor sparse matrix - scalar', function () {
      assert.deepStrictEqual(lcm(sparse([[5, 0, 3], [0, 18, 0]]), 3), sparse([[15, 0, 3], [0, 18, 0]]))
      assert.deepStrictEqual(lcm(3, sparse([[5, 0, 3], [0, 18, 0]])), sparse([[15, 0, 3], [0, 18, 0]]))
    })

    it('should find the greatest common divisor sparse matrix - array', function () {
      assert.deepStrictEqual(lcm(sparse([[5, 2, 3], [3, 2, 5]]), [[0, 3, 6], [6, 0, 25]]), sparse([[0, 6, 6], [6, 0, 25]]))
    })

    it('should find the greatest common divisor sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(lcm(sparse([[5, 2, 3], [3, 2, 5]]), matrix([[0, 3, 6], [6, 0, 25]])), sparse([[0, 6, 6], [6, 0, 25]]))
    })

    it('should find the greatest common divisor sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(lcm(sparse([[5, 2, 3], [3, 2, 5]]), sparse([[0, 3, 6], [6, 0, 25]])), sparse([[0, 6, 6], [6, 0, 25]]))
    })
  })

  it('should LaTeX lcm', function () {
    const expression = math.parse('lcm(2,3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{lcm}\\left(2,3\\right)')
  })
})
