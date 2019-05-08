// test ceil
import assert from 'assert'

import approx from '../../../tools/approx'
import { bignumber, ceil, complex, fraction, i, isFraction, matrix, pi, unit, parse } from '../../../src/entry/mainAny'

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

  it('should return the ceil of real and imag part of a complex', function () {
    approx.deepEqual(ceil(complex(0, 0)), complex(0, 0))
    approx.deepEqual(ceil(complex(1.3, 1.8)), complex(2, 2))
    approx.deepEqual(ceil(i), complex(0, 1))
    approx.deepEqual(ceil(complex(-1.3, -1.8)), complex(-1, -1))
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

  it('should gracefully handle round-off errors', function () {
    assert.strictEqual(ceil(3.0000000000000004), 3)
    assert.strictEqual(ceil(7.999999999999999), 8)
    assert.strictEqual(ceil(-3.0000000000000004), -3)
    assert.strictEqual(ceil(-7.999999999999999), -8)
    assert.strictEqual(ceil(30000.000000000004), 30000)
    assert.strictEqual(ceil(799999.9999999999), 800000)
    assert.strictEqual(ceil(-30000.000000000004), -30000)
    assert.strictEqual(ceil(-799999.9999999999), -800000)
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

  it('should convert a string to a number', function () {
    assert.strictEqual(ceil('1.8'), 2)
  })

  it('should ceil each element in a matrix, array or range', function () {
    approx.deepEqual(ceil([1.2, 3.4, 5.6, 7.8, 10.0]), [2, 4, 6, 8, 10])
    approx.deepEqual(ceil(matrix([1.2, 3.4, 5.6, 7.8, 10.0])), matrix([2, 4, 6, 8, 10]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { ceil() }, /TypeError: Too few arguments/)
    assert.throws(function () { ceil(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { ceil(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX ceil', function () {
    const expression = parse('ceil(0.5)')
    assert.strictEqual(expression.toTex(), '\\left\\lceil0.5\\right\\rceil')
  })
})
