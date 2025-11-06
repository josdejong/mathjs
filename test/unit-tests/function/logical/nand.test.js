// test nand
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const complex = math.complex
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const nand = math.nand

describe('nand', function () {
  it('should nand two numbers correctly', function () {
    assert.strictEqual(nand(1, 1), false)
    assert.strictEqual(nand(-1, 1), false)
    assert.strictEqual(nand(-1, -1), false)
    assert.strictEqual(nand(0, -1), true)
    assert.strictEqual(nand(1, 0), true)
    assert.strictEqual(nand(1, NaN), true)
    assert.strictEqual(nand(NaN, 1), true)
    assert.strictEqual(nand(1e10, 0.019209), false)
    assert.strictEqual(nand(-1.0e-100, 1.0e-100), false)
    assert.strictEqual(nand(Infinity, -Infinity), false)
  })

  it('should nand two complex numbers', function () {
    assert.strictEqual(nand(complex(1, 1), complex(1, 1)), false)
    assert.strictEqual(nand(complex(0, 1), complex(1, 1)), false)
    assert.strictEqual(nand(complex(1, 0), complex(1, 1)), false)
    assert.strictEqual(nand(complex(1, 1), complex(0, 1)), false)
    assert.strictEqual(nand(complex(1, 1), complex(1, 0)), false)
    assert.strictEqual(nand(complex(1, 0), complex(1, 0)), false)
    assert.strictEqual(nand(complex(0, 1), complex(0, 1)), false)
    assert.strictEqual(nand(complex(0, 0), complex(1, 1)), true)
    assert.strictEqual(nand(complex(0, 0), complex(0, 1)), true)
    assert.strictEqual(nand(complex(0, 0), complex(1, 0)), true)
    assert.strictEqual(nand(complex(1, 1), complex(0, 0)), true)
    assert.strictEqual(nand(complex(0, 1), complex(0, 0)), true)
    assert.strictEqual(nand(complex(1, 0), complex(0, 0)), true)
    assert.strictEqual(nand(complex(), complex(1, 1)), true)
    assert.strictEqual(nand(complex(0), complex(1, 1)), true)
    assert.strictEqual(nand(complex(1), complex(1, 1)), false)
    assert.strictEqual(nand(complex(1, 1), complex()), true)
    assert.strictEqual(nand(complex(1, 1), complex(0)), true)
    assert.strictEqual(nand(complex(1, 1), complex(1)), false)
  })

  it('should nand mixed numbers nand complex numbers', function () {
    assert.strictEqual(nand(complex(1, 1), 1), false)
    assert.strictEqual(nand(complex(1, 1), 0), true)
    assert.strictEqual(nand(1, complex(1, 1)), false)
    assert.strictEqual(nand(0, complex(1, 1)), true)
    assert.strictEqual(nand(complex(0, 0), 1), true)
    assert.strictEqual(nand(1, complex(0, 0)), true)
  })

  it('should nand two booleans', function () {
    assert.strictEqual(nand(true, true), false)
    assert.strictEqual(nand(true, false), true)
    assert.strictEqual(nand(false, true), true)
    assert.strictEqual(nand(false, false), true)
  })

  it('should nand mixed numbers nand booleans', function () {
    assert.strictEqual(nand(2, true), false)
    assert.strictEqual(nand(2, false), true)
    assert.strictEqual(nand(0, true), true)
    assert.strictEqual(nand(true, 2), false)
    assert.strictEqual(nand(false, 2), true)
  })

  it('should nand bignumbers', function () {
    assert.strictEqual(nand(bignumber(1), bignumber(1)), false)
    assert.strictEqual(nand(bignumber(-1), bignumber(1)), false)
    assert.strictEqual(nand(bignumber(-1), bignumber(-1)), false)
    assert.strictEqual(nand(bignumber(0), bignumber(-1)), true)
    assert.strictEqual(nand(bignumber(1), bignumber(0)), true)
    assert.strictEqual(nand(bignumber(1), bignumber(NaN)), true)
    assert.strictEqual(nand(bignumber(NaN), bignumber(1)), true)
    assert.strictEqual(nand(bignumber('1e+10'), bignumber(0.19209)), false)
    assert.strictEqual(nand(bignumber('-1.0e-100'), bignumber('1.0e-100')), false)
    assert.strictEqual(nand(bignumber(Infinity), bignumber(-Infinity)), false)
  })

  it('should nand bigints', function () {
    assert.strictEqual(nand(1n, 1n), false)
    assert.strictEqual(nand(-1n, 1n), false)
    assert.strictEqual(nand(-1n, -1n), false)
    assert.strictEqual(nand(0n, -1n), true)
    assert.strictEqual(nand(1n, 0n), true)
  })

  it('should nand mixed numbers nand bignumbers', function () {
    assert.strictEqual(nand(bignumber(2), 3), false)
    assert.strictEqual(nand(2, bignumber(2)), false)
    assert.strictEqual(nand(0, bignumber(2)), true)
    assert.strictEqual(nand(2, bignumber(0)), true)
    assert.strictEqual(nand(bignumber(0), 2), true)
    assert.strictEqual(nand(bignumber(2), 0), true)
  })

  it('should nand mixed numbers nand bigints', function () {
    assert.strictEqual(nand(2n, 3), false)
    assert.strictEqual(nand(2, 2n), false)
    assert.strictEqual(nand(0, 2n), true)
    assert.strictEqual(nand(2, 0n), true)
    assert.strictEqual(nand(0n, 2), true)
    assert.strictEqual(nand(2n, 0), true)
  })

  it('should nand two units', function () {
    assert.strictEqual(nand(unit('100cm'), unit('10inch')), false)
    assert.strictEqual(nand(unit('100cm'), unit('0 inch')), true)
    assert.strictEqual(nand(unit('0cm'), unit('1m')), true)
    assert.strictEqual(nand(unit('m'), unit('1m')), true)
    assert.strictEqual(nand(unit('1dm'), unit('m')), true)
    assert.strictEqual(nand(unit('-100cm'), unit('-10inch')), false)
    assert.strictEqual(nand(unit(5, 'km'), unit(100, 'gram')), false)
    assert.strictEqual(nand(unit(5, 'km'), unit(0, 'gram')), true)
    assert.strictEqual(nand(unit(0, 'km'), unit(100, 'gram')), true)

    assert.strictEqual(nand(unit(bignumber(0), 'm'), unit(bignumber(0), 'm')), true)
    assert.strictEqual(nand(unit(bignumber(1), 'm'), unit(bignumber(0), 'm')), true)
    assert.strictEqual(nand(unit(bignumber(0), 'm'), unit(bignumber(1), 'm')), true)
    assert.strictEqual(nand(unit(bignumber(1), 'm'), unit(bignumber(1), 'm')), false)
  })

  describe('Array', function () {
    it('should nand array - scalar', function () {
      assert.deepStrictEqual(nand(10, [0, 2]), [true, false])
      assert.deepStrictEqual(nand([0, 2], 10), [true, false])
    })

    it('should nand array - array', function () {
      assert.deepStrictEqual(nand([0, 1, 0, 12], [0, 0, 1, 22]), [true, true, true, false])
      assert.deepStrictEqual(nand([], []), [])
    })

    it('should nand broadcastable arrays', function () {
      assert.deepStrictEqual(nand([[0, 1, 0, 12]], [[0], [0], [1], [22]]), [[true, true, true, true], [true, true, true, true], [true, false, true, false], [true, false, true, false]])
    })

    it('should nand array - dense matrix', function () {
      assert.deepStrictEqual(nand([0, 1, 0, 12], matrix([0, 0, 1, 22])), matrix([true, true, true, false]))
      assert.deepStrictEqual(nand([], matrix([])), matrix([]))
    })

    it('should nand array - sparse matrix', function () {
      assert.deepStrictEqual(nand([[0, 1], [0, 12]], sparse([[0, 0], [1, 22]])), sparse([[true, true], [true, false]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should nand dense matrix - scalar', function () {
      assert.deepStrictEqual(nand(10, matrix([0, 2])), matrix([true, false]))
      assert.deepStrictEqual(nand(matrix([0, 2]), 10), matrix([true, false]))
    })

    it('should nand dense matrix - array', function () {
      assert.deepStrictEqual(nand(matrix([0, 1, 0, 12]), [0, 0, 1, 22]), matrix([true, true, true, false]))
      assert.deepStrictEqual(nand(matrix([]), []), matrix([]))
    })

    it('should nand dense matrix - dense matrix', function () {
      assert.deepStrictEqual(nand(matrix([0, 1, 0, 12]), matrix([0, 0, 1, 22])), matrix([true, true, true, false]))
      assert.deepStrictEqual(nand(matrix([]), matrix([])), matrix([]))
    })

    it('should nand dense matrix - sparse matrix', function () {
      assert.deepStrictEqual(nand(matrix([[0, 1], [0, 12]]), sparse([[0, 0], [1, 22]])), sparse([[true, true], [true, false]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should nand sparse matrix - scalar', function () {
      assert.deepStrictEqual(nand(10, sparse([[0], [2]])), sparse([[true], [false]]))
      assert.deepStrictEqual(nand(sparse([[0], [2]]), 10), sparse([[true], [false]]))
    })

    it('should nand sparse matrix - array', function () {
      assert.deepStrictEqual(nand(sparse([[0, 1], [0, 12]]), [[0, 0], [1, 22]]), sparse([[true, true], [true, false]]))
    })

    it('should nand sparse matrix - dense matrix', function () {
      assert.deepStrictEqual(nand(sparse([[0, 1], [0, 12]]), matrix([[0, 0], [1, 22]])), sparse([[true, true], [true, false]]))
    })

    it('should nand sparse matrix - sparse matrix', function () {
      assert.deepStrictEqual(nand(sparse([[0, 1], [0, 12]]), sparse([[0, 0], [1, 22]])), sparse([[true, true], [true, false]]))
    })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { nand(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { nand(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { nand(2, null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nand(new Date(), false) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nand(false, new Date()) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nand(false, undefined) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { nand(undefined, false) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX nand', function () {
    const expression = math.parse('nand(1,2)')
    assert.strictEqual(expression.toTex(), '\\left(1\\uparrow2\\right)')
  })
})
