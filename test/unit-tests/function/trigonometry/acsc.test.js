/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const pi = math.pi
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const acsc = math.acsc
const csc = math.csc
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const biggermath = math.create({ precision: 21 })
const predmath = math.create({ predictable: true })
const acscBig = bigmath.acsc
const Big = bigmath.bignumber

describe('acsc', function () {
  it('should return the arccsc of a boolean', function () {
    approxEqual(acsc(true), pi / 2)
    assert.deepStrictEqual(acsc(false), complex(pi / 2, Infinity))
    // assert.ok(isNaN(acsc(false)))
  })

  it('should return the arccsc of a number', function () {
    approxEqual(acsc(-2) / pi, -1 / 6)
    approxEqual(acsc(-1) / pi, -0.5)
    assert.deepStrictEqual(acsc(0), complex(pi / 2, Infinity))
    // assert.ok(isNaN(acsc(0)))
    approxEqual(acsc(1) / pi, 0.5)
    approxEqual(acsc(2) / pi, 1 / 6)
  })

  it('should return the arccsc of a number when predictable:true', function () {
    assert.strictEqual(typeof predmath.acsc(0), 'number')
    assert(isNaN(predmath.acsc(0)))
  })

  it('should return the arccsc of a bignumber', function () {
    const arg1 = Big(-2)
    const arg2 = Big(-1.71)
    const arg3 = Big(-1)

    assert.deepStrictEqual(acscBig(arg1), Big('-0.52359877559829887308'))
    // wolfram:                          -0.52359877559829887307710723054658381403286156656251763682915743205130273438103483310467247089035284466369134775
    assert.deepStrictEqual(acscBig(arg2), Big('-0.62462771332471601304'))
    assert.deepStrictEqual(acscBig(arg3), Big('-1.5707963267948966192'))
    assert.deepStrictEqual(acscBig(Big(1)), Big('1.5707963267948966192'))
    assert.deepStrictEqual(acscBig(Big(1.71)), Big('0.62462771332471601304'))
    assert.deepStrictEqual(acscBig(Big(2)), Big('0.52359877559829887308'))

    // Make sure args were not changed
    assert.deepStrictEqual(arg1, Big(-2))
    assert.deepStrictEqual(arg2, Big(-1.71))
    assert.deepStrictEqual(arg3, Big(-1))

    // Hit Newton's method case
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })

    const arg4 = bigmath61.bignumber(1.00000001)
    assert.deepStrictEqual(bigmath61.acsc(arg4),
      bigmath61.bignumber('1.570654905439248565373629613450057180739125884090554026623514'))
    // wolfram             1.5706549054392485653736296134500571807391258840905540266235145245693842219005187990359787187421573662444504948773
    assert.deepStrictEqual(arg4, bigmath61.bignumber(1.00000001))

    assert.ok(acscBig(Big(0.5)).isNaN())
    assert.ok(acscBig(Big(-0.5)).isNaN())
  })

  it('should be the inverse function of csc', function () {
    approxEqual(acsc(csc(-1)), -1)
    approxEqual(acsc(csc(0)), 0)
    approxEqual(acsc(csc(0.1)), 0.1)
    approxEqual(acsc(csc(0.5)), 0.5)
    approxEqual(acsc(csc(2)), 1.14159265358979)
  })

  it('should be the inverse function of bignumber csc', function () {
    const bigmath61 = bigmath.create({ number: 'BigNumber', precision: 61 })
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(-2))),
      bigmath61.bignumber('-1.141592653589793238462643383279502884197169399375105820974946'))
    // wolfram:            -1.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(-0.5))), bigmath61.bignumber('-0.4999999999999999999999999999999999999999999999999999999999999'))
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(-0.1))), bigmath61.bignumber(-0.1))
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(0.1))), bigmath61.bignumber(0.1))
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(0.5))), bigmath61.bignumber('0.4999999999999999999999999999999999999999999999999999999999999'))
    assert.deepStrictEqual(bigmath61.acsc(bigmath61.csc(bigmath61.bignumber(2))), bigmath61.bignumber('1.141592653589793238462643383279502884197169399375105820974946'))

    // Full decimal Taylor test cases
    assert.deepStrictEqual(bigmath.acsc(bigmath.csc(bigmath.bignumber(0))), bigmath.bignumber(0))
    assert.deepStrictEqual(bigmath.acsc(bigmath.csc(bigmath.bignumber(0.1))), bigmath.bignumber('0.099999999999999999997'))
    assert.deepStrictEqual(bigmath.acsc(bigmath.csc(bigmath.bignumber(0.5))), bigmath.bignumber(0.5))

    // Pass in an extra digit
    assert.deepStrictEqual(bigmath.acsc(biggermath.csc(bigmath.bignumber(-1))), bigmath.bignumber('-1'))
    assert.deepStrictEqual(bigmath.acsc(biggermath.csc(bigmath.bignumber(2))), bigmath.bignumber('1.1415926535897932385'))
  })

  it('should return the arccsc of a complex number', function () {
    const re = 0.150385604327861963
    const im = 0.231334698573973315
    approxDeepEqual(acsc(complex('2+3i')), complex(re, -im))
    approxDeepEqual(acsc(complex('2-3i')), complex(re, im))
    approxDeepEqual(acsc(complex('-2+3i')), complex(-re, -im))
    approxDeepEqual(acsc(complex('-2-3i')), complex(-re, im))
    approxDeepEqual(acsc(complex('1+i')), complex(0.4522784471511907, -0.53063753095251783))
    approxDeepEqual(acsc(complex('i')), complex(0, -0.881373587019543))

    approxDeepEqual(acsc(complex('-1')), complex(-pi / 2, 0))
    approxDeepEqual(acsc(complex('-0.5')), complex(-pi / 2, 1.3169578969248))
    assert.deepStrictEqual(acsc(complex('0')), complex(pi / 2, Infinity))
    approxDeepEqual(acsc(complex('0.5')), complex(pi / 2, -1.3169578969248))
    approxDeepEqual(acsc(complex('1')), complex(pi / 2, 0))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { acsc(unit('45deg')) })
    assert.throws(function () { acsc(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { acsc('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => acsc([1, 2, 3]), TypeError)
    assert.throws(() => acsc(matrix([1, 2, 3])), TypeError)
    const acsc123 = [pi / 2, pi / 6, 0.339836909454]
    approxDeepEqual(math.map([1, 2, 3], acsc), acsc123)
    approxDeepEqual(math.map(matrix([1, 2, 3]), acsc), matrix(acsc123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { acsc() }, /TypeError: Too few arguments/)
    assert.throws(function () { acsc(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTex acsc', function () {
    const expression = math.parse('acsc(2)')
    assert.strictEqual(expression.toTex(), '\\csc^{-1}\\left(2\\right)')
  })
})
