// test ceil
import assert from 'assert'

import approx from '../../../../tools/approx'
import math from '../../../../src/bundleAny'
const { bignumber, ceil, complex, fraction, i, isFraction, matrix, pi, unit, parse, sparse } = math

describe('ceil', function () {
  it('should return the ceil of a boolean', function () {
    assert.strictEqual(ceil(true), 1)
    assert.strictEqual(ceil(false), 0)
  })

  it('should return the ceil of a number', function () {
    approx.equal(ceil(0), 0)
    approx.equal(ceil(1), 1)
    approx.equal(ceil(1.3), 2)
    approx.equal(ceil(1.8), 2)
    approx.equal(ceil(2), 2)
    approx.equal(ceil(-1), -1)
    approx.equal(ceil(-1.3), -1)
    approx.equal(ceil(-1.8), -1)
    approx.equal(ceil(-2), -2)
    approx.equal(ceil(-2.1), -2)
    approx.equal(ceil(pi), 4)
  })

  it('should return the ceil of a number with a given number of decimals', function () {
    approx.equal(ceil(0, 5), 0)
    approx.equal(ceil(2, 3), 2)
    approx.equal(ceil(math.pi, 3), 3.142)
    approx.equal(ceil(math.pi, 6), 3.141593)
    approx.equal(ceil(1234.5678, 2), 1234.57)
    approx.equal(ceil(2.13, 2), 2.13)
    approx.equal(ceil(-1.8, 0), -1)
    approx.equal(ceil(-1.8, 1), -1.8)
    approx.equal(ceil(-2.178, 2), -2.17)
  })

  it('should return the ceil of a big number', function () {
    assert.deepStrictEqual(ceil(bignumber(0)), bignumber(0))
    assert.deepStrictEqual(ceil(bignumber(1)), bignumber(1))
    assert.deepStrictEqual(ceil(bignumber(1.3)), bignumber(2))
    assert.deepStrictEqual(ceil(bignumber(1.8)), bignumber(2))
    assert.deepStrictEqual(ceil(bignumber(2)), bignumber(2))
    assert.deepStrictEqual(ceil(bignumber(-1)), bignumber(-1))
    assert.deepStrictEqual(ceil(bignumber(-1.3)), bignumber(-1))
    assert.deepStrictEqual(ceil(bignumber(-1.8)), bignumber(-1))
    assert.deepStrictEqual(ceil(bignumber(-2)), bignumber(-2))
    assert.deepStrictEqual(ceil(bignumber(-2.1)), bignumber(-2))
  })

  it('should return the ceil of a big number with a given number of decimals', function () {
    assert.deepStrictEqual(ceil(bignumber(0), 3), bignumber(0))
    assert.deepStrictEqual(ceil(bignumber(1), 3), bignumber(1))
    assert.deepStrictEqual(ceil(bignumber(1.315), 2), bignumber(1.32))
    assert.deepStrictEqual(ceil(bignumber(1.8), 1), bignumber(1.8))
    assert.deepStrictEqual(ceil(bignumber(-1), 4), bignumber(-1))
    assert.deepStrictEqual(ceil(bignumber(-1.3), 4), bignumber(-1.3))
    assert.deepStrictEqual(ceil(bignumber(-1.8), 0), bignumber(-1))
    assert.deepStrictEqual(ceil(bignumber(-1.315), 2), bignumber(-1.31))
    assert.deepStrictEqual(ceil(bignumber(-2), 0), bignumber(-2))
    assert.deepStrictEqual(ceil(bignumber(-2.1), 0), bignumber(-2))
  })

  it('should return the ceil of real and imag part of a complex', function () {
    approx.deepEqual(ceil(complex(0, 0)), complex(0, 0))
    approx.deepEqual(ceil(complex(1.3, 1.8)), complex(2, 2))
    approx.deepEqual(ceil(i), complex(0, 1))
    approx.deepEqual(ceil(complex(-1.3, -1.8)), complex(-1, -1))
  })

  it('should return the ceil of real and imag part of a complex with a given number of decimals', function () {
    approx.deepEqual(ceil(complex(0, 0), 3), complex(0, 0))
    approx.deepEqual(ceil(complex(1.3, 1.8), 0), complex(2, 2))
    approx.deepEqual(ceil(complex(1.3, 1.8), 1), complex(1.3, 1.8))
    approx.deepEqual(ceil(complex(1.315, 1.878), 2), complex(1.32, 1.88))
    approx.deepEqual(ceil(i, 0), complex(0, 1))
    approx.deepEqual(ceil(i, 4), complex(0, 1))
    approx.deepEqual(ceil(complex(-1.3, -1.8), 0), complex(-1, -1))
    approx.deepEqual(ceil(complex(-1.3, -1.8), 1), complex(-1.3, -1.8))
    approx.deepEqual(ceil(complex(-1.315, -1.878), 2), complex(-1.31, -1.87))
  })

  it('should return the ceil of a fraction', function () {
    const a = fraction('2/3')
    assert(isFraction(ceil(a)))
    assert.strictEqual(a.toString(), '0.(6)')

    assert.strictEqual(ceil(fraction(0)).toString(), '0')
    assert.strictEqual(ceil(fraction(1)).toString(), '1')
    assert.strictEqual(ceil(fraction(1.3)).toString(), '2')
    assert.strictEqual(ceil(fraction(1.8)).toString(), '2')
    assert.strictEqual(ceil(fraction(2)).toString(), '2')
    assert.strictEqual(ceil(fraction(-1)).toString(), '-1')
    assert.strictEqual(ceil(fraction(-1.3)).toString(), '-1')
    assert.strictEqual(ceil(fraction(-1.8)).toString(), '-1')
    assert.strictEqual(ceil(fraction(-2)).toString(), '-2')
    assert.strictEqual(ceil(fraction(-2.1)).toString(), '-2')
  })

  it('should return the ceil of a fraction with a given number of decimals', function () {
    const a = fraction('2/3')
    assert(isFraction(ceil(a, 0)))
    assert.strictEqual(a.toString(), '0.(6)')
    assert(isFraction(ceil(a, 4)))
    assert.strictEqual(a.toString(), '0.(6)')

    assert.strictEqual(ceil(fraction(0), 0).toString(), '0')
    assert.strictEqual(ceil(fraction(0), 3).toString(), '0')
    assert.strictEqual(ceil(fraction(1), 4).toString(), '1')
    assert.strictEqual(ceil(fraction(1.315), 2).toString(), '1.32')
    assert.strictEqual(ceil(fraction(-1), 0).toString(), '-1')
    assert.strictEqual(ceil(fraction(-1.315), 2).toString(), '-1.31')
  })

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(ceil(3.0000000000000004), 3)
    assert.strictEqual(ceil(7.999999999999999), 8)
    assert.strictEqual(ceil(-3.0000000000000004), -3)
    assert.strictEqual(ceil(-7.999999999999999), -8)
    assert.strictEqual(ceil(30000.000000000004), 30000)
    assert.strictEqual(ceil(799999.9999999999), 800000)
    assert.strictEqual(ceil(-30000.000000000004), -30000)
    assert.strictEqual(ceil(-799999.9999999999), -800000)

    assert.strictEqual(ceil(3.0000000000000004, 2), 3)
    assert.strictEqual(ceil(7.999999999999999, 2), 8)
    assert.strictEqual(ceil(-3.0000000000000004, 2), -3)
    assert.strictEqual(ceil(-7.999999999999999, 2), -8)
    assert.strictEqual(ceil(30000.000000000004, 2), 30000)
    assert.strictEqual(ceil(799999.9999999999, 2), 800000)
    assert.strictEqual(ceil(-30000.000000000004, 2), -30000)
    assert.strictEqual(ceil(-799999.9999999999, 2), -800000)
  })

  it('should gracefully handle round-off errors with bignumbers', function () {
    assert.deepStrictEqual(ceil(bignumber(3.0000000000000004)), bignumber(3))
    assert.deepStrictEqual(ceil(bignumber(7.999999999999999)), bignumber(8))
    assert.deepStrictEqual(ceil(bignumber(-3.0000000000000004)), bignumber(-3))
    assert.deepStrictEqual(ceil(bignumber(-7.999999999999999)), bignumber(-8))
    assert.deepStrictEqual(ceil(bignumber(30000.000000000004)), bignumber(30000))
    assert.deepStrictEqual(ceil(bignumber(799999.9999999999)), bignumber(800000))
    assert.deepStrictEqual(ceil(bignumber(-30000.000000000004)), bignumber(-30000))
    assert.deepStrictEqual(ceil(bignumber(-799999.9999999999)), bignumber(-800000))
  })

  it('should throw an error for units', function () {
    assert.throws(function () { ceil(unit('5cm')) }, TypeError, 'Function ceil(unit) not supported')
  })

  it('should throw an error if requested number of decimals is incorrect', function () {
    assert.throws(function () { ceil(2.5, 1.5) }, TypeError, 'Number of decimals in function round must be an integer')
    assert.throws(function () { ceil(2.5, -2) }, Error, ' Number of decimals in function round must be in te range of 0-15')
    assert.throws(function () { ceil(2.5, Infinity) }, Error, ' Number of decimals in function round must be in te range of 0-15')
  })

  it('should convert a string to a number', function () {
    assert.strictEqual(ceil('1.8'), 2)
    assert.strictEqual(ceil('1.815', '2'), 1.82)
    assert.strictEqual(ceil('1.815', 2).toString(), '1.82')
    assert.strictEqual(ceil(1.815, '2').toString(), '1.82')
  })

  it('should ceil each element in a matrix, array or range', function () {
    approx.deepEqual(ceil([1.2, 3.4, 5.6, 7.8, 10.0]), [2, 4, 6, 8, 10])
    approx.deepEqual(ceil(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([2, 4, 6, 8, 10]))
  })

  it('should ceil each element in a matrix with a given number of decimals', function () {
    approx.deepEqual(ceil([1.282, 3.415, -5.121, -10.128], 2), [1.29, 3.42, -5.12, -10.12])
    approx.deepEqual(ceil(matrix([1.282, 3.415, -5.121, -10.128]), 2), matrix([1.29, 3.42, -5.12, -10.12]))
  })

  it('should ceil when number of decimals is provided in an array', function () {
    assert.deepStrictEqual(ceil(3.12385, [2, 3]), [3.13, 3.124])
  })

  it('should ceil dense matrix', function () {
    assert.deepStrictEqual(ceil(matrix([[1.712, 2.345], [8.987, -3.565]]), 2), matrix([[1.72, 2.35], [8.99, -3.56]]))
  })

  it('should ceil dense matrix and scalar', function () {
    assert.deepStrictEqual(ceil(matrix([[1.7777, 2.3456], [-90.8272, 0]]), 3), matrix([[1.778, 2.346], [-90.827, 0]]))
  })

  it('should ceil dense matrix with given bignumber decimals', function () {
    const expected = matrix([[1.778, 2.346], [-90.827, 0]])
    approx.deepEqual(ceil(matrix([[1.7777, 2.3456], [-90.8272, 0]]), bignumber(3)), expected)
  })

  it('should ceil sparse matrix', function () {
    assert.deepStrictEqual(ceil(sparse([[1.7, 0], [8.987, -3.565]]), 2), sparse([[1.7, 0], [8.99, -3.56]]))
  })

  it('should ceil sparse matrix and scalar', function () {
    assert.deepStrictEqual(ceil(sparse([[1.7777, 2.3456], [-90.8272, 0]]), 3), sparse([[1.778, 2.346], [-90.827, 0]]))
  })

  it('should ceil sparse matrix with given bignumber decimals', function () {
    const expected = bignumber(sparse([[1.778, 2.346], [-90.827, 0]]))
    assert.deepStrictEqual(ceil(sparse([[1.7777, 2.3456], [-90.8272, 0]]), bignumber(3)), expected)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { ceil() }, /TypeError: Too few arguments/)
    assert.throws(function () { ceil(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { ceil(null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { ceil(42, null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX ceil', function () {
    const expression = parse('ceil(0.5)')
    assert.strictEqual(expression.toTex(), '\\left\\lceil0.5\\right\\rceil')
  })
})
