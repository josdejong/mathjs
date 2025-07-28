// test sign
import assert from 'assert'

import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const fraction = math.fraction
const complex = math.complex

describe('sign', function () {
  it('should calculate the sign of a boolean', function () {
    assert.strictEqual(math.sign(true), 1)
    assert.strictEqual(math.sign(false), 0)
  })

  it('should calculate the sign of a number', function () {
    assert.strictEqual(math.sign(3), 1)
    assert.strictEqual(math.sign(-3), -1)
    assert.strictEqual(math.sign(0), 0)
  })

  it('should calculate the sign of a bigint', function () {
    assert.strictEqual(math.sign(3n), 1n)
    assert.strictEqual(math.sign(-3n), -1n)
    assert.strictEqual(math.sign(0n), 0n)
  })

  it('should calculate the sign of a big number', function () {
    assert.deepStrictEqual(math.sign(bignumber(3)), bignumber(1))
    assert.deepStrictEqual(math.sign(bignumber(-3)), bignumber(-1))
    assert.deepStrictEqual(math.sign(bignumber(0)), bignumber(0))
  })

  it('should calculate the sign of a fraction', function () {
    const a = fraction(0.5)
    assert(math.sign(a) instanceof math.Fraction)
    assert.strictEqual(math.sign(a).toString(), '1')
    assert.strictEqual(math.sign(fraction(-0.5)).toString(), '-1')
    assert.strictEqual(a.toString(), '0.5')
    assert.deepStrictEqual(math.sign(math.fraction(0)), math.fraction(0))
  })

  it('should calculate the sign of a complex value', function () {
    approxDeepEqual(math.sign(math.complex(2, -3)), math.complex(0.554700196225229, -0.832050294337844))
  })

  it('should calculate the sign of a unit', function () {
    assert.strictEqual(math.sign(math.unit('5 cm')), 1)
    assert.strictEqual(math.sign(math.unit('-5 kg')), -1)
    assert.strictEqual(math.sign(math.unit('0 mol/s')), 0)

    /* sign is ambiguous on units with offset, because you don't know if
     * -3 degC is the difference between two temperatures, in which case
     * it is definitely negative, or an actual temperature of something,
     * in which case it is arguably positive. So actually mathjs should
     * throw an error, which we will test below. Formerly:
     assert.strictEqual(math.sign(math.unit('-283.15 degC')), -1)
     assert.strictEqual(math.sign(math.unit('-273.15 degC')), 0)
     assert.strictEqual(math.sign(math.unit('-263.15 degC')), 1)
    */

    assert.deepStrictEqual(math.sign(math.unit(bignumber(5), 'cm')), bignumber(1))
    assert.deepStrictEqual(math.sign(math.unit(bignumber(-5), 'cm')), bignumber(-1))
    assert.deepStrictEqual(math.sign(math.unit(fraction(5), 'cm')), fraction(1))
    assert.deepStrictEqual(math.sign(math.unit(fraction(-5), 'cm')), fraction(-1))

    assert.deepStrictEqual(math.sign(math.unit(complex(3, 4), 'mi')), complex(0.6, 0.8))
  })

  it('should throw an error on a valueless unit or a unit with offset', function () {
    assert.throws(() => math.sign(math.unit('ohm')), TypeError)
    assert.throws(() => math.sign(math.unit('-3 degC')), /ambiguous/)
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () { math.sign('hello world') })
  })

  it('should return a matrix of the signs of each elements in the given array', function () {
    assert.deepStrictEqual(math.sign([-2, -1, 0, 1, 2]), [-1, -1, 0, 1, 1])
  })

  it('should return a matrix of the signs of each elements in the given matrix', function () {
    assert.deepStrictEqual(math.sign(math.matrix([-2, -1, 0, 1, 2])), math.matrix([-1, -1, 0, 1, 1]))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { math.sign() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.sign(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { math.sign(null) }, /TypeError: Unexpected type of argument/)
  })

  describe('sign(0) should return 0', function () {
    it('number', function () {
      assert.strictEqual(math.sign(0), 0)
    })

    it('bignumber', function () {
      assert.deepStrictEqual(math.sign(math.bignumber(0)), math.bignumber(0))
    })

    it('complex', function () {
      assert.deepStrictEqual(math.sign(math.complex(0)), math.complex(0))
    })
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { math.sign(null) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX sign', function () {
    const expression = math.parse('sign(-4)')
    assert.strictEqual(expression.toTex(), '\\mathrm{sign}\\left(-4\\right)')
  })
})
