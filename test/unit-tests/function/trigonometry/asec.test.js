/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'
const pi = math.pi
const asec = math.asec
const sec = math.sec
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const bigmath = math.create({ number: 'BigNumber', precision: 20 })
const predmath = math.create({ predictable: true })
const asecBig = bigmath.asec
const Big = bigmath.bignumber

describe('asec', function () {
  it('should return the arcsec of a boolean', function () {
    assert.strictEqual(asec(true), 0)
    assert.deepStrictEqual(asec(false), complex(0, Infinity))
    // assert.ok(isNaN(asec(false)))
  })

  it('should return the arcsec of a number', function () {
    approx.equal(asec(-2) / pi, 2 / 3)
    approx.equal(asec(-1) / pi, 1)
    approx.equal(asec(1) / pi, 0)
    approx.equal(asec(2) / pi, 1 / 3)

    approx.deepEqual(asec(-0.5), complex(pi, -1.3169578969248))
    approx.deepEqual(asec(0.5), complex(0, 1.3169578969248))
  })

  it('should return the arcsec of a number when predictable:true', function () {
    assert.strictEqual(typeof predmath.asec(0.5), 'number')
    assert(isNaN(predmath.asec(0.5)))
  })

  it('should return the arcsec of a bignumber', function () {
    const arg1 = Big(-2)
    const arg2 = Big(-1)
    assert.deepStrictEqual(asecBig(arg1).toString(), bigmath.tau.div(3).toString())
    assert.deepStrictEqual(asecBig(arg2).toString(), bigmath.pi.toString())
    assert.deepStrictEqual(asecBig(Big(1)), Big(0))
    assert.deepStrictEqual(asecBig(Big(2)).toString(), bigmath.pi.div(3).toString())

    // Make sure arg was not changed
    assert.deepStrictEqual(arg1, Big(-2))
    assert.deepStrictEqual(arg2, Big(-1))

    // Hit Newton's method case
    const bigmath64 = bigmath.create({ number: 'BigNumber', precision: 64 })
    const arg = bigmath64.bignumber('3.00000001')
    assert.deepStrictEqual(bigmath64.asec(bigmath64.bignumber(3)),
      bigmath64.bignumber('1.230959417340774682134929178247987375710340009355094839055548334'))
    // wolfram:  asec(3) = 1.2309594173407746821349291782479873757103400093550948390555483336639923144782560878532516201708609211389442794492
    assert.deepStrictEqual(bigmath64.asec(arg),
      bigmath64.bignumber('1.230959418519285979938614206185297709155969929825366328254265441'))
    // wolfram:            1.2309594185192859799386142061852977091559699298253663282542654408321080017053701257305273449373991752616248450522
    assert.deepStrictEqual(arg, bigmath64.bignumber(3.00000001))

    // out of range
    assert.ok(asec(Big(0.5)).isNaN())
    assert.ok(asec(Big(0)).isNaN())
    assert.ok(asec(Big(-0.5)).isNaN())
  })

  it('should be the inverse function of sec', function () {
    approx.equal(asec(sec(-1)), 1)
    approx.equal(asec(sec(0)), 0)
    approx.equal(asec(sec(0.1)), 0.1)
    approx.equal(asec(sec(0.5)), 0.5)
    approx.equal(asec(sec(2)), 2)
  })

  it('should be the inverse function of bignumber sec', function () {
    bigmath.config({ precision: 20 })
    assert.deepStrictEqual(asecBig(bigmath.sec(Big(-1))), Big(1))
    assert.deepStrictEqual(asecBig(bigmath.sec(Big(0))), Big(0))
    assert.deepStrictEqual(asecBig(bigmath.sec(Big(0.5))), Big('0.49999999999999999997'))
    assert.deepStrictEqual(asecBig(bigmath.sec(Big(2))), Big(2))
  })

  it('should return the arcsec of a complex number', function () {
    approx.deepEqual(asec(complex('2+3i')), complex(1.42041072246703, 0.23133469857397))
    approx.deepEqual(asec(complex('2-3i')), complex(1.42041072246703, -0.23133469857397))
    approx.deepEqual(asec(complex('-2+3i')), complex(1.7211819311228, 0.2313346985739733))
    approx.deepEqual(asec(complex('-2-3i')), complex(1.7211819311228, -0.2313346985739733))
    approx.deepEqual(asec(complex('i')), complex(1.570796326794897, 0.881373587019543))
    approx.deepEqual(asec(complex('1+i')), complex(1.1185178796437059, 0.530637530952517826))
    approx.deepEqual(asec(complex('1')), complex(0, 0))
    approx.deepEqual(asec(complex('0.5')), complex(0, 1.3169578969248))
    approx.deepEqual(asec(complex('0')), complex(0, Infinity))
    approx.deepEqual(asec(complex('-0.5')), complex(pi, -1.3169578969248))
  })

  it('should throw an error if called with a unit', function () {
    assert.throws(function () { asec(unit('45deg')) })
    assert.throws(function () { asec(unit('5 celsius')) })
  })

  it('should throw an error if called with a string', function () {
    assert.throws(function () { asec('string') })
  })

  it('should not operate on arrays and matrices', function () {
    assert.throws(() => asec([1, 2, 3]), TypeError)
    assert.throws(() => asec(matrix([1, 2, 3])), TypeError)
    const asec123 = [0, pi / 3, 1.23095941734077468]
    approx.deepEqual(math.map([1, 2, 3], asec), asec123)
    approx.deepEqual(math.map(matrix([1, 2, 3]), asec), matrix(asec123))
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { asec() }, /TypeError: Too few arguments/)
    assert.throws(function () { asec(1, 2) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX asec', function () {
    const expression = math.parse('asec(2)')
    assert.strictEqual(expression.toTex(), '\\sec^{-1}\\left(2\\right)')
  })
})
