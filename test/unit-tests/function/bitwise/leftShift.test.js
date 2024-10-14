// test leftShift
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const sparse = math.sparse
const bignumber = math.bignumber
const leftShift = math.leftShift

describe('leftShift', function () {
  it('should left shift a number by a given amount', function () {
    assert.strictEqual(leftShift(0, 1000), 0)
    assert.strictEqual(leftShift(2, 0), 2)
    assert.strictEqual(leftShift(2, 3), 16)
    assert.strictEqual(leftShift(2, 4), 32)
    assert.strictEqual(leftShift(-2, 2), -8)
    assert.strictEqual(leftShift(3, 3), 24)
    assert.strictEqual(leftShift(-3, 2), -12)
    assert.strictEqual(leftShift(-3, 3), -24)
  })

  it('should left shift a bigint by a given amount', function () {
    assert.strictEqual(leftShift(0n, 1000n), 0n)
    assert.strictEqual(leftShift(2n, 0n), 2n)
    assert.strictEqual(leftShift(2n, 3n), 16n)
    assert.strictEqual(leftShift(2n, 4n), 32n)
    assert.strictEqual(leftShift(-2n, 2n), -8n)
    assert.strictEqual(leftShift(3n, 3n), 24n)
    assert.strictEqual(leftShift(-3n, 2n), -12n)
    assert.strictEqual(leftShift(-3n, 3n), -24n)
  })

  it('should left shift booleans by a boolean amount', function () {
    assert.strictEqual(leftShift(true, true), 2)
    assert.strictEqual(leftShift(true, false), 1)
    assert.strictEqual(leftShift(false, true), 0)
    assert.strictEqual(leftShift(false, false), 0)
  })

  it('should left shift with a mix of numbers and booleans', function () {
    assert.strictEqual(leftShift(2, true), 4)
    assert.strictEqual(leftShift(2, false), 2)
    assert.strictEqual(leftShift(true, 2), 4)
    assert.strictEqual(leftShift(false, 2), 0)
  })

  it('should left shift with a mix of numbers and bigints', function () {
    assert.strictEqual(leftShift(2, 3n), 16)
    assert.strictEqual(leftShift(2n, 3), 16)
  })

  it('should left shift bignumbers', function () {
    assert.deepStrictEqual(leftShift(bignumber(2), bignumber(3)), bignumber(16))
    assert.deepStrictEqual(leftShift(bignumber(500), bignumber(100)), bignumber('633825300114114700748351602688000'))
    assert.deepStrictEqual(leftShift(bignumber(-1), bignumber(2)), bignumber(-4))
    assert.strictEqual(leftShift(bignumber(0), bignumber(-2)).isNaN(), true)
    assert.deepStrictEqual(leftShift(bignumber(Infinity), bignumber(2)).toString(), 'Infinity')
    assert.strictEqual(leftShift(bignumber(Infinity), bignumber(Infinity)).isNaN(), true)
  })

  it('should left shift mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(leftShift(bignumber(2), 3), bignumber(16))
    assert.deepStrictEqual(leftShift(bignumber(500), 100), bignumber('633825300114114700748351602688000'))
    assert.deepStrictEqual(leftShift(2, bignumber(3)), bignumber(16))
    assert.deepStrictEqual(leftShift(-1, bignumber(2)), bignumber(-4))
    assert.deepStrictEqual(leftShift(bignumber(-1), 2), bignumber(-4))
    assert.strictEqual(leftShift(bignumber(0), -2).isNaN(), true)
    assert.strictEqual(leftShift(bignumber(Infinity), Infinity).isNaN(), true)
  })

  it('should left shift mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(leftShift(true, bignumber(3)), bignumber(8))
    assert.deepStrictEqual(leftShift(false, bignumber(3)), bignumber(0))
    assert.deepStrictEqual(leftShift(bignumber(3), false), bignumber(3))
    assert.deepStrictEqual(leftShift(bignumber(3), true), bignumber(6))
  })

  it('should throw an error if used with a unit', function () {
    assert.throws(function () { leftShift(math.unit('5cm'), 2) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(2, math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(math.unit('2cm'), math.unit('5cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error if the parameters are not integers', function () {
    assert.throws(function () {
      leftShift(1.1, 1)
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(1, 1.1)
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(1.1, 1.1)
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(bignumber(1.1), 1)
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(1, bignumber(1.1))
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(bignumber(1.1), bignumber(1))
    }, /Integers expected in function leftShift/)
    assert.throws(function () {
      leftShift(bignumber(1), bignumber(1.1))
    }, /Integers expected in function leftShift/)
  })

  describe('Array', function () {
    it('should left shift array and scalar', function () {
      assert.deepStrictEqual(leftShift([[1, 2], [8, 0]], 2), [[4, 8], [32, 0]])
      assert.deepStrictEqual(leftShift(2, [[1, 2], [8, 0]]), [[4, 8], [512, 2]])
    })

    it('should left shift array - array', function () {
      assert.deepStrictEqual(leftShift([[1, 2], [8, 0]], [[4, 8], [32, 0]]), [[16, 512], [8, 0]])
      assert.deepStrictEqual(leftShift([[4, 8], [32, 0]], [[1, 2], [8, 0]]), [[8, 32], [8192, 0]])
    })

    it('should left shift broadcastable arrays', function () {
      assert.deepStrictEqual(leftShift([[1, 2]], [[4], [32]]), [[16, 32], [1, 2]])
      assert.deepStrictEqual(leftShift([[4], [32]], [8, 0]), [[1024, 4], [8192, 32]])
    })

    it('should left shift array - dense matrix', function () {
      assert.deepStrictEqual(leftShift([[1, 2], [8, 0]], matrix([[4, 8], [32, 0]])), matrix([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift([[4, 8], [32, 0]], matrix([[1, 2], [8, 0]])), matrix([[8, 32], [8192, 0]]))
    })

    it('should left shift array - sparse matrix', function () {
      assert.deepStrictEqual(leftShift([[1, 2], [8, 0]], sparse([[4, 8], [32, 0]])), matrix([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift([[4, 8], [32, 0]], sparse([[1, 2], [8, 0]])), matrix([[8, 32], [8192, 0]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should left shift dense matrix and scalar', function () {
      assert.deepStrictEqual(leftShift(matrix([[1, 2], [8, 0]]), 2), matrix([[4, 8], [32, 0]]))
      assert.deepStrictEqual(leftShift(2, matrix([[1, 2], [8, 0]])), matrix([[4, 8], [512, 2]]))
    })

    it('should left shift dense matrix - array', function () {
      assert.deepStrictEqual(leftShift(matrix([[1, 2], [8, 0]]), [[4, 8], [32, 0]]), matrix([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(matrix([[4, 8], [32, 0]]), [[1, 2], [8, 0]]), matrix([[8, 32], [8192, 0]]))
    })

    it('should left shift dense matrix - dense matrix', function () {
      assert.deepStrictEqual(leftShift(matrix([[1, 2], [8, 0]]), matrix([[4, 8], [32, 0]])), matrix([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(matrix([[4, 8], [32, 0]]), matrix([[1, 2], [8, 0]])), matrix([[8, 32], [8192, 0]]))
    })

    it('should left shift dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(leftShift(matrix([[1, 2], [8, 0]]), sparse([[4, 8], [32, 0]])), matrix([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(matrix([[4, 8], [32, 0]]), sparse([[1, 2], [8, 0]])), matrix([[8, 32], [8192, 0]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should left shift sparse matrix and scalar', function () {
      assert.deepStrictEqual(leftShift(sparse([[1, 2], [8, 0]]), 2), sparse([[4, 8], [32, 0]]))
      assert.deepStrictEqual(leftShift(2, sparse([[1, 2], [8, 0]])), matrix([[4, 8], [512, 2]]))
    })

    it('should left shift sparse matrix - array', function () {
      assert.deepStrictEqual(leftShift(sparse([[1, 2], [8, 0]]), [[4, 8], [32, 0]]), sparse([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(sparse([[4, 8], [32, 0]]), [[1, 2], [8, 0]]), sparse([[8, 32], [8192, 0]]))
    })

    it('should left shift sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(leftShift(sparse([[1, 2], [8, 0]]), matrix([[4, 8], [32, 0]])), sparse([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(sparse([[4, 8], [32, 0]]), matrix([[1, 2], [8, 0]])), sparse([[8, 32], [8192, 0]]))
    })

    it('should left shift sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(leftShift(sparse([[1, 2], [8, 0]]), sparse([[4, 8], [32, 0]])), sparse([[16, 512], [8, 0]]))
      assert.deepStrictEqual(leftShift(sparse([[4, 8], [32, 0]]), sparse([[1, 2], [8, 0]])), sparse([[8, 32], [8192, 0]]))
    })
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { leftShift(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { leftShift(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { leftShift(new Date(), true) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(2, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(true, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(true, undefined) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { leftShift(undefined, true) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX leftShift', function () {
    const expression = math.parse('leftShift(2,3)')
    assert.strictEqual(expression.toTex(), '\\left(2<<3\\right)')
  })
})
