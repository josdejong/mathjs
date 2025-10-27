// test nor
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const nor = math.nor

describe('nor', function () {
  it('should nor two numbers correctly', function () {
    assert.strictEqual(nor(1, 1), false)
    assert.strictEqual(nor(-1, 1), false)
    assert.strictEqual(nor(-1, -1), false)
    assert.strictEqual(nor(0, -1), false)
    assert.strictEqual(nor(1, 0), false)
    assert.strictEqual(nor(1, NaN), false)
    assert.strictEqual(nor(NaN, 1), false)
    assert.strictEqual(nor(1e10, 0.019209), false)
    assert.strictEqual(nor(-1.0e-100, 1.0e-100), false)
    assert.strictEqual(nor(Infinity, -Infinity), false)
    assert.strictEqual(nor(NaN, NaN), true)
    assert.strictEqual(nor(NaN, 0), true)
    assert.strictEqual(nor(0, NaN), true)
    assert.strictEqual(nor(0, 0), true)
  })

  it('should nor two complex numbers', function () {
    assert.strictEqual(nor(complex(1, 1), complex(1, 1)), false)
    assert.strictEqual(nor(complex(0, 1), complex(1, 1)), false)
    assert.strictEqual(nor(complex(1, 0), complex(1, 1)), false)
    assert.strictEqual(nor(complex(1, 1), complex(0, 1)), false)
    assert.strictEqual(nor(complex(1, 1), complex(1, 0)), false)
    assert.strictEqual(nor(complex(1, 0), complex(1, 0)), false)
    assert.strictEqual(nor(complex(0, 1), complex(0, 1)), false)
    assert.strictEqual(nor(complex(0, 0), complex(1, 1)), false)
    assert.strictEqual(nor(complex(0, 0), complex(0, 1)), false)
    assert.strictEqual(nor(complex(0, 0), complex(1, 0)), false)
    assert.strictEqual(nor(complex(1, 1), complex(0, 0)), false)
    assert.strictEqual(nor(complex(0, 1), complex(0, 0)), false)
    assert.strictEqual(nor(complex(1, 0), complex(0, 0)), false)
    assert.strictEqual(nor(complex(), complex(1, 1)), false)
    assert.strictEqual(nor(complex(0), complex(1, 1)), false)
    assert.strictEqual(nor(complex(1), complex(1, 1)), false)
    assert.strictEqual(nor(complex(1, 1), complex()), false)
    assert.strictEqual(nor(complex(1, 1), complex(0)), false)
    assert.strictEqual(nor(complex(1, 1), complex(1)), false)
    assert.strictEqual(nor(complex(0, 0), complex(0, 0)), true)
    assert.strictEqual(nor(complex(), complex()), true)
  })

  it('should nor mixed numbers and complex numbers', function () {
    assert.strictEqual(nor(complex(1, 1), 1), false)
    assert.strictEqual(nor(complex(1, 1), 0), false)
    assert.strictEqual(nor(1, complex(1, 1)), false)
    assert.strictEqual(nor(0, complex(1, 1)), false)
    assert.strictEqual(nor(complex(0, 0), 1), false)
    assert.strictEqual(nor(1, complex(0, 0)), false)
    assert.strictEqual(nor(0, complex(0, 0)), true)
    assert.strictEqual(nor(complex(0, 0), 0), true)
  })

  it('should nor two booleans', function () {
    assert.strictEqual(nor(true, true), false)
    assert.strictEqual(nor(true, false), false)
    assert.strictEqual(nor(false, true), false)
    assert.strictEqual(nor(false, false), true)
  })

  it('should nor mixed numbers and booleans', function () {
    assert.strictEqual(nor(2, true), false)
    assert.strictEqual(nor(2, false), false)
    assert.strictEqual(nor(0, true), false)
    assert.strictEqual(nor(0, false), true)
    assert.strictEqual(nor(true, 2), false)
    assert.strictEqual(nor(false, 2), false)
    assert.strictEqual(nor(false, 0), true)
  })

  it('should nor bignumbers', function () {
    assert.strictEqual(nor(bignumber(1), bignumber(1)), false)
    assert.strictEqual(nor(bignumber(-1), bignumber(1)), false)
    assert.strictEqual(nor(bignumber(-1), bignumber(-1)), false)
    assert.strictEqual(nor(bignumber(0), bignumber(-1)), false)
    assert.strictEqual(nor(bignumber(1), bignumber(0)), false)
    assert.strictEqual(nor(bignumber(1), bignumber(NaN)), false)
    assert.strictEqual(nor(bignumber(NaN), bignumber(1)), false)
    assert.strictEqual(nor(bignumber('1e+10'), bignumber(0.19209)), false)
    assert.strictEqual(nor(bignumber('-1.0e-100'), bignumber('1.0e-100')), false)
    assert.strictEqual(nor(bignumber(Infinity), bignumber(-Infinity)), false)
    assert.strictEqual(nor(bignumber(NaN), bignumber(NaN)), true)
    assert.strictEqual(nor(bignumber(NaN), bignumber(0)), true)
    assert.strictEqual(nor(bignumber(0), bignumber(NaN)), true)
    assert.strictEqual(nor(bignumber(0), bignumber(0)), true)
  })

  it('should nor bigints', function () {
    assert.strictEqual(nor(1n, 1n), false)
    assert.strictEqual(nor(-1n, 1n), false)
    assert.strictEqual(nor(-1n, -1n), false)
    assert.strictEqual(nor(0n, -1n), false)
    assert.strictEqual(nor(1n, 0n), false)
  })

  it('should nor mixed numbers and bignumbers', function () {
    assert.strictEqual(nor(bignumber(2), 3), false)
    assert.strictEqual(nor(2, bignumber(2)), false)
    assert.strictEqual(nor(0, bignumber(2)), false)
    assert.strictEqual(nor(2, bignumber(0)), false)
    assert.strictEqual(nor(bignumber(0), 2), false)
    assert.strictEqual(nor(bignumber(0), 0), true)
    assert.strictEqual(nor(bignumber(2), 0), false)
    assert.strictEqual(nor(bignumber(0), 0), true)
  })

  it('should nor mixed numbers and bigints', function () {
    assert.strictEqual(nor(2n, 3), false)
    assert.strictEqual(nor(2, 3n), false)
  })

  it('should nor two units', function () {
    assert.strictEqual(nor(unit('100cm'), unit('10inch')), false)
    assert.strictEqual(nor(unit('100cm'), unit('0 inch')), false)
    assert.strictEqual(nor(unit('0cm'), unit('1m')), false)
    assert.strictEqual(nor(unit('m'), unit('1m')), false)
    assert.strictEqual(nor(unit('1dm'), unit('m')), false)
    assert.strictEqual(nor(unit('dm'), unit('m')), true)
    assert.strictEqual(nor(unit('-100cm'), unit('-10inch')), false)
    assert.strictEqual(nor(unit(5, 'km'), unit(100, 'gram')), false)
    assert.strictEqual(nor(unit(5, 'km'), unit(0, 'gram')), false)
    assert.strictEqual(nor(unit(0, 'km'), unit(100, 'gram')), false)
    assert.strictEqual(nor(unit(0, 'km'), unit(0, 'gram')), true)

    assert.strictEqual(nor(unit(bignumber(0), 'm'), unit(bignumber(0), 'm')), true)
    assert.strictEqual(nor(unit(bignumber(1), 'm'), unit(bignumber(0), 'm')), false)
    assert.strictEqual(nor(unit(bignumber(0), 'm'), unit(bignumber(1), 'm')), false)
    assert.strictEqual(nor(unit(bignumber(1), 'm'), unit(bignumber(1), 'm')), false)
  })

  it('should nor two arrays', function () {
    assert.deepStrictEqual(nor([0, 1, 0, 12], [0, 0, 1, 22]), [true, false, false, false])
    assert.deepStrictEqual(nor([], []), [])
  })

  it('should nor mixed numbers and arrays', function () {
    assert.deepStrictEqual(nor(10, [0, 2]), [false, false])
    assert.deepStrictEqual(nor([0, 2], 10), [false, false])
    assert.deepStrictEqual(nor(0, [0, 2]), [true, false])
    assert.deepStrictEqual(nor([0, 2], 0), [true, false])
  })

  describe('Array', function () {
    it('should nor array - scalar', function () {
      assert.deepStrictEqual(nor(10, [0, 2]), [false, false])
      assert.deepStrictEqual(nor([0, 2], 10), [false, false])
    })

    it('should nor array - array', function () {
      assert.deepStrictEqual(nor([0, 1, 0, 12], [0, 0, 1, 22]), [true, false, false, false])
      assert.deepStrictEqual(nor([], []), [])
    })

    it('should nor broadcastable arrays', function () {
      assert.deepStrictEqual(nor([[0, 1, 0, 12]], [[0], [0], [1], [22]]), [[true, false, true, false], [true, false, true, false], [false, false, false, false], [false, false, false, false]])
    })

    it('should nor array - dense matrix', function () {
      assert.deepStrictEqual(nor([0, 1, 0, 12], matrix([0, 0, 1, 22])), matrix([true, false, false, false]))
      assert.deepStrictEqual(nor([], matrix([])), matrix([]))
    })

    it('should nor array - sparse matrix', function () {
      assert.deepStrictEqual(nor([[0, 1], [0, 12]], sparse([[0, 0], [1, 22]])), matrix([[true, false], [false, false]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should nor dense matrix - scalar', function () {
      assert.deepStrictEqual(nor(10, matrix([0, 2])), matrix([false, false]))
      assert.deepStrictEqual(nor(matrix([0, 2]), 10), matrix([false, false]))
    })

    it('should nor dense matrix - array', function () {
      assert.deepStrictEqual(nor(matrix([0, 1, 0, 12]), [0, 0, 1, 22]), matrix([true, false, false, false]))
      assert.deepStrictEqual(nor(matrix([]), []), matrix([]))
    })

    it('should nor dense matrix - dense matrix', function () {
      assert.deepStrictEqual(nor(matrix([0, 1, 0, 12]), matrix([0, 0, 1, 22])), matrix([true, false, false, false]))
      assert.deepStrictEqual(nor(matrix([]), matrix([])), matrix([]))
    })

    it('should nor dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(nor(matrix([[0, 1], [0, 12]]), sparse([[0, 0], [1, 22]])), matrix([[true, false], [false, false]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should nor sparse matrix - scalar', function () {
      assert.deepStrictEqual(nor(10, sparse([[0], [2]])), matrix([[false], [false]]))
      assert.deepStrictEqual(nor(sparse([[0], [2]]), 10), matrix([[false], [false]]))
    })

    it('should nor sparse matrix - array', function () {
      assert.deepStrictEqual(nor(sparse([[0, 1], [0, 12]]), [[0, 0], [1, 22]]), matrix([[true, false], [false, false]]))
    })

    it('should nor sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(nor(sparse([[0, 1], [0, 12]]), matrix([[0, 0], [1, 22]])), matrix([[true, false], [false, false]]))
    })

    it('should nor sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(nor(sparse([[0, 1], [0, 12]]), sparse([[0, 0], [1, 22]])), sparse([[true, false], [false, false]]))
    })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { nor(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { nor(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { nor(2, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nor(new Date(), false) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nor(false, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nor(false, undefined) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nor(undefined, false) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX nor', function () {
    const expression = math.parse('nor(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1\\2\\right)')
  })
})
