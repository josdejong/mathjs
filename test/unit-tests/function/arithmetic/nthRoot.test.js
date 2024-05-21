// test nthRoot
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const matrix = math.matrix
const sparse = math.sparse
const unit = math.unit
const nthRoot = math.nthRoot
const big = math.bignumber
const complex = math.complex

describe('nthRoot', function () {
  it('should return the nthRoot of a boolean value', function () {
    assert.strictEqual(nthRoot(true), 1)
    assert.strictEqual(nthRoot(false), 0)
    assert.strictEqual(nthRoot(1, true), 1)
  })

  it('should return the nthRoot for numbers', function () {
    approxEqual(nthRoot(4), 2)
    approxEqual(nthRoot(9), 3)
    approxEqual(nthRoot(8, 3), 2)
    approxEqual(nthRoot(64, 3), 4)
    approxEqual(nthRoot(2, 2.5), 1.31950791077289)
    approxEqual(nthRoot(2.5, 2), 1.58113883008419)
    approxEqual(nthRoot(0.1 + 0.2), 0.5477225575051662) // a value containing a round-off error
    approxEqual(nthRoot(0, 3), 0)
    approxEqual(nthRoot(0, 2), 0)
    approxEqual(nthRoot(0.0001, 3), 0.0464158883361278)
  })

  it('should return the nthRoot for very large numbers', function () {
    approxEqual(nthRoot(2e150 * 2e150), 2e150)
    approxEqual(nthRoot(Math.pow(2, 1000)), 3.273390607896142e+150)
  })

  it('should return the nthRoot for small large numbers', function () {
    approxEqual(nthRoot(4e-300), 2e-150)
  })

  it('should return the nthRoot for negative numbers', function () {
    approxEqual(nthRoot(-64, 3), -4)
    approxEqual(nthRoot(-8, 3), -2)
    // Newton's method fails in this particular case: --ericman314
    approxEqual(nthRoot(-2, 3), -1.2599210498949)
  })

  it('should return the nthRoot for negative roots', function () {
    approxEqual(nthRoot(64, -3), 0.25)
    approxEqual(nthRoot(-64, -3), -0.25)
  })

  it('should return the nthRoot for zero', function () {
    assert.strictEqual(nthRoot(0, 2), 0)
    assert.strictEqual(nthRoot(0, -2), Infinity)
  })

  it('should return the nthRoot for infinity', function () {
    approxEqual(nthRoot(Infinity, 2), Infinity)
    approxEqual(nthRoot(-Infinity, 3), -Infinity)
    approxEqual(nthRoot(Infinity, -3), 0)
  })

  it('should throw an error when n is zero', function () {
    assert.throws(function () { nthRoot(4, 0) }, /Root must be non-zero/)
  })

  it('should throw an error when value is negative and root is even', function () {
    assert.throws(function () { nthRoot(-27, 2) }, /Root must be odd when a is negative/)
    assert.throws(function () { nthRoot(-27, 2.5) }, /Root must be odd when a is negative/)
  })

  it('should throw an error if invalid number of arguments', function () {
    assert.throws(function () { nthRoot() }, /TypeError: Too few arguments/)
    assert.throws(function () { nthRoot(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { nthRoot(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should return the nthRoot of bignumbers', function () {
    assert.deepStrictEqual(nthRoot(big(4)), big(2))
    assert.deepStrictEqual(nthRoot(big(9)), big(3))
    assert.deepStrictEqual(nthRoot(big(8), big(3)), big(2))
    assert.deepStrictEqual(nthRoot(big(64), big(3)), big(4))
  })

  it('should return the nthRoot of negative bignumber values', function () {
    assert.deepStrictEqual(nthRoot(big(-2), big(3)), big('-1.259921049894873164767210607278228350570251464701507980081975112'))
    assert.deepStrictEqual(nthRoot(big(-64), big(3)), big(-4))
  })

  it('should return the nthRoot of negative bignumber roots', function () {
    assert.deepStrictEqual(nthRoot(big(64), big(-3)), big(0.25))
    assert.deepStrictEqual(nthRoot(big(-64), big(3)), big(-4))
    assert.deepStrictEqual(nthRoot(big(-64), big(-3)), big(-0.25))
  })

  it('should return the nthRoot for bignumber zero', function () {
    assert.deepStrictEqual(nthRoot(big(0), big(2)).toString(), '0')
    assert.deepStrictEqual(nthRoot(big(0), big(-2)).toString(), 'Infinity')
  })

  it('should return the nthRoot for bignumber infinity', function () {
    assert.deepStrictEqual(nthRoot(big(Infinity), big(2)).toString(), 'Infinity')
    assert.deepStrictEqual(nthRoot(big(-Infinity), big(3)).toString(), '-Infinity')
    assert.deepStrictEqual(nthRoot(big(Infinity), big(-3)), big(0))
  })

  it('should throw an error when used with a complex number', function () {
    assert.throws(function () { nthRoot(complex('-8'), 3) })
  })

  it('should throw an error when used with a complex number and root is less than 0', function () {
    assert.throws(function () { nthRoot(complex('-1'), -1) })
  })

  it('should throw an error when used with a complex number and root is not an integer', function () {
    assert.throws(function () { nthRoot(complex('-1 + 2i'), 0.5) })
  })

  it('should throw an error when used on a unit', function () {
    assert.throws(function () { nthRoot(unit('5cm')) })
  })

  it('should throw an error when used on a string', function () {
    assert.throws(function () { nthRoot('text') })
  })

  describe('Array', function () {
    it('should return the nthRoot for array - scalar', function () {
      approxDeepEqual(nthRoot([8, 27, 64], 3), [2, 3, 4])
      approxDeepEqual(nthRoot(64, [2, 3, 8]), [8, 4, 1.68179283050743])
    })

    it('should return the nthRoot for array - array', function () {
      approxDeepEqual(nthRoot([[64, 3125], [0, -1]], [[3, 5], [1, 3]]), [[4, 5], [0, -1]])
    })

    it('should return the nthRoot for broadcastable arrays', function () {
      approxDeepEqual(nthRoot([64, 3125], [[3], [1]]), [[3.9999999999999996, 14.620088691064328], [64, 3125]])
      approxDeepEqual(nthRoot([[64], [0]], [3, 5]), [[3.9999999999999996, 2.29739670999407], [0, 0]])
    })

    it('should return the nthRoot for array - dense matrix', function () {
      approxDeepEqual(nthRoot([[64, 3125], [0, -1]], matrix([[3, 5], [1, 3]])), matrix([[4, 5], [0, -1]]))
    })

    it('should return the nthRoot for array - sparse matrix', function () {
      approxDeepEqual(nthRoot([[64, 3125], [0, -1]], sparse([[3, 5], [1, 3]])), matrix([[4, 5], [0, -1]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should return the nthRoot for dense matrix - scalar', function () {
      approxDeepEqual(nthRoot(matrix([8, 27, 64]), 3), matrix([2, 3, 4]))
      approxDeepEqual(nthRoot(64, matrix([2, 3, 8])), matrix([8, 4, 1.68179283050743]))
    })

    it('should return the nthRoot for dense matrix - array', function () {
      approxDeepEqual(nthRoot(matrix([[64, 3125], [0, -1]]), [[3, 5], [1, 3]]), matrix([[4, 5], [0, -1]]))
    })

    it('should return the nthRoot for dense matrix - dense matrix', function () {
      approxDeepEqual(nthRoot(matrix([[64, 3125], [0, -1]]), matrix([[3, 5], [1, 3]])), matrix([[4, 5], [0, -1]]))
    })

    it('should return the nthRoot for dense matrix - sparse matrix', function () {
      approxDeepEqual(nthRoot(matrix([[64, 3125], [0, -1]]), sparse([[3, 5], [1, 3]])), matrix([[4, 5], [0, -1]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should return the nthRoot for sparse matrix - scalar', function () {
      approxDeepEqual(nthRoot(sparse([[8, 27], [0, 64]]), 3), sparse([[2, 3], [0, 4]]))
      approxDeepEqual(nthRoot(64, sparse([[2, 3], [1, 8]])), sparse([[8, 4], [64, 1.68179283050743]]))
    })

    it('should return the nthRoot for sparse matrix - array', function () {
      approxDeepEqual(nthRoot(sparse([[64, 3125], [0, -1]]), [[3, 5], [1, 3]]), sparse([[4, 5], [0, -1]]))
    })

    it('should return the nthRoot for sparse matrix - dense matrix', function () {
      approxDeepEqual(nthRoot(sparse([[64, 3125], [0, -1]]), matrix([[3, 5], [1, 3]])), sparse([[4, 5], [0, -1]]))
    })

    it('should return the nthRoot for sparse matrix - sparse matrix', function () {
      approxDeepEqual(nthRoot(sparse([[64, 3125], [0, -1]]), sparse([[3, 5], [1, 3]])), sparse([[4, 5], [0, -1]]))
    })
  })

  it('should LaTeX nthRoot', function () {
    const expression = math.parse('nthRoot(8,3)')
    assert.strictEqual(expression.toTex(), '\\sqrt[3]{8}')
  })
})
