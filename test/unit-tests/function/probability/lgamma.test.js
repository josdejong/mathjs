/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const lgamma = math.lgamma

describe('lgamma', function () {
  it('should calculate the lgamma of 0', function () {
    assert.strictEqual(lgamma(0), Infinity)
  })

  it('should calculate the lgamma of a negative integer', function () {
    assert.strictEqual(lgamma(-1), NaN)
    assert.strictEqual(lgamma(-2), NaN)
    assert.strictEqual(lgamma(-100000), NaN)
    assert.ok(isNaN(lgamma(-NaN)))
  })

  it('should calculate the lgamma of a positive number', function () {
    approx.equal(lgamma(0.000000001), 20.723265836369195492082857, 1e-10)
    approx.equal(lgamma(0.000001), 13.815509980749431669207827, 1e-10)
    approx.equal(lgamma(0.25), 1.2880225246980774573706104, 1e-10)
    approx.equal(lgamma(0.8), 0.1520596783998375887782926, 1e-10)
    approx.equal(lgamma(1), 0, 1e-10)
    approx.equal(lgamma(1.5), -0.12078223763524522234551845, 1e-10)
    approx.equal(lgamma(2), 0, 1e-10)
    approx.equal(lgamma(2.5), 0.28468287047291915963249467, 1e-10)
    approx.equal(lgamma(12.5), 18.734347511936445701634125, 1e-10)
    approx.equal(lgamma(125.5), 479.45782236390339913576384, 1e-10)
    approx.equal(lgamma(5555.5555), 42344.127792509816147711716, 1e-10)
    approx.equal(lgamma(5000000.5), 72124743.270930397264882949, 1e-10)
    approx.equal(lgamma(99999999999999.5), 3123619130191632.6403724193, 1e-10)
    approx.equal(lgamma(1e+92), 2.1083782855545220292965521E+94, 1e-10)
  })

  it('should calculate the lgamma of an irrational number', function () {
    approx.equal(lgamma(Math.SQRT2), -0.12038230351896920333038516, 1e-10)
    approx.equal(lgamma(Math.PI), 0.82769459232343710152957856, 1e-10)
    approx.equal(lgamma(Math.E), 0.44946174182006766700250782, 1e-10)
  })

  it('should calculate the lgamma of a boolean', function () {
    assert.strictEqual(lgamma(true), 0)
    assert.strictEqual(lgamma(false), Infinity)
  })

  it('should calculate the lgamma of each element in a matrix', function () {
    approx.deepEqual(
      lgamma(math.matrix([0, 1, 2, 3, 4, 5])),
      math.matrix([Infinity, 0, 0, 0.69314718055994530941723212, 1.7917594692280550008124774, 3.1780538303479456196469416])
    )
  })

  it('should calculate the lgamma of each element in an array', function () {
    approx.deepEqual(
      lgamma([0, 1, 2, 3, 4, 5]),
      [Infinity, 0, 0, 0.69314718055994530941723212, 1.7917594692280550008124774, 3.1780538303479456196469416]
    )
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { lgamma() })
    assert.throws(function () { lgamma(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { lgamma(new Date()) })
    assert.throws(function () { lgamma('a string') })
  })

  it('should LaTeX lgamma', function () {
    const expression = math.parse('lgamma(2.5)')
    assert.strictEqual(expression.toTex(), '\\ln\\Gamma\\left(2.5\\right)')
  })
})
